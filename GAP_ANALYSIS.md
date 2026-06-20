# GAP ANALYSIS — Worden Standard v5 vs Source Repos
*Generated 2026-06-20. Wave 1 completed 2026-06-20. Wave 2 completed 2026-06-20. Source repos treated as read-only.*

---

## Wave 2 — Completed 2026-06-20

12 new capabilities ported at premium quality (TypeScript strict 0 errors, real logic, model-matched fields):

| # | Item | What Was Built |
|---|---|---|
| 1 | **Proposals / Document Generation** | `routers/proposals.py` (5 endpoints) + `services/proposal_engine.py` — GPT-4o 7-section markdown proposal, win/loss outcome tracking, win-rate stats |
| 2 | **Operations / Work Orders** | `routers/operations.py` (7 endpoints) — work order CRUD with auto-timestamps (started_at, completed_at), stats summary, jobs pipeline view |
| 3 | **Dispatch / Scheduling** | `routers/dispatch.py` (5 endpoints) + `services/dispatch_engine.py` — haversine crew proximity scoring, skill matching, weekly schedule, availability check |
| 4 | **Foreman Check-In** | `routers/foreman.py` (4 endpoints) — timestamped progress notes, active-jobs dashboard, completed-today count, site status |
| 5 | **Workforce / Crew** | `routers/workforce.py` (6 endpoints) — member CRUD, cert expiry alerts (license, OSHA card, JSON cert array), soft-terminate |
| 6 | **Subcontractors** | `routers/subcontractors.py` (7 endpoints) — sub directory, performance reviews (quality/schedule/communication 1–5), aggregate rating, compliance expiry alerts |
| 7 | **Safety / OSHA** | `routers/safety.py` (6 endpoints) — GPT-4o toolbox talks (12 topics), incident CRUD, TRIR/DART rate calculator, aggregate site safety score |
| 8 | **Cash Flow** | `routers/cashflow.py` (6 endpoints) — signed-amount entry CRUD, 13-week rolling forecast with seasonal adjustment (off-season Nov–Feb), alert thresholds |
| 9 | **KPI Dashboard** | `routers/kpi.py` (1 endpoint) — single aggregate wall: pipeline, jobs, work orders, workforce, safety, cashflow, proposals, VDOT, gallery |
| 10 | **VDOT Bid Scraper** | `routers/vdot_bids.py` (4 endpoints) — public VDOT advertisement page scraped with httpx + BeautifulSoup4, auto-tiering (WHALE/SHARK/FISH by estimate), background scan trigger |
| 11 | **Market Intelligence** | `routers/market_intelligence.py` (3 endpoints) — seasonal demand curve (12-month index), 51-state paving demand signals, competitor landscape with win-rate cross-reference |
| 12 | **Gallery** | `routers/gallery.py` (3 endpoints) — photo upload with local filesystem + S3 dual backend, list with state/type/featured filters, delete with storage cleanup |

**Services added:** `conversation_memory.py` (ChatSession + ChatMessage), `proposal_engine.py`, `dispatch_engine.py`  
**ai.py updated:** Jarvis now accepts `session_id`, hydrates history from DB, persists replies  
**Frontend added:** `/gallery` (masonry grid, lightbox, upload), `/command-center` (authenticated KPI wall)  
**Ops stations added:** Dispatch · Safety · Cash Flow · Market Intelligence (15 stations total)

---

## Wave 1 — Completed 2026-06-20

All 7 Tier 1 items ported at premium quality (TypeScript strict 0 errors, real error handling, no stubs where source has real logic):

| # | Item | What Was Built |
|---|---|---|
| 1 | **51 VA location pages** | Data-driven, multi-tenant architecture. `TenantConfig` in `packages/core/src/tenant.ts`, J Worden tenant in `packages/core/src/tenants/jworden.ts`. All 51 cities, auto-generated SEO meta, JSON-LD schemas (LocalBusiness, BreadcrumbList, FAQPage). Swap tenant config to white-label for new licensee. |
| 2 | **Stripe payments** | `apps/api/app/routers/payments.py` — checkout session creation (20% deposit), webhook signature verification, payment status. Demo mode when no key set. |
| 3 | **Twilio voice intake** | `apps/api/app/routers/voice.py` + `services/voice_intake.py` — Whisper transcription, GPT-4o entity extraction, TwiML webhook, recording callback. SSRF protection on recording SID. |
| 4 | **GPT-4o Vision photo inspector** | `apps/api/app/routers/ai.py` `/photo-inspect` + `AIPhotoInspector.tsx` — upload photo → severity assessment, findings table, recommended services. |
| 5 | **Blog** | `apps/api/app/routers/blog.py` (7 endpoints + GPT-4o draft gen) + `routes/blog.tsx` + `routes/blog-post.tsx`. Fixed "Article Not Found" prerender bug with 3-state loading pattern. |
| 6 | **Lien calendar** | `apps/api/app/services/lien_calendar.py` (13 states) + `routers/lien_calendar.py` (5 endpoints). Ops dashboard Lien Calendar station. |
| 7 | **CRM** | `apps/api/app/routers/customers.py` (8 endpoints) + `routers/crm.py` (pipeline + funnel). Ops dashboard CRM station with stage filter and lead list. |

**Architecture addition:** Multi-tenant / white-label system. `TenantConfig` interface drives location pages, NAP, branding, pricing, compliance, engineering standards, and service area across all 50 states + DC. J Worden = first tenant instance.

---

## Source Repos Inventoried

