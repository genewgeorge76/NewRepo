import {
  RESIDENTIAL_DENSITY,
  COMMERCIAL_DENSITY,
} from './constants.js';
import type { TradeSpec } from './types.js';

/** All supported trade types keyed by short identifier */
export const TRADES: Record<string, TradeSpec> = {
  // Paving & Asphalt
  asphalt_res: { label: 'Asphalt — Residential', category: 'paving', defaultDensity: RESIDENTIAL_DENSITY, unit: 'sqft', depthUnit: 'in', costLabel: '$/ton' },
  asphalt_com: { label: 'Asphalt — Commercial', category: 'paving', defaultDensity: COMMERCIAL_DENSITY, unit: 'sqft', depthUnit: 'in', costLabel: '$/ton' },
  sealcoat:   { label: 'Sealcoating', category: 'paving', defaultDensity: null, unit: 'sqft', depthUnit: null, costLabel: '$/sqft' },
  crack_fill: { label: 'Crack Filling', category: 'paving', defaultDensity: null, unit: 'lnft', depthUnit: null, costLabel: '$/lnft' },
  milling:    { label: 'Milling', category: 'paving', defaultDensity: null, unit: 'sqft', depthUnit: 'in', costLabel: '$/sqft' },
  striping:   { label: 'Line Striping', category: 'paving', defaultDensity: null, unit: 'lnft', depthUnit: null, costLabel: '$/lnft' },
  chip_seal:  { label: 'Chip Seal', category: 'paving', defaultDensity: null, unit: 'sqft', depthUnit: null, costLabel: '$/sqft' },
  // Concrete
  conc_flat:   { label: 'Flatwork', category: 'concrete', defaultDensity: 150, unit: 'sqft', depthUnit: 'in', costLabel: '$/yard' },
  conc_struct: { label: 'Structural', category: 'concrete', defaultDensity: 150, unit: 'sqft', depthUnit: 'in', costLabel: '$/yard' },
  conc_stamp:  { label: 'Stamped Concrete', category: 'concrete', defaultDensity: null, unit: 'sqft', depthUnit: null, costLabel: '$/sqft' },
  conc_curb:   { label: 'Curb & Gutter', category: 'concrete', defaultDensity: null, unit: 'lnft', depthUnit: null, costLabel: '$/lnft' },
  // Sitework
  grading: { label: 'Grading', category: 'sitework', defaultDensity: null, unit: 'sqft', depthUnit: null, costLabel: '$/sqft' },
  excav:   { label: 'Excavation', category: 'sitework', defaultDensity: null, unit: 'cuyd', depthUnit: null, costLabel: '$/cuyd' },
  demo:    { label: 'Demolition', category: 'sitework', defaultDensity: null, unit: 'sqft', depthUnit: null, costLabel: '$/sqft' },
  drain:   { label: 'Drainage', category: 'sitework', defaultDensity: null, unit: 'lnft', depthUnit: null, costLabel: '$/lnft' },
  retain:  { label: 'Retaining Walls', category: 'sitework', defaultDensity: null, unit: 'sqft', depthUnit: null, costLabel: '$/sqft' },
  // Roofing
  roof_shin:  { label: 'Shingle Roof', category: 'roofing', defaultDensity: null, unit: 'sqft', depthUnit: null, costLabel: '$/square' },
  roof_metal: { label: 'Metal Roof', category: 'roofing', defaultDensity: null, unit: 'sqft', depthUnit: null, costLabel: '$/sqft' },
  roof_flat:  { label: 'Flat/TPO Roof', category: 'roofing', defaultDensity: null, unit: 'sqft', depthUnit: null, costLabel: '$/sqft' },
  gutter:     { label: 'Gutters', category: 'roofing', defaultDensity: null, unit: 'lnft', depthUnit: null, costLabel: '$/lnft' },
  // Masonry
  brick: { label: 'Brick/Block', category: 'masonry', defaultDensity: null, unit: 'sqft', depthUnit: null, costLabel: '$/sqft' },
  stone: { label: 'Stone Work', category: 'masonry', defaultDensity: null, unit: 'sqft', depthUnit: null, costLabel: '$/sqft' },
  paver: { label: 'Pavers', category: 'masonry', defaultDensity: null, unit: 'sqft', depthUnit: null, costLabel: '$/sqft' },
};

/** Group trades by category for UI selects */
export const TRADES_BY_CATEGORY = Object.entries(TRADES).reduce<Record<string, Record<string, TradeSpec>>>(
  (acc, [key, spec]) => {
    if (!acc[spec.category]) acc[spec.category] = {};
    acc[spec.category][key] = spec;
    return acc;
  },
  {},
);
