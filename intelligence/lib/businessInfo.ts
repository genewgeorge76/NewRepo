/**
 * businessInfo.ts — SINGLE CANONICAL SOURCE OF TRUTH for J. Worden & Sons.
 *
 * MASTER OWNED BY: gemni-investigate
 * Mirror lives at: standalone repo → src/lib/businessInfo.js
 * Rule: edit this file. Re-export to standalone via the mirror script.
 * Never hand-edit the JS mirror.
 *
 * Every NAP, schema, social link, and credential rendered anywhere on
 * jwordenasphaltpaving.com must import from this file. No drift tolerated.
 *
 * Last verified: 2026-05-12
 */

export const SITE_URL = 'https://www.jwordenasphaltpaving.com';

// ──────────────────────────────────────────────────────────────────────────────
// IDENTITY
// ──────────────────────────────────────────────────────────────────────────────
export const BUSINESS_NAME = 'J. Worden & Sons Paving LLC';
export const BUSINESS_LEGAL_NAME = 'J. Worden & Sons Paving LLC';
export const BUSINESS_FOUNDING_YEAR = '1984';
export const TAX_ID_EIN = '20-4419522';

export const FOUNDER = {
  name: 'John H. Worden',
  jobTitle: 'Founder',
} as const;

export const ALTERNATE_NAMES = [
  'J. Worden and Sons',
  'J Worden and Sons',
  'JWorden & Sons',
  'J. Worden & Sons Paving',
  'J. Worden & Sons Paving LLC',
  'J Worden Asphalt',
] as const;

export const BUSINESS_DESCRIPTION =
  '4th-generation family asphalt paving contractor founded in Chester, Virginia in 1984. ' +
  'Virginia Class A Contractor. BBB A+ rated since 1994. ' +
  'Multi-year Best of Houzz Service Award winner. ' +
  'Pavement Magazine Top 75 Contractor. ' +
  'National preferred contractor for KFC, Taco Bell, and Arby\u2019s. ' +
  'Self-performed crews on every job, public or private.';

// ──────────────────────────────────────────────────────────────────────────────
// CONTACT
// ──────────────────────────────────────────────────────────────────────────────
export const PHONE_DISPLAY = '804-446-1296';
export const PHONE_E164 = '+18044461296';
export const PHONE_SCHEMA = '+1-804-446-1296';
export const PHONE_HREF = 'tel:+18044461296';

export const SMS_E164 = '+18044461296';
export const SMS_PREFILL = 'Hi, I saw your website and want a free quote.';

export const EMAIL = 'j.wordenandsonspaving@gmail.com';

// ──────────────────────────────────────────────────────────────────────────────
// LOCATION (verified 2026-05-10 — "Ware Bottom Spring Rd", no trailing S)
// ──────────────────────────────────────────────────────────────────────────────
export const ADDRESS = {
  streetAddress: '1601 Ware Bottom Spring Rd, Suite 214',
  addressLocality: 'Chester',
  addressRegion: 'VA',
  postalCode: '23836',
  addressCountry: 'US',
} as const;

export const ADDRESS_DISPLAY =
  `${ADDRESS.streetAddress}, ${ADDRESS.addressLocality}, ${ADDRESS.addressRegion} ${ADDRESS.postalCode}`;

export const GEO = { latitude: 37.3529, longitude: -77.4326 } as const;

// ──────────────────────────────────────────────────────────────────────────────
// HOURS (verified 2026-05-10)
// ──────────────────────────────────────────────────────────────────────────────
export const OPENING_HOURS = [
  { dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '07:00', closes: '18:00' },
  { dayOfWeek: ['Saturday'], opens: '07:00', closes: '14:00' },
] as const;

export const HOURS_DISPLAY = 'Mon\u2013Fri 7am\u20136pm \u00b7 Sat 7am\u20132pm';
export const HOURS_DISPLAY_ALT = '24/7 Emergency Response Available';

// ──────────────────────────────────────────────────────────────────────────────
// CREDENTIALS
// ──────────────────────────────────────────────────────────────────────────────
export const CREDENTIALS = {
  vaLicense: 'Virginia Class A Contractor',
  bbbRating: 'A+',
  bbbSince: '1994',
  pavementAward: 'Pavement Magazine Top 75 Contractor',
  houzzAwards: [
    'Best of Houzz Service 2014',
    'Best of Houzz Service 2015',
    'Best of Houzz Service 2016',
    'Best of Houzz Service 2023',
  ],
  qsrClients: ['KFC', 'Taco Bell', 'Arby\u2019s', 'Winn-Dixie'],
} as const;

export const PRICE_RANGE = '$$$';

// ──────────────────────────────────────────────────────────────────────────────
// REVIEWS
// ──────────────────────────────────────────────────────────────────────────────
export const GOOGLE_PLACE_ID = 'ChIJG3X8o_OStokRzRynNBuVfQ0';
export const GOOGLE_REVIEWS_URL = `https://search.google.com/local/reviews?placeid=${GOOGLE_PLACE_ID}`;
export const GOOGLE_WRITE_REVIEW_URL = `https://search.google.com/local/writereview?placeid=${GOOGLE_PLACE_ID}`;
export const GOOGLE_MAPS_URL = `https://www.google.com/maps/place/?q=place_id:${GOOGLE_PLACE_ID}`;

