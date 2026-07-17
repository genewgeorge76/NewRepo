/**
 * JWORDENAI Bid Intelligence Engine
 * Reads RFP descriptions → scores Whale/Shark/Fish tier → drafts proposals
 * with auto-populated government compliance language.
 */

import { routeToModel } from './MultiModelRouter';
import { buildRAGContext } from './RAGKnowledgeBase';

export type BidTier = 'whale' | 'shark' | 'fish';

export interface BidScore {
  tier: BidTier;
  icon: '🐋' | '🦈' | '🐟';
  estimatedValue: number;
  confidence: number;
  signals: string[];
}

export interface BidProposal {
  rfpTitle: string;
  tier: BidTier;
  tierIcon: string;
  estimatedValue: number;
  executiveSummary: string;
  technicalApproach: string;
  complianceLanguage: string;
  heritageCertification: string;
  totalProposedPrice: string;
  generatedAt: string;
}

const WHALE_SIGNALS = ['federal', 'usace', 'highway', 'state dot', 'vdot', 'airport', 'municipality', 'county', 'million', 'national', 'interstate', 'fhwa', 'gsa', 'sam.gov'];
const SHARK_SIGNALS = ['commercial', 'parking lot', 'shopping center', 'school', 'county road', 'regional', 'university', 'hospital', 'industrial'];
const FISH_SIGNALS = ['residential', 'driveway', 'homeowner', 'hoa', 'condo', 'townhouse', 'neighborhood'];

/**
 * Scores an RFP description to determine the bid tier.
 */
export function scoreBidTier(rfpText: string): BidScore {
  const text = rfpText.toLowerCase();
  const whaleHits = WHALE_SIGNALS.filter((s) => text.includes(s));
  const sharkHits = SHARK_SIGNALS.filter((s) => text.includes(s));
  const fishHits = FISH_SIGNALS.filter((s) => text.includes(s));

  // Parse dollar amount if present
  const dollarMatch = text.match(/\$?([\d,]+)\s*(million|k\b)?/i);
  let estimatedValue = 0;
  if (dollarMatch) {
    const num = parseFloat(dollarMatch[1].replace(/,/g, ''));
    if (dollarMatch[2]?.toLowerCase() === 'million') estimatedValue = num * 1_000_000;
    else if (dollarMatch[2]?.toLowerCase() === 'k') estimatedValue = num * 1_000;
    else estimatedValue = num;
  }

  if (whaleHits.length >= 2 || estimatedValue >= 500_000) {
    return {
      tier: 'whale', icon: '🐋',
      estimatedValue: estimatedValue || 750_000,
      confidence: Math.min(95, 60 + whaleHits.length * 10),
      signals: whaleHits,
    };
  }
  if (sharkHits.length >= 1 || (estimatedValue >= 100_000 && estimatedValue < 500_000)) {
    return {
      tier: 'shark', icon: '🦈',
      estimatedValue: estimatedValue || 250_000,
      confidence: Math.min(90, 55 + sharkHits.length * 10),
      signals: sharkHits,
    };
  }
  return {
    tier: 'fish', icon: '🐟',
    estimatedValue: estimatedValue || 15_000,
    confidence: Math.min(85, 50 + fishHits.length * 10),
    signals: fishHits,
  };
}

/**
 * Generates a full bid proposal using the multi-model router + RAG.
 */
export async function generateBidProposal(
  rfpTitle: string,
  rfpDescription: string,
  projectLocation: string
): Promise<BidProposal> {
  const score = scoreBidTier(`${rfpTitle} ${rfpDescription}`);
  const ragContext = buildRAGContext(`${rfpTitle} ${rfpDescription} paving standards compliance`);

  const isGovernment = WHALE_SIGNALS.some((s) => rfpDescription.toLowerCase().includes(s));

  const complianceRequirements = isGovernment
    ? `This is a GOVERNMENT CONTRACT. Include: Virginia Class A Contractor License, SAM.gov registration (UEI/CAGE), Davis-Bacon prevailing wage compliance acknowledgment, DBE participation plan, bid bond capacity, performance and payment bond capacity.`
    : `Include: Virginia Class A Contractor License, full liability and workers comp insurance, zero sub-contracted labor policy.`;

  const prompt = `
${ragContext}

Generate a winning ${score.icon} ${score.tier.toUpperCase()} TIER bid proposal for:
PROJECT: ${rfpTitle}
LOCATION: ${projectLocation}
DESCRIPTION: ${rfpDescription}
ESTIMATED VALUE: $${score.estimatedValue.toLocaleString()}

${complianceRequirements}

Required sections:
1. Executive Summary (3 sentences, extremely persuasive, mention 4th-generation heritage since 1984)
2. Technical Approach (reference specific VDOT specs, 96% Marshall standard, 6-inch base minimum)
3. Compliance Language (Virginia Class A license, insurance, all required certs)
4. Heritage Certification (one paragraph on 40-year track record)
5. Proposed Price (range based on project scope)

Tone: Authoritative, elite, non-negotiable quality. This company wins contracts.
`;

  const result = await routeToModel(prompt, 'bidding');

  // Parse sections from AI response
  const lines = result.response.split('\n');
  const getSection = (marker: string) => {
    const idx = lines.findIndex((l) => l.toLowerCase().includes(marker.toLowerCase()));
    if (idx === -1) return result.response.substring(0, 200);
    return lines.slice(idx + 1, idx + 6).join(' ').trim();
  };

  return {
    rfpTitle,
    tier: score.tier,
    tierIcon: score.icon,
    estimatedValue: score.estimatedValue,
    executiveSummary: getSection('executive summary'),
    technicalApproach: getSection('technical approach'),
    complianceLanguage: isGovernment
      ? 'Virginia Class A Contractor License | SAM.gov Active Registration | Davis-Bacon Compliant | Bid/Performance/Payment Bond Capable | E-Verify | OSHA 30 Certified Crews'
      : 'Virginia Class A Contractor License | $2M General Liability | Workers Compensation | BBB A+ Accredited',
    heritageCertification: 'J. Worden & Sons — 4th Generation Since 1984. 40+ years of continuous operation. KBP/KFC vetted. 96% Marshall compaction on every project. Zero-subcontract labor policy.',
    totalProposedPrice: `$${(score.estimatedValue * 0.9).toLocaleString()} – $${(score.estimatedValue * 1.1).toLocaleString()}`,
    generatedAt: new Date().toISOString(),
  };
}
