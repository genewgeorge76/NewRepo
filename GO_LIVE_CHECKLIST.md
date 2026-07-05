# Go-Live Checklist — J. Worden & Sons Platform
**Last updated:** 2026-06-21

This checklist covers everything needed to flip from demo/mock mode to real customer-facing operation. Complete every item in order. Items marked ⚠ are security-critical blockers.

---

## 1. API Keys & Accounts Required

### 1a. Must-Have (Core Platform)

| Service | Purpose | Where to get |
|---------|---------|--------------|
| **Anthropic API** | Jarvis AI assistant, bid scoring | console.anthropic.com → API keys |
| **PostgreSQL** (Railway or Supabase) | Primary database (SQLite is dev-only) | railway.app or supabase.com |
| **Stripe** (live mode) | Customer deposit payments | dashboard.stripe.com → API keys |
| **Stripe webhook secret** | Verify payment events | Stripe → Webhooks → endpoint secret |

### 1b. Should-Have (Voice & Notifications)

| Service | Purpose | Where to get |
|---------|---------|--------------|
| **Twilio** | Inbound call recording + SMS | console.twilio.com |
| **OpenAI** | Voice transcription (Whisper), photo inspect (GPT-4o) | platform.openai.com |
| **SendGrid** | Transactional email (portal magic links) | app.sendgrid.com |

### 1c. Optional (Advanced Features)

| Service | Purpose | Where to get |
|---------|---------|--------------|
| **Regrid** | Real parcel data for scan campaigns | app.regrid.com → API plan |
| **Nearmap or EagleView** | Commercial aerial imagery (replace Google Maps — see SECURITY_REVIEW M4/L4) | nearmap.com or eagleview.com |
| **Lob** | Physical direct mail delivery | lob.com → API keys |
| **Sentry** | Error monitoring | sentry.io |
| **Pinecone** | Vector search / RAG knowledge base | pinecone.io |
| **Google GBP OAuth** | Google Business Profile updates | Google Cloud Console |

---

## 2. Environment Variables

Create `apps/api/.env` (never commit to git):

```bash
# ── Core ──────────────────────────────────────────────────────────────────────
ENVIRONMENT=production
DATABASE_URL=postgresql://user:pass@host:5432/jworden_prod

# !! GENERATE THESE — do NOT reuse dev values !!
JWORDEN_MASTER_KEY=$(openssl rand -hex 32)   # 64-char hex secret
JWT_SECRET_KEY=$(openssl rand -hex 32)        # 64-char hex secret

# ── AI ────────────────────────────────────────────────────────────────────────
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...           # Whisper + GPT-4o Vision

# ── Payments ──────────────────────────────────────────────────────────────────
STRIPE_SECRET_KEY=sk_live_...  # NOT sk_test_
STRIPE_WEBHOOK_SECRET=whsec_...

# ── Voice ─────────────────────────────────────────────────────────────────────
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_FROM_NUMBER=+18045550100

# ── Email ─────────────────────────────────────────────────────────────────────
SENDGRID_API_KEY=SG....
SENDGRID_FROM_EMAIL=no-reply@jwordenasphaltpaving.com

# ── Direct Mail (Wave 4) ──────────────────────────────────────────────────────
REGRID_API_KEY=...              # leave blank for mock mode
LOB_API_KEY=...                 # leave blank for mock mode
LOB_FROM_NAME=J. Worden & Sons

# ── Monitoring ────────────────────────────────────────────────────────────────
SENTRY_DSN=https://...@sentry.io/...
```

Create `apps/web/.env.local` and `apps/ops/.env.local`:

```bash
VITE_API_BASE_URL=https://jworden-api.up.railway.app
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_SENTRY_DSN=https://...@sentry.io/...
```

---

## 3. Deploy Steps

### 3a. API → Railway

1. Push the `main` branch to GitHub (CI quality gate must be green).
2. In Railway: create project → "Deploy from GitHub repo" → select `genewgeorge76/newrepo`.
3. Set root directory to `apps/api`, build command `pip install -r requirements.txt`, start command `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
4. Add all env vars from §2 above.
5. Add a PostgreSQL add-on; copy the `DATABASE_URL` it provides.
6. Trigger a deploy. Verify `/health` returns `{"status":"ok"}`.
7. Run the database migration: `alembic upgrade head` (or use SQLAlchemy `create_all` for initial deploy — already wired in `lifespan`).
8. Configure Celery: add Redis add-on, set `REDIS_URL`, start a second Railway service with command `celery -A app.celery_app worker -Q ai,default -c 2`.

### 3b. Web (jwordenasphaltpaving.com) → Netlify

1. The `genewgeorge76/jworden-production` repo auto-deploys to Netlify on `main` push (see memory: jworden-site-deploy).
2. Set `VITE_API_BASE_URL` in Netlify → Site settings → Environment variables.
3. Set `VITE_STRIPE_PUBLISHABLE_KEY`.
4. Trigger a deploy or push a commit.
5. Verify the contact form at `/contact` creates a lead via the API.

### 3c. Ops Dashboard → Netlify (separate site)

1. From `apps/ops`, run `npm run build` and deploy the `dist/` folder as a separate Netlify site.
2. Set the same env vars as web.
3. Protect with Netlify password or IP allowlist — the ops dashboard is admin-only.

### 3d. Stripe Webhook

1. In Stripe dashboard → Webhooks → "Add endpoint".
2. URL: `https://jworden-api.up.railway.app/api/v1/payments/webhook`
3. Events: `checkout.session.completed`
4. Copy the signing secret → `STRIPE_WEBHOOK_SECRET` in Railway.

