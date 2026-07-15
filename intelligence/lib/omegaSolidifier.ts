/**
 * JWORDENAI: THE OMEGA SOLIDIFIER — Sovereign v2.0
 * Three core intelligence modules:
 *   1. Whale-Sense Financial Screener
 *   2. Drone-to-Plant Price Lock
 *   3. Voice Dispatcher (The Worden Voice)
 *
 * Standards: VDOT Section 211/315 · AASHTO T245 · Marshall Mix · AEI/Neyra spec
 */

// ═══════════════════════════════════════════════════════════════════════════════
// 1. WHALE-SENSE — Client Financial Risk Screener
// ═══════════════════════════════════════════════════════════════════════════════

/** Risk score is 0–10. Scores above MOBILIZATION_THRESHOLD require 50% up-front. */
export const MOBILIZATION_THRESHOLD = 7;

export type ClientTier = '🐋 Whale' | '🦈 Shark' | '🐟 Fish';
export type PaymentTerms = 'STANDARD_TERMS' | 'REQUIRE_50_PCT_MOBILIZATION' | 'REQUIRE_FULL_PREPAY' | 'DECLINE';

export interface ClientData {
  name: string;
  /** 0 = no risk, 10 = extreme risk */
  riskScore: number;
  tier: ClientTier;
  projectValue: number;
  stateCode: string;
  /** e.g. "Federal Agency", "National Chain", "HOA", "Individual" */
  clientType: string;
  hasPriorRelationship: boolean;
  hasCurrentLien: boolean;
  creditDaysOutstanding: number; // days past due on any prior invoice
}

export interface WhaleSenseResult {
  clientName: string;
  riskScore: number;
  riskLabel: string;
  paymentTerms: PaymentTerms;
  mobilizationAmountDue: number;
  rationale: string[];
  sovereignFlags: string[];
  approvedToProceed: boolean;
}

const RISK_LABELS = ['Minimal', 'Low', 'Low-Moderate', 'Moderate', 'Moderate', 'Elevated', 'Elevated', 'High', 'High', 'Very High', 'Extreme'];