| Repo | Path | What It Is |
|---|---|---|
| **gemni-investigate** | `C:\Users\genew\gemni-investigate` | Frontend SPA — JWordenAI with 3D, maps, multi-model AI, bid engine, 41 location pages |
| **codexbuildfreeofbase44** | `C:\Users\genew\source\repos\jwordenaii\codexbuildfreeofbase44` | Full-stack monolith — 74 FastAPI routers, React/JSX frontend, Netlify functions |
| **wordenstandard** | `C:\Users\genew\wordenstandard` | Internal ops dashboard — 9 stations, Jarvis, 70+ trades, 51-state legal, weather |
| **wordenuniversity** | `C:\Users\genew\wordenuniversity` | LMS — Worker Classification + OSHA courses with full quiz/cert engine |
| **doooooone** | `C:\Users\genew\doooooone` | Root: 49 static HTML location/service pages · Subdirectory: WordenEnterpriseOS (full FastAPI backend, 120+ endpoints, 86 services, 9 Celery tasks) |
| **facebookmarketing** | `C:\Users\genew\facebookmarketing` | Marketing assets — Facebook audit, SEO audit, 80+ keyword map, 2-week content calendar |
| **seo_spider_mcp_server** | `C:\Users\genew\seo_spider_mcp_server` | Empty — no files present |

---

## Legend
- ✅ **Ported** — Fully implemented in newrepo
- 🟡 **Partial** — Core logic exists but missing depth/features
- ❌ **Missing** — Not yet implemented in newrepo

---

## 1. BACKEND API (FastAPI)

The source has **120+ endpoints across 80 router files** and **86 service modules**.  
newrepo currently has **4 router files** and **2 service modules**.

### 1A. Ported Routers

| Router | Status | Note |
|---|---|---|
| `health.py` | ✅ | `/health`, liveness, readiness |
| `leads.py` | ✅ | `/contact` POST; newrepo adds `WEB-{id}` assignment |
| `ai.py` | ✅ | `/jarvis` + `/bid-score` + `/photo-inspect` (GPT-4o Vision) |
| `analytics.py` (partial) | 🟡 | `/summary` only; missing funnel, revenue-forecast, monthly-volume |

### 1B. Missing Routers — Categorized

#### Admin & Security (Missing)
| Router | Endpoints | Source |
|---|---|---|
| `admin.py` | HTML dashboard — 13 routes (leads, content, GSC, GA4, AI chat) | WordenEnterpriseOS |
| `admin_2fa.py` | 4 routes — TOTP setup/verify/disable/status | WordenEnterpriseOS |
| `admin_integrations.py` | 6 routes — managed key CRUD, reload, live-probe test | WordenEnterpriseOS |
| `admin_vector.py` | 2 routes — Pinecone reindex + health | WordenEnterpriseOS |
| `audit_admin.py` | 1 route — `/audit/events` | WordenEnterpriseOS |
| `auth.py` | 3 routes — `/auth/status`, `/auth/token` (JWT), `/auth/pin` | WordenEnterpriseOS |
| `features.py` | 1 route — `/features` tier-based feature flags | WordenEnterpriseOS |
| `staff_router.py` | 9 routes — login, me, checkin, profile, docs + admin staff CRUD | WordenEnterpriseOS |
| `twilio_verify_router.py` | 4 routes — OTP send/check/status (admin + public) | WordenEnterpriseOS |

#### Sales & CRM (Missing)
| Router | Endpoints | Source |
|---|---|---|
| `crm.py` | ✅ **Ported** — pipeline stage CRUD, funnel counts | WordenEnterpriseOS |
| `customers.py` | ✅ **Ported** — full CRM: create/list/get/update, service history, bulk import | WordenEnterpriseOS |
| `proposals.py` | 2 routes — generate proposal, generate + queue for approval | WordenEnterpriseOS |
| `quotes.py` | 1 route — generate priced proposal from evaluation | WordenEnterpriseOS |
| `follow_ups.py` | 2 routes — list follow-ups, cancel task | WordenEnterpriseOS |
| `reviews.py` | 2 routes — get aggregate reviews, AI review response draft | WordenEnterpriseOS |
| `bid_intelligence.py` | 6 routes — win/loss outcome CRUD, win-rate stats, GPT-4o win analysis | WordenEnterpriseOS |

#### Payments (Missing)
| Router | Endpoints | Source |
|---|---|---|
| `payments.py` | ✅ **Ported** — Stripe checkout session, webhook, payment status | WordenEnterpriseOS |

#### Field Operations (Missing)
| Router | Endpoints | Source |
|---|---|---|
| `operations.py` | 15 routes — estimates CRUD, jobs CRUD, work orders, job documents | WordenEnterpriseOS |
| `dispatch_router.py` | 11 routes — trucks/drivers/jobs CRUD + assignment | WordenEnterpriseOS |
| `foreman.py` | 4 routes — job progress, crew check-in, live project status | WordenEnterpriseOS |
| `workforce.py` | 6 routes — employee CRUD, availability query, expiring certs | WordenEnterpriseOS |
| `subcontractors.py` | 8 routes — sub CRUD, performance history, expiring certs | WordenEnterpriseOS |
| `schedule_sim.py` | 2 routes — simulation status, run what-if simulation | WordenEnterpriseOS |
| `kickserv.py` | 2 routes — connection status, sync jobs from Kickserv | WordenEnterpriseOS |

