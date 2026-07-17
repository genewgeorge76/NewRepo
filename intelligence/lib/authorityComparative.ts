/**
 * JWORDENAI Authority Comparative — "Jordan Wells Filter"
 * Performs real-time competitor bid deconstruction when a customer
 * presents a lower price from another contractor.
 *
 * Standards: VDOT Section 315 · ASTM C270 · FM Global RoofNav
 * Strategy: Interrogate what the competitor DIDN'T include, not just price.
 */

// ── Worden Standard line items every bid MUST include ────────────────────────

export interface JWORDENAI_Sovereign_StandardItem {
  id: string;
  category: string;
  requirement: string;
  spec: string;
  typicalCostImpact: string;   // what it adds to the price
  riskIfOmitted: string;       // consequence for the property owner
  question: string;            // the question to ask the competitor
}

export const JWORDENAI_SOVEREIGN_STANDARD_ITEMS: JWORDENAI_Sovereign_StandardItem[] = [
  {
    id: 'compaction',
    category: 'Compaction',
    requirement: '96% Marshall Unit Weight minimum — verified by nuclear density gauge',
    spec: 'AASHTO T245 / VDOT Section 315',
    typicalCostImpact: '+$0.40–$0.80/sq ft (extra roller passes + QA testing)',
    riskIfOmitted: 'Pavement fails in 2–4 years vs. 15–20 years. Water infiltration, heaving, alligator cracking.',
    question: 'Does their quote specify 96% Marshall Unit Weight compaction with nuclear gauge verification?',
  },
  {
    id: 'stone-base',
    category: 'Stone Base',
    requirement: 'VDOT-grade 21A crusher run base — 6-inch minimum (Sovereign Standard)',
    spec: 'VDOT Aggregate Section 303',
    typicalCostImpact: '+$1.20–$2.50/sq ft depending on depth',
    riskIfOmitted: 'Sub-base failure under freeze-thaw cycles. Potholes in 1–3 years. Cost to repair is 3× original.',
    question: 'Does their quote include a VDOT-certified 6-inch 21A stone structural base — or are they paving over the existing failed sub-base?',
  },
  {
    id: 'oil-shield',
    category: 'Price Protection',
    requirement: '$9/ton liquid asphalt price shield — no change-order surprises',
    spec: 'Worden Business Standard',
    typicalCostImpact: 'Included — fixed price guarantee',
    riskIfOmitted: 'Competitor bids without a buffer. If oil spikes $15/ton, they issue a change order or cut corners on tonnage.',
    question: 'Is their price locked against liquid asphalt commodity swings, or is it subject to change orders if oil prices rise?',
  },
  {
    id: 'sealer',
    category: 'Sealer Brand',
    requirement: 'Neyra / Asphalt Emulsion Inc. sealer — ASTM D2939 certified',
    spec: 'ASTM D2939',
    typicalCostImpact: '+$0.15–$0.30/sq ft vs. generic coal-tar',
    riskIfOmitted: 'Generic sealer wears in 1 year. Neyra lasts 3 years. Over a 10-year period, proper sealer saves 2× resurface costs.',
    question: 'What sealer brand are they using? Is it ASTM D2939 certified or a generic coal-tar blend?',
  },
  {
    id: 'license',
    category: 'Licensing',
    requirement: 'Virginia Class A Contractor License (or equivalent in the project state)',
    spec: 'DPOR Regulation 9VAC5-50',
    typicalCostImpact: 'N/A — required by law on commercial projects >$120K',
    riskIfOmitted: 'Unlicensed work voids property insurance claims. Owner liable for injuries on site.',
    question: 'Is the competitor Class A licensed in this state? Ask for their license number.',
  },
  {
    id: 'bonding',
    category: 'Bonding',
    requirement: 'Performance bond + payment bond on commercial projects',
    spec: 'AIA A312 / Miller Act (federal)',
    typicalCostImpact: '+1–3% of contract value',
    riskIfOmitted: 'If contractor walks or fails, property owner has no financial recourse. Job left half-done.',
    question: 'Does their quote include a performance and payment bond, or is the owner exposed to contractor default?',
  },
  {
    id: 'mix-design',
    category: 'Mix Design',
    requirement: 'VDOT-certified Marshall mix design — specified gradation and binder content',
    spec: 'VDOT Road & Bridge Specifications — Sec 211',
    typicalCostImpact: '+$3–$6/ton vs. off-spec "hot mix"',
    riskIfOmitted: 'Off-spec mix ravels in 3–5 years. No recourse without a documented mix design spec.',
    question: 'Can they provide the certified Marshall mix design sheet for the asphalt they\'re quoting?',
  },
  {
    id: 'warranty',
    category: 'Warranty',
    requirement: '3-year workmanship warranty — Worden standard',
    spec: 'Worden Contract Standard',
    typicalCostImpact: 'Included in Worden contracts',
    riskIfOmitted: 'Most low-bid contractors offer no written warranty. Owner pays for repairs immediately.',
    question: 'Do they offer a 3-year written workmanship warranty? Ask for it in writing.',
  },
];

