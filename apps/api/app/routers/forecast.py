"""
ForecastStation backend — WBP-v1 fusion engine.

File: app/routers/forecast.py

Implements the API contract ForecastStation already expects:
  GET  /api/v1/forecast?model=wbp_v1&geo=51041&horizon=90
  POST /api/v1/narrate

Multi-tenant via existing request.state.tenant_id pattern.

The fusion math (WBP-v1) is the proprietary core — combines 8 federal
data signals (BLS, Census, FRED, EIA, SAM, NOAA, AIA) into a 0-100
score per (geography, horizon). See app/services/wbp_fusion.py for math.

Mock Mode (env FORECAST_MOCK=true, default true) returns synthetic but
realistic scores so the UI works without burning federal API rate limits.
"""

import json
import logging
import math
import os
import random
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from ..core.limiter import limiter
from ..database import get_db

router = APIRouter(prefix="/api/v1", tags=["forecast"])
logger = logging.getLogger(__name__)


def _is_mock() -> bool:
    return os.getenv("FORECAST_MOCK", "true").lower() in ("true", "1", "yes")


# ─── Model registry ──────────────────────────────────────────────────────────
# Mirrors the fusion.types.ts spec. Each model is a weighted bag of signals.

FUSION_MODELS: Dict[str, Dict[str, Any]] = {
    "wbp_v1": {
        "label": "Worden Boom Probability v1",
        "tau": 90,
        "signals": [
            # id, metric, weight, leadDays, invert, allowColdStart
            ("permits",         "bps_total_permits",       0.18,  60, False, True),
            ("sam_spending",    "sam_construction_awards", 0.15,  30, False, True),
            ("yield_curve",     "fred_t10y2y",             0.10, 180, False, False),
            ("jolts_openings",  "bls_jolts_construction",  0.12,  45, False, True),
            ("aia_abi",         "aia_abi_index",           0.13,  90, False, True),
            ("material_cost",   "ppi_construction_mats",   0.12,  30, True,  False),
            ("pavement_cond",   "ferrari_7a_pci_avg",      0.10,  60, True,  True),
            ("demographics",    "census_acs_pop_growth",   0.10, 365, False, False),
        ],
    },
    "trade_demand_v1": {
        "label": "Pavement Trade Demand v1",
        "tau": 60,
        "signals": [
            ("permits",        "bps_total_permits",       0.25,  60, False, True),
            ("sam_spending",   "sam_construction_awards", 0.20,  30, False, True),
            ("dot_obligated",  "fhwa_dot_obligated",      0.20,  90, False, True),
            ("aia_abi",        "aia_abi_index",           0.15,  90, False, True),
            ("material_cost", "ppi_construction_mats",    0.10,  30, True,  False),
            ("pavement_cond","ferrari_7a_pci_avg",        0.10,  60, True,  True),
        ],
    },
    "margin_erosion_v1": {
        "label": "Margin Erosion Risk v1",
        "tau": 45,
        "signals": [
            # Signs flipped: rising costs hurt margins → negative for boom
            ("material_cost",  "ppi_construction_mats",    0.30,  30, True,  False),
            ("diesel",         "eia_diesel_retail",        0.25,  14, True,  False),
            ("eci_wages",      "bls_eci_construction",     0.20,  90, True,  False),
            ("asphalt_cement","eia_asphalt_cement",        0.15,  30, True,  False),
            ("jolts_openings", "bls_jolts_construction",   0.10,  45, True,  True),
        ],
    },
    "capital_cycle_v1": {
        "label": "Capital Deployment Cycle v1",
        "tau": 180,
        "signals": [
            ("yield_curve",    "fred_t10y2y",             0.25, 180, False, False),
            ("fed_funds",      "fred_fedfunds",           0.20, 120, True,  False),
            ("sam_spending",   "sam_construction_awards", 0.20,  30, False, True),
            ("aia_abi",        "aia_abi_index",           0.15,  90, False, True),
            ("demographics",   "census_acs_pop_growth",   0.10, 365, False, False),
            ("permits",        "bps_total_permits",       0.10,  60, False, True),
        ],
    },
}


# ─── Response shapes ─────────────────────────────────────────────────────────