### 3e. Twilio

1. In Twilio Console → Phone numbers → your number → Voice → "A call comes in".
2. Set webhook to `https://jworden-api.up.railway.app/api/v1/voice/twilio/webhook` (HTTP POST).
3. Set recording status callback to `https://jworden-api.up.railway.app/api/v1/voice/twilio/recording`.

---

## 4. ⚠ Security Blockers Before Customer Traffic

These **must** be resolved before any real customer data enters the system (see SECURITY_REVIEW.md for details):

- [x] **⚠ M1 — Change default secrets**: Confirm `JWORDEN_MASTER_KEY` and `JWT_SECRET_KEY` are freshly generated (not `'change-me'`). Startup assertion added 2026-07-05 — the API now refuses to boot in production with default secrets.
- [ ] **⚠ M3 — Portal magic link**: Implement email delivery for `/portal/auth` before enabling customer portal. Currently returns token directly (dev shortcut).
- [ ] **⚠ L4 — Imagery ToS**: If running scan campaigns in production with real imagery, use Nearmap or EagleView, not Google Maps Static. See `imagery_service.py` ToS note.

---

## 5. Must-Test Before Customer Use

### 5a. Automated (CI)

Run the full test suite — must be green:
```bash
cd apps/api
pip install -r requirements.txt -r requirements-test.txt
pytest tests/ --timeout=30 -q
# Expected: 76 passed
```

### 5b. Manual Smoke Tests (Production Environment)

Run these end-to-end with real API keys before announcing launch:

#### Auth
- [ ] `POST /api/v1/auth/token` with correct master key → returns JWT
- [ ] Same endpoint with wrong key → 401 (not 500)
- [ ] JWT works on `/api/v1/leads/` → 200

#### Leads / Contact Form
- [ ] Submit contact form on website → lead appears in ops dashboard
- [ ] `POST /api/v1/leads/contact` without auth → 201 (public endpoint)
- [ ] `GET /api/v1/leads/` without auth → 403

#### Payments
- [ ] Create a Stripe checkout session for a lead with `estimated_value` set
- [ ] Complete payment in Stripe test mode → webhook fires → transaction marked `paid`

#### Voice
- [ ] Call Twilio number → hears greeting → records message
- [ ] Recording callback fires → transcript created → lead appears in ops dashboard

#### Scan Campaign (Wave 4)
- [ ] Create campaign for ZIP `23220` with real keys (or mock) → run → export ZIP with CSV + mailer HTMLs
- [ ] If `LOB_API_KEY` set: verify letter appears in Lob dashboard

#### AI (Jarvis)
- [ ] `POST /api/v1/ai/jarvis` with a question → returns relevant answer
- [ ] `POST /api/v1/ai/photo-inspect` with a photo → returns damage assessment

#### Pricing
- [ ] `GET /api/v1/pricing/services` → list of services
- [ ] `POST /api/v1/pricing/estimate` for VA + paving 1000 sqft → low/high USD

#### Blog
- [ ] `GET /api/v1/blog/` → empty or existing posts
- [ ] `POST /api/v1/blog/draft` with AI key → generates draft
- [ ] Publish and verify on website

#### 2FA (optional but recommended)
- [ ] `POST /admin/2fa/setup` → get QR code, scan in authenticator app
- [ ] `POST /admin/2fa/verify` with TOTP code → 2FA enabled

---

## 6. Smoke-Test Results (Demo/Mock Mode — Wave 5)

All tests run locally with `ENVIRONMENT=test`, zero real API keys.

| Pipeline | Result | Notes |
|----------|--------|-------|
| Auth: token issue + verify | ✅ Pass | JWT round-trip confirmed |
| Leads: create, list, get, update | ✅ Pass | Auth enforced on all read/write ops |
| Pricing: estimate, quick-quote, state multiplier | ✅ Pass | 51-state multiplier table verified |
| Scan campaign: create, run, detail, export | ✅ Pass | Mock pipeline: 8 parcels, ZIP with CSV + mailer HTMLs |
| Security: bad key → 403 | ✅ Pass | Both missing key and wrong key correctly rejected |
| **Total** | **64/64 pass** | 30-second per-test timeout enforced |