#### Geospatial & IoT (Missing)
| Router | Endpoints | Source |
|---|---|---|
| `geo.py` | 9 routes — site polygons, permit leads, Virginia LIS scrape, truck GPS pings, radius query | WordenEnterpriseOS |
| `live_site.py` | 2 routes — SSE site-stream (truck + compaction every 5s), site snapshot | WordenEnterpriseOS |
| `compaction.py` | 3 routes — compaction ping, heat map, site analysis | WordenEnterpriseOS |
| `drone_scan.py` | 3 routes — ingest drone scan (photogrammetry/LiDAR/thermal), latest, history | WordenEnterpriseOS |
| `drone_capture_router.py` | 4 routes — upload/list/delete drone captures | WordenEnterpriseOS |
| `lidar_ingest_router.py` | 5 routes — upload/list/delete LiDAR scans, match as-built to design | WordenEnterpriseOS |
| `roller_telemetry_router.py` | 5 routes — start/sample/end roller session, telemetry dashboard, alert | WordenEnterpriseOS |
| `crew_wearables.py` | 3 routes — wearable vitals webhook (Oura/Apple/Fitbit), crew health snapshot | WordenEnterpriseOS |
| `asphalt_thermal_router.py` | 1 route — thermal lay-down window calculation (mix temp decay) | WordenEnterpriseOS |

#### AI & Analytics (Missing)
| Router | Endpoints | Source |
|---|---|---|
| `jarvis_router.py` | 7 routes — autonomous command, chat w/memory, web search, outbound call, email, status, readiness | WordenEnterpriseOS |
| `autonomy.py` | 9 routes — autonomy state, freeze/unfreeze, goals, Digital Twin, intelligence map | WordenEnterpriseOS |
| `takeoff.py` | 6 routes — vision takeoff, rapid takeoff from photo, history, ground scan, pavement decay, premium civil stack | WordenEnterpriseOS |
| `spatial_ai.py` | 6 routes — as-built deviation verify, estimate lines CRUD, cost catalog | WordenEnterpriseOS |
| `math_ai.py` | 4 routes — PCI pavement scoring, cost estimate, maintenance forecast, lead quality prediction (GBM) | WordenEnterpriseOS |
| `igrade.py` | 6 routes — iGrade stats, logs, self-correction sweep, media file CRUD | WordenEnterpriseOS |
| `documents.py` | 3 routes — parse contract PDF, parse blueprint for sqft, parse permit PDF | WordenEnterpriseOS |
| `human_review.py` | 5 routes — review queue CRUD, approve/reject AI decisions, stats | WordenEnterpriseOS |
| `vector_search.py` | 1 route — Pinecone semantic search over blog posts | WordenEnterpriseOS |
| `search.py` | 3 routes — Elasticsearch full-text search, reindex, health | WordenEnterpriseOS |
| `market_intelligence.py` | 3 routes — competitors, state market signals, seasonal demand | WordenEnterpriseOS |
| `ads_intelligence.py` | 9 routes — Google AI Max, URL exclusions, Customer Match export, lead qualification agent, anomaly detection | WordenEnterpriseOS |
| `plan_estimator.py` | 2 routes — parse uploaded plans + return estimate, inbound email webhook | WordenEnterpriseOS |

#### Content & SEO (Missing)
| Router | Endpoints | Source |
|---|---|---|
| `blog.py` | ✅ **Ported** — 7 routes: list/get/create/update/publish/delete + GPT-4o draft | WordenEnterpriseOS |
| `seo.py` | 3 routes — city page copy, meta tags, location FAQs | WordenEnterpriseOS |
| `schema_ld.py` | 1 route — JSON-LD LocalBusiness schema | WordenEnterpriseOS |
| `gallery.py` | 3 routes — upload/list/delete job photos | WordenEnterpriseOS |
| `content.py` | 2 routes — list/get CMS content blocks | WordenEnterpriseOS |

#### Communication (Missing)
| Router | Endpoints | Source |
|---|---|---|
| `voice.py` | ✅ **Ported** — upload transcription, TwiML webhook, recording callback (SSRF protected) | WordenEnterpriseOS |
| `chat.py` | 3 routes — create session, history, **WebSocket `/ws/chat/{session_id}`** | WordenEnterpriseOS |
| `public_chat.py` | 1 route — rate-limited public concierge chat (15/min) | WordenEnterpriseOS |
| `email.py` | 3 routes — send, log, template test | WordenEnterpriseOS |
| `tts.py` | 5 routes — speak, stream, status, Claude ping, Gemini ping, ElevenLabs ping | WordenEnterpriseOS |
| `gbp_router.py` | 4 routes — GBP post draft, push, reviews, review request | WordenEnterpriseOS |

#### Financial (Missing)
| Router | Endpoints | Source |
|---|---|---|
| `cashflow.py` | 6 routes — entry CRUD, 13-week rolling forecast, alert threshold | WordenEnterpriseOS |
| `revenue.py` | 2 routes — revenue loop status, allocate revenue | WordenEnterpriseOS |

#### Compliance & Legal (Missing)
| Router | Endpoints | Source |
|---|---|---|
| `compliance.py` | 7 routes — 51-jurisdiction matrix, verify license, batch verify, state rules, PPE inspection | WordenEnterpriseOS |
| `lien_calendar.py` | ✅ **Ported** — 5 routes: calculate, track, upcoming, entries, states (13-state DB) | WordenEnterpriseOS |
| `permits.py` | 6 routes — permit CRUD, national feed, state-specific feed | WordenEnterpriseOS |
| `vdot_bids.py` | 4 routes — list/get VDOT bids, trigger scan | WordenEnterpriseOS |
| `scc.py` | 3 routes — Virginia SCC entity verification, batch verify | WordenEnterpriseOS |
| `advisor.py` | 6 routes — legal strategy, top states, reciprocity ranking, license optimizer, utility risk, compliance plan | WordenEnterpriseOS |
| `safety.py` | 8 routes — toolbox talks, incidents, OSHA rate, per-site safety scores, biometric alert | WordenEnterpriseOS |

