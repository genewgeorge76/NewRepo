# REPORT_PARITY.md — Capability Parity Tracker

Maps each capability from the J. Worden & Sons Competitive Intelligence Report to its newrepo status.

Legend: ✅ Done | 🔄 In Progress | 🗓 Planned (batch N) | ❌ Not started

---

## Wave 6 Progress

| Batch | Status |
|-------|--------|
| Batch 1 — 5-Provider LLM Router + Vapi Voice | ✅ Complete |
| Batch 2 — AI SEO Engine + City Pages | 🗓 Next |
| Batch 3 — Command Center 13 Tabs | 🗓 Planned |
| Batch 4 — Field Intelligence + Ferrari Engines | 🗓 Planned |
| Batch 5 — Schedule Sim + Gap Features | 🗓 Planned |
| Batch 6 — Wearables + Lead Qualifier + Mobile | 🗓 Planned |

---

## AI / Intelligence Layer

| Capability | Source File | newrepo Status | Notes |
|-----------|-------------|----------------|-------|
| 5-Provider LLM Router (Claude/GPT-4o/Gemini/Perplexity/Grok) | `llm_client.py` | ✅ `services/llm_client.py` | Task-based routing with silent fallback |
| Jarvis AI (Claude Sonnet primary) | `ai_engine.py` | ✅ Updated to use llm_client | Falls back to GPT-4o → Grok → Gemini |
| Vapi Outbound Voice Calling | `vapi_caller.py` | ✅ `services/vapi_caller.py` | E.164 normalization, autonomy guard |
| Autonomy State Kill Switch | `autonomy_state.py` | ✅ `services/autonomy_state.py` | Persistent JSON, freeze/unfreeze |
| Voice AI REST API | `(new)` | ✅ `routers/voice_ai.py` | 6 endpoints + autonomy management |
| Runtime Config Hot-Reload | `runtime_config.py` | ✅ `services/runtime_config.py` | Feature tiers, MANAGED_KEYS whitelist |
| Authority SEO Content (ai_foreman) | `ai_foreman.py` | 🗓 Batch 2 | Gemini 2.5 Flash → GPT-4o fallback |
| Cognitive Digital Twin | `cognitive_twin.py` | 🗓 Batch 4 | 6 dimensions, drift thresholds, auto-remediation |
| Mathematical AI (PCI/GBM/SciPy CI/decay) | `math_ai_service.py` | 🗓 Batch 4 | sklearn GBM + SciPy, zero external API |
| 51-State Compliance (SupremeCourtAI) | `ai_brain.py` | 🗓 Batch 5 | All 51 jurisdictions, liability scoring |
| iGrade Decision Grader | `igrade.py` | 🗓 Batch 4 | A/B/C/D quality grader for AI decisions |
| Lead Qualifier (2-stage) | `lead_qualifier.py` | 🗓 Batch 6 | BOT/BUYER/RESEARCHER/TIRE_KICKER |
| Document Intelligence | `document_intelligence.py` | 🗓 Batch 5 | Contract/blueprint/permit + GPT-4o Vision |
| Proof Pack / Mr. Worden Concierge | `proof_pack.py` | 🗓 Batch 2 | Public-facing concierge knowledge base |

---

## Field Intelligence / IoT

| Capability | Source File | newrepo Status | Notes |
|-----------|-------------|----------------|-------|
| Asphalt Thermal Lay-Down Window | `asphalt_thermal.py` | 🗓 Batch 4 | Free NOAA API, Chadbourn surrogate model |
| Roller Telemetry (GPS + IRI) | `roller_telemetry.py` | 🗓 Batch 4 | 3m×3m cells, pass count, IRI proxy |
| Drone Capture + GPS Metadata | `drone_capture.py` | 🗓 Batch 4 | 150MB max, HEIC/MP4 support |
| LiDAR Ingest | `lidar_ingest.py` | 🗓 Batch 4 | Point cloud pipeline |
| Vision Takeoff (OpenCV) | `vision_takeoff.py` | 🗓 Batch 4 | Canny edge → polygon sqft + Google Solar/Aerial |
| Crew Wearables (5 providers) | `crew_wearables.py` | 🗓 Batch 6 | Apple HealthKit, Fitbit, Garmin, Whoop, Oura |

---

## Operations / Business Intelligence