export const AGGREGATE_RATING = {
  ratingValue: '4.4',
  bestRating: '5',
  worstRating: '1',
  reviewCount: '91',
} as const;

// ──────────────────────────────────────────────────────────────────────────────
// EXTERNAL PROFILES (sameAs)
// ──────────────────────────────────────────────────────────────────────────────
export const SOCIAL_PROFILES = {
  facebook: 'https://www.facebook.com/jwordenpaving/',
  instagram: 'https://www.instagram.com/jwordensons',
  linkedin: 'https://www.linkedin.com/showcase/j.-worden-%26-sons-paving-l.l.c./',
  youtube: 'https://www.youtube.com/@JWordenSons',
  tiktok: 'https://www.tiktok.com/@jwordenandsonspaving',
  twitter: 'https://twitter.com/JWordenSons',
} as const;

export const REVIEW_PROFILES = {
  google: GOOGLE_REVIEWS_URL,
  googleMaps: GOOGLE_MAPS_URL,
  houzz: 'https://www.houzz.com/professionals/paving-contractors/j-worden-sons-paving-pfvwus-pf~174057',
  bbb: 'https://www.bbb.org/us/va/chester/profile/paving-contractors/j-worden-and-sons-paving-llc',
  angi: 'https://www.angi.com/companylist/us/va/chester/j-worden-and-sons-paving-reviews-7601083.htm',
} as const;

/** Schema.org `sameAs` array — the entity-disambiguation glue. */
export const SAME_AS: readonly string[] = [
  REVIEW_PROFILES.google,
  REVIEW_PROFILES.googleMaps,
  REVIEW_PROFILES.houzz,
  REVIEW_PROFILES.bbb,
  REVIEW_PROFILES.angi,
  SOCIAL_PROFILES.facebook,
  SOCIAL_PROFILES.instagram,
  SOCIAL_PROFILES.linkedin,
  SOCIAL_PROFILES.youtube,
  SOCIAL_PROFILES.tiktok,
  SOCIAL_PROFILES.twitter,
];

// ──────────────────────────────────────────────────────────────────────────────
// SERVICES
// ──────────────────────────────────────────────────────────────────────────────
export const SERVICES_OFFERED = [
  'Commercial Parking Lot Installation',
  'Residential Driveway Installation',
  'Asphalt Sealcoating',
  'Asphalt Milling & Overlay',
  'ADA Striping',
  'Tar & Chip / Macadam Paving',
  'Asphalt Repair & Crack Filling',
  '6-Inch Structural Stone Base Paving',
  'QSR Fast-Track Development (90-Day)',
  'Masonry & Brick Paver Installation',
  'Roofing \u2014 TPO, EPDM, Modified Bitumen',
] as const;

// ──────────────────────────────────────────────────────────────────────────────
// SCHEMA.ORG @id ANCHORS (stable canonical IDs Google uses to dedupe entities)
// ──────────────────────────────────────────────────────────────────────────────
export const SCHEMA_IDS = {
  organization: `${SITE_URL}/#organization`,
  business: `${SITE_URL}/#business`,
  website: `${SITE_URL}/#website`,
  founder: `${SITE_URL}/about#founder`,
} as const;

// ──────────────────────────────────────────────────────────────────────────────
// COMPILE-TIME GUARD
// Anyone removing/renaming a required field will get a TypeScript error here
// before the change can ship. Add new required fields to BusinessInfoShape.
// ──────────────────────────────────────────────────────────────────────────────
export interface BusinessInfoShape {
  readonly siteUrl: string;
  readonly name: string;
  readonly legalName: string;
  readonly foundingYear: string;
  readonly ein: string;
  readonly founder: { readonly name: string; readonly jobTitle: string };
  readonly phoneDisplay: string;
  readonly phoneE164: string;
  readonly phoneSchema: string;
  readonly phoneHref: string;
  readonly email: string;
  readonly address: {
    readonly streetAddress: string;
    readonly addressLocality: string;
    readonly addressRegion: string;
    readonly postalCode: string;
    readonly addressCountry: string;
  };
  readonly geo: { readonly latitude: number; readonly longitude: number };
  readonly hoursDisplay: string;
  readonly googlePlaceId: string;
  readonly aggregateRating: {
    readonly ratingValue: string;
    readonly reviewCount: string;
  };
  readonly sameAs: readonly string[];
  readonly schemaIds: { readonly business: string; readonly organization: string };
}

const _shapeCheck: BusinessInfoShape = {
  siteUrl: SITE_URL,
  name: BUSINESS_NAME,
  legalName: BUSINESS_LEGAL_NAME,
  foundingYear: BUSINESS_FOUNDING_YEAR,
  ein: TAX_ID_EIN,
  founder: FOUNDER,
  phoneDisplay: PHONE_DISPLAY,
  phoneE164: PHONE_E164,
  phoneSchema: PHONE_SCHEMA,
  phoneHref: PHONE_HREF,
  email: EMAIL,
  address: ADDRESS,
  geo: GEO,
  hoursDisplay: HOURS_DISPLAY,
  googlePlaceId: GOOGLE_PLACE_ID,
  aggregateRating: AGGREGATE_RATING,
  sameAs: SAME_AS,
  schemaIds: SCHEMA_IDS,
};
void _shapeCheck;
