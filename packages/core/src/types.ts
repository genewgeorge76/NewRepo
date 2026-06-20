/** Shared TypeScript types for the entire platform */

// ── Estimating ───────────────────────────────────────────────────────────────

export type TradeCategory =
  | 'paving'
  | 'concrete'
  | 'sitework'
  | 'roofing'
  | 'electrical'
  | 'plumbing'
  | 'hvac'
  | 'carpentry'
  | 'masonry'
  | 'painting'
  | 'landscaping'
  | 'interior'
  | 'specialty';

export type UnitType = 'sqft' | 'lnft' | 'cuyd' | 'unit' | 'hr';

export interface TradeSpec {
  label: string;
  category: TradeCategory;
  defaultDensity: number | null;
  unit: UnitType;
  depthUnit: 'in' | null;
  costLabel: string;
}

export interface EstimateInput {
  tradeKey: string;
  quantity: number;
  depthIn?: number;
  costPerUnit: number;
  location?: string;
}

export interface EstimateOutput {
  id: string;
  tradeLabel: string;
  quantity: number;
  tonnage: number | null;
  materialCost: number;
  binderCost: number;
  machineHealth: number;
  subtotal: number;
  finalBid: number;
  margin: number;
  location: string;
  isLargeJob: boolean;
  generatedAt: string;
}

// ── Leads ────────────────────────────────────────────────────────────────────

export type BidTier = 'whale' | 'shark' | 'fish';
export type LeadStatus = 'new' | 'contacted' | 'quoted' | 'won' | 'lost' | 'archived';

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  service?: string;
  description?: string;
  estimatedValue?: number;
  tier?: BidTier;
  score?: number;
  status: LeadStatus;
  source?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Jobs ─────────────────────────────────────────────────────────────────────

export type JobStatus =
  | 'Estimated'
  | 'Proposed'
  | 'Accepted'
  | 'Scheduled'
  | 'In Progress'
  | 'Complete'
  | 'Invoiced'
  | 'Paid'
  | 'Archived';

export interface Job {
  id: string;
  trade: string;
  city: string;
  quantity: number;
  bid: number;
  status: JobStatus;
  isLargeJob?: boolean;
  createdAt: string;
  leadId?: string;
}

// ── Crew / Equipment ─────────────────────────────────────────────────────────

export type CrewStatus = 'Available' | 'On Job' | 'Off' | 'Vacation' | 'Terminated';
export type EquipmentStatus = 'Available' | 'On Job' | 'Maintenance' | 'Down' | 'Retired';

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  status: CrewStatus;
  phone?: string;
  licenseExpiry?: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  status: EquipmentStatus;
  serialNumber?: string;
  nextService?: string;
}

// ── Weather ──────────────────────────────────────────────────────────────────

export type PavingDecision = 'GO' | 'CAUTION' | 'NO-GO';

export interface DayForecast {
  date: string;
  highF: number;
  lowF: number;
  precipPct: number;
  windMph: number;
  weatherCode: number;
  decision: PavingDecision;
}

// ── Bid Intelligence ─────────────────────────────────────────────────────────

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

// ── Location / SEO ───────────────────────────────────────────────────────────

export interface LocationData {
  slug: string;
  city: string;
  county: string;
  state: string;
  stateAbbr: string;
  lat: number;
  lng: number;
  population?: number;
  region?: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
}