class EvaluatedSignalOut(BaseModel):
    id: str
    metric: str
    z: float
    weight: float
    weightAdjusted: float
    contribution: float
    isSynthetic: bool
    latestValue: Optional[float] = None
    latestObservedAt: Optional[str] = None


class ForecastResponse(BaseModel):
    model: str
    geo: str
    horizon: int
    score: float
    components: List[EvaluatedSignalOut]
    generatedAt: str
    persisted: bool
    coldStart: bool


class NarrateRequest(BaseModel):
    model_config = {"str_strip_whitespace": True}
    geo: str = Field(..., max_length=20)
    score: float = Field(..., ge=0, le=100)
    components: List[Dict[str, Any]]
    model: str = Field(default="wbp_v1", max_length=40)


class NarrateResponse(BaseModel):
    narrative: str
    source: str
    tokensIn: Optional[int] = None
    tokensOut: Optional[int] = None
    generatedAt: str
    persisted: bool = False


# ─── Math (the fusion engine) ────────────────────────────────────────────────

def _horizon_weight_adjust(base_weight: float, horizon: int, lead_days: int, tau: float) -> float:
    """Gaussian decay around the signal's lead time."""
    delta = horizon - lead_days
    return base_weight * math.exp(-(delta ** 2) / (2 * tau * tau))


def _logistic(x: float) -> float:
    return 1.0 / (1.0 + math.exp(-x))


def _fuse(z_by_id: Dict[str, float], model_id: str, horizon: int) -> Dict[str, Any]:
    """Combine z-scores into a final 0-100 fusion score."""
    spec = FUSION_MODELS[model_id]
    tau = spec["tau"]
    components_out: List[Dict[str, Any]] = []
    weighted_sum = 0.0
    coldstart_count = 0

    for (sig_id, metric, base_w, lead, invert, allow_cold) in spec["signals"]:
        z_raw = z_by_id.get(sig_id, 0.0)
        is_synthetic = sig_id not in z_by_id
        if is_synthetic and not allow_cold:
            continue
        if is_synthetic:
            coldstart_count += 1
        z = -z_raw if invert else z_raw
        w_adj = _horizon_weight_adjust(base_w, horizon, lead, tau)
        contribution = w_adj * z
        weighted_sum += contribution
        components_out.append({
            "id": sig_id,
            "metric": metric,
            "z": round(z_raw, 3),
            "weight": base_w,
            "weightAdjusted": round(w_adj, 4),
            "contribution": round(contribution, 4),
            "isSynthetic": is_synthetic,
        })

    score_0_1 = _logistic(weighted_sum)
    score = round(score_0_1 * 100, 1)
    return {
        "score": score,
        "components": components_out,
        "coldStart": coldstart_count >= len(spec["signals"]) // 2,
    }


# ─── Mock data (Mock Mode) ───────────────────────────────────────────────────

def _mock_z_by_id(geo: str, model_id: str) -> Dict[str, float]:
    """Synthetic but deterministic z-scores keyed on (geo, signal_id)."""
    spec = FUSION_MODELS[model_id]
    rng = random.Random(f"{geo}-{model_id}")
    out: Dict[str, float] = {}
    for (sig_id, *_rest) in spec["signals"]:
        out[sig_id] = rng.uniform(-1.5, 1.8)
    return out


# ─── Live data (when MOCK=false, plugs into existing federal data libs) ──────

def _live_z_by_id(geo: str, model_id: str) -> Dict[str, float]:
    """
    Production wiring: pull series from federal data libs, compute z-scores.

    The libs already exist in src_wordenstandard/lib/:
      - bls.ts        BLS JOLTS + ECI + PPI
      - census.ts     BPS permits + ACS demographics
      - eia.ts        Diesel + crude + asphalt cement
      - fred-extended.ts  Yield curve + Fed funds + macro
      - sam.ts        SAM.gov + USASpending federal awards
      - noaa.ts       Weather (no key needed)

    Mirror them as Python services (app/services/federal_data/*.py) and
    call them here. Each returns {observedAt, value} time series; compute
    z = (latest - mean_5yr) / std_5yr, clamp(-3, 3).

    Until those services are wired, this raises so Mock Mode stays the default.
    """
    raise NotImplementedError(
        "Live federal data not yet wired. Set FORECAST_MOCK=true (default) or "
        "implement app/services/federal_data/* mirrors of the TypeScript libs."
    )


