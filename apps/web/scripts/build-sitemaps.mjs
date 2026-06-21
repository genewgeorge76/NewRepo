#!/usr/bin/env node
/**
 * JWORDENAI: National 50-State Sitemap + robots.txt Generator
 * -----------------------------------------------------------
 * Generates public/sitemap.xml covering all app routes plus
 * 200+ national expansion markets across all 50 states.
 *
 * Base URL: uses VITE_SITE_URL env var, defaults to jwordenasphaltpaving.com
 * Run: npm run build-sitemaps
 */

import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BASE = process.env.VITE_SITE_URL?.replace(/\/$/, '') || 'https://jwordenasphaltpaving.com';
const TODAY = new Date().toISOString().split('T')[0];

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
  url('/about', '0.9', 'monthly'),
  url('/contact', '0.9', 'monthly'),
  url('/gallery', '0.85', 'monthly'),
  url('/blog', '0.85', 'weekly'),
  url('/photo-inspect', '0.8', 'monthly'),
  url('/locations', '0.9', 'monthly'),
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
  // Hampton Roads (Tier 1 — Whale Zone)
  ['/locations/virginia-beach', '0.9'],
  ['/locations/norfolk', '0.9'],
  ['/locations/hampton', '0.9'],
  ['/locations/chesapeake', '0.9'],
  ['/locations/portsmouth', '0.85'],
  ['/locations/suffolk', '0.85'],
  ['/locations/newport-news', '0.85'],
  ['/locations/williamsburg', '0.85'],
  // Northern Virginia / DC Corridor
  ['/locations/mclean', '0.85'],
  ['/locations/prince-william', '0.85'],
  ['/locations/fredericksburg', '0.85'],
  ['/locations/stafford', '0.85'],
  ['/locations/spotsylvania', '0.8'],
  ['/locations/warrenton', '0.8'],
  ['/locations/culpeper', '0.8'],
  // Southside & Rural
  ['/locations/colonial-heights', '0.85'],
  ['/locations/hopewell', '0.85'],
  ['/locations/petersburg', '0.85'],
  ['/locations/prince-george', '0.8'],
  ['/locations/dinwiddie', '0.8'],
  ['/locations/amelia', '0.8'],
  ['/locations/powhatan', '0.8'],
  ['/locations/goochland', '0.8'],
  ['/locations/hanover', '0.8'],
  ['/locations/ashland', '0.8'],
  ['/locations/moseley', '0.8'],
  ['/locations/charlottesville', '0.85'],
].map(([loc, priority]) => url(loc, priority));

// ---------------------------------------------------------------------------
// NATIONAL EXPANSION — Tier 1 Whale States
// Priority tiers reflect KFC/QSR franchise density and market opportunity
// ---------------------------------------------------------------------------
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
  // KANSAS
  ['/locations/wichita', '0.85'],
  ['/locations/olathe', '0.85'],
  ['/locations/overland-park', '0.85'],
  ['/locations/topeka', '0.75'],
].map(([loc, priority]) => url(loc, priority));

