/**
 * JWORDENAI Asset Mirror — Job Record Ledger + Lifetime Revenue Engine
 * Every completed job is stored as a digital replica.
 * The engine pings property managers at 1-year, 3-year, and 5-year maintenance windows.
 *
 * Standards: NRCA · FM Global · VDOT Section 315 · ASTM D2939
 */

// ── Maintenance schedule constants ───────────────────────────────────────────

export const MAINTENANCE_SCHEDULE = {
  /** Year 1 — inspection + crack sealing */
  year1: { label: '1-Year Inspection', action: 'Crack sealing + joint inspection', revenueMultiplier: 0.05 },
  /** Year 3 — sealcoat (Neyra/AEI) */
  year3: { label: '3-Year Sealcoat Window', action: 'Neyra double-coat sealcoat application', revenueMultiplier: 0.18 },
  /** Year 5 — mill-and-overlay or micro-surface */
  year5: { label: '5-Year Resurface Assessment', action: 'Mill 1.5" + SM-9.5A overlay evaluation', revenueMultiplier: 0.65 },
  /** Year 12 — full reconstruction recommendation */
  year12: { label: '12-Year Full Reconstruction', action: 'Full remove & replace — VDOT base + surface', revenueMultiplier: 1.20 },
} as const;

export type MaintenanceWindow = keyof typeof MAINTENANCE_SCHEDULE;

// ── Job record schema ────────────────────────────────────────────────────────

export type ServiceType = 'asphalt-new' | 'asphalt-overlay' | 'sealcoat' | 'concrete' | 'masonry' | 'roofing' | 'gc-commercial';

export interface CompletedJob {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  propertyAddress: string;
  city: string;
  stateCode: string;
  serviceType: ServiceType;
  sqFt: number;
  tonsUsed: number;
  sealerBrand: string;
  baseDepthIn: number;
  surfaceDepthIn: number;
  compactionPct: number;
  weatherAtPour: string;
  ambientTempF: number;
  groundTempF: number;
  asphaltMixSpec: string;
  stoneBaseSpec: string;
  completionDate: string; // ISO date
  contractValue: number;
  crew: string;
  foreman: string;
  notes: string;
  photos: string[]; // URL list
}

export interface MaintenancePing {
  jobId: string;
  clientName: string;
  propertyAddress: string;
  window: MaintenanceWindow;
  scheduledDate: string; // ISO date — when to send the ping
  daysUntil: number;
  isOverdue: boolean;
  recommendedAction: string;
  estimatedRevenue: number;
  pingMessage: string;
}

// ── Seeded demo job ledger ───────────────────────────────────────────────────

export const DEMO_JOBS: CompletedJob[] = [
  {
    id: 'JW-2022-001',
    clientName: 'KBP Foods (KFC Richmond)',
    clientEmail: 'facilities@kbpfoods.com',
    clientPhone: '804-555-0110',
    propertyAddress: '4321 Commerce Rd',
    city: 'Richmond',
    stateCode: 'VA',
    serviceType: 'asphalt-new',
    sqFt: 18_400,
    tonsUsed: 312,
    sealerBrand: 'Neyra STAR Sealcoat',
    baseDepthIn: 6,
    surfaceDepthIn: 2,
    compactionPct: 97.1,
    weatherAtPour: 'Clear, 74°F',
    ambientTempF: 74,
    groundTempF: 68,
    asphaltMixSpec: 'SM-9.5A / BM-25.0 VDOT Sec 315',
    stoneBaseSpec: '21A Crusher Run VDOT 303',
    completionDate: '2022-06-15',
    contractValue: 148_000,
    crew: 'Alpha Team',
    foreman: 'Mike Worden',
    notes: 'KBP full lot replacement. 96%+ compaction on all lifts verified.',
    photos: [],
  },
  {
    id: 'JW-2023-004',
    clientName: 'Henrico County Schools — Glen Allen HS',
    clientEmail: 'facilities@henricoschools.us',
    clientPhone: '804-555-0220',
    propertyAddress: '10000 Staples Mill Rd',
    city: 'Glen Allen',
    stateCode: 'VA',
    serviceType: 'asphalt-overlay',
    sqFt: 42_000,
    tonsUsed: 485,
    sealerBrand: 'AEI Emulsion SS-1H',
    baseDepthIn: 6,
    surfaceDepthIn: 2,
    compactionPct: 96.8,
    weatherAtPour: 'Partly Cloudy, 68°F',
    ambientTempF: 68,
    groundTempF: 62,
    asphaltMixSpec: 'SM-9.5A VDOT Sec 315',
    stoneBaseSpec: 'Existing 21A base — verified 6-in depth',
    completionDate: '2023-08-22',
    contractValue: 320_000,
    crew: 'Bravo Team',
    foreman: 'James Worden',
    notes: 'County school mill & overlay. Prevailing wage / Davis-Bacon compliant.',
    photos: [],
  },
  {
    id: 'JW-2021-009',
    clientName: 'Windsor Farms HOA',
    clientEmail: 'hoa@windsorfarms.org',
    clientPhone: '804-555-0330',
    propertyAddress: '200 Windsor Farms Dr',
    city: 'Richmond',
    stateCode: 'VA',
    serviceType: 'sealcoat',
    sqFt: 28_500,
    tonsUsed: 0,
    sealerBrand: 'Neyra STAR Sealcoat',
    baseDepthIn: 0,
    surfaceDepthIn: 0,
    compactionPct: 0,
    weatherAtPour: 'Sunny, 81°F',
    ambientTempF: 81,
    groundTempF: 78,
    asphaltMixSpec: 'N/A — sealcoat only',
    stoneBaseSpec: 'N/A',
    completionDate: '2021-09-10',
    contractValue: 24_500,
    crew: 'Seal Team',
    foreman: 'Dave Worden',
    notes: 'Full HOA parking area. Double coat Neyra per ASTM D2939.',
    photos: [],
  },
  {
    id: 'JW-2020-015',
    clientName: 'Chesterfield Commerce Park LLC',
    clientEmail: 'pm@ccpllc.com',
    clientPhone: '804-555-0440',
    propertyAddress: '9800 Midlothian Tpk',
    city: 'Midlothian',
    stateCode: 'VA',
    serviceType: 'asphalt-new',
    sqFt: 55_000,
    tonsUsed: 920,
    sealerBrand: 'Neyra STAR Sealcoat',
    baseDepthIn: 6,
    surfaceDepthIn: 2.5,
    compactionPct: 97.4,
    weatherAtPour: 'Clear, 79°F',
    ambientTempF: 79,
    groundTempF: 72,
    asphaltMixSpec: 'SM-9.5A + BM-25.0 VDOT Sec 315',
    stoneBaseSpec: '21A Crusher Run + #57 drainage course',
    completionDate: '2020-05-20',
    contractValue: 485_000,
    crew: 'Alpha + Bravo Team',
    foreman: 'Gene Worden',
    notes: 'Full commercial lot. Drainage swales, curb & gutter Div 03.',
    photos: [],
  },
];

