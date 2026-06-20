# Worden Standard v5 — Licensable Contractor Platform

A 51-state, multi-tenant contractor management platform. First tenant: [J. Worden & Sons](https://www.jwordenasphaltpaving.com) — 4th-generation asphalt paving & general contracting (est. 1984, Chester VA).

Designed to be licensed to other contractors: swap `apps/web/src/config/tenant.ts` to point at a new `TenantConfig` and the entire platform white-labels — location pages, NAP, branding, pricing, trust signals, engineering standards.

## Architecture

```
newrepo/
├── apps/
│   ├── web/          # Public website — Vite 8 + React 19 + TanStack Router (Netlify)
│   ├── ops/          # Internal ops dashboard — Worden Standard v5 (private)
│   └── api/          # FastAPI Python backend (Railway)
├── packages/
│   ├── core/         # Types, estimator, trades, legal DB, tenant config system
│   ├── ai/           # Claude client, Jarvis, bid intelligence, RAG
│   └── ui/           # Shared React components
├── scripts/
│   ├── lead_scoring.py   # Hourly GitHub Actions cron
│   └── vdot_scraper.py   # VDOT bid opportunity scraper
└── .github/workflows/
    ├── quality-gate.yml  # TS typecheck + build on push
    └── lead-scoring.yml  # Hourly lead scoring cron
```

## Multi-Tenant / White-Label

Business identity, NAP, branding, compliance signals, pricing, and service areas all live in `TenantConfig` (see `packages/core/src/tenant.ts`). J Worden's config is `packages/core/src/tenants/jworden.ts`.

**To license to a new contractor:**
1. Create `packages/core/src/tenants/acme-paving.ts` with their `TenantConfig`
2. Change `apps/web/src/config/tenant.ts` to `export const CURRENT_TENANT = ACME_TENANT`
3. Set their env vars, push — done.

Location pages auto-generate meta titles, descriptions, h1s, FAQ content, and JSON-LD schemas from the tenant config. No content changes needed across components.

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
Routes: Home · About · Services · Estimator · Contact · **Service Area (`/locations`)** · **51 City Pages (`/locations/:slug`)** · **Blog** · **Blog Post** · **AI Photo Inspector** (`/photo-inspect`)

- Deployed to Netlify — `netlify.toml` has SPA fallback for all routes
- TanStack Router v1 (manual route tree)
- JSON-LD schemas on every location page (LocalBusiness, BreadcrumbList, FAQPage)
- Blog post pages: loading skeleton → content or 404 (no "Article Not Found" prerender flash)

### `apps/ops` — Worden Standard v5 Dashboard (11 stations)
Home · Jarvis AI · Estimate · Jobs · Crew · Equipment · Weather · Banking · Legal · **CRM** · **Lien Calendar**

- Internal only — do not expose publicly
- All data persisted to `localStorage` for offline field use
- 10-day paving GO/CAUTION/NO-GO forecast via Open-Meteo
- 51-state legal database in `packages/core/src/legal.ts`

### `apps/api` — FastAPI Backend (41 endpoints)

| Router | Endpoints |
|---|---|
| health | `/health`, `/health/db` |
| leads | `/api/v1/leads/contact`, list, get, update |
| ai | `/api/v1/ai/jarvis`, `/bid-score`, `/photo-inspect` (GPT-4o Vision) |
| analytics | `/api/v1/analytics/summary` |
| blog | 7 endpoints — CRUD + AI draft generation |
| payments | 3 endpoints — Stripe checkout, webhook, status |
| voice | 3 endpoints — upload, Twilio TwiML, recording callback |
| lien | 5 endpoints — calculate, track, upcoming, entries, states |
| customers | 8 endpoints — CRUD, service history, bulk import |
| crm | 3 endpoints — leads pipeline, stage update, funnel |

All protected routes require `X-Master-Key` header.  
Rate limiting via `slowapi` — per-router limits.  
Redis cache (in-memory fallback for dev).

## Packages

### `@jworden/core`
Pure TypeScript, zero dependencies. Exports:

| Export | Description |
|---|---|
| `TRADES` | 20+ trade specs with density/depth/cost data |
| `calculateEstimate()` | 35% margin floor, binder index, machine health |
| `pavingDecision()` | GO/CAUTION/NO-GO from weather inputs |
| `STATE_LEGAL` | 51-state contractor legal DB (licensing, bond, lien law, prevailing wage, OSHA) |
| `TenantConfig` | Multi-tenant config interface |
| `JWORDEN_TENANT` | J Worden's full tenant config (51 VA cities + business identity) |
| `getLocationsForTenant()` | All location pages for a tenant |
| `getLocationBySlug()` | Single location lookup |
| `getNearbyLocations()` | Same-region fallback to same-state |
| `getLocationsByState()` | All cities in a state |
| `getUniqueRegions()` | Distinct region names for grouping |
| `buildLocationData()` | Auto-generate meta/h1 from tenant config |

### `@jworden/ai`
Claude-powered intelligence: `askJarvis()`, `scoreBidTier()`, `generateBidProposal()`, multi-model router, RAG knowledge base

### `@jworden/ui`
Shared React components: `PhoneLink`, `DecisionBadge`, `DollarValue`

## Worden Engineering Standards

Constants in `packages/core/src/constants.ts`:

| Standard | Value |
|---|---|
| Marshall compaction floor | 96% (AASHTO T99/T180) |
| Base spec | VDOT Section 315 structural stone |
| Oil shield buffer | ±$9/ton |
| Sovereign base depth | 6 inches minimum |
| Gross margin floor | 35% |
| Binder index | $627.50 |
| Machine health | $0.08/ton |

## Secrets Required

| Secret | Used by | Where |
|---|---|---|
| `ANTHROPIC_API_KEY` | Jarvis AI, bid intelligence | `apps/api`, `packages/ai` |
| `DATABASE_URL` | API (defaults to SQLite for dev) | `apps/api` |
| `JWORDEN_MASTER_KEY` | All protected API routes | `apps/api` |
| `OPENAI_API_KEY` | GPT-4o Vision, Whisper, blog drafts | `apps/api` |
| `STRIPE_SECRET_KEY` | Checkout sessions | `apps/api` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signature | `apps/api` |
| `TWILIO_ACCOUNT_SID` | Voice intake, TwiML | `apps/api` |
| `TWILIO_AUTH_TOKEN` | Voice intake | `apps/api` |
| `TWILIO_FROM_NUMBER` | Outbound calls | `apps/api` |
| `VITE_API_BASE_URL` | Web + Ops apps | `apps/web`, `apps/ops` |
| `VITE_MASTER_KEY` | Web + Ops API calls | `apps/web`, `apps/ops` |

See `.env.example` for the full list.

## Deployment

| App | Platform | Trigger |
|---|---|---|
| `apps/web` | Netlify | Push to `main` |
| `apps/api` | Railway | Push to `main` |
| `apps/ops` | Netlify (separate site) | Push to `main` |

Set GitHub Actions secrets: `ANTHROPIC_API_KEY`, `JWORDEN_API_URL`, `JWORDEN_MASTER_KEY`, `VITE_API_BASE_URL`

## Bid Tiers

| Tier | Signals | Target Value |
|---|---|---|
| 🐋 Whale | Federal, USACE, VDOT, airport, highway | $500K+ |
| 🦈 Shark | Commercial, parking lot, municipality, school | $50K–$500K |
| 🐟 Fish | Residential driveway, patch, seal | <$50K |