#### Infrastructure & Monitoring (Missing)
| Router | Endpoints | Source |
|---|---|---|
| `metrics.py` | 7 routes — Celery, Redis, DB, AI, cache, Jarvis SLO, provider heartbeats | WordenEnterpriseOS |
| `monitoring.py` | 2 routes — comprehensive health, active alerts | WordenEnterpriseOS |
| `google_reporting.py` | 2 routes — unified Google Ads + GSC + GA4 summary | WordenEnterpriseOS |
| `scaling.py` | 2 routes — scaling architecture status, provision node | WordenEnterpriseOS |
| `tenants.py` | 3 routes — white-label tenant CRUD | WordenEnterpriseOS |
| `kpi_wall.py` | 1 route — aggregate KPI wall | WordenEnterpriseOS |
| `site_metrics.py` | 1 route — Command Center site metrics (compliance + ad ROI) | WordenEnterpriseOS |
| `global_platform.py` | 3 routes — universal ledger verify, maintenance plan, service triage | WordenEnterpriseOS |
| `search_pulse_router.py` | 1 route — search metrics snapshot | WordenEnterpriseOS |
| `retrospectives.py` | 6 routes — project lessons CRUD, GPT-4o auto-tag, surface past lessons for bids | WordenEnterpriseOS |
| `innovations.py` | 5 routes — innovation log CRUD, adopted methods summary | WordenEnterpriseOS |
| `project_metrics.py` | 6 routes — project KPI scorecard CRUD, portfolio trends, GPT-4o case study generation | WordenEnterpriseOS |
| `websocket_events.py` | Socket.IO ASGI at `/sio` — real-time event bus | WordenEnterpriseOS |
| `visualizer.py` | 3 routes — parcel lookup, visual build → quote, AI design suggestions | WordenEnterpriseOS |

---

## 2. BACKEND SERVICES

Source has **86 service modules**. newrepo has **2** (`ai_engine.py`, basic `email_service.py` stub).

| Service Category | Count Missing | Key Missing Services |
|---|---|---|
| AI Engines | 12 | `vision_inspector.py` (GPT-4), `igrade_engine.py`, `cognitive_twin.py`, `math_ai_service.py`, `simulation_agent.py`, `orchestrator.py`, `anomaly_detector.py`, `document_intelligence.py` |
| Analytics | 4 | `analytics_ai.py`, `ga4_client.py`, `gsc_client.py`, `search_pulse.py` |
| Lead Scoring | 4 | `lead_scorer.py` (HOT/WARM/COOL), `lead_qualifier.py` (BUYER/BOT/etc.), `contractor_ranker.py`, `ranking.py` |
| Search | 3 | `search_service.py` (Elasticsearch), `vector_search_service.py` (Pinecone), `knowledge_base.py` |
| Communication | 4 | `email_service.py` (SendGrid), `tts_service.py`, `vapi_caller.py`, `websocket_manager.py` |
| Geospatial | 5 | `drone_capture.py`, `lidar_ingest.py`, `roller_telemetry.py`, `permit_scraper.py`, `dispatch_engine.py` |
| Compliance | 5 | `license_service.py`, `lien_calendar.py`, `scc_service.py`, `national_permits.py`, `lawyer_recommender.py` |
| Financial | 3 | `pricing.py`, `telemetry.py`, `monitoring_service.py` |
| Security | 4 | `totp_service.py`, `audit.py`, `staff_auth.py`, `tenant_service.py` |
| AI Memory | 3 | `conversation_memory.py`, `long_memory.py`, `short_memory.py` |
| Other | 39 | market_intelligence, ad_signals, gbp_automation, review_responder, proof_pack, langsmith_tracer, etc. |

---

## 3. DATABASE MODELS

Source has **50+ ORM models**. newrepo has **5** (Lead, Job, Crew, Equipment, Estimate).

| Missing Model | Purpose | Source |
|---|---|---|
| `Customer` | Full CRM record (residential/commercial) | WordenEnterpriseOS |
| `ServiceHistory` | Completed jobs per customer | WordenEnterpriseOS |
| `FollowUpTask` | Automated follow-up (HOT/WARM/COOL SLA) | WordenEnterpriseOS |
| `ProjectSite` | Geospatial site polygon + PostGIS | WordenEnterpriseOS |
| `WorkOrder` | Field execution unit for crews | WordenEnterpriseOS |
| `ProjectDocument` | Job documents (client-visible flag) | WordenEnterpriseOS |
| `ProjectMetric` | Post-completion KPI scorecard | WordenEnterpriseOS |
| `ProjectRetrospective` | Lessons-learned records | WordenEnterpriseOS |
| `TruckPosition` | Real-time GPS + asphalt temp + ETA | WordenEnterpriseOS |
| `GroundScanReport` | 811 ticket, utility locating, subsurface scan | WordenEnterpriseOS |
| `DroneScan` | Photogrammetry / LiDAR / thermal scans | WordenEnterpriseOS |
| `CompactionLog` | GPS-tagged intelligent roller compaction passes | WordenEnterpriseOS |
| `RegionalBaseEvaluation` | DOT spec compliance by region | WordenEnterpriseOS |
| `PavingEvaluation` | Physical site assessment → pricing multiplier | WordenEnterpriseOS |
| `LicenseVerificationLog` | Immutable contractor license check audit | WordenEnterpriseOS |
| `LienCalendarEntry` | Mechanics lien deadlines (50-state rules) | WordenEnterpriseOS |
| `SccVerificationLog` | Virginia SCC entity verification | WordenEnterpriseOS |
| `VdotBid` | VDOT bid board opportunities | WordenEnterpriseOS |
| `SubcontractorRoster` | Sub directory with license/insurance | WordenEnterpriseOS |
| `SubcontractorPerformance` | Per-project performance reviews | WordenEnterpriseOS |
| `WorkforceMember` | Employee skills + certifications | WordenEnterpriseOS |
| `CashFlowEntry` | 13-week income/expense entries | WordenEnterpriseOS |
| `CashFlowAlert` | Low-balance threshold per tenant | WordenEnterpriseOS |
| `PaymentTransaction` | Stripe checkout sessions | WordenEnterpriseOS |
| `PageContent` | CMS content blocks | WordenEnterpriseOS |
| `BlogPost` | Blog posts with SEO metadata | WordenEnterpriseOS |
| `ChatSession` / `ChatMessage` | WebSocket chat history | WordenEnterpriseOS |
| `EmailLog` | SendGrid send audit log | WordenEnterpriseOS |
| `HumanReviewQueue` | Low-confidence AI decisions flagged for review | WordenEnterpriseOS |
| `GradeLog` / `AICorrection` | iGrade engine decision log + correction patterns | WordenEnterpriseOS |
| `AdUrlExclusion` | Google Ads AI Max URL exclusions | WordenEnterpriseOS |
| `AnomalyAlert` | Business metric anomalies | WordenEnterpriseOS |
| `SafetyToolboxTalk` | Pre-shift safety briefing records | WordenEnterpriseOS |
| `SafetyIncident` | OSHA recordable / near-miss log | WordenEnterpriseOS |
| `GalleryImage` | Public gallery photos | WordenEnterpriseOS |
| `Innovation` | Experimental methods trial log | WordenEnterpriseOS |
| `ProposalOutcome` | Win/loss outcome records | WordenEnterpriseOS |
| `ProductItem` | Material/labor price catalog | WordenEnterpriseOS |
| `SiteEvaluation` | Monthly compliance + ad-ROI snapshot | WordenEnterpriseOS |
| `Tenant` | White-label SaaS tenant config | WordenEnterpriseOS |
| `AuditEvent` | Immutable privileged-action log | WordenEnterpriseOS |
| `TwoFactorSecret` | TOTP secrets + backup codes | WordenEnterpriseOS |
| `MediaFile` | Project photos/PDFs/videos | WordenEnterpriseOS |