/** Sovereign risk-profile cross-reference — returns terms + flags. */
export function screenClient(clientData: ClientData): WhaleSenseResult {
  const { name, riskScore, projectValue, hasPriorRelationship, hasCurrentLien, creditDaysOutstanding } = clientData;
  const rationale: string[] = [];
  const sovereignFlags: string[] = [];

  let effectiveRisk = riskScore;

  // Adjust for known relationship
  if (hasPriorRelationship && creditDaysOutstanding === 0) {
    effectiveRisk = Math.max(0, effectiveRisk - 1);
    rationale.push('Prior relationship with clean payment history → -1 risk adjustment.');
  }

  // Hard flags
  if (hasCurrentLien) {
    sovereignFlags.push('⛔ ACTIVE LIEN on file — full prepay or decline required.');
    effectiveRisk = Math.min(10, effectiveRisk + 3);
  }
  if (creditDaysOutstanding > 90) {
    sovereignFlags.push(`⚠️ ${creditDaysOutstanding} days outstanding on prior invoice — mobilization escalated.`);
    effectiveRisk = Math.min(10, effectiveRisk + 2);
  } else if (creditDaysOutstanding > 30) {
    sovereignFlags.push(`⚠️ ${creditDaysOutstanding} days outstanding — monitor closely.`);
    effectiveRisk = Math.min(10, effectiveRisk + 1);
  }

  // Federal / government tier always gets standard terms
  if (clientData.clientType === 'Federal Agency' || clientData.clientType === 'State DOT') {
    rationale.push('Government entity — bonded contract, standard terms apply per FAR.');
    effectiveRisk = Math.min(effectiveRisk, 3);
  }

  // Determine payment terms
  let paymentTerms: PaymentTerms;
  if (hasCurrentLien || effectiveRisk >= 10) {
    paymentTerms = 'DECLINE';
    rationale.push('Risk exceeds Sovereign threshold — recommend declining without senior approval.');
  } else if (effectiveRisk >= 9) {
    paymentTerms = 'REQUIRE_FULL_PREPAY';
    rationale.push('Extreme risk score — 100% prepayment required before mobilization.');
  } else if (effectiveRisk > MOBILIZATION_THRESHOLD) {
    paymentTerms = 'REQUIRE_50_PCT_MOBILIZATION';
    rationale.push(`Risk score ${effectiveRisk} exceeds threshold (${MOBILIZATION_THRESHOLD}) — 50% mobilization deposit required.`);
  } else {
    paymentTerms = 'STANDARD_TERMS';
    rationale.push(`Risk score ${effectiveRisk} is within acceptable range — standard net-30 terms apply.`);
  }

  const mobilizationPct = paymentTerms === 'REQUIRE_50_PCT_MOBILIZATION' ? 0.50
    : paymentTerms === 'REQUIRE_FULL_PREPAY' ? 1.00
    : 0;

  return {
    clientName: name,
    riskScore: effectiveRisk,
    riskLabel: RISK_LABELS[Math.min(effectiveRisk, 10)],
    paymentTerms,
    mobilizationAmountDue: parseFloat((projectValue * mobilizationPct).toFixed(2)),
    rationale,
    sovereignFlags,
    approvedToProceed: paymentTerms !== 'DECLINE',
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. DRONE-TO-PLANT PRICE LOCK
// ═══════════════════════════════════════════════════════════════════════════════

export interface PlantProfile {
  id: string;
  name: string;
  shortName: string;
  location: string;
  stateCode: string;
  /** Represents the regional broker/supplier network */
  network: string;
  currentPricePerTon: number;
  oilShieldBuffer: number;
  shieldedPricePerTon: number;
  availability: 'OPTIMAL' | 'MODERATE' | 'LIMITED' | 'CLOSED';
  waitTimeMins: number;
}

/**
 * Plant routing table.
 * AEI-Richmond is the Worden home plant for VA/MD/DC/WV/DE.
 * Universal-Broker covers all other 46 states.
 */
export const PLANT_NETWORK: PlantProfile[] = [
  {
    id: 'AEI-RIC',
    name: 'Asphalt Emulsion Inc. — Richmond, VA',
    shortName: 'AEI-Richmond',
    location: 'Richmond, VA',
    stateCode: 'VA',
    network: 'AEI Home Network',
    currentPricePerTon: 61.50,
    oilShieldBuffer: 9.00,
    shieldedPricePerTon: 70.50,
    availability: 'OPTIMAL',
    waitTimeMins: 12,
  },
  {
    id: 'AEI-BAL',
    name: 'Asphalt Emulsion Inc. — Baltimore Hub',
    shortName: 'AEI-Baltimore',
    location: 'Baltimore, MD',
    stateCode: 'MD',
    network: 'AEI Home Network',
    currentPricePerTon: 64.00,
    oilShieldBuffer: 9.00,
    shieldedPricePerTon: 73.00,
    availability: 'OPTIMAL',
    waitTimeMins: 18,
  },
  {
    id: 'AEI-DC',
    name: 'Asphalt Emulsion Inc. — DC Metro',
    shortName: 'AEI-DC Metro',
    location: 'Washington, DC',
    stateCode: 'DC',
    network: 'AEI Home Network',
    currentPricePerTon: 66.50,
    oilShieldBuffer: 9.00,
    shieldedPricePerTon: 75.50,
    availability: 'MODERATE',
    waitTimeMins: 28,
  },
  {
    id: 'UNI-SE',
    name: 'Universal Broker — Southeast Region',
    shortName: 'Universal-SE',
    location: 'Charlotte, NC',
    stateCode: 'SE',
    network: 'Universal-Broker',
    currentPricePerTon: 59.00,
    oilShieldBuffer: 9.00,
    shieldedPricePerTon: 68.00,
    availability: 'OPTIMAL',
    waitTimeMins: 15,
  },
  {
    id: 'UNI-NE',
    name: 'Universal Broker — Northeast Region',
    shortName: 'Universal-NE',
    location: 'Philadelphia, PA',
    stateCode: 'NE',
    network: 'Universal-Broker',
    currentPricePerTon: 68.00,
    oilShieldBuffer: 9.00,
    shieldedPricePerTon: 77.00,
    availability: 'MODERATE',
    waitTimeMins: 35,
  },
  {
    id: 'UNI-MW',
    name: 'Universal Broker — Midwest Region',
    shortName: 'Universal-MW',
    location: 'Columbus, OH',
    stateCode: 'MW',
    network: 'Universal-Broker',
    currentPricePerTon: 62.50,
    oilShieldBuffer: 9.00,
    shieldedPricePerTon: 71.50,
    availability: 'OPTIMAL',
    waitTimeMins: 20,
  },
  {
    id: 'UNI-SW',
    name: 'Universal Broker — Southwest Region',
    shortName: 'Universal-SW',
    location: 'Dallas, TX',
    stateCode: 'SW',
    network: 'Universal-Broker',
    currentPricePerTon: 57.00,
    oilShieldBuffer: 9.00,
    shieldedPricePerTon: 66.00,
    availability: 'LIMITED',
    waitTimeMins: 55,
  },
  {
    id: 'UNI-WE',
    name: 'Universal Broker — West Region',
    shortName: 'Universal-West',
    location: 'Los Angeles, CA',
    stateCode: 'WE',
    network: 'Universal-Broker',
    currentPricePerTon: 78.00,
    oilShieldBuffer: 9.00,
    shieldedPricePerTon: 87.00,
    availability: 'MODERATE',
    waitTimeMins: 30,
  },
];

/** Route a state code to the correct plant */
export function routePlant(stateCode: string): PlantProfile {
  const sc = stateCode.toUpperCase();
  // AEI home network states
  if (['VA', 'WV', 'DE'].includes(sc)) return PLANT_NETWORK.find((p) => p.id === 'AEI-RIC')!;
  if (sc === 'MD') return PLANT_NETWORK.find((p) => p.id === 'AEI-BAL')!;
  if (sc === 'DC') return PLANT_NETWORK.find((p) => p.id === 'AEI-DC')!;
  // Universal-Broker regional routing
  if (['NC', 'SC', 'GA', 'FL', 'AL', 'MS', 'TN', 'KY', 'AR', 'LA'].includes(sc)) return PLANT_NETWORK.find((p) => p.id === 'UNI-SE')!;
  if (['PA', 'NJ', 'NY', 'CT', 'RI', 'MA', 'VT', 'NH', 'ME', 'OH', 'MI', 'IN', 'WI', 'MN'].includes(sc)) return PLANT_NETWORK.find((p) => p.id === 'UNI-NE')!;
  if (['IL', 'MO', 'IA', 'KS', 'NE', 'SD', 'ND', 'OK'].includes(sc)) return PLANT_NETWORK.find((p) => p.id === 'UNI-MW')!;
  if (['TX', 'NM', 'AZ', 'CO', 'UT', 'NV'].includes(sc)) return PLANT_NETWORK.find((p) => p.id === 'UNI-SW')!;
  return PLANT_NETWORK.find((p) => p.id === 'UNI-WE')!; // CA, OR, WA, AK, HI + fallback
}

export interface PriceLockResult {
  plant: PlantProfile;
  tonnage: number;
  pricePerTonLocked: number;
  totalMaterialCost: number;
  oilShieldApplied: number;
  locked: boolean;
  lockId: string;
  expires: string;         // ISO timestamp — 48 hours from now
  expiresLabel: string;    // human-readable
  priceShieldActive: boolean;
  warningIfUnavailable: string | null;
}

/** Lock material price for a given tonnage and state. */
export function lockMaterialPrice(tonnage: number, stateCode: string): PriceLockResult {
  const plant = routePlant(stateCode);
  const pricePerTonLocked = plant.shieldedPricePerTon;
  const totalMaterialCost = parseFloat((tonnage * pricePerTonLocked).toFixed(2));
  const oilShieldApplied = parseFloat((tonnage * plant.oilShieldBuffer).toFixed(2));

  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + 48);

  const lockId = `LOCK-${stateCode.toUpperCase()}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  const warningIfUnavailable =
    plant.availability === 'LIMITED'
      ? `⚠️ ${plant.shortName} is reporting LIMITED availability (${plant.waitTimeMins} min wait). Consider rerouting lowboys to backup plant.`
      : plant.availability === 'CLOSED'
      ? `⛔ ${plant.shortName} is CLOSED. Lock reserved for next operational window.`
      : null;

  return {
    plant,
    tonnage,
    pricePerTonLocked,
    totalMaterialCost,
    oilShieldApplied,
    locked: plant.availability !== 'CLOSED',
    lockId,
    expires: expiryDate.toISOString(),
    expiresLabel: expiryDate.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
    priceShieldActive: true,
    warningIfUnavailable,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. VOICE DISPATCHER — The Worden Voice
// ═══════════════════════════════════════════════════════════════════════════════

export type VoiceCategory = 'vdot' | 'sunday-standard' | 'price-objection' | 'compaction' | 'competitor' | 'warranty' | 'federal' | 'emergency';

export interface VoiceResponse {
  id: string;
  category: VoiceCategory;
  trigger: string;       // what the customer said / situation
  subject: string;       // short label
  tone: string;
  script: string;        // full Worden Voice response
  spec: string;          // supporting standard cited
  closingLine: string;   // signature close
}

/** Tone: Premium / Authority / 4th-Generation Legacy */
export const VOICE_RESPONSES: VoiceResponse[] = [
  {
    id: 'vdot-base',
    category: 'vdot',
    trigger: 'Customer asks about base depth / VDOT spec',
    subject: 'VDOT 6-Inch Virgin Stone Base',
    tone: 'Authority',
    script: 'Our 6-inch virgin 21A crusher-run stone base exceeds VDOT Section 211 specifications — it\'s not an upgrade, it\'s the Worden minimum. Every job we touch goes down on a certified structural base before a single ton of asphalt is laid. That\'s what separates a 15-year pavement from a 4-year pothole.',
    spec: 'VDOT Section 211 / VDOT Road & Bridge Specifications',
    closingLine: '4th Generation. Since 1984. We built it right before it was a regulation.',
  },
  {
    id: 'sunday-standard',
    category: 'sunday-standard',
    trigger: 'Customer needs paving done before Monday business hours',
    subject: 'The Sunday Standard — Zero-Downtime Guarantee',
    tone: 'Premium / Service',
    script: 'The Sunday Standard ensures your lot is ready for Monday morning business — no cones, no wet asphalt, no customer complaints. We coordinate the pour, compaction, and cooldown window to deliver a fully cured and striped surface by Sunday midnight. Your customers will never know we were there — only that the parking lot looks brand new.',
    spec: 'Worden Operations Protocol — Zero-Downtime Commercial Standard',
    closingLine: 'We respect your operation. We don\'t close you down — we upgrade you overnight.',
  },
  {
    id: 'price-objection',
    category: 'price-objection',
    trigger: 'Customer says "another contractor was cheaper"',
    subject: 'Price Objection — The Sovereign Response',
    tone: 'Authority / Calm',
    script: 'I understand price matters — it matters to us too. But I have to ask: does that quote include a VDOT-certified 6-inch stone base? Does it specify 96% Marshall Unit Weight compaction verified by a nuclear density gauge? Is the liquid asphalt price locked against commodity swings? At J. Worden & Sons, every one of those is standard. Not optional. A cheaper price today often means a $40,000 reconstruction in 4 years — on your dime. We\'re the more expensive quote that saves you money.',
    spec: 'VDOT Section 315 · AASHTO T245 · Worden $9/ton Oil Shield',
    closingLine: 'The cheapest bid is only cheap until it fails.',
  },
  {
    id: 'compaction',
    category: 'compaction',
    trigger: 'Customer or inspector asks about compaction spec',
    subject: '96% Marshall Unit Weight — Non-Negotiable',
    tone: 'Technical Authority',
    script: 'Every Worden job is compacted to a minimum of 96% Marshall Unit Weight density — verified by nuclear density gauge testing on every lift. This isn\'t marketing language. It\'s in our contract. AASHTO T245 is the standard; 96% is our floor. That compaction density is the single biggest predictor of pavement lifespan — at 93% you\'re looking at accelerated raveling and early cracking. We don\'t negotiate the floor.',
    spec: 'AASHTO T245 / VDOT Section 315 — 96% MUW minimum',
    closingLine: 'We test it. We document it. We guarantee it in writing.',
  },
  {
    id: 'competitor',
    category: 'competitor',
    trigger: 'Customer mentions a competitor by name',
    subject: 'Competitor Response — The Jordan Wells Filter',
    tone: 'Authority / Professional',
    script: 'I respect competition — it keeps everyone sharp. But I\'d encourage you to ask them one question: can they show you the certified Marshall mix design sheet for the asphalt they\'re proposing? Can they walk you to a job they did 5 years ago? At J. Worden & Sons, we\'ve been building driveways, parking lots, and federal projects since 1984 — we\'ll take you to every reference we have. Forty years of work doesn\'t disappear.',
    spec: 'VDOT Road & Bridge Specs Section 211 / Worden 40-Year Portfolio',
    closingLine: 'Ask them for a 5-year-old reference. We\'ll give you a 20-year-old one.',
  },
  {
    id: 'warranty',
    category: 'warranty',
    trigger: 'Customer asks about warranty / what happens if it fails',
    subject: '3-Year Workmanship Warranty',
    tone: 'Confidence / Authority',
    script: 'Every Worden project comes with a 3-year written workmanship warranty — covering compaction failure, surface raveling, and joint defects resulting from our work. If something goes wrong within that window due to our installation, we\'re back on site at no charge. We stand behind what we build because we built it right to begin with. Most of our warranty calls are from customers asking us to do another job, not repair the last one.',
    spec: 'Worden Contract Standard — 3-Year Workmanship Warranty',
    closingLine: 'The warranty is in the contract. The confidence is in the work.',
  },
  {
    id: 'federal',
    category: 'federal',
    trigger: 'Federal or government procurement / SAM.gov inquiry',
    subject: 'Federal Project Qualification',
    tone: 'Professional / Compliance',
    script: 'J. Worden & Sons holds an active SAM.gov registration with a current UEI and CAGE code. We are a Virginia Class A licensed contractor with full Davis-Bacon prevailing wage compliance capability, DBE participation plan generation, and Buy America Act materials verification built into our standard project workflow. We have completed USACE and VDOT projects and maintain a full bonding package including bid, performance, and payment bonds.',
    spec: 'FAR 48 CFR / Davis-Bacon Act / Buy America Act (BABA) / AIA A312',
    closingLine: 'We don\'t learn federal compliance on your job — we bring it to your job.',
  },
  {
    id: 'emergency',
    category: 'emergency',
    trigger: 'Customer needs emergency repair — pothole, washout, lot failure',
    subject: 'Emergency Response Protocol',
    tone: 'Urgent / Decisive',
    script: 'We run an emergency dispatch protocol for commercial and government clients. If your lot has a safety hazard — active potholes, sub-base washout, or pavement failure in a drive-through or loading dock lane — we can have an assessment crew on site within 4 hours and a temporary cold-patch repair within 24. Permanent repair is scheduled as soon as the crew calendar clears, typically within 72 hours for commercial. Give us the address. We\'re already moving.',
    spec: 'Worden Emergency Response Protocol — OSHA 1926 Subpart Q compliance',
    closingLine: 'Don\'t put a cone on it. Call us.',
  },
];

/** Retrieve all responses in a category */
export function getResponsesByCategory(category: VoiceCategory): VoiceResponse[] {
  return VOICE_RESPONSES.filter((r) => r.category === category);
}

/** Search voice responses by keyword */
export function searchVoiceResponses(query: string): VoiceResponse[] {
  const q = query.toLowerCase();
  return VOICE_RESPONSES.filter(
    (r) =>
      r.trigger.toLowerCase().includes(q) ||
      r.subject.toLowerCase().includes(q) ||
      r.script.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q),
  );
}

export const VOICE_CATEGORIES: Array<{ id: VoiceCategory; label: string; icon: string }> = [
  { id: 'vdot', label: 'VDOT Standards', icon: '🏗️' },
  { id: 'sunday-standard', label: 'Sunday Standard', icon: '🌙' },
  { id: 'price-objection', label: 'Price Objection', icon: '💰' },
  { id: 'compaction', label: 'Compaction Spec', icon: '⚙️' },
  { id: 'competitor', label: 'Competitor Response', icon: '⚔️' },
  { id: 'warranty', label: 'Warranty', icon: '✅' },
  { id: 'federal', label: 'Federal Projects', icon: '🏛️' },
  { id: 'emergency', label: 'Emergency Dispatch', icon: '🚨' },
];
