/**
 * JWORDENAI Interactive 3D Estimator — Polygon-Based Pricing Engine
 *
 * Calculates area from polygon coordinates drawn on the map,
 * connects to the Dynamic Estimator pricing logic, and classifies
 * leads into Whale / Shark / Fish tiers.
 *
 * Standards: VDOT Section 315 · AASHTO T245 · Marshall Mix Design
 */

import {
  calculateEstimate,
  STATE_PRICE_MULTIPLIER,
  OIL_SHIELD_BUFFER_PER_TON,
  WORDEN_COMPACTION_FLOOR_PCT,
  SOVEREIGN_BASE_DEPTH_IN,
  type EstimateOutput,
} from './dynamicEstimator';

// ── Polygon area calculation ────────────────────────────────────────────────

/** Coordinate pair [lat, lng] as stored by Leaflet */
export type LatLng = [number, number];

/**
 * Calculate area of a polygon in square feet using the Shoelace formula
 * on projected coordinates. Converts lat/lng to approximate meters first,
 * then to square feet.
 *
 * Good enough for estimating purposes (±2% at mid-latitudes).
 */
export function calculatePolygonAreaSqFt(coords: LatLng[]): number {
  if (coords.length < 3) return 0;

  // Use centroid latitude for projection
  const avgLat = coords.reduce((s, c) => s + c[0], 0) / coords.length;
  const latRad = (avgLat * Math.PI) / 180;

  // Meters per degree at this latitude
  const metersPerDegLat = 111_132.92;
  const metersPerDegLng = 111_132.92 * Math.cos(latRad);

  // Project to meters relative to the first point
  const projected = coords.map((c) => ({
    x: (c[1] - coords[0][1]) * metersPerDegLng,
    y: (c[0] - coords[0][0]) * metersPerDegLat,
  }));

  // Shoelace formula for area in square meters
  let area = 0;
  for (let i = 0; i < projected.length; i++) {
    const j = (i + 1) % projected.length;
    area += projected[i].x * projected[j].y;
    area -= projected[j].x * projected[i].y;
  }
  area = Math.abs(area) / 2;

  // Convert square meters → square feet (1 m² = 10.7639 ft²)
  return Math.round(area * 10.7639);
}

// ── Service types for the estimator ──────────────────────────────────────────

export type ServiceType = 'new-install' | 'overlay' | 'repair' | 'sealcoat-only';

export interface EstimatorConfig {
  serviceType: ServiceType;
  surfaceDepthIn: number;
  includeBase: boolean;
  includeSeal: boolean;
  stateCode: string;
}

export const DEFAULT_CONFIG: EstimatorConfig = {
  serviceType: 'new-install',
  surfaceDepthIn: 2,
  includeBase: true,
  includeSeal: false,
  stateCode: 'VA',
};

// ── Estimate from polygon ────────────────────────────────────────────────────

export interface MapEstimateResult {
  sqFt: number;
  estimate: EstimateOutput;
  tier: 'whale' | 'shark' | 'fish';
  tierEmoji: string;
  tierLabel: string;
}

/**
 * Generate a full Worden Standard estimate from a drawn polygon and config.
 */
export function estimateFromPolygon(
  coords: LatLng[],
  config: EstimatorConfig = DEFAULT_CONFIG,
): MapEstimateResult | null {
  const sqFt = calculatePolygonAreaSqFt(coords);
  if (sqFt < 1) return null;

  // Use centroid latitude for projection.
  // NOTE: This uses a square root approximation to convert area (sqFt) into
  // length × width for the existing pricing engine. For irregular or elongated
  // shapes, material quantities may vary ±5% from actual — the on-site estimate
  // from a Worden estimator will provide the final verified quantities.
  const side = Math.sqrt(sqFt);
  const estimate = calculateEstimate({
    lengthFt: side,
    widthFt: side,
    surfaceDepthIn: config.surfaceDepthIn,
    includeBase: config.includeBase,
    includeSeal: config.includeSeal,
    stateCode: config.stateCode,
    serviceType: config.serviceType,
  });

  // Classify by project value (mirrors lead_scoring.py thresholds)
  const value = estimate.finalBidPrice;
  let tier: 'whale' | 'shark' | 'fish';
  let tierEmoji: string;
  let tierLabel: string;

  if (value >= 500_000) {
    tier = 'whale';
    tierEmoji = '🐋';
    tierLabel = 'Whale — Priority Dispatch';
  } else if (value >= 100_000) {
    tier = 'shark';
    tierEmoji = '🦈';
    tierLabel = 'Shark — Commercial Priority';
  } else {
    tier = 'fish';
    tierEmoji = '🐟';
    tierLabel = 'Standard Estimate';
  }

  return { sqFt, estimate, tier, tierEmoji, tierLabel };
}

// ── Lead data structure for capture ──────────────────────────────────────────

export interface LeadCapture {
  name: string;
  email: string;
  phone: string;
  address: string;
  stateCode: string;
  sqFt: number;
  estimatedValue: number;
  serviceType: ServiceType;
  tier: 'whale' | 'shark' | 'fish';
  timestamp: string;
}

/**
 * Format a captured lead for the leads_inbox.json pipeline.
 * Matches the schema expected by scripts/lead_scoring.py.
 */
export function formatLeadForPipeline(lead: LeadCapture) {
  const clientType =
    lead.estimatedValue >= 500_000
      ? 'commercial'
      : lead.estimatedValue >= 100_000
        ? 'commercial'
        : 'residential';

  return {
    lead_id: `WEB-${Date.now()}`,
    contact_name: lead.name,
    company: 'Website Lead',
    email: lead.email,
    phone: lead.phone,
    project_type: lead.serviceType === 'sealcoat-only' ? 'Sealcoating' : 'Asphalt Paving',
    estimated_value_usd: lead.estimatedValue,
    state: lead.stateCode,
    client_type: clientType,
    timeline_days: 30,
    notes: `Interactive 3D Estimator — ${lead.sqFt} sq ft — ${lead.address}`,
  };
}

// Re-export constants used by UI components
export {
  STATE_PRICE_MULTIPLIER,
  OIL_SHIELD_BUFFER_PER_TON,
  WORDEN_COMPACTION_FLOOR_PCT,
  SOVEREIGN_BASE_DEPTH_IN,
};
