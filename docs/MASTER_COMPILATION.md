# MASTER COMPILATION — Every Ability Across the Worden Codebase Empire

> Deep-research inventory of all 13 repositories across `genewgeorge76` and `jwordenaii`,
> compiled 2026-07-15. This is the definitive map of what the empire can do today,
> and the source of every component consolidated into this repository.

---

## 1. The Repository Fleet

| Repo | Role | Scale | Verdict |
|------|------|-------|---------|
| `jwordenaii/wordenstandard` | **The Brain** — flagship FastAPI backend | 85 routers, 85 services, 225 py files | ⭐ Consolidated → `apps/api` |
| `genewgeorge76/NewRepo` | **The Skeleton** — Worden Standard v5 multi-tenant monorepo | apps/web+ops+api, packages/core+ai+ui | ⭐ Consolidated → `apps/web`, `apps/ops`, `packages/*` |
| `genewgeorge76/jworden-jarvis-os` | **The Skills Library** — JARVIS agentic OS | 21 ability categories, 178 modules | ⭐ Consolidated → `abilities/` |
| `genewgeorge76/gemini2` | **The Intelligence Layer** — JWORDENAI production site (jwordenasphaltpaving.com) | 199 ts/js files, AI engine suite | ⭐ Consolidated → `intelligence/` |
| `genewgeorge76/googlebuiltoperatingsystem-` | **The Cockpit** — Worden Command System ("Every Ferrari, One Garage") | Single-file distilled command center | ⭐ Consolidated → `apps/command` |
| `jwordenaii/codexbuildfreeofbase44` | Sibling/predecessor of wordenstandard + Capacitor field app | 236 py, 391 js/ts | Superseded by wordenstandard (kept: nothing unique) |
| `genewgeorge76/jworden-production` | Kitchen-sink staging: everything + scavenged assets, OBX paving, deploy scripts | 2,170 files, 372 py | Superseded (unique deploy scripts noted below) |
| `genewgeorge76/jwordenasphaltantigravity` | Next.js SEO silo site — Richmond VA (antigravity brand) | 49 ts files, 600+ content pages | Standalone site (OrbitalMap noted) |
| `genewgeorge76/blueridgeasphaltpaving` | Next.js SEO silo site — Blue Ridge brand | 29 ts files + silo/blog generators | Standalone site |
| `jwordenaii/atlantapavingandsealing` | Static city-page silo — Georgia market | 29 pre-built city pages | Deploy artifact |
| `genewgeorge76/doooone` | Netlify deploy artifact of the production site | built bundle | Deploy artifact |
| `jwordenaii/wordenuniversity` | Vite/React starter — training university concept | starter only | Future build target |
| `jwordenaii/carolinablacktop` | Empty | 0 files | Reserved brand |

---

## 2. The Brain — `apps/api` (from wordenstandard)

The most complete contractor-operations backend found anywhere in the fleet. FastAPI + SQLAlchemy + Alembic + Celery + Redis.

### 85 Routers (API surface)
**Revenue & Sales:** leads, quotes, proposals, crm, customers, follow_ups, payments, cashflow, revenue, kickserv (CRM sync), public_chat, email
**Estimation & Takeoff:** takeoff, plan_estimator, materials, math_ai, compaction, igrade (A/B/C/D decision grading), visualizer (3D proposals), drone_scan, drone_capture_router, lidar_ingest_router, spatial_ai
**Bidding & Market:** bid_intelligence, vdot_bids, market_intelligence, ads_intelligence, forecast, scaling, global_platform
**Operations:** dispatch_router, foreman, operations, schedule_sim, workforce, staff_router, subcontractors, crew_wearables, roller_telemetry_router, asphalt_thermal_router, safety, weather, geo, live_site, project_metrics
**Legal & Compliance:** compliance, lien_calendar, permits, advisor (legal advisory), audit_admin, human_review
**AI & Autonomy:** ai, jarvis_router, autonomy, chat, voice, tts, vector_search, search_pulse_router, innovations, retrospectives
**Growth & SEO:** seo, blog, content, gallery, reviews, gbp_router (Google Business Profile), google_reporting, schema_ld, search, site_metrics, analytics, kpi_wall, metrics, monitoring, health
**Admin & Security:** admin, admin_2fa, admin_integrations, admin_vector, auth, twilio_verify_router, tenants (multi-tenant), features, documents, scc

