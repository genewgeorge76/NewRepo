# Security Review — J. Worden & Sons Platform
**Date:** 2026-06-21  
**Scope:** apps/api (FastAPI), auth/2FA, master-key scheme, SSRF protections, input validation, secrets handling, injection risks, rate limiting, external-provider clients (Regrid/Google Maps/Lob/Stripe/Twilio/OpenAI/Anthropic)  
**Reviewer:** Wave 5 automated audit (Claude Sonnet 4.6)

---

## Summary

| Severity | Count | Status |
|----------|-------|--------|
| CRITICAL | 0 | — |
| HIGH | 4 | **All fixed in Wave 5** |
| MEDIUM | 5 | Documented; 2 deferred to go-live |
| LOW | 4 | Documented |

---

## HIGH — Fixed

### H1: Leads endpoints exposed without authentication (FIXED)
**Files:** `apps/api/app/routers/leads.py`  
**Issue:** `GET /api/v1/leads/`, `GET /api/v1/leads/{id}`, and `PATCH /api/v1/leads/{id}` had no `verify_premium_security` dependency, exposing customer PII (name, email, phone) to any unauthenticated caller.  
**Fix:** Added `dependencies=[Depends(verify_premium_security)]` to all three routes. The public `POST /leads/contact` endpoint remains open by design (contact form).

### H2: Timing oracle on master-key and PIN authentication (FIXED)
**Files:** `apps/api/app/routers/auth.py`  
**Issue:** `body.master_key != settings.jworden_master_key` and `body.pin != settings.admin_pin` used Python's `!=` operator, which short-circuits on the first differing byte. An attacker could measure response latency to recover the key one byte at a time (~256 requests per byte).  
**Fix:** Replaced with `hmac.compare_digest()` in both `/token` and `/pin-token` endpoints. The `security.py` master-key check already used `hmac.compare_digest` (fixed in a prior session); auth.py is now consistent.

### H3: 2FA TOTP endpoints had no rate limiting (FIXED)
**Files:** `apps/api/app/routers/admin_2fa.py`  
**Issue:** `/admin/2fa/verify`, `/admin/2fa/disable`, and `/admin/2fa/backup-verify` had no rate limits. TOTP has a 30-second window (~6-digit code space of 1,000,000). Without rate limiting, an attacker with the master key could brute-force a valid TOTP code in under a minute.  
**Fix:** Added `@limiter.limit('10/minute')` to all three mutation endpoints.

### H4: Twilio webhook/recording endpoints had no signature validation (FIXED)
**Files:** `apps/api/app/routers/voice.py`  
**Issue:** `POST /voice/twilio/webhook` and `POST /voice/twilio/recording` accepted any POST request. An attacker could forge Twilio callbacks to create arbitrary leads or trigger recording downloads.  
**Fix:** Added `_verify_twilio_signature()` helper implementing the [Twilio HMAC-SHA1 validation spec](https://www.twilio.com/docs/usage/webhooks/webhooks-security). Both endpoints now validate `X-Twilio-Signature` against `TWILIO_AUTH_TOKEN` when credentials are configured. In unconfigured (mock) mode the check is skipped with a warning.

---

## MEDIUM — Documented

### M1: Default secrets are insecure placeholders
**Files:** `apps/api/app/config.py`  
**Issue:** `jworden_master_key` defaults to `'change-me'` and `jwt_secret_key` to `'change-me-jwt'`. If deployed with `.env` missing, the API runs with publicly-known secrets.  
**Recommendation:** Add a startup validator in `main.py` (lifespan event) that raises `RuntimeError` if these values equal their defaults and `ENVIRONMENT != 'development'`. **Required before go-live.**

### M2: No JWT revocation mechanism
**Issue:** Admin JWTs are valid for 24 hours with no revocation. If a master key is rotated (key compromise), existing tokens stay valid until expiry.  
**Recommendation:** Implement a simple `TokenBlocklist` table with the JWT `jti` field, checked on each authenticated request. Alternatively, shorten JWT TTL to 1 hour.

### M3: Client portal returns token directly (magic link not sent)
**Files:** `apps/api/app/routers/client_portal.py`  
**Issue:** `POST /portal/auth` returns the portal JWT directly in the response body. In production, the spec requires emailing a magic link instead. Returning the token in the response allows anyone who can call the API to get a portal token for any known customer email.  
**Recommendation:** Implement the email-delivery path (SendGrid is already wired) before exposing the customer portal. **Required before go-live.**

### M4: 2FA is optional and not enforced on the main auth flow
**Issue:** Even when 2FA is enrolled and enabled for `admin`, the `/auth/token` endpoint doesn't check it. An attacker with the master key gets a full JWT without 2FA.  
**Recommendation:** After issuing the master-key exchange, check if 2FA is enabled for the `admin` user; if so, return a short-lived challenge token and require a `/auth/token/confirm` call with a valid TOTP. This is a meaningful security upgrade but is non-trivial to implement.

### M5: Blog body not sanitized server-side
**Files:** `apps/api/app/routers/blog.py`  
**Issue:** Blog post `body` content is stored as raw HTML/Markdown and returned to clients without server-side sanitization. If a future admin interface allows untrusted authors, stored XSS is possible.  
**Recommendation:** Apply DOMPurify (client-side) or `bleach` (server-side) before rendering blog post HTML in the web app. For now, only admin-issued content is stored, keeping risk low.

---

## LOW — Documented

### L1: CORS allows all methods and headers
**Files:** `apps/api/app/main.py`  
`allow_methods=['*']` and `allow_headers=['*']` are broader than needed. Restrict to `['GET', 'POST', 'PUT', 'PATCH', 'DELETE']` and the specific headers used (`Content-Type`, `Authorization`, `X-Master-Key`).

### L2: Portal token TTL is 7 days
**Files:** `apps/api/app/routers/client_portal.py`  
7-day portal tokens are long for a construction scheduling context. Recommend 24–48 hours with a refresh mechanism.

### L3: OpenAPI docs disabled in non-debug mode (GOOD — no action needed)
`docs_url='/docs' if settings.debug else None` is correctly configured. No fix required.

### L4: Google Maps Static API ToS compliance
**Files:** `apps/api/app/services/imagery_service.py`  
The file already documents this clearly. Google Maps Static API ToS §3.2.3 prohibits caching aerial imagery for prospecting. A commercial ToS-compliant alternative (Nearmap, EagleView) must be used before commercial go-live.

---

## Areas Confirmed Clean

| Area | Status |
|------|--------|
| SQL injection | **Clean** — SQLAlchemy ORM throughout; no raw SQL strings |
| SSRF — Regrid API | **Fixed** (Wave 5) — ZIP validated with regex before URL interpolation |
| SSRF — Twilio recording | **Fixed** — `RecordingSid` validated by `^RE[0-9a-f]{32}$`; `RecordingUrl` never used |
| SSRF — Google Maps | **Clean** — only lat/lon floats interpolated; no user-controlled URL components |
| File upload validation | **Clean** — MIME type + size checked on both `/voice/upload` and `/ai/photo-inspect` |
| Stripe webhook | **Clean** — `stripe.Webhook.construct_event()` validates HMAC-SHA256 signature |
| Secrets in code | **Clean** — all secrets via pydantic-settings / `.env`; no hardcoded keys |
| Injection (prompt/template) | **Clean** — user content passed as data, not injected into prompt templates |
| Rate limiting coverage | **Complete** — all public/AI/scan/voice endpoints limited; test mode disables limiter |
| Audit log | **Present** — `AuditEvent` table records auth events with IP address |
