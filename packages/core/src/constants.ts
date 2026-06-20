/**
 * Worden Engineering Standards — non-negotiable floor values
 * These constants are the single source of truth across ALL apps.
 */

export const WORDEN_COMPACTION_FLOOR_PCT = 96;
export const WORDEN_BASE_SPEC = 'VDOT Section 315 structural stone base';
export const OIL_SHIELD_BUFFER_PER_TON = 9;
export const SOVEREIGN_BASE_DEPTH_IN = 6;
export const GROSS_MARGIN_FLOOR = 0.35;
export const BINDER_INDEX = 627.5;
export const MACHINE_HEALTH_PER_TON = 0.08;
export const LARGE_JOB_SQFT_THRESHOLD = 20_000;

export const RESIDENTIAL_DENSITY = 145;
export const COMMERCIAL_DENSITY = 148;

export const BUSINESS_NAME = 'J. Worden & Sons Paving & General Contracting';
export const BUSINESS_SHORT = 'J. Worden & Sons';
export const BUSINESS_PHONE = '(804) 446-1296';
export const BUSINESS_SINCE = 1984;
export const BUSINESS_GENERATION = '4th Generation';
export const SITE_URL = 'https://www.jwordenasphaltpaving.com';
export const SERVICE_RADIUS_MILES = 150;
export const HQ_LAT = 37.38;
export const HQ_LNG = -77.45;

/** Paving go/no-go thresholds */
export const PAVING_MIN_TEMP_F = 45;
export const PAVING_CAUTION_TEMP_F = 55;
export const PAVING_MAX_PRECIP_PCT = 40;
export const PAVING_CAUTION_PRECIP_PCT = 20;
export const PAVING_MAX_WIND_MPH = 20;
export const PAVING_CAUTION_WIND_MPH = 15;

/** Federal compliance reference standards */
export const COMPLIANCE_REFS = {
  compaction: 'AASHTO T99/T180',
  paving: 'VDOT Sec 315',
  masonry: 'ASTM C90/C270',
  roofing: 'FM Global RoofNav',
  concrete: 'ACI 318',
  federal: 'FAR 48 CFR + Davis-Bacon',
} as const;
