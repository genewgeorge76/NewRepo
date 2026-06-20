import type { TenantConfig } from '../tenant.js';

export const JWORDEN_TENANT: TenantConfig = {
  id: 'jworden',

  business: {
    name: 'J. Worden & Sons Paving & General Contracting',
    shortName: 'J. Worden & Sons',
    phone: '(804) 446-1296',
    phoneE164: '+18044461296',
    email: 'info@jwordenasphaltpaving.com',
    address: '10800 Midlothian Turnpike',
    addressCity: 'North Chesterfield',
    addressState: 'Virginia',
    addressStateAbbr: 'VA',
    addressZip: '23235',
    website: 'https://www.jwordenasphaltpaving.com',
    founded: 1984,
    generation: '4th-generation',
    primaryTrade: 'asphalt paving',
    tradeLabel: 'Paving & General Contracting',
  },

  branding: {
    primaryColor: '#f5a623',
    accentColor: '#f5a623',
    tagline: "Virginia's Asphalt Paving Experts",
    ratingValue: '4.9',
    ratingCount: 312,
  },

  compliance: {
    licenseStatement: 'Class A Virginia Contractor License',
    bond: 'Fully bonded & insured ($2M liability)',
    bbbRating: 'BBB A+ Rating since 1994',
    trustSignals: [
      'Class A Virginia Contractor License',
      'BBB A+ Rating since 1994',
      'Fully bonded & insured ($2M liability)',
      '4th-generation family business since 1984',
      'VDOT pre-qualified',
      '96% Marshall compaction on every job',
    ],
  },

  pricing: {
    residentialSqftMin: 3.50,
    residentialSqftMax: 7.00,
    depositPct: 0.20,
  },

  engineering: {
    compactionPct: 96,
    baseDepthIn: 6,
    baseSpec: 'VDOT Section 315 #21A Stone',
    wearingCourse: '2-inch minimum SM-9.5A',
    oilShieldPerTon: 9,
    marginFloor: 0.35,
    specs: [
      ['Base Specification', 'VDOT Section 315 #21A Stone'],
      ['Minimum Base Depth', '6 inches compacted'],
      ['Compaction Floor', '96% Marshall Unit Weight'],
      ['Wearing Course', '2-inch minimum SM-9.5A'],
      ['Binder Price Lock', '±$9/ton oil shield'],
      ['Margin Floor', '35% gross — no exceptions'],
    ],
  },

  services: [
    { title: 'Asphalt Driveway Installation', desc: '2-inch minimum wearing course over 6-inch #21A stone base. 96% Marshall compaction guaranteed.' },
    { title: 'Commercial Parking Lots', desc: 'Full-depth construction, milling & overlay, ADA-compliant striping, drainage engineering.' },
    { title: 'Sealcoating', desc: 'Coal-tar or asphalt-based sealer with 30% sand additive. Extends pavement life 3–5 years.' },
    { title: 'Crack Filling & Repair', desc: 'Hot-pour rubberized crack filler. Stops water infiltration before it reaches your base.' },
    { title: 'Milling & Resurfacing', desc: 'Cold-plane milling to precise depth. Reclaim your existing base — cost-effective alternative to full removal.' },
    { title: 'Striping & ADA Compliance', desc: 'Thermoplastic or paint. ADA stalls, fire lanes, loading zones, directional arrows.' },
  ],

  serviceAreas: [
    {
      state: 'Virginia',
      stateAbbr: 'VA',
      cities: [
        // ── Greater Richmond ──────────────────────────────────────────────────
        { slug: 'richmond', city: 'Richmond', county: 'City of Richmond', lat: 37.5407, lng: -77.4360, population: 226610, region: 'Greater Richmond' },
        { slug: 'henrico', city: 'Henrico', county: 'Henrico County', lat: 37.5499, lng: -77.3459, population: 334389, region: 'Greater Richmond' },
        { slug: 'midlothian', city: 'Midlothian', county: 'Chesterfield County', lat: 37.4935, lng: -77.6441, population: 65985, region: 'Greater Richmond' },
        { slug: 'glen-allen', city: 'Glen Allen', county: 'Henrico County', lat: 37.6626, lng: -77.4958, population: 19113, region: 'Greater Richmond' },
        { slug: 'mechanicsville', city: 'Mechanicsville', county: 'Hanover County', lat: 37.6087, lng: -77.3736, population: 36348, region: 'Greater Richmond' },
        { slug: 'short-pump', city: 'Short Pump', county: 'Henrico County', lat: 37.6516, lng: -77.6135, population: 24000, region: 'Greater Richmond' },
        { slug: 'bon-air', city: 'Bon Air', county: 'Chesterfield County', lat: 37.5079, lng: -77.5724, population: 16000, region: 'Greater Richmond' },
        { slug: 'lakeside', city: 'Lakeside', county: 'Henrico County', lat: 37.6003, lng: -77.4631, population: 11000, region: 'Greater Richmond' },
        { slug: 'sandston', city: 'Sandston', county: 'Henrico County', lat: 37.5240, lng: -77.3128, population: 8200, region: 'Greater Richmond' },
        { slug: 'tuckahoe', city: 'Tuckahoe', county: 'Henrico County', lat: 37.5840, lng: -77.5750, population: 48000, region: 'Greater Richmond' },
        { slug: 'stratford-hills', city: 'Stratford Hills', county: 'City of Richmond', lat: 37.5230, lng: -77.4970, population: 9000, region: 'Greater Richmond' },
        { slug: 'westham-parkway', city: 'Westham Parkway', county: 'Henrico County', lat: 37.5910, lng: -77.5700, population: 6000, region: 'Greater Richmond' },
        { slug: 'windsor-farms', city: 'Windsor Farms', county: 'City of Richmond', lat: 37.5480, lng: -77.5090, population: 5000, region: 'Greater Richmond' },

        // ── Tri-Cities / Chesterfield ──────────────────────────────────────────
        { slug: 'chester', city: 'Chester', county: 'Chesterfield County', lat: 37.3565, lng: -77.4427, population: 21200, region: 'Tri-Cities' },
        { slug: 'chesterfield', city: 'Chesterfield', county: 'Chesterfield County', lat: 37.3765, lng: -77.5352, population: 367766, region: 'Tri-Cities' },
        { slug: 'colonial-heights', city: 'Colonial Heights', county: 'City of Colonial Heights', lat: 37.2598, lng: -77.4016, population: 18720, region: 'Tri-Cities' },
        { slug: 'hopewell', city: 'Hopewell', county: 'City of Hopewell', lat: 37.3043, lng: -77.2877, population: 23900, region: 'Tri-Cities' },
        { slug: 'petersburg', city: 'Petersburg', county: 'City of Petersburg', lat: 37.2279, lng: -77.4019, population: 33000, region: 'Tri-Cities' },
        { slug: 'moseley', city: 'Moseley', county: 'Chesterfield County', lat: 37.4190, lng: -77.7300, population: 9000, region: 'Tri-Cities' },
        { slug: 'dinwiddie', city: 'Dinwiddie', county: 'Dinwiddie County', lat: 37.0720, lng: -77.5870, population: 29000, region: 'Tri-Cities' },
        { slug: 'prince-george', city: 'Prince George', county: 'Prince George County', lat: 37.2200, lng: -77.1400, population: 40100, region: 'Tri-Cities' },
        { slug: 'sussex', city: 'Sussex', county: 'Sussex County', lat: 36.9120, lng: -77.2750, population: 11000, region: 'Tri-Cities' },

        // ── Hampton Roads ─────────────────────────────────────────────────────
        { slug: 'virginia-beach', city: 'Virginia Beach', county: 'City of Virginia Beach', lat: 36.8529, lng: -75.9780, population: 459000, region: 'Hampton Roads' },
        { slug: 'norfolk', city: 'Norfolk', county: 'City of Norfolk', lat: 36.8508, lng: -76.2859, population: 238005, region: 'Hampton Roads' },
        { slug: 'chesapeake', city: 'Chesapeake', county: 'City of Chesapeake', lat: 36.7682, lng: -76.2875, population: 249422, region: 'Hampton Roads' },
        { slug: 'newportnews', city: 'Newport News', county: 'City of Newport News', lat: 37.0871, lng: -76.4730, population: 186247, region: 'Hampton Roads' },
        { slug: 'hampton', city: 'Hampton', county: 'City of Hampton', lat: 37.0299, lng: -76.3452, population: 137436, region: 'Hampton Roads' },
        { slug: 'portsmouth', city: 'Portsmouth', county: 'City of Portsmouth', lat: 36.8354, lng: -76.2983, population: 97680, region: 'Hampton Roads' },
        { slug: 'suffolk', city: 'Suffolk', county: 'City of Suffolk', lat: 36.7282, lng: -76.5890, population: 94384, region: 'Hampton Roads' },
        { slug: 'williamsburg', city: 'Williamsburg', county: 'City of Williamsburg', lat: 37.2707, lng: -76.7074, population: 15425, region: 'Hampton Roads' },

        // ── Northern Virginia ─────────────────────────────────────────────────
        { slug: 'fredericksburg', city: 'Fredericksburg', county: 'City of Fredericksburg', lat: 38.3032, lng: -77.4605, population: 29000, region: 'Northern Virginia' },
        { slug: 'spotsylvania', city: 'Spotsylvania', county: 'Spotsylvania County', lat: 38.1910, lng: -77.6580, population: 140000, region: 'Northern Virginia' },
        { slug: 'stafford', city: 'Stafford', county: 'Stafford County', lat: 38.4220, lng: -77.4080, population: 155000, region: 'Northern Virginia' },
        { slug: 'caroline', city: 'Caroline', county: 'Caroline County', lat: 38.0190, lng: -77.3780, population: 31000, region: 'Northern Virginia' },
        { slug: 'king-george', city: 'King George', county: 'King George County', lat: 38.2710, lng: -77.1190, population: 26000, region: 'Northern Virginia' },
        { slug: 'orange', city: 'Orange', county: 'Orange County', lat: 38.2450, lng: -78.1120, population: 37000, region: 'Northern Virginia' },
        { slug: 'culpeper', city: 'Culpeper', county: 'Culpeper County', lat: 38.4730, lng: -77.9970, population: 54000, region: 'Northern Virginia' },
        { slug: 'warrenton', city: 'Warrenton', county: 'Fauquier County', lat: 38.7170, lng: -77.7970, population: 10200, region: 'Northern Virginia' },
        { slug: 'mclean', city: 'McLean', county: 'Fairfax County', lat: 38.9340, lng: -77.1770, population: 48000, region: 'Northern Virginia' },
        { slug: 'prince-william', city: 'Prince William', county: 'Prince William County', lat: 38.7060, lng: -77.5000, population: 480000, region: 'Northern Virginia' },

        // ── Surrounding Counties ──────────────────────────────────────────────
        { slug: 'hanover', city: 'Hanover', county: 'Hanover County', lat: 37.7551, lng: -77.3736, population: 107000, region: 'Surrounding Counties' },
        { slug: 'ashland', city: 'Ashland', county: 'Hanover County', lat: 37.7598, lng: -77.4797, population: 8108, region: 'Surrounding Counties' },
        { slug: 'goochland', city: 'Goochland', county: 'Goochland County', lat: 37.6762, lng: -77.8969, population: 24000, region: 'Surrounding Counties' },
        { slug: 'powhatan', city: 'Powhatan', county: 'Powhatan County', lat: 37.5529, lng: -77.9152, population: 30000, region: 'Surrounding Counties' },
        { slug: 'new-kent', city: 'New Kent', county: 'New Kent County', lat: 37.5210, lng: -76.9810, population: 23100, region: 'Surrounding Counties' },
        { slug: 'amelia', city: 'Amelia', county: 'Amelia County', lat: 37.3400, lng: -77.9850, population: 13100, region: 'Surrounding Counties' },
        { slug: 'charles-city', city: 'Charles City', county: 'Charles City County', lat: 37.3310, lng: -77.0570, population: 7100, region: 'Surrounding Counties' },
        { slug: 'cumberland', city: 'Cumberland', county: 'Cumberland County', lat: 37.5130, lng: -78.2630, population: 10100, region: 'Surrounding Counties' },
        { slug: 'fluvanna', city: 'Fluvanna', county: 'Fluvanna County', lat: 37.8370, lng: -78.2690, population: 28000, region: 'Surrounding Counties' },
        { slug: 'louisa', city: 'Louisa', county: 'Louisa County', lat: 38.0250, lng: -78.0000, population: 38000, region: 'Surrounding Counties' },
        { slug: 'king-william', city: 'King William', county: 'King William County', lat: 37.7420, lng: -77.0950, population: 17400, region: 'Surrounding Counties' },
        { slug: 'charlottesville', city: 'Charlottesville', county: 'City of Charlottesville', lat: 38.0293, lng: -78.4767, population: 46500, region: 'Surrounding Counties' },
      ],
    },
  ],
};
