/** Multi-tenant / white-label configuration types */

export interface CityConfig {
  slug: string;
  city: string;
  county: string;
  lat: number;
  lng: number;
  population?: number;
  region?: string;
  /** If omitted, auto-generated from business config */
  metaTitle?: string;
  metaDescription?: string;
  h1?: string;
}

export interface ServiceArea {
  state: string;
  stateAbbr: string;
  cities: CityConfig[];
}

export interface TenantBusiness {
  name: string;
  shortName: string;
  phone: string;
  phoneE164: string;
  email: string;
  address: string;
  addressCity: string;
  addressState: string;
  addressStateAbbr: string;
  addressZip: string;
  website: string;
  logoUrl?: string;
  founded: number;
  generation?: string;
  primaryTrade: string;
  tradeLabel: string;
}

export interface TenantBranding {
  primaryColor: string;
  accentColor: string;
  tagline: string;
  ratingValue?: string;
  ratingCount?: number;
}

export interface TenantCompliance {
  licenseStatement: string;
  bond: string;
  bbbRating?: string;
  trustSignals: string[];
}

export interface TenantPricing {
  residentialSqftMin: number;
  residentialSqftMax: number;
  depositPct: number;
}

export interface TenantEngineeringStandard {
  compactionPct: number;
  baseDepthIn: number;
  baseSpec: string;
  wearingCourse: string;
  oilShieldPerTon: number;
  marginFloor: number;
  specs: Array<[string, string]>;
}

export interface TenantService {
  title: string;
  desc: string;
}

export interface TenantConfig {
  id: string;
  business: TenantBusiness;
  branding: TenantBranding;
  compliance: TenantCompliance;
  pricing: TenantPricing;
  engineering: TenantEngineeringStandard;
  services: TenantService[];
  serviceAreas: ServiceArea[];
}
