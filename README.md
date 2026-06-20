# J. Worden & Sons — Worden Standard v5

Unified platform for [jwordenasphaltpaving.com](https://www.jwordenasphaltpaving.com) — a 4th-generation asphalt paving and general contracting company (est. 1984, Chester VA).

## Architecture

```
newrepo/
├── apps/
│   ├── web/          # Public website — Vite + React + TanStack Router (Netlify)
│   ├── ops/          # Internal ops dashboard — Worden Standard v5 (private)
│   └── api/          # FastAPI Python backend (Railway)
├── packages/
│   ├── core/         # Shared constants, types, estimator, trades, legal DB
│   ├── ai/           # Claude client, Jarvis, bid intelligence, RAG
│   └── ui/           # Shared React components
├── scripts/
│   ├── lead_scoring.py   # Hourly GitHub Actions cron
│   └── vdot_scraper.py   # VDOT bid opportunity scraper
└── .github/workflows/
    ├── quality-gate.yml  # TS typecheck + build on push
    └── lead-scoring.yml  # Hourly lead scoring cron
```

## Worden Engineering Standards

These constants live in `packages/core/src/constants.ts` and are the **single source of truth** across all apps:

| Standard | Value |
|---|---|
| Marshall compaction floor | 96% (AASHTO T99/T180) |
| Base spec | VDOT Section 315 structural stone |
| Oil shield buffer | ±$9/ton |
| Sovereign base depth | 6 inches minimum |
| Gross margin floor | 35% |
| Binder index | $627.50 |
| Machine health | $0.08/ton |

**Tonnage formula:** `tons = (sqft / 9 × depth_in × density_pcf) / 24,000`
- Residential: 145 pcf | Commercial: 148 pcf

## Quick Start

```bash
# 1. Install
npm install

# 2. Copy and fill in secrets
cp .env.example .env

# 3. Dev servers
npm run dev:web   # http://localhost:5173 — public site
npm run dev:ops   # http://localhost:5174 — ops dashboard

# 4. API (in apps/api/)
python -m venv .venv && .venv/Scripts/activate   # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload   # http://localhost:8000
```

## Apps

### `apps/web` — Public Website
- Deployed to Netlify from `main` branch
- Netlify Functions for Jarvis AI chat (`/api/jarvis`) and lead capture (`/api/leads`)
- TanStack Router v1 (manual route tree for immediate dev server)
- Routes: Home · About · Services · Estimator · Contact
- 20 Virginia SEO location pages (see `packages/core/src/locations.ts`)

### `apps/ops` — Worden Standard v5 Dashboard
- Internal only — **do not expose publicly**
- 9 stations: Home · Jarvis AI · Estimate · Jobs · Crew · Equipment · Weather · Banking · Legal
- All data persisted to `localStorage` for offline field use
- 10-day paving GO/CAUTION/NO-GO forecast via Open-Meteo (free, no key needed)
- 10-state legal database; ask Jarvis for any additional state

### `apps/api` — Python Backend
- FastAPI on Railway with PostgreSQL + Redis
- Endpoints: `/health`, `/api/v1/leads/`, `/api/v1/ai/jarvis`, `/api/v1/ai/bid-score`, `/api/v1/analytics/summary`
- SQLAlchemy models with Alembic migrations
- Sentry error tracking, CORS locked to production domains

## Packages

### `@jworden/core`
Pure TypeScript, zero dependencies. Exports:
- `TRADES` — 20+ trade specs (asphalt residential/commercial, sealcoat, crack fill, milling, concrete, masonry, roofing, sitework…)
- `calculateEstimate(input, density)` — enforces 35% margin floor, binder index, machine health
- `pavingDecision(highF, precipPct, windMph)` — GO/CAUTION/NO-GO
- `STATE_LEGAL` — 10-state contractor legal database (licensing, lien law, prevailing wage, OSHA)
- `VA_LOCATIONS` — 20 Virginia SEO location targets

### `@jworden/ai`
Claude-powered intelligence:
- `askJarvis(messages)` — field AI with full Worden Standards system prompt
- `scoreBidTier(rfpText)` — Whale 🐋 / Shark 🦈 / Fish 🐟 tier classification
- `generateBidProposal(title, text, score)` — full proposal via Claude
- `routeToModel(task, messages)` — multi-model router (Sonnet for analysis, Haiku for chat)
- RAG knowledge base with 6 compliance knowledge chunks

### `@jworden/ui`
Shared React components: `PhoneLink`, `DecisionBadge`, `DollarValue`

## Secrets Required

See `.env.example` for the full list. Minimum for local dev:

| Secret | Used by |
|---|---|
| `ANTHROPIC_API_KEY` | Jarvis AI, bid intelligence |
| `DATABASE_URL` | API (defaults to SQLite for dev) |

## Deployment

| App | Platform | Trigger |
|---|---|---|
| `apps/web` | Netlify | Push to `main` |
| `apps/api` | Railway | Push to `main` |
| `apps/ops` | Netlify (separate site, `_redirects` auth) | Push to `main` |

Set GitHub Actions secrets: `ANTHROPIC_API_KEY`, `JWORDEN_API_URL`, `JWORDEN_MASTER_KEY`, `VITE_API_BASE_URL`

## Bid Tiers

| Tier | Signals | Target Value |
|---|---|---|
| 🐋 Whale | Federal, USACE, VDOT, airport, highway | $500K+ |
| 🦈 Shark | Commercial, parking lot, municipality, school | $50K–$500K |
| 🐟 Fish | Residential driveway, patch, seal | <$50K |