// ── Maintenance ping engine ───────────────────────────────────────────────────

function addYears(date: Date, years: number): Date {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

function daysUntil(target: Date): number {
  const now = new Date();
  return Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function buildPingMessage(job: CompletedJob, window: MaintenanceWindow, scheduledDate: Date): string {
  const sched = MAINTENANCE_SCHEDULE[window];
  const dateStr = scheduledDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  return `Dear ${job.clientName}, your ${job.sqFt.toLocaleString()} sq ft pavement at ${job.propertyAddress} — installed by J. Worden & Sons in ${new Date(job.completionDate).getFullYear()} — is entering its ${sched.label}. Based on your ${new Date(job.completionDate).getFullYear()} pour specs (${job.compactionPct}% compaction, ${job.baseDepthIn}-inch VDOT base), we recommend: ${sched.action}. Please contact us to schedule your ${dateStr} maintenance window. 4th Generation Since 1984 — we built it right, we'll keep it right. 📞 804-446-1296`;
}

/** Generate all pending and upcoming maintenance pings from a job ledger */
export function generateMaintenancePings(jobs: CompletedJob[]): MaintenancePing[] {
  const pings: MaintenancePing[] = [];

  for (const job of jobs) {
    const completion = new Date(job.completionDate);
    const windows: Array<{ key: MaintenanceWindow; yearOffset: number }> = [
      { key: 'year1', yearOffset: 1 },
      { key: 'year3', yearOffset: 3 },
      { key: 'year5', yearOffset: 5 },
      { key: 'year12', yearOffset: 12 },
    ];

    for (const w of windows) {
      const pingDate = addYears(completion, w.yearOffset);
      const days = daysUntil(pingDate);
      const sched = MAINTENANCE_SCHEDULE[w.key];

      // Only surface pings within 6 months past due or up to 18 months ahead
      if (days > 548 || days < -180) continue;

      pings.push({
        jobId: job.id,
        clientName: job.clientName,
        propertyAddress: job.propertyAddress,
        window: w.key,
        scheduledDate: pingDate.toISOString(),
        daysUntil: days,
        isOverdue: days < 0,
        recommendedAction: sched.action,
        estimatedRevenue: parseFloat((job.contractValue * sched.revenueMultiplier).toFixed(2)),
        pingMessage: buildPingMessage(job, w.key, pingDate),
      });
    }
  }

  // Sort: overdue first, then soonest upcoming
  return pings.sort((a, b) => a.daysUntil - b.daysUntil);
}

/** Calculate projected lifetime revenue for a single job */
export function calcLifetimeRevenue(job: CompletedJob): number {
  return parseFloat(
    Object.values(MAINTENANCE_SCHEDULE)
      .reduce((sum, sched) => sum + job.contractValue * sched.revenueMultiplier, job.contractValue)
      .toFixed(2),
  );
}

/** Summarize the entire ledger's lifetime value */
export function ledgerLifetimeSummary(jobs: CompletedJob[]): {
  totalJobs: number;
  totalContractValue: number;
  projectedLifetimeRevenue: number;
  lifetimeMultiplier: number;
} {
  const totalContractValue = jobs.reduce((s, j) => s + j.contractValue, 0);
  const projectedLifetimeRevenue = jobs.reduce((s, j) => s + calcLifetimeRevenue(j), 0);
  return {
    totalJobs: jobs.length,
    totalContractValue: parseFloat(totalContractValue.toFixed(2)),
    projectedLifetimeRevenue: parseFloat(projectedLifetimeRevenue.toFixed(2)),
    lifetimeMultiplier: parseFloat((projectedLifetimeRevenue / totalContractValue).toFixed(2)),
  };
}
