/**
 * JWORDENAI RAG Knowledge Base
 * Retrieval-Augmented Generation: stores Worden Standards, VDOT specs,
 * Davis-Bacon wage tables, and SAM.gov rules so the AI can cite real sources.
 */

export interface KnowledgeChunk {
  id: string;
  category: 'vdot' | 'worden-standard' | 'davis-bacon' | 'sam-gov' | 'safety' | 'pricing';
  title: string;
  content: string;
  source: string;
  tags: string[];
}

export const KNOWLEDGE_BASE: KnowledgeChunk[] = [
  // ─── VDOT Standards ────────────────────────────────────────────────────────
  {
    id: 'vdot-315',
    category: 'vdot',
    title: 'VDOT Section 315 — Aggregate Base Course',
    content: 'VDOT Section 315 requires a compacted aggregate base course of No. 21A crushed stone to a minimum depth of 6 inches for residential applications and 8–12 inches for commercial/municipal. Compaction must achieve 100% of Standard Proctor Density per AASHTO T99.',
    source: 'VDOT Road and Bridge Specifications, Section 315',
    tags: ['base course', 'aggregate', 'compaction', 'residential', 'commercial'],
  },
  {
    id: 'vdot-asphalt-mix',
    category: 'vdot',
    title: 'VDOT SM-9.5A Surface Mix Design',
    content: 'SM-9.5A is the standard VDOT surface layer mix for residential and light commercial applications. Minimum compacted thickness: 1.5 inches. Application temperature: 275–325°F. Compaction window closes below 175°F. Air voids: 3.0–5.0%.',
    source: 'VDOT Road and Bridge Specifications, Sections 211–212',
    tags: ['asphalt mix', 'SM-9.5A', 'surface course', 'temperature', 'air voids'],
  },
  {
    id: 'vdot-bm-25',
    category: 'vdot',
    title: 'VDOT BM-25.0 Base Mix Design',
    content: 'BM-25.0 is the VDOT base course asphalt mix for heavy commercial and municipal applications. Minimum compacted depth: 2.5 inches. Used beneath SM-9.5A surface in commercial parking lots and roadways.',
    source: 'VDOT Road and Bridge Specifications, Section 212',
    tags: ['BM-25.0', 'base mix', 'commercial', 'heavy duty'],
  },
  // ─── Worden Standards ──────────────────────────────────────────────────────
  {
    id: 'worden-96-marshall',
    category: 'worden-standard',
    title: 'Worden Standard: 96% Marshall Unit Weight',
    content: 'J. Worden & Sons requires a minimum 96% Marshall Unit Weight compaction on all asphalt lifts. This exceeds the industry standard of 92% and prevents rutting, shoving, and premature cracking. Verified by nuclear density gauge on every project. This is non-negotiable.',
    source: 'J. Worden & Sons Engineering Standard WS-001',
    tags: ['96% marshall', 'compaction', 'density', 'quality', 'non-negotiable'],
  },
  {
    id: 'worden-6-inch-base',
    category: 'worden-standard',
    title: 'Worden Minimum: 6-Inch Structural Stone Base',
    content: 'All J. Worden & Sons paving projects include a VDOT-grade structural stone base of minimum 6 inches (compacted). This is the "Worden Minimum" — never negotiated down. Provides 25+ year lifespan vs. 10–15 years with inadequate base. Spec: No. 21A crushed stone, 100% Standard Proctor.',
    source: 'J. Worden & Sons Engineering Standard WS-002',
    tags: ['6-inch base', 'structural stone', 'VDOT', 'longevity', 'residential', 'commercial'],
  },
  {
    id: 'worden-oil-shield',
    category: 'worden-standard',
    title: 'Worden $9/Ton Oil Price Shield',
    content: 'All Worden proposals include a ±$9/ton liquid asphalt price buffer built into the unit price. This protects margin when PG 64-22 binder prices fluctuate. Current base: $650/ton plant-mixed asphalt. Shield activates at ±$9/ton change from proposal date.',
    source: 'J. Worden & Sons Pricing Standard WS-003',
    tags: ['oil price shield', '$9/ton', 'pricing', 'margin protection', 'liquid asphalt'],
  },
  // ─── Davis-Bacon ───────────────────────────────────────────────────────────
  {
    id: 'davis-bacon-general',
    category: 'davis-bacon',
    title: 'Davis-Bacon Act — Federal Prevailing Wage',
    content: 'All federally funded construction contracts exceeding $2,000 require payment of prevailing wages per the Davis-Bacon Act (40 U.S.C. 3141–3148). Wages are set by the U.S. Department of Labor per county and craft. Certified payroll (WH-347) must be submitted weekly. Asphalt paver operators and laborers have separate wage determinations.',
    source: 'Davis-Bacon Act, 40 U.S.C. 3141; DOL Wage and Hour Division',
    tags: ['davis-bacon', 'prevailing wage', 'federal', 'certified payroll', 'WH-347'],
  },
  {
    id: 'davis-bacon-virginia',
    category: 'davis-bacon',
    title: 'Davis-Bacon Virginia — Paving Wage Rates (Richmond Metro)',
    content: 'Current Davis-Bacon wage rates for Richmond, VA metro (Chesterfield, Henrico, Richmond City): Asphalt Paver Operator: $28.50/hr + $12.45 fringe. Laborer (Asphalt): $22.75/hr + $12.45 fringe. Roller Operator: $26.80/hr + $12.45 fringe. Rates effective 2025 — verify at sam.gov/wage-determinations.',
    source: 'DOL General Decision VA20240014 (verify current at sam.gov)',
    tags: ['virginia', 'richmond', 'wage rates', 'asphalt', 'operator', 'laborer'],
  },
  // ─── SAM.gov ───────────────────────────────────────────────────────────────
  {
    id: 'sam-gov-registration',
    category: 'sam-gov',
    title: 'SAM.gov — Federal Registration Requirements',
    content: 'All federal contractors must maintain active SAM.gov (System for Award Management) registration. Registration must be renewed annually. Required for: bidding federal contracts, receiving federal payments, applying for small business set-asides. J. Worden & Sons is actively registered with UEI and CAGE code.',
    source: 'SAM.gov; FAR 4.1102',
    tags: ['SAM.gov', 'federal', 'UEI', 'CAGE', 'registration', 'annual renewal'],
  },
  {
    id: 'far-compliance',
    category: 'sam-gov',
    title: 'FAR Part 36 — Construction and Architect-Engineer Contracts',
    content: 'Federal construction contracts are governed by FAR Part 36. Key requirements: bid bonds required on contracts >$150K, performance/payment bonds on contracts >$150K (Miller Act). Buy American provisions apply. Subcontracting plans required on contracts >$750K.',
    source: 'Federal Acquisition Regulation (FAR) 48 CFR Part 36',
    tags: ['FAR', 'federal', 'bid bond', 'performance bond', 'Miller Act', 'Buy American'],
  },
  // ─── Pricing ───────────────────────────────────────────────────────────────
  {
    id: 'pricing-residential',
    category: 'pricing',
    title: 'Worden Residential Pricing Schedule',
    content: 'Residential asphalt driveway: $3.50–$7.00/sqft installed (2024 Virginia rates). Includes: saw cut, tack coat, 1.5-inch SM-9.5A surface, 6-inch No. 21A base. Sealcoating: $0.18–$0.28/sqft. Crack sealing: $2.50–$4.00/linear foot. Minimum job: $1,500.',
    source: 'J. Worden & Sons Rate Sheet RS-2024-01',
    tags: ['residential', 'driveway', 'pricing', 'sealcoating', 'crack sealing'],
  },
  {
    id: 'pricing-commercial',
    category: 'pricing',
    title: 'Worden Commercial Pricing Schedule',
    content: 'Commercial parking lot (new): $4.50–$9.00/sqft installed. Includes: full-depth asphalt, 8-inch base, striping. Mill & overlay: $2.50–$4.50/sqft. Municipal-grade work (VDOT spec): add 15–20% premium. QSR fast-track 90-day program: fixed-fee per site agreement available.',
    source: 'J. Worden & Sons Rate Sheet RS-2024-02',
    tags: ['commercial', 'parking lot', 'mill overlay', 'municipal', 'QSR'],
  },
];

/**
 * Retrieves the most relevant knowledge chunks for a given query.
 * Simple keyword-based retrieval (production would use vector embeddings).
 */
export function retrieveRelevantChunks(query: string, topK = 3): KnowledgeChunk[] {
  const q = query.toLowerCase();
  const scored = KNOWLEDGE_BASE.map((chunk) => {
    const text = `${chunk.title} ${chunk.content} ${chunk.tags.join(' ')}`.toLowerCase();
    const score = q.split(' ').filter((w) => w.length > 3 && text.includes(w)).length;
    return { chunk, score };
  });
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter((s) => s.score > 0)
    .map((s) => s.chunk);
}

/**
 * Formats retrieved chunks into a context block for injection into prompts.
 */
export function buildRAGContext(query: string): string {
  const chunks = retrieveRelevantChunks(query);
  if (chunks.length === 0) return '';
  return [
    '--- WORDEN KNOWLEDGE BASE (cite these sources in your response) ---',
    ...chunks.map((c) => `[${c.source}]\n${c.content}`),
    '--- END KNOWLEDGE BASE ---',
  ].join('\n\n');
}