// ── Competitor bid analysis engine ───────────────────────────────────────────

export interface CompetitorBidInput {
  competitorName: string;
  theirPrice: number;
  wordenPrice: number;
  /** IDs from JWORDENAI_SOVEREIGN_STANDARD_ITEMS that the competitor likely omitted */
  omittedItemIds: string[];
  projectType: 'driveway' | 'parking-lot' | 'commercial' | 'government' | 'sealcoat';
  sqFt: number;
}

export interface CompetitorAnalysisResult {
  priceDifference: number;
  priceDifferencePct: number;
  omittedItems: JWORDENAI_Sovereign_StandardItem[];
  hiddenCostMin: number;
  hiddenCostMax: number;
  trueCompetitorCostLow: number;  // their price + min hidden costs
  trueCompetitorCostHigh: number; // their price + max hidden costs
  valueDeficit: number;           // what's genuinely missing vs Worden
  interrogationScript: string[];  // questions to ask the property owner
  verdictSummary: string;
}

/** Deconstruct a competitor bid and produce the interrogation script */
export function analyzeCompetitorBid(input: CompetitorBidInput): CompetitorAnalysisResult {
  const omittedItems = JWORDENAI_SOVEREIGN_STANDARD_ITEMS.filter((item) => input.omittedItemIds.includes(item.id));

  // Estimate hidden cost range from omitted items
  const priceDifference = parseFloat((input.wordenPrice - input.theirPrice).toFixed(2));
  const priceDifferencePct = parseFloat(((priceDifference / input.wordenPrice) * 100).toFixed(1));

  // Parse cost impact ranges from the text (heuristic)
  let hiddenCostMin = 0;
  let hiddenCostMax = 0;
  omittedItems.forEach((item) => {
    const match = item.typicalCostImpact.match(/\$([0-9.]+)[–-]\$([0-9.]+)\/sq ft/);
    if (match) {
      hiddenCostMin += parseFloat(match[1]) * input.sqFt;
      hiddenCostMax += parseFloat(match[2]) * input.sqFt;
    } else if (item.typicalCostImpact.includes('%')) {
      const pctMatch = item.typicalCostImpact.match(/([0-9]+)–([0-9]+)%/);
      if (pctMatch) {
        hiddenCostMin += (parseFloat(pctMatch[1]) / 100) * input.theirPrice;
        hiddenCostMax += (parseFloat(pctMatch[2]) / 100) * input.theirPrice;
      }
    }
  });

  const trueCompetitorCostLow = parseFloat((input.theirPrice + hiddenCostMin).toFixed(2));
  const trueCompetitorCostHigh = parseFloat((input.theirPrice + hiddenCostMax).toFixed(2));
  const valueDeficit = omittedItems.length;

  const interrogationScript = omittedItems.map((item) => `❓ ${item.question}`);

  // Add standard closing questions
  interrogationScript.push(
    '❓ Ask them to show you a job they completed 5 years ago — will they take you there?',
    '❓ Ask for 3 verifiable commercial references with contact numbers.',
    '📋 J. Worden & Sons has completed 40+ years of verifiable work in Virginia — references on request.',
  );

  const verdictSummary = omittedItems.length === 0
    ? `The competitor bid appears to include comparable scope to Worden. The $${priceDifference.toLocaleString()} difference (${priceDifferencePct}%) reflects the Worden quality premium and 3-year warranty.`
    : `The competitor bid is missing ${omittedItems.length} critical standard item(s). When you add the hidden long-term cost of ${omittedItems.map((i) => i.category).join(', ')}, their true 5-year cost is $${trueCompetitorCostLow.toLocaleString()}–$${trueCompetitorCostHigh.toLocaleString()} — compared to Worden's $${input.wordenPrice.toLocaleString()} with full compliance, warranty, and zero surprises.`;

  return {
    priceDifference,
    priceDifferencePct,
    omittedItems,
    hiddenCostMin: parseFloat(hiddenCostMin.toFixed(2)),
    hiddenCostMax: parseFloat(hiddenCostMax.toFixed(2)),
    trueCompetitorCostLow,
    trueCompetitorCostHigh,
    valueDeficit,
    interrogationScript,
    verdictSummary,
  };
}