---

## 4. CELERY BACKGROUND TASKS

Source has **9 Celery task files**. newrepo has **0** (Celery listed in requirements but no workers implemented).

| Task | Purpose | Source |
|---|---|---|
| `anomaly_beat.py` | Periodic anomaly detection (every 30 min) | WordenEnterpriseOS |
| `autonomy_tasks.py` | Autonomous task execution (Jarvis-orchestrated) | WordenEnterpriseOS |
| `cache_warmer.py` | Redis cache pre-population (every 5 min) | WordenEnterpriseOS |
| `email_tasks.py` | Async SendGrid email delivery | WordenEnterpriseOS |
| `scraper.py` | Async permit scraping (Virginia LIS) | WordenEnterpriseOS |
| `self_heal_beat.py` | Periodic data quality correction (every hour) | WordenEnterpriseOS |
| `vdot_scraper.py` | VDOT bid board scraper | WordenEnterpriseOS |
| `vector_tasks.py` | Pinecone index rebuild | WordenEnterpriseOS |
| `vision.py` | Async drone/takeoff photo analysis | WordenEnterpriseOS |

---

## 5. EXTERNAL INTEGRATIONS

| Integration | Status | Source |
|---|---|---|
| Anthropic (Claude) | ✅ Ported | All repos |
| Open-Meteo weather | ✅ Ported | (in ops app) |
| **Stripe** (payments, webhooks) | ❌ Missing | WordenEnterpriseOS |
| **Twilio** (voice, SMS, TwiML, recording, Verify OTP) | ❌ Missing | WordenEnterpriseOS |
| **SendGrid** (email delivery, audit log, templates) | ❌ Missing | WordenEnterpriseOS |
| **Pinecone** (vector search, semantic RAG) | ❌ Missing | WordenEnterpriseOS |
| **Elasticsearch** (full-text search, blog, content) | ❌ Missing | WordenEnterpriseOS |
| **OpenAI GPT-4 / GPT-4o** (vision, proposals, analysis) | ❌ Missing | WordenEnterpriseOS |
| **Google Gemini** (specs, long-context tasks) | ❌ Missing | gemni-investigate, WordenEnterpriseOS |
| **Google Analytics 4** (traffic, conversions) | ❌ Missing | WordenEnterpriseOS |
| **Google Search Console** (keywords, CTR, positions) | ❌ Missing | WordenEnterpriseOS |
| **Google Ads** (AI Max, URL exclusions, Customer Match) | ❌ Missing | WordenEnterpriseOS |
| **Google Business Profile** (posts, reviews) | ❌ Missing | WordenEnterpriseOS |
| **Vapi** (outbound AI voice calls) | ❌ Missing | WordenEnterpriseOS |
| **ElevenLabs** (text-to-speech streaming) | ❌ Missing | WordenEnterpriseOS |
| **LangChain + LangSmith** (RAG pipeline, observability) | ❌ Missing | WordenEnterpriseOS |
| **Datadog** (APM, 5xx alerting) | ❌ Missing | WordenEnterpriseOS |
| **Sentry** (listed in requirements) | 🟡 Partial | (in requirements.txt only, not wired) |
| **Tavily** (web search for Jarvis) | ❌ Missing | WordenEnterpriseOS |
| **Kickserv** (field service CRM sync) | ❌ Missing | WordenEnterpriseOS |
| **PyOTP / QRCode** (TOTP 2FA) | ❌ Missing | WordenEnterpriseOS |
| **Socket.IO** (real-time event bus) | ❌ Missing | WordenEnterpriseOS |
| **GeoAlchemy2 / PostGIS** (spatial queries) | ❌ Missing | WordenEnterpriseOS |
| **NumPy / SciPy / scikit-learn** (mathematical AI) | ❌ Missing | WordenEnterpriseOS |

---

## 6. FRONTEND — apps/web (Public Site)

