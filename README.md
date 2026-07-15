# WORDEN SOVEREIGN OS

**Every ability. Every repo. One system.**

The unified operating system for J. Worden & Sons Paving & General Contracting —
the consolidation of 13 repositories into one best-of-breed platform: a 51-state,
multi-tenant, AI-native contractor OS.

> *4th Generation. Since 1984. Built to Last.*

---

## What this is

Deep research across the entire Worden codebase fleet (`genewgeorge76` + `jwordenaii`)
identified five best-of-breed pillars, extracted here without dilution:

| Pillar | Lives at | Extracted from |
|--------|----------|----------------|
| 🧠 **The Brain** — FastAPI backend, 85 routers / 85 services | `apps/api/` | `wordenstandard` |
| 🦴 **The Skeleton** — multi-tenant white-label platform (v5) | `apps/web`, `apps/ops`, `packages/` | `NewRepo` |
| 🛠️ **The Skills Library** — 178 JARVIS ability modules, 21 categories | `abilities/` | `jworden-jarvis-os` |
| ⚡ **The Intelligence Layer** — production JWORDENAI engine suite | `intelligence/` | `gemini2` |
| 🎛️ **The Cockpit** — Worden Command System | `apps/command/` | `googlebuiltoperatingsystem-` |

## The three documents

1. **[docs/MASTER_COMPILATION.md](docs/MASTER_COMPILATION.md)** — the full inventory: every repo, every router, every service, every ability, and where it now lives.
2. **[docs/FUTURE_ABILITIES.md](docs/FUTURE_ABILITIES.md)** — what the system can become: 13 combined abilities across 3 tiers, with a recommended build order.
3. **[docs/UNIFICATION_MAP.md](docs/UNIFICATION_MAP.md)** — provenance of every path, what was deliberately excluded, and the known wiring work.

## Layout

```
worden-sovereign-os/
├── apps/
│   ├── api/          # The Brain — FastAPI + Alembic + Celery (+ jarvis_core supervisor)
│   ├── web/          # Public white-label site — Vite + React 19 + TanStack Router
│   ├── ops/          # Internal ops dashboard
│   └── command/      # Worden Command System — 50-state data, 18-service pricing, JARVIS orb
├── packages/
│   ├── core/         # Tenant config, estimator, trades, 51-state legal DB
│   ├── ai/           # Claude client, Jarvis, bid intelligence, RAG, multi-model router
│   └── ui/           # Shared components
├── abilities/        # 178 JARVIS modules: sales, B2G bidding, quant finance, fleet, governance…
├── intelligence/     # JWORDENAI engines: bid intelligence, RAG, swarm, wealth, virtual foreman…
├── scripts/          # lead_scoring.py (hourly cron), vdot_scraper.py, sitemap builder
└── docs/             # Master compilation + 30 operational backend docs
```

## Quick start

```bash
# The Brain
cd apps/api && pip install -r requirements.txt && uvicorn app.main:app --reload

# The public site
cd apps/web && npm install && npm run dev

# The Cockpit
cd apps/command && npm install && npm run dev
```

## Engineering Standards (non-negotiable)

96% Marshall compaction · VDOT Section 315 base · ±$9/ton Oil Shield ·
Zero-Downtime DOT Medical · 145/148 lbs/sy/in density (res/industrial)

---

*Assembled 2026-07-15 from wordenstandard, NewRepo, jworden-jarvis-os, gemini2, and googlebuiltoperatingsystem-. See UNIFICATION_MAP.md for full provenance.*
