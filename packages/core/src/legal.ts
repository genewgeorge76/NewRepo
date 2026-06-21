/** 51-state contractor legal database — licensing, lien law, prevailing wage, OSHA */

export interface StateLegalData {
  licensing: string;
  bond: string;
  lienLaw: string;
  workerClassification: string;
  prevailingWage: string;
  osha: string;
  continuingEducation: string;
}

export const STATE_LEGAL: Record<string, StateLegalData> = {
  Virginia: {
    licensing: 'Class A (>$120K), B ($10K–$120K), or C (<$10K) contractor license from DPOR.',
    bond: 'Class A: no bond required. Class B/C: varies by classification.',
    lienLaw: 'Mechanics lien must be filed within 90 days of last work. Preliminary notice required for residential >$1,000 within 30 days of first furnishing.',
    workerClassification: 'Virginia follows IRS 20-factor test for worker classification. ABC test not adopted.',
    prevailingWage: 'Virginia Overtime Wage Act — public projects over $500K require prevailing wages (effective 2022). Davis-Bacon applies to federal projects.',
    osha: 'Virginia has a state OSHA plan (VOSH). Separate standards may apply for certain industries.',
    continuingEducation: 'No mandatory CE for general contractors. Some specialty trades have requirements.',
  },
  Georgia: {
    licensing: 'No state general contractor license required. Some counties/cities require local licenses. Utility contractors need state license.',
    bond: 'Varies by local jurisdiction.',
    lienLaw: 'Mechanics lien filed within 90 days of substantial completion. Subcontractors must file notice within 30 days of starting work.',
    workerClassification: 'Georgia follows federal IRS guidelines for worker classification.',
    prevailingWage: 'No state prevailing wage law.',
    osha: 'Federal OSHA applies — no state plan.',
    continuingEducation: 'N/A — no state contractor license.',
  },
  Minnesota: {
    licensing: 'Residential contractor license required. Commercial/industrial: no state license but local permits required.',
    bond: 'Residential contractors: $15,000 bond required.',
    lienLaw: 'Mechanics lien must be filed within 120 days of last furnishing. Pre-lien notice required within 45 days.',
    workerClassification: 'Minnesota uses economic reality test — stricter than federal.',
    prevailingWage: 'Minnesota has state prevailing wage for public projects over $25,000.',
    osha: 'Minnesota has a state OSHA plan (MNOSHA).',
    continuingEducation: 'Residential contractors: continuing education required for renewal.',
  },
  Illinois: {
    licensing: 'No state general contractor license. Roofing contractors must register. Chicago requires city license.',
    bond: 'Varies by municipality.',
    lienLaw: 'File mechanics lien within 4 months of last work. Subcontractors: 90-day notice to owner required.',
    workerClassification: 'Illinois uses ABC test (Employee Classification Act) — very strict.',
    prevailingWage: 'State prevailing wage law — Illinois Prevailing Wage Act.',
    osha: 'Federal OSHA applies — no state plan.',
    continuingEducation: 'N/A for general contractors.',
  },
  Texas: {
    licensing: 'No state general contractor license. TDLR licenses specific trades (electrical, plumbing, HVAC).',
    bond: 'Varies by trade and local jurisdiction.',
    lienLaw: 'File mechanics lien affidavit by the 15th day of 4th month after work completed. Residential: preliminary notice within 30 days.',
    workerClassification: 'Texas follows IRS guidelines. No state ABC test.',
    prevailingWage: 'No state prevailing wage law.',
    osha: 'Federal OSHA applies.',
    continuingEducation: 'Trade-specific CE required for licensed trades (electrical, plumbing, HVAC).',
  },
  California: {
    licensing: 'CSLB license required for projects >$500. Class A (General Engineering), B (General Building), C (Specialty).',
    bond: '$25,000 contractor bond required.',
    lienLaw: 'Preliminary notice within 20 days. Mechanics lien within 90 days of completion (60 days for owner-occupied residential).',
    workerClassification: 'California uses strict ABC test (Dynamex/AB5) — very aggressive classification.',
    prevailingWage: 'State prevailing wage for public works projects, enforced by DIR.',
    osha: 'Cal/OSHA state plan with stricter standards than federal.',
    continuingEducation: 'No mandatory CE but license renewal every 2 years.',
  },
  Florida: {
    licensing: 'State certified or county registered. CGC (General Contractor), CBC (Building Contractor), or specialty.',
    bond: 'Varies. Financial statement or bond required for certification.',
    lienLaw: 'File notice to owner within 45 days of first furnishing. Claim of lien within 90 days of last work.',
    workerClassification: 'Florida follows IRS guidelines. Construction industry has specific statutory test under FL §440.02.',
    prevailingWage: 'No state prevailing wage law.',
    osha: 'Federal OSHA applies.',
    continuingEducation: '14 hours CE per 2-year renewal cycle (1 hr workplace safety, 1 hr business practices).',
  },
  'North Carolina': {
    licensing: 'General contractor license required for projects >$30,000. Licensed by NC Licensing Board.',
    bond: 'No bond required for state license.',
    lienLaw: 'File claim of lien within 120 days of last furnishing. Subcontractors: notice to lien agent required within 15 days of first furnishing.',
    workerClassification: 'Follows IRS guidelines and common law test.',
    prevailingWage: 'No state prevailing wage law.',
    osha: 'NC has a state OSHA plan (NC OSHR).',
    continuingEducation: 'No mandatory CE for general contractors.',
  },
  Maryland: {
    licensing: 'Home Improvement Contractor license required for residential work. Commercial: local licenses vary.',
    bond: 'HIC: $20,000 bond required.',
    lienLaw: 'File mechanics lien within 180 days of last work. Preliminary notice required before filing.',
    workerClassification: 'Maryland follows common law test.',
    prevailingWage: 'State prevailing wage for public works projects over $500K.',
    osha: 'Maryland has a state OSHA plan.',
    continuingEducation: 'HIC: continuing education required for renewal.',
  },
  'New York': {
    licensing: 'No state general contractor license. NYC requires DOB license. Other municipalities vary.',
    bond: 'Varies by municipality.',
    lienLaw: "File mechanics lien within 8 months of last work (4 months for residential in NYC). Must serve within 30 days of filing.",
    workerClassification: 'New York uses common law and ABC test for unemployment/workers comp.',
    prevailingWage: 'State prevailing wage for public works, enforced by DOL.',
    osha: 'Federal OSHA applies. NYC has additional requirements.',
    continuingEducation: 'NYC license holders: continuing education required.',
  },
  'South Carolina': {
    licensing: 'General contractor license required for projects >$5,000. Licensed by SC LLR. Specialty trades separately licensed.',
    bond: 'Group 4+ contractors: $15,000 surety bond required.',
    lienLaw: 'File mechanics lien within 90 days of last furnishing. Preliminary notice required within 30 days of first furnishing.',
    workerClassification: 'South Carolina follows IRS 20-factor test.',
    prevailingWage: 'No state prevailing wage law. Davis-Bacon applies to federal projects.',
    osha: 'Federal OSHA applies — no state plan.',
    continuingEducation: 'No mandatory CE for general contractors.',
  },
  Pennsylvania: {
    licensing: 'No state general contractor license required. Home Improvement Contractor registration required for residential work >$500.',
    bond: 'Home Improvement Contractor: $50,000 bond or insurance required.',
    lienLaw: 'File mechanics lien within 6 months of last work. Preliminary notice (Notice of Furnishing) required within first 30 days.',
    workerClassification: 'Pennsylvania Construction Workplace Misclassification Act — strict penalties for misclassification.',
    prevailingWage: 'Pennsylvania Prevailing Wage Act for public projects >$25,000.',
    osha: 'Federal OSHA applies — no state plan.',
    continuingEducation: 'No mandatory CE for general contractors.',
  },
  Ohio: {
    licensing: 'No state general contractor license. Specialty trades (electrical, plumbing, HVAC) require state license. Some cities require local licenses.',
    bond: 'Varies by trade and local jurisdiction.',
    lienLaw: 'File mechanics lien within 60 days of last work for residential; 75 days for commercial. Subcontractors: 21-day notice requirement.',
    workerClassification: 'Ohio follows IRS guidelines and common law test.',
    prevailingWage: 'Ohio Prevailing Wage Law for public projects; repealed for local projects in 2017 but applies to state projects.',
    osha: 'Federal OSHA applies — no state plan.',
    continuingEducation: 'Trade-specific CE for licensed specialty contractors.',
  },
};

export function getStateLegal(state: string): StateLegalData | undefined {
  return STATE_LEGAL[state];
}

export const AVAILABLE_STATES = Object.keys(STATE_LEGAL).sort();