### Ported Pages
| Page | Status | Note |
|---|---|---|
| Home | ✅ | Hero, JarvisChat, trust bar, services grid, lead form |
| About | ✅ | Basic |
| Services | ✅ | Basic |
| Estimator | ✅ | Full trade calculator with Worden math |
| Contact | ✅ | Lead capture form |

### Missing Pages / Routes
| Missing | Source | SEO/Business Value |
|---|---|---|
| **51 location pages** (`/locations`, `/locations/:slug`) | gemni-investigate, doooooone | ✅ **Ported** — data-driven multi-tenant arch; all 51 VA cities; JSON-LD schemas; white-label ready |
| **Blog** (list + post detail) | WordenEnterpriseOS | ✅ **Ported** — prerender bug fixed; skeleton loading; BlogPosting schema |
| **Gallery** (job photo portfolio) | WordenEnterpriseOS, gemni-investigate | 🟠 High — conversion, E-E-A-T signals |
| **Command Center** (authenticated admin SPA) | WordenEnterpriseOS, gemni-investigate | 🟠 High — internal ops |
| **Dispatch node** | gemni-investigate | 🟡 Medium — field ops |
| **Whale Hunter** (lead tier visualization) | gemni-investigate | 🟡 Medium — sales intelligence |
| **Field crew portal** | gemni-investigate | 🟡 Medium — crew mobile use |
| **Client portal** (job status, documents) | WordenEnterpriseOS, gemni-investigate | 🟡 Medium — customer experience |
| **GC Bid engine** | gemni-investigate | 🟡 Medium — commercial bidding |
| **Revenue dashboard** | WordenEnterpriseOS | 🟡 Medium — financial visibility |
| **Voice calls** page | WordenEnterpriseOS | 🟢 Low |
| Static HTML location pages (49 files in doooooone root) | doooooone | 🟠 High — deploy-ready SEO pages |

### Missing Key Components
| Component | What It Does | Source |
|---|---|---|
| **Three.js 3D cross-section viewer** | WebGL drag-to-rotate Worden Standard layer diagram | gemni-investigate |
| **Leaflet polygon drawing / MapEstimator** | Users draw project boundary on satellite map → auto sqft + estimate | gemni-investigate |
| **AIPhotoInspector** | ✅ **Ported** — upload photo → GPT-4o Vision damage assessment + service recommendations | WordenEnterpriseOS |
| **Before/After slider gallery** | Before/after project comparison with drag slider | gemni-investigate |
| **Virtual foreman** | AI field guide component | gemni-investigate |
| **Truck tracker** | Real-time truck position map | gemni-investigate, WordenEnterpriseOS |
| **Live field feed** | Live crew status stream | WordenEnterpriseOS |
| **Property visualizer / Build configurator** | Visual design + quote builder | WordenEnterpriseOS |
| **Lead consultant / inbox** | Internal lead management UI | WordenEnterpriseOS |
| **Swarm Coordinator UI** | Parallel AI agent visualization | gemni-investigate |
| **Voice interface** (Web Speech API) | Hands-free crew commands | gemni-investigate |
| **React PDF proposal renderer** | Client-downloadable PDF proposals | gemni-investigate |
| **WebGL persona avatar** | 3D chat avatar for Jarvis | WordenEnterpriseOS |
| **Local reviews (live Google feed)** | Live Google Reviews widget | WordenEnterpriseOS, gemni-investigate |
| **SEO schema markup component** | JSON-LD per-page structured data | gemni-investigate |
| **Google Intelligence Engine** | Core Web Vitals + E-E-A-T self-scoring | gemni-investigate |

### Missing Netlify Functions
| Function | Purpose | Source |
|---|---|---|
| `get-token.ts` | JWT token issuance (master key → 24h JWT) | WordenEnterpriseOS |
| `command-center-auth.ts` *(edge function)* | Command Center PIN gate with HttpOnly cookie | WordenEnterpriseOS |
| `auto-post-tweet.js` | Automated Twitter/X post | WordenEnterpriseOS |
| `post-tweet.js` | Manual Twitter/X post | WordenEnterpriseOS |
| `lead-fallback-notify.js` | Lead fallback SMS/email notification | WordenEnterpriseOS |

---

## 7. APPS/OPS (Internal Dashboard)

The ops app (`apps/ops`) is the **best-ported section** — it closely mirrors the `wordenstandard` source.

| Station | Status | Note |
|---|---|---|
| Home (telemetry strip) | ✅ | Matches source |
| Jarvis AI | ✅ | Matches source |
| Estimate (70+ trades) | ✅ | Matches source |
| Jobs pipeline | ✅ | Matches source |
| Crew management | ✅ | Matches source |
| Equipment tracking | ✅ | Matches source |
| Weather (10-day GO/CAUTION/NO-GO) | ✅ | Matches source |
| Banking / margin dashboard | ✅ | Matches source |
| Legal / compliance (51 states) | ✅ | Full 51-state DB in `packages/core/src/legal.ts` |

### Added in Wave 1
| Station | What Was Added |
|---|---|
| **CRM** | Pipeline view with stage filter, lead list with tier color coding, load from API |
| **Lien Calendar** | Inline deadline calculator (state + dates → all deadlines), upcoming entries list (60-day window) |

### Still Missing from ops vs source
| Missing | Source |
|---|---|
| **Real-time paving weather logic** fires from geolocation on load | wordenstandard |
| **Dispatch view** — truck/crew assignment | wordenstandard (newer version) |
| **Session-based auth** (4-digit PIN + HttpOnly cookie) | wordenstandard |
| **Document upload / management** | WordenEnterpriseOS |
| **Compaction map** station | WordenEnterpriseOS |
| **KPI wall** station | WordenEnterpriseOS |
| **Drone feed** station | WordenEnterpriseOS |

---

## 8. PACKAGES

