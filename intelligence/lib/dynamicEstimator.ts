/**
 * JWORDENAI Dynamic Estimator — Real-Time Material Price Engine
 * Covers all 50 US states with regional pricing tiers.
 * Enforces the Worden $9/ton oil-price shield on every calculated bid.
 *
 * Standards: VDOT Section 315 · AASHTO T245 · Marshall Mix Design
 */

// ── Constants ────────────────────────────────────────────────────────────────

/** Non-negotiable Worden oil-price buffer per GEMINI.md */
export const OIL_SHIELD_BUFFER_PER_TON = 9.0;

/** 96% Marshall Unit Weight minimum compaction floor */
export const WORDEN_COMPACTION_FLOOR_PCT = 96.0;

/** Compacted HMA unit weight used in Marshall tonnage math (lb/ft³) */
export const MARSHALL_DENSITY_LB_PER_CF = 148;

/** Sovereign Buffer applied on top of Marshall tonnage (5% safety factor) */
export const SOVEREIGN_BUFFER_PCT = 5;

/** Sovereign 6-inch VDOT-grade structural base depth (inches) */
export const SOVEREIGN_BASE_DEPTH_IN = 6;

// ── Regional pricing multipliers (50-state coverage) ────────────────────────

/**
 * Price index multiplier relative to the Virginia baseline (1.0).
 * Derived from regional plant costs, freight, and union labor rates.
 */
export const STATE_PRICE_MULTIPLIER: Record<string, number> = {
  // Southeast (VA home base)
  VA: 1.00, MD: 1.04, DC: 1.08, NC: 0.97, SC: 0.95, GA: 0.93, FL: 0.96,
  WV: 0.99, KY: 0.98, TN: 0.96, AL: 0.94, MS: 0.91,
  // Mid-Atlantic / Northeast
  DE: 1.03, PA: 1.06, NJ: 1.14, NY: 1.22, CT: 1.18, RI: 1.17, MA: 1.20,
  VT: 1.15, NH: 1.16, ME: 1.13,
  // Midwest
  OH: 1.01, IN: 0.99, IL: 1.07, MI: 1.05, WI: 1.06, MN: 1.08,
  IA: 0.98, MO: 0.97, ND: 1.03, SD: 1.02, NE: 0.99, KS: 0.97,
  // South / Gulf
  TX: 0.95, OK: 0.94, AR: 0.92, LA: 0.93,
  // Mountain / West
  MT: 1.09, WY: 1.07, CO: 1.10, NM: 1.04, ID: 1.06, UT: 1.05,
  AZ: 1.03, NV: 1.08, CA: 1.28, OR: 1.15, WA: 1.17, AK: 1.45, HI: 1.52,
};

// ── Material baseline prices (Virginia, per ton unless noted) ────────────────

export interface MaterialPrice {
  id: string;
  name: string;
  spec: string;
  unit: string;
  baselinePricePerUnit: number;  // VA baseline
  currentIndexPct: number;       // % above/below baseline (simulated market)
  oilLinked: boolean;            // true = affected by liquid asphalt price
}

export const MATERIAL_INDEX: MaterialPrice[] = [
  {
    id: 'liquid-asphalt',
    name: 'Liquid Asphalt Binder PG 64-22',
    spec: 'AASHTO M 320',
    unit: 'ton',
    baselinePricePerUnit: 58.0,
    currentIndexPct: +6.0, // +6% above baseline today
    oilLinked: true,
  },
  {
    id: 'sm-9-5a',
    name: 'SM-9.5A Surface Mix',
    spec: 'VDOT Section 315',
    unit: 'ton',
    baselinePricePerUnit: 92.0,
    currentIndexPct: +3.5,
    oilLinked: true,
  },
  {
    id: 'bm-25',
    name: 'BM-25.0 Intermediate/Base Mix',
    spec: 'VDOT Section 315',
    unit: 'ton',
    baselinePricePerUnit: 85.0,
    currentIndexPct: +2.8,
    oilLinked: true,
  },
  {
    id: '21a-stone',
    name: '21A Crusher Run (VDOT 6-in Base)',
    spec: 'VDOT Aggregate Section 303',
    unit: 'ton',
    baselinePricePerUnit: 18.5,
    currentIndexPct: +8.2, // stone spike scenario
    oilLinked: false,
  },
  {
    id: '57-stone',
    name: '#57 Stone (Drainage Course)',
    spec: 'VDOT Section 303',
    unit: 'ton',
    baselinePricePerUnit: 22.0,
    currentIndexPct: +5.0,
    oilLinked: false,
  },
  {
    id: 'neyra-sealer',
    name: 'Neyra Asphalt Emulsion Sealer',
    spec: 'ASTM D2939',
    unit: 'gal',
    baselinePricePerUnit: 1.85,
    currentIndexPct: +4.0,
    oilLinked: true,
  },
];

