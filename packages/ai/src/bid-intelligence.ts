/**
 * Bid Intelligence Engine
 * RFP text → Whale / Shark / Fish tier score → full proposal draft (via Claude)
 *
 * Whale  🐋 — federal / state DOT / large municipal  → $500K+
 * Shark  🦈 — commercial / county / school            → $50K–$500K
 * Fish   🐟 — residential / HOA / small commercial    → <$50K
 */

import { claudeChat } from './claude.js';
import {
  BUSINESS_NAME,
  BUSINESS_SINCE,
  BUSINESS_GENERATION,
  WORDEN_COMPACTION_FLOOR_PCT,
  WORDEN_BASE_SPEC,
  OIL_SHIELD_BUFFER_PER_TON,
} from '@jworden/core';
import type { BidTier, BidScore, BidProposal } from '@jworden/core';

const WHALE_SIGNALS = [
  'federal', 'usace', 'army corps', 'highway', 'state dot', 'vdot', 'airport',
  'municipality', 'county', 'million', 'national', 'interstate', 'fhwa', 'gsa',
  'sam.gov', 'public works', 'department of transportation',
];
const SHARK_SIGNALS = [
  'commercial', 'parking lot', 'shopping center', 'school', 'county road',
  'regional', 'university', 'hospital', 'industrial', 'warehouse', 'kfc',
  'qsr', 'franchise', 'fleet yard',
];

export function scoreBidTier(rfpText: string): BidScore {
  const text = rfpText.toLowerCase();

  const whaleHits = WHALE_SIGNALS.filter((s) => text.includes(s));
  const sharkHits = SHARK_SIGNALS.filter((s) => text.includes(s));

  const dollarMatch = text.match(/\$[\d,]+(?:\.\d+)?(?:\s*(?:million|m\b))?/g) ?? [];
  let estimatedValue = 0;
  for (const m of dollarMatch) {
    const isM = m.includes('million') || m.toLowerCase().includes('m');
    const num = parseFloat(m.replace(/[^0-9.]/g, ''));
    const val = isM ? num * 1_000_000 : num;
    if (val > estimatedValue) estimatedValue = val;
  }

  if (whaleHits.length > 0 || estimatedValue > 500_000) {
    return { tier: 'whale', icon: '🐋', estimatedValue: estimatedValue || 1_000_000, confidence: Math.min(0.95, 0.6 + whaleHits.length * 0.05), signals: whaleHits };
  }
  if (sharkHits.length > 0 || estimatedValue > 50_000) {
    return { tier: 'shark', icon: '🦈', estimatedValue: estimatedValue || 150_000, confidence: Math.min(0.9, 0.5 + sharkHits.length * 0.08), signals: sharkHits };
  }
  return { tier: 'fish', icon: '🐟', estimatedValue: estimatedValue || 10_000, confidence: 0.7, signals: [] };
}

export async function generateBidProposal(
  rfpTitle: string,
  rfpText: string,
  score: BidScore,
): Promise<BidProposal> {
  const system = `You are the bid intelligence engine for ${BUSINESS_NAME}, a ${BUSINESS_GENERATION} asphalt paving contractor in business since ${BUSINESS_SINCE}.

  Generate professional proposal sections. Standards: ${WORDEN_COMPACTION_FLOOR_PCT}% Marshall compaction minimum, ${WORDEN_BASE_SPEC}, ±$${OIL_SHIELD_BUFFER_PER_TON}/ton oil shield buffer in all estimates.

  Format your response as JSON with keys: executiveSummary, technicalApproach, complianceLanguage, heritageCertification.
  Keep each section concise but complete.`;

  const prompt = `Generate a bid proposal for this RFP:
Title: ${rfpTitle}
Tier: ${score.tier} (${score.icon}) — estimated value $${score.estimatedValue.toLocaleString()}
Signals detected: ${score.signals.join(', ') || 'residential/small commercial'}

RFP Text: ${rfpText.slice(0, 2000)}`;

  const raw = await claudeChat([{ role: 'user', content: prompt }], system, undefined, 2000);

  let parsed: Record<string, string>;
  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
  } catch {
    parsed = {};
  }

  return {
    rfpTitle,
    tier: score.tier,
    tierIcon: score.icon,
    estimatedValue: score.estimatedValue,
    executiveSummary: parsed.executiveSummary ?? 'See attached proposal for full executive summary.',
    technicalApproach: parsed.technicalApproach ?? `All work performed to ${WORDEN_COMPACTION_FLOOR_PCT}% Marshall compaction minimum per AASHTO T245.`,
    complianceLanguage: parsed.complianceLanguage ?? 'Fully licensed and insured. Davis-Bacon compliant where applicable.',
    heritageCertification: parsed.heritageCertification ?? `${BUSINESS_GENERATION} family business in operation since ${BUSINESS_SINCE}. No subcontracting without written approval.`,
    totalProposedPrice: `$${score.estimatedValue.toLocaleString()}`,
    generatedAt: new Date().toISOString(),
  };
}