### @jworden/core
| Capability | Status | Note |
|---|---|---|
| Worden engineering constants | ✅ | All 12+ constants |
| TypeScript types (20 interfaces) | ✅ | Complete |
| Estimator + tonnage formula | ✅ | Full margin/binder/machine-health enforcement |
| 20+ trade specs | ✅ | 20 trades across 5 categories |
| 51 VA city configs (in `TenantConfig`) | ✅ | Multi-tenant, white-label architecture |
| `TenantConfig` + location helpers | ✅ | New Wave 1 addition — powers all location pages |
| 51-state legal DB | ✅ | Full `STATE_LEGAL` export |
| Paving GO/CAUTION/NO-GO logic | ✅ | |

### @jworden/ai
| Capability | Status | Note |
|---|---|---|
| Claude client factory | ✅ | |
| Jarvis system prompt + askJarvis() | ✅ | |
| Bid intelligence (Whale/Shark/Fish scoring) | ✅ | |
| Multi-model router | ✅ | Claude/Haiku routing |
| RAG knowledge base (6 chunks) | 🟡 | Source has LangChain + Pinecone + Chroma + full embedded KB |
| GPT-4 Vision inspector | ❌ Missing | |
| iGrade self-correcting engine | ❌ Missing | |
| Swarm Coordinator (parallel agents) | ❌ Missing | gemni-investigate |
| Voice interface (Web Speech API) | ❌ Missing | gemni-investigate |
| Satellite estimator stub | ❌ Missing | gemni-investigate |
| Anomaly detector | ❌ Missing | WordenEnterpriseOS |
| Cognitive Digital Twin | ❌ Missing | WordenEnterpriseOS |
| LangChain RAG pipeline | ❌ Missing | WordenEnterpriseOS |
| Conversation memory (short + long term) | ❌ Missing | WordenEnterpriseOS |

### @jworden/ui
| Component | Status |
|---|---|
| PhoneLink | ✅ |
| DecisionBadge | ✅ |
| DollarValue | ✅ |
| Everything else (85+ components) | ❌ Missing — not yet extracted to shared package |

---

## 9. WORDEN UNIVERSITY (LMS)

Entirely absent from newrepo. Two full courses with deep compliance content:

| Course | Status | Content |
|---|---|---|
| Worker Classification ($99) | ❌ Missing | 6 modules, IRS 20-factor, ABC test (11 states), 4 real misclassification cases w/penalties |
| OSHA Construction Safety ($149) | ❌ Missing | 10 modules, Fatal Four, silica, heat illness, OSHA 300 log, surviving inspection |
| LMS engine (quiz, cert, progress) | ❌ Missing | 8-question exams, 80% pass threshold, localStorage-persisted certs |

---

## 10. MARKETING ASSETS (facebookmarketing)

Content-only assets — not code gaps per se, but strategically valuable:

| Asset | Status | What to Use It For |
|---|---|---|
| SEO audit (80+ keywords mapped) | ❌ Not in newrepo | Populate `packages/core/src/locations.ts` + blog content calendar |
| Facebook audit + posting calendar | ❌ Not in newrepo | Content ops — not a code artifact |
| 14 pre-built location HTML pages | ❌ Not in newrepo | Source material for React location page components |
| Competitive analysis (8 named competitors) | ❌ Not in newrepo | Inform market intelligence features |

---

## 11. STATIC HTML LOCATION PAGES (doooooone root)

49 static HTML location/service pages — deploy-ready SEO assets never ported:

| Category | Count | Examples |
|---|---|---|
| City location pages | 35+ | richmond, chester, chesterfield, henrico, ashland, charlottesville, fredericksburg, williamsburg, virginia-beach, hampton, newport-news, suffolk, hopewell, colonial-heights, petersburg, glen-allen, midlothian, short-pump, mechanicsville, hanover, powhatan, goochland, dinwiddie, new-kent, fairfax, mclean, tuckahoe, sleepy-hollow |
| Service pages | 10+ | asphalt-driveway-paving, commercial-paving, residential-asphalt-paving, sealcoating, chip-and-tar, parking-lot-paving, line-striping, grading-excavation, concrete-paving, cobblestone-paving, stone-masonry-paving |
| Meta pages | 4 | index, service-areas, request-estimate, settings |

---

## 12. CAPABILITY MATRIX SUMMARY

*After Wave 1 — 2026-06-20*

| Domain | Total Capabilities | Ported | Partial | Missing |
|---|---|---|---|---|
| API Routers | 80 | **10** | 1 | 69 |
| API Endpoints | 120+ | **~41** | ~2 | ~80 |
| Service Modules | 86 | **3** | 1 | 82 |
| Celery Tasks | 9 | 0 | 0 | 9 |
| Database Models | 50+ | **10** | 0 | 40+ |
| External Integrations | 24 | **4** | 1 | 19 |
| Web App Routes | 30+ | **10** | 0 | 20+ |
| UI Components | 85+ | **10** | 0 | 75+ |
| Location Pages | 51 cities (multi-tenant) | **51** | 0 | 0 |
| AI Capabilities | 14 | **5** | 2 | 7 |
| Netlify Functions | 6 | 2 | 0 | 4 |
| LMS Courses | 2 | 0 | 0 | 2 |

---

## 13. PRIORITIZED PORT-IT-NEXT LIST

### Tier 1 — High Value, Relatively Self-Contained (Port First)