// ── Core price calculation logic ─────────────────────────────────────────────

export interface MaterialPriceLive {
  id: string;
  name: string;
  spec: string;
  unit: string;
  baseline: number;
  current: number;
  delta: number;
  deltaSign: '+' | '-' | '=';
  shieldedPrice: number;   // current + oil buffer (if oil-linked)
  shieldActive: boolean;
}

/** Returns live price for every material, applying the oil shield where relevant. */
export function getLiveMaterialPrices(stateCode: string = 'VA'): MaterialPriceLive[] {
  const mult = STATE_PRICE_MULTIPLIER[stateCode.toUpperCase()] ?? 1.0;
  return MATERIAL_INDEX.map((m) => {
    const baseline = m.baselinePricePerUnit * mult;
    const current = parseFloat((baseline * (1 + m.currentIndexPct / 100)).toFixed(2));
    const delta = parseFloat((current - baseline).toFixed(2));
    const shield = m.oilLinked ? OIL_SHIELD_BUFFER_PER_TON : 0;
    const shieldedPrice = parseFloat((current + shield).toFixed(2));
    const shieldActive = m.oilLinked && delta > 0;
    return {
      id: m.id,
      name: m.name,
      spec: m.spec,
      unit: m.unit,
      baseline,
      current,
      delta,
      deltaSign: delta > 0 ? '+' : delta < 0 ? '-' : '=',
      shieldedPrice,
      shieldActive,
    };
  });
}

// ── Bid estimation engine ─────────────────────────────────────────────────────

export interface EstimateInput {
  lengthFt: number;
  widthFt: number;
  /** Asphalt surface thickness in inches (typical: 1.5–3 in) */
  surfaceDepthIn: number;
  /** Include sovereign 6-inch 21A stone base? */
  includeBase: boolean;
  /** Include sealcoat application? */
  includeSeal: boolean;
  stateCode: string;
  serviceType: 'new-install' | 'overlay' | 'repair' | 'sealcoat-only';
}

export interface EstimateLineItem {
  description: string;
  spec: string;
  qty: number;
  unit: string;
  unitPrice: number;
  total: number;
  shielded: boolean;
}

export interface EstimateOutput {
  sqFt: number;
  totalBase: number;     // before Worden standards markup
  totalShielded: number; // after oil shield
  profitTargetPct: number;
  finalBidPrice: number;
  pricePerSqFt: number;
  lineItems: EstimateLineItem[];
  complianceNotes: string[];
  state: string;
  stateMultiplier: number;
  timestamp: string;
}

/** Calculate tons of asphalt mix (96% Marshall: 148 lb/cf compacted density + 5% Sovereign Buffer) */
function calcTons(sqFt: number, depthIn: number): number {
  const rawTons = (sqFt * (depthIn / 12) * MARSHALL_DENSITY_LB_PER_CF) / 2000;
  const withBuffer = rawTons * (1 + SOVEREIGN_BUFFER_PCT / 100);
  return parseFloat(withBuffer.toFixed(2));
}

/** Calculate tons of 21A stone base (VDOT 6-inch = 125 lb/ft³) */
function calcBaseTons(sqFt: number): number {
  return parseFloat(((sqFt * (SOVEREIGN_BASE_DEPTH_IN / 12) * 125) / 2000).toFixed(2));
}

