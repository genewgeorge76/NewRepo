#!/usr/bin/env node
/**
 * JWORDENAI: National 50-State Sitemap Generator
 * -----------------------------------------------
 * Generates public/sitemap.xml covering all existing routes plus
 * national expansion markets across all 50 states.
 *
 * Run: npm run build-sitemaps
 */

import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BASE = 'https://jwordenasphaltpaving.com';
const TODAY = new Date().toISOString().split('T')[0];

// ---------------------------------------------------------------------------
// URL entry builder
// ---------------------------------------------------------------------------
function url(loc, priority = '0.8', changefreq = 'monthly') {
  return `  <url><loc>${BASE}${loc}</loc><lastmod>${TODAY}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
}

// ---------------------------------------------------------------------------
// CORE PAGES
// ---------------------------------------------------------------------------
const corePages = [
  url('/', '1.0', 'weekly'),
  url('/services', '0.95', 'monthly'),
  url('/estimator', '0.95', 'monthly'),
  url('/gc-bid', '0.95', 'monthly'),
  url('/whale-hunter', '0.95', 'monthly'),
  url('/about', '0.9', 'monthly'),
  url('/contact', '0.9', 'monthly'),
  url('/commercial', '0.9', 'monthly'),
  url('/residential', '0.9', 'monthly'),
  url('/sealcoating', '0.9', 'monthly'),
  url('/masonry', '0.85', 'monthly'),
  url('/concrete', '0.85', 'monthly'),
  url('/roofing', '0.85', 'monthly'),
  url('/safety', '0.8', 'monthly'),
  url('/gallery', '0.8', 'monthly'),
  url('/standards', '0.8', 'monthly'),
  url('/pre-con', '0.8', 'monthly'),
  url('/weather-intel', '0.75', 'monthly'),
  url('/portal', '0.7', 'monthly'),
];

// ---------------------------------------------------------------------------
// VIRGINIA — Home State (full granular coverage)
// ---------------------------------------------------------------------------
const virginiaLocations = [
  // Richmond Metro (Tier 1 — Whale Zone)
  ['/locations/richmond', '0.95'],
  ['/locations/chesterfield', '0.95'],
  ['/locations/henrico', '0.95'],
  ['/locations/mechanicsville', '0.9'],
  ['/locations/midlothian', '0.9'],
  ['/locations/glen-allen', '0.9'],
  ['/locations/chester', '0.9'],
  ['/locations/short-pump', '0.85'],
  ['/locations/tuckahoe', '0.85'],
  ['/locations/bon-air', '0.85'],
  ['/locations/sandston', '0.85'],
  ['/locations/lakeside', '0.85'],
  ['/locations/stratford-hills', '0.85'],
  ['/locations/westham-parkway', '0.85'],
  ['/locations/windsor-farms', '0.85'],
  // Hampton Roads (Tier 1 — Whale Zone)
  ['/locations/virginia-beach', '0.9'],
  ['/locations/norfolk', '0.9'],
  ['/locations/hampton', '0.9'],
  ['/locations/chesapeake', '0.9'],
  ['/locations/portsmouth', '0.85'],
  ['/locations/suffolk', '0.85'],
  ['/locations/newportnews', '0.85'],
  ['/locations/williamsburg', '0.85'],
  // Northern Virginia / DC Corridor
  ['/locations/mclean', '0.85'],
  ['/locations/prince-william', '0.85'],
  ['/locations/fredericksburg', '0.85'],
  ['/locations/stafford', '0.85'],
  ['/locations/spotsylvania', '0.8'],
  ['/locations/warrenton', '0.8'],
  ['/locations/culpeper', '0.8'],
  ['/locations/king-george', '0.8'],
  // Southside & Rural
  ['/locations/colonial-heights', '0.85'],
  ['/locations/hopewell', '0.85'],
  ['/locations/petersburg', '0.85'],
  ['/locations/prince-george', '0.8'],
  ['/locations/dinwiddie', '0.8'],
  ['/locations/amelia', '0.8'],
  ['/locations/powhatan', '0.8'],
  ['/locations/goochland', '0.8'],
  ['/locations/caroline', '0.8'],
  ['/locations/hanover', '0.8'],
  ['/locations/ashland', '0.8'],
  ['/locations/new-kent', '0.8'],
  ['/locations/charles-city', '0.8'],
  ['/locations/cumberland', '0.8'],
  ['/locations/fluvanna', '0.8'],
  ['/locations/louisa', '0.8'],
  ['/locations/orange', '0.8'],
  ['/locations/king-william', '0.8'],
  ['/locations/sussex', '0.8'],
  ['/locations/moseley', '0.8'],
  ['/locations/standards', '0.7'],
  ['/locations/residential', '0.8'],
].map(([loc, priority]) => url(loc, priority));

// ---------------------------------------------------------------------------
// NATIONAL EXPANSION — All 50 States
// Priority tiers reflect KFC/KBP franchise density and market opportunity
// ---------------------------------------------------------------------------

// Tier 1 — Whale States: highest KFC/QSR franchise density
const tier1Markets = [
  // TEXAS
  ['/locations/houston', '0.9'],
  ['/locations/dallas', '0.9'],
  ['/locations/austin', '0.9'],
  ['/locations/san-antonio', '0.9'],
  ['/locations/fort-worth', '0.9'],
  ['/locations/el-paso', '0.85'],
  ['/locations/arlington-tx', '0.85'],
  ['/locations/corpus-christi', '0.8'],
  ['/locations/plano', '0.8'],
  ['/locations/lubbock', '0.8'],
  // FLORIDA
  ['/locations/miami', '0.9'],
  ['/locations/orlando', '0.9'],
  ['/locations/tampa', '0.9'],
  ['/locations/jacksonville', '0.9'],
  ['/locations/fort-lauderdale', '0.85'],
  ['/locations/west-palm-beach', '0.85'],
  ['/locations/tallahassee', '0.8'],
  ['/locations/clearwater', '0.8'],
  ['/locations/gainesville', '0.8'],
  ['/locations/pensacola', '0.8'],
  // GEORGIA
  ['/locations/atlanta', '0.9'],
  ['/locations/savannah', '0.85'],
  ['/locations/augusta', '0.8'],
  ['/locations/columbus-ga', '0.8'],
  ['/locations/macon', '0.8'],
  // NORTH CAROLINA
  ['/locations/charlotte', '0.9'],
  ['/locations/raleigh', '0.9'],
  ['/locations/greensboro', '0.85'],
  ['/locations/durham', '0.85'],
  ['/locations/winston-salem', '0.8'],
  ['/locations/fayetteville-nc', '0.8'],
  // MARYLAND / DC METRO
  ['/locations/baltimore', '0.9'],
  ['/locations/bethesda', '0.85'],
  ['/locations/rockville', '0.85'],
  ['/locations/silver-spring', '0.8'],
  ['/locations/annapolis', '0.8'],
  // PENNSYLVANIA
  ['/locations/philadelphia', '0.9'],
  ['/locations/pittsburgh', '0.9'],
  ['/locations/allentown', '0.8'],
  ['/locations/harrisburg', '0.8'],
  ['/locations/erie', '0.75'],
  // OHIO
  ['/locations/columbus-oh', '0.9'],
  ['/locations/cleveland', '0.9'],
  ['/locations/cincinnati', '0.85'],
  ['/locations/akron', '0.8'],
  ['/locations/dayton', '0.8'],
  // ILLINOIS
  ['/locations/chicago', '0.9'],
  ['/locations/naperville', '0.85'],
  ['/locations/aurora-il', '0.8'],
  ['/locations/rockford', '0.8'],
  ['/locations/springfield-il', '0.75'],
  // MICHIGAN
  ['/locations/detroit', '0.9'],
  ['/locations/grand-rapids', '0.85'],
  ['/locations/lansing', '0.8'],
  ['/locations/ann-arbor', '0.8'],
  ['/locations/sterling-heights', '0.75'],
  // TENNESSEE
  ['/locations/nashville', '0.9'],
  ['/locations/memphis', '0.9'],
  ['/locations/knoxville', '0.8'],
  ['/locations/chattanooga', '0.8'],
  ['/locations/clarksville', '0.75'],
  // INDIANA
  ['/locations/indianapolis', '0.9'],
  ['/locations/fort-wayne', '0.8'],
  ['/locations/evansville', '0.75'],
  ['/locations/south-bend', '0.75'],
  // MISSOURI
  ['/locations/st-louis', '0.9'],
  ['/locations/kansas-city', '0.9'],
  ['/locations/springfield-mo', '0.8'],
  ['/locations/columbia-mo', '0.75'],
  // KANSAS
  ['/locations/wichita', '0.85'],
  ['/locations/olathe', '0.85'],
  ['/locations/overland-park', '0.85'],
  ['/locations/topeka', '0.75'],
].map(([loc, priority]) => url(loc, priority));

// Tier 2 — Shark States: strong regional growth
const tier2Markets = [
  // ARIZONA
  ['/locations/phoenix', '0.85'],
  ['/locations/tucson', '0.8'],
  ['/locations/scottsdale', '0.8'],
  ['/locations/mesa', '0.8'],
  ['/locations/chandler', '0.75'],
  // COLORADO
  ['/locations/denver', '0.85'],
  ['/locations/colorado-springs', '0.8'],
  ['/locations/aurora-co', '0.8'],
  ['/locations/fort-collins', '0.75'],
  // WASHINGTON STATE
  ['/locations/seattle', '0.85'],
  ['/locations/spokane', '0.8'],
  ['/locations/tacoma', '0.8'],
  ['/locations/bellevue', '0.75'],
  // OREGON
  ['/locations/portland', '0.85'],
  ['/locations/salem', '0.75'],
  ['/locations/eugene', '0.75'],
  // NEVADA
  ['/locations/las-vegas', '0.85'],
  ['/locations/henderson', '0.8'],
  ['/locations/reno', '0.75'],
  // MINNESOTA
  ['/locations/minneapolis', '0.85'],
  ['/locations/st-paul', '0.85'],
  ['/locations/rochester-mn', '0.75'],
  // WISCONSIN
  ['/locations/milwaukee', '0.85'],
  ['/locations/madison', '0.8'],
  ['/locations/green-bay', '0.75'],
  // KENTUCKY
  ['/locations/louisville', '0.85'],
  ['/locations/lexington', '0.8'],
  ['/locations/bowling-green', '0.75'],
  // ALABAMA
  ['/locations/birmingham', '0.85'],
  ['/locations/montgomery', '0.8'],
  ['/locations/huntsville', '0.8'],
  ['/locations/mobile', '0.75'],
  // SOUTH CAROLINA
  ['/locations/columbia-sc', '0.85'],
  ['/locations/charleston', '0.85'],
  ['/locations/greenville-sc', '0.8'],
  // LOUISIANA
  ['/locations/new-orleans', '0.85'],
  ['/locations/baton-rouge', '0.85'],
  ['/locations/shreveport', '0.75'],
  // OKLAHOMA
  ['/locations/oklahoma-city', '0.85'],
  ['/locations/tulsa', '0.85'],
  ['/locations/norman', '0.75'],
  // ARKANSAS
  ['/locations/little-rock', '0.8'],
  ['/locations/fayetteville-ar', '0.75'],
  // WEST VIRGINIA
  ['/locations/charleston-wv', '0.8'],
  ['/locations/huntington-wv', '0.75'],
  // IOWA
  ['/locations/des-moines', '0.8'],
  ['/locations/cedar-rapids', '0.75'],
  // NEBRASKA
  ['/locations/omaha', '0.8'],
  ['/locations/lincoln', '0.75'],
  // NEW JERSEY
  ['/locations/newark', '0.85'],
  ['/locations/jersey-city', '0.8'],
  ['/locations/trenton', '0.75'],
  // NEW YORK
  ['/locations/new-york-city', '0.85'],
  ['/locations/buffalo', '0.8'],
  ['/locations/rochester-ny', '0.8'],
  ['/locations/syracuse', '0.75'],
  ['/locations/albany', '0.75'],
  // MASSACHUSETTS
  ['/locations/boston', '0.85'],
  ['/locations/worcester', '0.75'],
  ['/locations/springfield-ma', '0.75'],
  // CONNECTICUT
  ['/locations/hartford', '0.8'],
  ['/locations/bridgeport', '0.75'],
  ['/locations/new-haven', '0.75'],
  // DELAWARE
  ['/locations/wilmington', '0.8'],
  ['/locations/dover', '0.75'],
  // MISSISSIPPI
  ['/locations/jackson-ms', '0.8'],
  ['/locations/gulfport', '0.75'],
  // UTAH
  ['/locations/salt-lake-city', '0.8'],
  ['/locations/provo', '0.75'],
  ['/locations/west-jordan', '0.75'],
].map(([loc, priority]) => url(loc, priority));

// Tier 3 — Fish Markets: smaller state capital / growth markets
const tier3Markets = [
  // NEW MEXICO
  ['/locations/albuquerque', '0.75'],
  ['/locations/santa-fe', '0.7'],
  // IDAHO
  ['/locations/boise', '0.75'],
  ['/locations/nampa', '0.7'],
  // MONTANA
  ['/locations/billings', '0.7'],
  ['/locations/missoula', '0.7'],
  // NORTH DAKOTA
  ['/locations/fargo', '0.7'],
  ['/locations/bismarck', '0.7'],
  // SOUTH DAKOTA
  ['/locations/sioux-falls', '0.75'],
  ['/locations/rapid-city', '0.7'],
  // WYOMING
  ['/locations/cheyenne', '0.7'],
  ['/locations/casper', '0.65'],
  // ALASKA
  ['/locations/anchorage', '0.7'],
  // HAWAII
  ['/locations/honolulu', '0.7'],
  // MAINE
  ['/locations/portland-me', '0.7'],
  ['/locations/bangor', '0.65'],
  // NEW HAMPSHIRE
  ['/locations/manchester-nh', '0.7'],
  ['/locations/concord-nh', '0.65'],
  // VERMONT
  ['/locations/burlington-vt', '0.7'],
  // RHODE ISLAND
  ['/locations/providence', '0.7'],
].map(([loc, priority]) => url(loc, priority));

// ---------------------------------------------------------------------------
// Assemble final sitemap
// ---------------------------------------------------------------------------

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<!-- JWORDENAI: 50-State National Sitemap | Generated ${TODAY} | jwordenasphaltpaving.com -->
<!-- J. Worden & Sons Paving & General Contracting — 4th Generation, Since 1984 -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- ===== CORE PAGES ===== -->
${corePages.join('\n')}

  <!-- ===== VIRGINIA — HOME STATE (Full Coverage) ===== -->
${virginiaLocations.join('\n')}

  <!-- ===== NATIONAL EXPANSION — TIER 1 WHALE STATES ===== -->
  <!-- Texas, Florida, Georgia, North Carolina, Maryland, Pennsylvania, Ohio, Illinois, Michigan, Tennessee, Indiana, Missouri, Kansas -->
${tier1Markets.join('\n')}

  <!-- ===== NATIONAL EXPANSION — TIER 2 SHARK STATES ===== -->
  <!-- Arizona, Colorado, Washington, Oregon, Nevada, Minnesota, Wisconsin, Kentucky, Alabama, South Carolina, Louisiana, Oklahoma, Arkansas, WV, Iowa, Nebraska, NJ, NY, Massachusetts, Connecticut, Delaware, Mississippi, Utah -->
${tier2Markets.join('\n')}

  <!-- ===== NATIONAL EXPANSION — TIER 3 GROWTH MARKETS ===== -->
  <!-- New Mexico, Idaho, Montana, Dakotas, Wyoming, Alaska, Hawaii, Maine, New Hampshire, Vermont, Rhode Island -->
${tier3Markets.join('\n')}
</urlset>
`;

// ---------------------------------------------------------------------------
// Write output files
// ---------------------------------------------------------------------------

const sitemapPath = resolve(ROOT, 'public', 'sitemap.xml');
writeFileSync(sitemapPath, sitemap, 'utf8');
console.log(`JWORDENAI: ✅ sitemap.xml written → ${sitemapPath}`);
console.log(`  Core pages:             ${corePages.length}`);
console.log(`  Virginia locations:     ${virginiaLocations.length}`);
console.log(`  Tier 1 national markets:${tier1Markets.length}`);
console.log(`  Tier 2 national markets:${tier2Markets.length}`);
console.log(`  Tier 3 national markets:${tier3Markets.length}`);
console.log(`  TOTAL URLs:             ${corePages.length + virginiaLocations.length + tier1Markets.length + tier2Markets.length + tier3Markets.length}`);

const robotsTxt = `User-agent: *
Allow: /

# Block internal/operational routes from public crawl
Disallow: /admin
Disallow: /dashboard
Disallow: /field
Disallow: /dispatch
Disallow: /dispatch-node
Disallow: /profit-node
Disallow: /payroll-treasury
Disallow: /investor-roi
Disallow: /pre-con-dashboard
Disallow: /legal-compliance
Disallow: /litigation
Disallow: /command-bot
Disallow: /login
Disallow: /portal

Sitemap: https://jwordenasphaltpaving.com/sitemap.xml
`;

const robotsPath = resolve(ROOT, 'public', 'robots.txt');
writeFileSync(robotsPath, robotsTxt, 'utf8');
console.log(`JWORDENAI: ✅ robots.txt written → ${robotsPath}`);