// ---------------------------------------------------------------------------
// NATIONAL EXPANSION — Tier 2 Shark States
// ---------------------------------------------------------------------------
const tier2Markets = [
  // ARIZONA
  ['/locations/phoenix', '0.85'],
  ['/locations/tucson', '0.8'],
  ['/locations/scottsdale', '0.8'],
  ['/locations/mesa', '0.8'],
  // COLORADO
  ['/locations/denver', '0.85'],
  ['/locations/colorado-springs', '0.8'],
  ['/locations/fort-collins', '0.75'],
  // WASHINGTON STATE
  ['/locations/seattle', '0.85'],
  ['/locations/spokane', '0.8'],
  ['/locations/tacoma', '0.8'],
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
  // ALABAMA
  ['/locations/birmingham', '0.85'],
  ['/locations/montgomery', '0.8'],
  ['/locations/huntsville', '0.8'],
  // SOUTH CAROLINA
  ['/locations/columbia-sc', '0.85'],
  ['/locations/charleston', '0.85'],
  ['/locations/greenville-sc', '0.8'],
  // LOUISIANA
  ['/locations/new-orleans', '0.85'],
  ['/locations/baton-rouge', '0.85'],
  // OKLAHOMA
  ['/locations/oklahoma-city', '0.85'],
  ['/locations/tulsa', '0.85'],
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
  ['/locations/albany', '0.75'],
  // MASSACHUSETTS
  ['/locations/boston', '0.85'],
  ['/locations/worcester', '0.75'],
  // CONNECTICUT
  ['/locations/hartford', '0.8'],
  ['/locations/bridgeport', '0.75'],
  // DELAWARE
  ['/locations/wilmington', '0.8'],
  // MISSISSIPPI
  ['/locations/jackson-ms', '0.8'],
  // UTAH
  ['/locations/salt-lake-city', '0.8'],
  ['/locations/provo', '0.75'],
  // ARKANSAS
  ['/locations/little-rock', '0.8'],
  // WEST VIRGINIA
  ['/locations/charleston-wv', '0.8'],
].map(([loc, priority]) => url(loc, priority));

// ---------------------------------------------------------------------------
// NATIONAL EXPANSION — Tier 3 Growth Markets
// ---------------------------------------------------------------------------
const tier3Markets = [
  ['/locations/albuquerque', '0.75'],
  ['/locations/santa-fe', '0.7'],
  ['/locations/boise', '0.75'],
  ['/locations/billings', '0.7'],
  ['/locations/fargo', '0.7'],
  ['/locations/sioux-falls', '0.75'],
  ['/locations/cheyenne', '0.7'],
  ['/locations/anchorage', '0.7'],
  ['/locations/honolulu', '0.7'],
  ['/locations/portland-me', '0.7'],
  ['/locations/manchester-nh', '0.7'],
  ['/locations/burlington-vt', '0.7'],
  ['/locations/providence', '0.7'],
].map(([loc, priority]) => url(loc, priority));

// ---------------------------------------------------------------------------
// Assemble sitemap
// ---------------------------------------------------------------------------
const totalUrls = corePages.length + virginiaLocations.length + tier1Markets.length + tier2Markets.length + tier3Markets.length;

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<!-- JWORDENAI: 50-State National Sitemap | Generated ${TODAY} | ${BASE} -->
<!-- J. Worden & Sons Paving & General Contracting — 4th Generation, Since 1984 -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- ===== CORE PAGES ===== -->
${corePages.join('\n')}

  <!-- ===== VIRGINIA — HOME STATE (Full Coverage) ===== -->
${virginiaLocations.join('\n')}

  <!-- ===== NATIONAL EXPANSION — TIER 1 WHALE STATES ===== -->
${tier1Markets.join('\n')}

  <!-- ===== NATIONAL EXPANSION — TIER 2 SHARK STATES ===== -->
${tier2Markets.join('\n')}

  <!-- ===== NATIONAL EXPANSION — TIER 3 GROWTH MARKETS ===== -->
${tier3Markets.join('\n')}
</urlset>
`;

mkdirSync(resolve(ROOT, 'public'), { recursive: true });
writeFileSync(resolve(ROOT, 'public', 'sitemap.xml'), sitemap, 'utf8');
console.log(`✅ sitemap.xml written (${totalUrls} URLs)`);
console.log(`   Core: ${corePages.length}  |  VA: ${virginiaLocations.length}  |  T1: ${tier1Markets.length}  |  T2: ${tier2Markets.length}  |  T3: ${tier3Markets.length}`);

// ---------------------------------------------------------------------------
// robots.txt
// ---------------------------------------------------------------------------
const robotsTxt = `User-agent: *
Allow: /

# Block private/operational routes from public crawl
Disallow: /command-center
Disallow: /client-portal
Disallow: /lms
Disallow: /lms-course

Sitemap: ${BASE}/sitemap.xml
`;

writeFileSync(resolve(ROOT, 'public', 'robots.txt'), robotsTxt, 'utf8');
console.log(`✅ robots.txt written`);