### 85 Services (business logic)
**AI Engines:** ai_brain (SupremeCourtAI compliance), ai_engine, jarvis + jarvis_access + jarvis_observability, cognitive_twin, quantum_orchestrator, global_orchestrator, orchestrator, action_planner, simulation_agent, self_heal, corrections_engine, anomaly_detector, math_ai_service, analytics_ai
**Estimation:** pricing, vision_takeoff, vision_inspector, igrade_engine, estimate_approval, drone_capture, lidar_ingest, asphalt_thermal, scc_service, roller_telemetry
**Sales:** lead_scorer, lead_qualifier, proposal_generator, contractor_ranker, market_intelligence, material_prices, follow_up_tasks, review_responder, gbp_automation
**Memory & Knowledge:** rag, knowledge_base, vector_search_service, pinecone_client, long_memory, short_memory, conversation_memory, document_intelligence, code_reader
**Integrations:** ga4_client, gsc_client, google_suite, twilio_verify, vapi_caller (AI phone calls), tts_service, voice_intake, email_service, web_search, langsmith_tracer
**Legal:** permit_engine, permit_scraper, national_permits, lien_calendar, lawyer_recommender, staff_compliance, state_data (51 jurisdictions)
**Ops & Infra:** dispatch_engine, weather_service, crew_wearables, subcontractor_monitor, telemetry, monitoring_service, celery_health, safe_runner, runtime_config, tenant_service, license_service, totp_service, staff_auth, audit, notifications, websocket_manager, search_service, search_pulse, self_heal

### Backend docs (preserved in `docs/backend/`)
2FA, Jarvis autonomy, math AI, multi-GBP architecture, reliability SLOs, monitoring, deployment, environment keys, porting guide, and 25+ more operational documents.

---

## 3. The Skeleton — `apps/web`, `apps/ops`, `packages/*` (from NewRepo / Worden Standard v5)

A **51-state, multi-tenant, white-label contractor platform**. Swap one `TenantConfig` file and the entire platform rebrands: location pages, NAP, pricing, trust signals, engineering standards.