| # | Item | Source | Why High Priority |
|---|---|---|---|
| 1 | **41 Virginia location pages** (React routes with SEO data from core) | gemni-investigate + doooooone | #1 organic traffic driver. `packages/core` already has 20 location data objects — just need page components |
| 2 | **Stripe payments** (`payments.py` + `PaymentTransaction` model) | WordenEnterpriseOS | Direct revenue. Standalone, well-defined surface area |
| 3 | **Twilio voice intake** (`voice.py`, `voice_intake.py` service, TwiML webhook) | WordenEnterpriseOS | Inbound lead capture from phone calls — highest-intent leads |
| 4 | **GPT-4 Vision photo inspector** (`ai.py` `/photo-inspect`, `vision_inspector.py`) | WordenEnterpriseOS | Unique differentiator. Users upload driveway photo → instant damage assessment + quote |
| 5 | **Blog** (`blog.py` + 7 endpoints + BlogPost model + frontend list/post pages) | WordenEnterpriseOS | SEO domain authority, long-tail traffic |
| 6 | **Lien calendar** (`lien_calendar.py` + `LienCalendarEntry` model) | WordenEnterpriseOS | Legal risk mitigation — missed lien deadlines cost contractors $10K–$500K |
| 7 | **CRM: customers + pipeline** (`customers.py`, `crm.py`, `Customer`, `ServiceHistory` models) | WordenEnterpriseOS | Foundation for all operational features |

### Tier 2 — High Value, Moderate Complexity (Port Second)

| # | Item | Source | Why |
|---|---|---|---|
| 8 | **Operations: jobs + work orders + estimates** (`operations.py`, full job lifecycle) | WordenEnterpriseOS | Core field ops — expands the lightweight job tracking in ops app |
| 9 | **Cash flow projections** (`cashflow.py`, 13-week rolling forecast) | WordenEnterpriseOS | Financial visibility, invoice management |
| 10 | **Three.js 3D cross-section viewer** (`CrossSectionViewer.tsx`) | gemni-investigate | Sales differentiator — visualizes Worden Standard layers (drag-rotate WebGL) |
| 11 | **Leaflet polygon drawing estimator** (`MapEstimator.tsx`) | gemni-investigate | Interactive sales tool — draw project boundary → instant sqft + price |
| 12 | **Dispatch engine** (`dispatch_router.py`, `dispatch_engine.py`) | WordenEnterpriseOS | Truck/crew assignment, route optimization |
| 13 | **VDOT bid scanner** (`vdot_bids.py` + `vdot_scraper.py` Celery task) | WordenEnterpriseOS | Whale-tier lead generation — federal/DOT contracts = $500K+ |
| 14 | **Gallery** (`gallery.py` + `GalleryImage` model + frontend component) | WordenEnterpriseOS | Before/after proof-of-work; drives conversions |
| 15 | **Document parsing** (`documents.py`, `document_intelligence.py`) | WordenEnterpriseOS | Parse contract/blueprint/permit PDFs via Claude Vision — automates takeoff |

### Tier 3 — Strategic / Complex (Port Third)

| # | Item | Source | Why |
|---|---|---|---|
| 16 | **Drone scan + LiDAR ingest** (`drone_scan.py`, `lidar_ingest_router.py`) | WordenEnterpriseOS | Unique field intelligence capability — photogrammetry, as-built deviation |
| 17 | **WebSocket real-time chat** (`chat.py`, Socket.IO, `ChatSession` model) | WordenEnterpriseOS | Live customer chat — better than Netlify Function round-trips |
| 18 | **Admin HTML dashboard + 2FA** (`admin.py`, `admin_2fa.py`) | WordenEnterpriseOS | Secure internal command surface with TOTP, GSC/GA4 |
| 19 | **Safety/OSHA module** (`safety.py`, toolbox talks, incidents, OSHA rate) | WordenEnterpriseOS | Compliance + liability — field crew safety documentation |
| 20 | **All 9 Celery workers** (anomaly_beat, cache_warmer, vdot_scraper, etc.) | WordenEnterpriseOS | Async operations — everything from email to anomaly detection |
| 21 | **Pinecone vector search** + LangChain RAG upgrade | WordenEnterpriseOS | Upgrade RAG from 6-chunk keyword matching to real semantic retrieval |
| 22 | **Worden University LMS** (worker classification + OSHA courses) | wordenuniversity | Training platform — $99–$149/seat recurring revenue; builds E-E-A-T |
| 23 | **Compaction telemetry** (`compaction.py`, `roller_telemetry_router.py`, heat map) | WordenEnterpriseOS | Intelligent roller integration — proves 96% Marshall compaction floor |
| 24 | **Google GSC + GA4 integration** (`gsc_client.py`, `ga4_client.py`, admin dashboard) | WordenEnterpriseOS | SEO intelligence loop — keyword tracking, traffic analytics |
| 25 | **Multi-tenancy** (`tenants.py`, `tenant_service.py`, `Tenant` model) | WordenEnterpriseOS | White-label SaaS capability — expand to other contractors |

---

## 14. WHAT newrepo DOES BETTER THAN THE SOURCES

| Improvement | Details |
|---|---|
| **True TypeScript monorepo** | npm workspaces + `@jworden/core` / `@jworden/ai` / `@jworden/ui` — sources are all siloed |
| **Single source of truth** | All Worden constants in one place; sources had drift (e.g., binder index appeared as 627.50 in one repo, different in another) |
| **Vite 8 + React 19 + TanStack Router v1** | Sources use older React 18, some use Vite 5 |
| **Tailwind 4** (no config file) | Sources use Tailwind 3 with tailwind.config.js |
| **TypeScript strict mode everywhere** | Sources mix JSX and TSX; some have no strict mode |
| **Clean CI pipeline** | `.github/workflows/quality-gate.yml` runs type-check + build on every push; sources had partial CI |
| **Trade database consolidation** | 20+ trades with correct density/depth/unit data in one typed record; sources had scattered trade logic |
| **ops app architecture** | Single-file App.tsx with 9 stations, all inline — faster iteration than the multi-file wordenstandard source |

---

*Analysis covers all 7 source repos. seo_spider_mcp_server contained no files.*
