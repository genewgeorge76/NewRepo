/**
 * RAG Knowledge Base — in-memory retrieval augmented generation context.
 * Provides structured retrieval of Worden engineering standards, VDOT specs,
 * and compliance references to augment Claude prompts.
 *
 * Future: replace with vector search (pgvector) backed by apps/api.
 */

import {
  WORDEN_COMPACTION_FLOOR_PCT,
  WORDEN_BASE_SPEC,
  OIL_SHIELD_BUFFER_PER_TON,
  COMPLIANCE_REFS,
  SOVEREIGN_BASE_DEPTH_IN,
} from '@jworden/core';

interface KnowledgeChunk {
  id: string;
  category: string;
  title: string;
  content: string;
  keywords: string[];
}

const KNOWLEDGE_BASE: KnowledgeChunk[] = [
  {
    id: 'compaction-standard',
    category: 'engineering',
    title: 'Worden Compaction Standard',
    content: `The Worden compaction minimum is ${WORDEN_COMPACTION_FLOOR_PCT}% Marshall Unit Weight, per AASHTO T245. This is a non-negotiable floor on all projects. Nuclear density gauge tests required on every project layer.`,
    keywords: ['compaction', 'marshall', 'density', 'aashto', 't245'],
  },
  {
    id: 'vdot-base',
    category: 'engineering',
    title: 'VDOT Section 315 Base Specification',
    content: `${WORDEN_BASE_SPEC}. Minimum ${SOVEREIGN_BASE_DEPTH_IN} inches compacted aggregate base on all projects. VDOT Section 315 defines the gradation requirements for the aggregate base course.`,
    keywords: ['vdot', 'section 315', 'base', 'aggregate', 'structural'],
  },
  {
    id: 'oil-shield',
    category: 'pricing',
    title: 'Oil Shield Buffer',
    content: `All J. Worden estimates include a ±$${OIL_SHIELD_BUFFER_PER_TON}/ton liquid asphalt price buffer (oil shield) to protect against crude oil volatility. This buffer is disclosed in proposals but built into unit pricing.`,
    keywords: ['oil shield', 'liquid asphalt', 'price buffer', 'pricing', 'crude oil'],
  },
  {
    id: 'federal-compliance',
    category: 'compliance',
    title: 'Federal Project Compliance',
    content: `Federal paving projects require: FAR 48 CFR compliance, Davis-Bacon prevailing wages, SAM.gov registration (active UEI/CAGE), Buy American Build Act (BABA) for federally funded infrastructure. All crew must have zero-downtime DOT medical compliance for projects on federal highways.`,
    keywords: ['federal', 'far', 'davis-bacon', 'sam.gov', 'uei', 'cage', 'baba'],
  },
  {
    id: 'tonnage-formula',
    category: 'estimating',
    title: 'Asphalt Tonnage Calculation',
    content: `Asphalt tonnage = (sqft / 9 × depth_inches × density_pcf) / 24,000. Residential asphalt density: 145 pcf. Commercial asphalt density: 148 pcf. This formula applies Marshall mix design principles standard to VDOT-approved mixes.`,
    keywords: ['tonnage', 'formula', 'sqft', 'depth', 'density', 'pcf', 'calculation'],
  },
  {
    id: 'compliance-refs',
    category: 'compliance',
    title: 'Reference Standards by Trade',
    content: Object.entries(COMPLIANCE_REFS).map(([k, v]) => `${k}: ${v}`).join('. '),
    keywords: ['standards', 'aashto', 'astm', 'aci', 'vdot', 'aashto', 'references'],
  },
];

export function retrieveContext(query: string, maxChunks = 3): string {
  const q = query.toLowerCase();
  const scored = KNOWLEDGE_BASE.map((chunk) => {
    const hits = chunk.keywords.filter((kw) => q.includes(kw)).length;
    const titleHit = q.includes(chunk.title.toLowerCase()) ? 2 : 0;
    return { chunk, score: hits + titleHit };
  }).filter((s) => s.score > 0).sort((a, b) => b.score - a.score).slice(0, maxChunks);

  if (scored.length === 0) return '';

  return '\n\nRelevant Worden Standards:\n' + scored.map((s) =>
    `[${s.chunk.title}]\n${s.chunk.content}`,
  ).join('\n\n');
}

export function buildRAGContext(query: string): string {
  return retrieveContext(query);
}