- `packages/core` — types, estimator engine, 18 trades, 51-state legal DB, locations, tenant config system (`tenants/jworden.ts` is tenant #1)
- `packages/ai` — Claude client, Jarvis, bid intelligence, RAG, multi-model router
- `packages/ui` — shared React components
- `apps/web` — public site: Vite + React 19 + TanStack Router (Netlify)
- `apps/ops` — private internal ops dashboard
- CI: quality-gate (typecheck + build) and hourly lead-scoring workflows

---

## 4. The Skills Library — `abilities/` (from jworden-jarvis-os)

**178 modules across 21 categories.** The widest capability surface in the fleet:

| Category | Highlights |
|----------|-----------|
| SalesAndEstimation | takeoff, openai_rfp_estimator, monte_carlo_bid_simulator, commercial_bid_hunter, crm_lead_scorer, roofing_ai, proposal_generator |
| CognitiveAndAutonomous | cognitive_twin, quantum_orchestrator, action_planner, self_heal, screed_3d_automation, asphalt_weather_matrix, ai_agentic_project_manager, vapi_jarvis_bridge |
| GovernmentAndB2G | autonomous_b2g_bidder, dynamic_auction_bidder |
| FinanceAndAccounting | equipment_macrs_depreciation, municipal_tax_calculator, asset_capitalization_engine, predictive_cashflow_ai, union_prevailing_wage |
| QuantFinance | quant_monte_carlo |
| FleetAndLogistics | telematics, fleet_acoustic_guardian |
| SystemGovernance | governance_daemon, domain-logic-audit, verify-operating-system-contract, reliability-synthetic-monitor, logic-preserve-snapshot |
| + 14 more | CapitalAndFinTech, EverydayAI, FinTechAndBanking, GenerativeDesignAndBIM, LegalAndCompliance, MarketOrchestration, MobileOperations, MultiTenantSaaS, OperationalAndDispatch, SaaSAndLicensing, SecurityAndInfrastructure, SupplyChainProcurement, SwarmRouting, VisionAndIntelligence |

Plus `apps/api/jarvis_core/` — the JARVIS supervisor, message broker, ML models, and database layer.

---

## 5. The Intelligence Layer — `intelligence/` (from gemini2 / JWORDENAI 2026.4.17)

The production site's AI suite, extracted:

- **engines/** — JWordenAIEngine (Anthropic direct), BidIntelligenceEngine (RFP → scored tier + proposal), MultiModelRouter (Claude/GPT-4/Gemini), RAGKnowledgeBase (VDOT, Davis-Bacon, SAM.gov), SatelliteEstimator, jarvisLogic, swarm/SwarmCoordinator
- **lib/** — ContractGenerator, SelfHealingPipeline, dynamicEstimator, estimator-engine, weatherGuard, industrialDigitalTwin, google-intelligence-engine, sovereignIndexing, sovereignPersona, authorityComparative
- **logic/** — wealthEngine, negotiationCloser, sovereignElite, macro suite
- **utils/** — virtualForeman, ironMatrix, seasonalityEngine, payrollTreasury, plantPulse, autonomousVision, richmondVoiceHub, commandBot, arEnforcer, coastalLogic, claudeDrop

---

## 6. The Cockpit — `apps/command` (from googlebuiltoperatingsystem-)

The Worden Command System: a distilled single-app command center whose header reads
*"All logic extracted from: wordenstandard, codexbuildfreeofbase44, gemini-site"* — the original three-system unification, now the fourth pillar of this one.

- 50-state master data (labor index, material premium, asphalt season months, prevailing wage, licensing, OSHA, QSR density)
- 18-service pricing engine with residential/commercial rate bands
- Map-draw property estimator (click-to-draw boundary takeoff)
- JARVIS orb — voice/chat AI with system-state awareness and `navigate_system` actions
- Material engine, PCI decay model, weather engine (`src/lib/`)

---

## 7. Worden Engineering Standards (non-negotiable, embedded everywhere)

| Standard | Value |
|----------|-------|
| Compaction | 96% Marshall Unit Weight minimum |
| Base | VDOT Section 315 structural stone base |
| Oil Shield | ±$9/ton liquid asphalt buffer in every estimate |
| Medical | Zero-Downtime DOT Medical crew compliance |
| Density | 145 lbs/sy/in residential · 148 lbs/sy/in industrial |

Reference: VDOT Sec 315, ASTM C90/C270, FM Global RoofNav, ACI 318, AASHTO T99/T180, FAR 48 CFR + Davis-Bacon.

---

## 8. Not consolidated (and why)

- **codexbuildfreeofbase44 / jworden-production** — near-duplicate ancestors of wordenstandard; consolidating them would import three copies of the same brain. Their unique value (field-app Capacitor shell, DNS/deploy scripts, OBX paving site) remains in their home repos.
- **doooone / atlantapavingandsealing** — built deploy artifacts, not source.
- **blueridgeasphaltpaving / jwordenasphaltantigravity** — live standalone Next.js brand sites; they consume this platform, they don't belong inside it. Their `OrbitalMap` OS component is the one piece worth porting later.
- **wordenuniversity / carolinablacktop** — empty/starter; future tenants of this platform.