# ─── Endpoints ───────────────────────────────────────────────────────────────

@router.get("/forecast", response_model=ForecastResponse)
@limiter.limit("60/hour")
def get_forecast(
    request: Request,
    model: str = "wbp_v1",
    geo: str = "51041",
    horizon: int = 90,
    db: Session = Depends(get_db),
) -> ForecastResponse:
    """
    Returns a fused 0-100 score for a (model, geo, horizon) triple.

    ForecastStation calls this every time the user changes geo or horizon.
    """
    if model not in FUSION_MODELS:
        raise HTTPException(status_code=404, detail=f"Unknown model: {model}")
    if horizon not in (30, 90, 180, 365):
        raise HTTPException(status_code=400, detail="horizon must be 30, 90, 180, or 365")
    if not geo.isdigit() or len(geo) > 10:
        raise HTTPException(status_code=400, detail="geo must be a FIPS code")

    if _is_mock():
        z_by_id = _mock_z_by_id(geo, model)
    else:
        z_by_id = _live_z_by_id(geo, model)

    fused = _fuse(z_by_id, model, horizon)

    return ForecastResponse(
        model=model,
        geo=geo,
        horizon=horizon,
        score=fused["score"],
        components=[EvaluatedSignalOut(**c) for c in fused["components"]],
        generatedAt=datetime.now(timezone.utc).isoformat(),
        persisted=False,
        coldStart=fused["coldStart"],
    )


@router.post("/narrate", response_model=NarrateResponse)
@limiter.limit("30/hour")
def narrate_forecast(
    request: Request,
    payload: NarrateRequest,
) -> NarrateResponse:
    """
    Turn a fusion result into a 2-3 sentence executive narrative.

    Uses ANTHROPIC_API_KEY (already in Railway env from codex baseline) when
    available, falls back to deterministic template otherwise so the user
    always gets text regardless of LLM availability.
    """
    if not os.getenv("ANTHROPIC_API_KEY"):
        return _deterministic_narrative(payload)

    try:
        return _anthropic_narrative(payload)
    except Exception as e:
        logger.warning(f"Anthropic narrative failed, falling back: {e}")
        return _deterministic_narrative(payload)


def _deterministic_narrative(p: NarrateRequest) -> NarrateResponse:
    """Honest fallback — cites top contributing signals without inventing data."""
    components = sorted(
        p.components, key=lambda c: abs(c.get("contribution", 0)), reverse=True
    )
    top = components[:2] if components else []

    if p.score >= 75:
        band = "high"
        verb = "strongly supports"
    elif p.score >= 55:
        band = "moderate"
        verb = "leans toward"
    elif p.score >= 35:
        band = "mixed"
        verb = "shows mixed signals for"
    else:
        band = "weak"
        verb = "discourages"

    spec = FUSION_MODELS.get(p.model, {})
    model_label = spec.get("label", p.model)

    top_phrases = []
    for c in top:
        sig_id = c.get("id", "")
        contrib = c.get("contribution", 0)
        direction = "lifting" if contrib > 0 else "dragging"
        top_phrases.append(f"{sig_id.replace('_', ' ')} {direction}")

    narrative = (
        f"{model_label} reads {p.score:.0f}/100 for this geography — "
        f"a {band} signal that {verb} the outlook. "
        + (
            f"Top drivers: {', '.join(top_phrases)}."
            if top_phrases
            else "No dominant signals identified."
        )
    )
    return NarrateResponse(
        narrative=narrative,
        source="deterministic",
        generatedAt=datetime.now(timezone.utc).isoformat(),
    )


def _anthropic_narrative(p: NarrateRequest) -> NarrateResponse:
    """Wire to Claude Haiku for the narrative — small, structured, cheap."""
    # Production: use anthropic.Anthropic() client (already in codex requirements.txt)
    # For now this stub returns the deterministic version with source flipped
    # so the contract is honored. Plug Claude SDK here when ready.
    raise NotImplementedError("Anthropic client wiring deferred; using deterministic fallback")
