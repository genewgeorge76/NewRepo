# UNIFICATION MAP — What Came From Where

Every path in this repo traced to its source repository and commit-time location.
Nothing was rewritten during consolidation; this is a faithful extraction of the
best-of-breed component wherever duplicates existed across the fleet.

| This repo | Source repo | Source path | Why this copy won |
|-----------|-------------|-------------|-------------------|
| `apps/api/app/` | jwordenaii/wordenstandard | `app/` | Most complete backend: 85 routers / 85 services vs. codexbuildfreeofbase44 and jworden-production siblings |
| `apps/api/alembic/` | jwordenaii/wordenstandard | `alembic/` | Matches the models shipped with the app |
| `apps/api/jarvis_core/` | genewgeorge76/jworden-jarvis-os | `core/` | Supervisor, message broker, ML models unique to jarvis-os |
| `apps/web/` | genewgeorge76/NewRepo | `apps/web/` | v5 white-label public site (newest architecture) |
| `apps/ops/` | genewgeorge76/NewRepo | `apps/ops/` | v5 internal ops dashboard |
| `apps/command/` | genewgeorge76/googlebuiltoperatingsystem- | `src/`, `api/` | The distilled Worden Command System (already a 3-repo unification) |
| `packages/core/` | genewgeorge76/NewRepo | `packages/core/` | Tenant config system, 18 trades, 51-state legal DB |
| `packages/ai/` | genewgeorge76/NewRepo | `packages/ai/` | Cleanest TS AI clients (Claude, Jarvis, RAG, router) |
| `packages/ui/` | genewgeorge76/NewRepo | `packages/ui/` | Shared components |
| `abilities/` | genewgeorge76/jworden-jarvis-os | `abilities/` | 178 modules / 21 categories — unique to jarvis-os |
| `intelligence/engines/` | genewgeorge76/gemini2 | `src/ai/` | Production JWORDENAI engine suite |
| `intelligence/lib/` | genewgeorge76/gemini2 | `src/lib/` | ContractGenerator, SelfHealingPipeline, estimators, weatherGuard |
| `intelligence/logic/` | genewgeorge76/gemini2 | `src/logic/` | wealthEngine, negotiationCloser, sovereignElite, macro |
| `intelligence/utils/` | genewgeorge76/gemini2 | `src/utils/` | virtualForeman, ironMatrix, seasonalityEngine, et al. |
| `scripts/` | NewRepo + gemini2 | `scripts/` | lead_scoring.py, vdot_scraper.py, build-sitemaps.mjs (gemini2 lead scorer kept as `lead_scoring_gemini.py`) |
| `docs/backend/` | jwordenaii/wordenstandard | `docs/` | 30+ operational docs (2FA, autonomy, SLOs, deployment) |
| `.github/workflows/` | genewgeorge76/NewRepo | `.github/workflows/` | quality-gate + lead-scoring crons |

## Deliberately excluded

- `node_modules/`, build artifacts, `__pycache__`, `*.db` SQLite files (dev data)
- Media-heavy public assets (the source repos carry ~470MB each of images/video — those stay with the deployed sites)
- Duplicate backends in codexbuildfreeofbase44 / jworden-production (same lineage as wordenstandard)
- Deploy-artifact repos (doooone, atlantapavingandsealing) and standalone brand sites (blueridgeasphaltpaving, jwordenasphaltantigravity)
- All `.env` files and secrets (verified: none present in this repo)

## Known post-unification work

- Import paths inside `intelligence/` still use gemini2's `@/` alias — they resolve once wired into an app's tsconfig, or consume them as reference implementations when porting into `packages/ai`.
- `apps/command/src/App.jsx` calls the Anthropic API from an `api/` proxy — point it at `apps/api` instead.
- The five Jarvis implementations should converge on `apps/api/app/services/jarvis.py` (see FUTURE_ABILITIES.md, Tier 1 #1).