| Capability | Source File | newrepo Status | Notes |
|-----------|-------------|----------------|-------|
| Anomaly Detector (Z-score) | `anomaly_detector.py` | 🗓 Batch 3 | 7-day rolling, 4 business metric checks |
| Self-Heal Infrastructure Daemon | `self_heal.py` | 🗓 Batch 6 | DB probe, Redis check, queue depth, auto-freeze |
| Search Pulse Heatmap (SerpAPI) | `search_pulse.py` | 🗓 Batch 3 | 16 VA hotspot centroids, 5-min cache |
| Schedule Simulator (GPT-4o) | `schedule_sim.py` | 🗓 Batch 5 | CPM scheduling with AI fallback |
| Estimate Approval Gate | `estimate_approval.py` | 🗓 Batch 5 | HumanReviewQueue + PIN verification |
| 51-State Pricing Multiplier | `pricing_engine.py` | ✅ Existing | State cost index applied to all estimates |
| Property Scan → Direct Mail | `scan_campaign` | ✅ Existing (Wave 4) | Regrid + Lob pipeline |
| Multi-tenant TenantConfig | `packages/core` | ✅ Existing | Licensable white-label architecture |

---

## Frontend / UX

| Capability | Source | newrepo Status | Notes |
|-----------|--------|----------------|-------|
| Command Center (13 tabs) | `CommandCenter.jsx` | 🗓 Batch 3 | Currently 1-tab KPI grid |
| Jarvis tab (AI chat) | `CommandCenter.jsx` | ✅ Existing | Basic chat present |
| Richmond Grid (live leads) | `CommandCenter.jsx` | 🗓 Batch 3 | Tab missing |
| Search Pulse tab | `CommandCenter.jsx` | 🗓 Batch 3 | SERP heatmap |
| Thermal tab | `CommandCenter.jsx` | 🗓 Batch 3 | Asphalt lay-down window forecast |
| Drone / LiDAR / Roller tabs | `CommandCenter.jsx` | 🗓 Batch 3 | Field telemetry tabs |
| Civil Intel tab | `CommandCenter.jsx` | 🗓 Batch 3 | 51-state compliance panel |
| PulseBar | `CommandCenter.jsx` | 🗓 Batch 3 | Top-of-screen live metric strip |
| Weather Radar (Windy/NOAA) | `CommandCenter.jsx` | 🗓 Batch 3 | iFrame auto-detected from job addresses |
| AI SEO City Pages (SSG) | `blueridgeasphaltpaving` | 🗓 Batch 2 | Next.js App Router SSG pattern |
| Gemini-Powered City Copy | `ai_foreman.py` | 🗓 Batch 2 | Real AI content, not static injection |
| 200+ City Sitemap | `build-sitemaps.mjs` | 🗓 Batch 2 | Expand to 200+ national locations |
| Gantt Scheduler UI | `(new)` | 🗓 Batch 5 | Visual CPM schedule |
| BIM / Blueprint Viewer | `(new)` | 🗓 Batch 5 | Document Intelligence UI |

---

## Infrastructure / Deployment

| Capability | Status | Notes |
|-----------|--------|-------|
| JWT auth + TOTP 2FA | ✅ Existing | Wave 3 |
| Stripe webhooks | ✅ Existing | Wave 1 |
| Celery + Redis task queue | ✅ Existing | Wave 1 |
| Slowapi rate limiting | ✅ Existing | All endpoints |
| Sentry error tracking | ✅ Existing | DSN from env |
| PostgreSQL (Railway prod) | ✅ Ready | SQLite for dev |
| Docker Compose (local dev) | ✅ Existing | |
| Website Factory (rebrand.js) | 🗓 Batch 2 | Port blueridgeasphaltpaving pattern |
| Mobile Crew App (Capacitor) | 🗓 Batch 6 | PWA + IndexedDB offline queue |

---

## New Env Vars Added in Wave 6

| Variable | Service | Required | Default |
|----------|---------|----------|---------|
| `PERPLEXITY_API_KEY` | llm_client (web_research task) | No | — (falls back to gpt-4o) |
| `XAI_API_KEY` | llm_client (social_signal task) | No | — (Grok only, no fallback) |
| `GOOGLE_API_KEY` | llm_client (math/long_context/city_authority) | No | — (also accepts GEMINI_API_KEY) |
| `VAPI_API_KEY` | vapi_caller | No (Vapi optional) | — |
| `VAPI_PHONE_NUMBER_ID` | vapi_caller | No (Vapi optional) | — |
| `VAPI_ASSISTANT_ID` | vapi_caller | No (Vapi optional) | — |
| `JARVIS_MAX_TIER` | llm_client | No | `opus` |
| `LLM_FALLBACK_SILENT` | llm_client | No | `1` |
| `LLM_DISABLED_PROVIDERS` | llm_client | No | — |
| `JARVIS_MODEL_OVERRIDE` | llm_client | No | — |
| `JARVIS_DISABLE_GEMINI` | llm_client | No | — |
| `JARVIS_AUTONOMY_STATE_PATH` | autonomy_state | No | OS temp path |
| `RUNTIME_CONFIG_PATH` | runtime_config | No | Railway volume or OS temp |
| `LICENSE_TIER` | runtime_config | No | `owner` |

> All production secrets come from Railway → Variables. Never commit keys.
> All services run in stub/mock mode locally when keys are absent.