/** Main bid estimate calculator */
export function calculateEstimate(input: EstimateInput): EstimateOutput {
  const sqFt = input.lengthFt * input.widthFt;
  const prices = getLiveMaterialPrices(input.stateCode);
  const stateMultiplier = STATE_PRICE_MULTIPLIER[input.stateCode.toUpperCase()] ?? 1.0;
  const lineItems: EstimateLineItem[] = [];
  const complianceNotes: string[] = [
    `96% Marshall Unit Weight compaction minimum — AASHTO T245 (non-negotiable)`,
    `Marshall tonnage math: ${MARSHALL_DENSITY_LB_PER_CF} lb/cf compacted density + ${SOVEREIGN_BUFFER_PCT}% Sovereign Buffer`,
    `VDOT-grade structural stone base — Section 315 aggregate (non-negotiable)`,
    `$${OIL_SHIELD_BUFFER_PER_TON}/ton oil-price shield applied to all asphalt materials`,
  ];

  // Surface course
  if (input.serviceType !== 'sealcoat-only') {
    const matId = input.serviceType === 'repair' ? 'sm-9-5a' : 'sm-9-5a';
    const p = prices.find((x) => x.id === matId)!;
    const tons = calcTons(sqFt, input.surfaceDepthIn);
    lineItems.push({
      description: `SM-9.5A Surface Course (${input.surfaceDepthIn}" compacted)`,
      spec: 'VDOT Section 315',
      qty: tons,
      unit: 'ton',
      unitPrice: p.shieldedPrice,
      total: parseFloat((tons * p.shieldedPrice).toFixed(2)),
      shielded: true,
    });

    if (input.serviceType !== 'overlay' && input.serviceType !== 'repair') {
      // Intermediate/base asphalt lift (3-inch)
      const pBase = prices.find((x) => x.id === 'bm-25')!;
      const baseTons = calcTons(sqFt, 3);
      lineItems.push({
        description: 'BM-25.0 Intermediate Lift (3" compacted)',
        spec: 'VDOT Section 315',
        qty: baseTons,
        unit: 'ton',
        unitPrice: pBase.shieldedPrice,
        total: parseFloat((baseTons * pBase.shieldedPrice).toFixed(2)),
        shielded: true,
      });
    }
  }

  // 21A stone base
  if (input.includeBase && input.serviceType !== 'sealcoat-only') {
    const p = prices.find((x) => x.id === '21a-stone')!;
    const tons = calcBaseTons(sqFt);
    lineItems.push({
      description: `21A Crusher Run Structural Base (${SOVEREIGN_BASE_DEPTH_IN}" — Sovereign Standard)`,
      spec: 'VDOT Aggregate Section 303',
      qty: tons,
      unit: 'ton',
      unitPrice: p.current,
      total: parseFloat((tons * p.current).toFixed(2)),
      shielded: false,
    });
    complianceNotes.push(`6-inch 21A base: ${tons} tons @ $${p.current}/ton (current market)`);
  }

  // Sealcoat
  if (input.includeSeal || input.serviceType === 'sealcoat-only') {
    const p = prices.find((x) => x.id === 'neyra-sealer')!;
    const gallons = parseFloat((sqFt * 0.15).toFixed(0)); // ~0.15 gal/sq ft
    lineItems.push({
      description: 'Neyra Asphalt Emulsion Sealer (double coat)',
      spec: 'ASTM D2939',
      qty: gallons,
      unit: 'gal',
      unitPrice: p.shieldedPrice,
      total: parseFloat((gallons * p.shieldedPrice).toFixed(2)),
      shielded: true,
    });
  }

  // Labor & equipment (30% of materials — standard GC markup)
  const materialTotal = lineItems.reduce((s, li) => s + li.total, 0);
  const laborEquip = parseFloat((materialTotal * 0.30).toFixed(2));
  lineItems.push({
    description: 'Labor, Equipment & Mobilization (OSHA 30-compliant crew)',
    spec: 'Div 01 — General Requirements',
    qty: 1,
    unit: 'ls',
    unitPrice: laborEquip,
    total: laborEquip,
    shielded: false,
  });

  const totalBase = parseFloat((materialTotal + laborEquip).toFixed(2));
  const totalShielded = totalBase; // shield already in line items
  const profitTargetPct = 18; // 18% Worden margin target
  const finalBidPrice = parseFloat((totalShielded * (1 + profitTargetPct / 100)).toFixed(2));
  const pricePerSqFt = sqFt > 0 ? parseFloat((finalBidPrice / sqFt).toFixed(2)) : 0;

  return {
    sqFt,
    totalBase,
    totalShielded,
    profitTargetPct,
    finalBidPrice,
    pricePerSqFt,
    lineItems,
    complianceNotes,
    state: input.stateCode.toUpperCase(),
    stateMultiplier,
    timestamp: new Date().toISOString(),
  };
}
