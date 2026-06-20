import type { LocationData } from './types.js';
import type { TenantConfig, CityConfig, ServiceArea } from './tenant.js';

export interface LocationDataWithRegion extends LocationData {
  region?: string;
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function buildLocationData(
  city: CityConfig,
  area: ServiceArea,
  tenant: TenantConfig,
): LocationDataWithRegion {
  const { business } = tenant;
  return {
    slug: city.slug,
    city: city.city,
    county: city.county,
    state: area.state,
    stateAbbr: area.stateAbbr,
    lat: city.lat,
    lng: city.lng,
    population: city.population,
    region: city.region,
    metaTitle: city.metaTitle ??
      `${cap(business.primaryTrade)} ${city.city} ${area.stateAbbr} | ${business.shortName} | ${business.phone}`,
    metaDescription: city.metaDescription ??
      `${business.shortName} — professional ${business.primaryTrade} contractors serving ${city.city}, ${area.stateAbbr}. Free estimates. ${business.phone}.`,
    h1: city.h1 ??
      `${cap(business.primaryTrade)} in ${city.city}, ${area.stateAbbr}`,
  };
}

/** All locations for a tenant, flattened across all service areas */
export function getLocationsForTenant(tenant: TenantConfig): LocationDataWithRegion[] {
  return tenant.serviceAreas.flatMap((area) =>
    area.cities.map((city) => buildLocationData(city, area, tenant))
  );
}

/** Look up a single location by slug across all service areas */
export function getLocationBySlug(slug: string, tenant: TenantConfig): LocationDataWithRegion | undefined {
  for (const area of tenant.serviceAreas) {
    const city = area.cities.find((c) => c.slug === slug);
    if (city) return buildLocationData(city, area, tenant);
  }
  return undefined;
}

/** Nearby locations: same region first, then same state, up to count */
export function getNearbyLocations(slug: string, tenant: TenantConfig, count = 6): LocationDataWithRegion[] {
  const target = getLocationBySlug(slug, tenant);
  if (!target) return [];
  const all = getLocationsForTenant(tenant);
  const sameRegion = all.filter((l) => l.slug !== slug && l.region === target.region);
  if (sameRegion.length >= 3) return sameRegion.slice(0, count);
  return all.filter((l) => l.slug !== slug && l.stateAbbr === target.stateAbbr).slice(0, count);
}

/** All locations for a given state abbreviation */
export function getLocationsByState(stateAbbr: string, tenant: TenantConfig): LocationDataWithRegion[] {
  return tenant.serviceAreas
    .filter((a) => a.stateAbbr === stateAbbr)
    .flatMap((area) => area.cities.map((city) => buildLocationData(city, area, tenant)));
}

/** All unique region names across a tenant's service areas */
export function getUniqueRegions(tenant: TenantConfig): string[] {
  const seen = new Set<string>();
  for (const area of tenant.serviceAreas) {
    for (const city of area.cities) {
      if (city.region) seen.add(city.region);
    }
  }
  return Array.from(seen);
}
