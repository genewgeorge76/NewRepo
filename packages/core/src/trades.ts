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
  // Electrical
  elec_rough:  { label: 'Electrical Rough-In', category: 'electrical', defaultDensity: null, unit: 'sqft', depthUnit: null, costLabel: '$/sqft' },
  elec_panel:  { label: 'Panel Upgrade', category: 'electrical', defaultDensity: null, unit: 'unit', depthUnit: null, costLabel: '$/panel' },
  solar:       { label: 'Solar Install', category: 'electrical', defaultDensity: null, unit: 'unit', depthUnit: null, costLabel: '$/watt' },
  ev_charger:  { label: 'EV Charger', category: 'electrical', defaultDensity: null, unit: 'unit', depthUnit: null, costLabel: '$/unit' },
  // Plumbing
  plmb_rough: { label: 'Plumbing Rough-In', category: 'plumbing', defaultDensity: null, unit: 'unit', depthUnit: null, costLabel: '$/fixture' },
  plmb_pipe:  { label: 'Re-Pipe', category: 'plumbing', defaultDensity: null, unit: 'lnft', depthUnit: null, costLabel: '$/lnft' },
  plmb_sewer: { label: 'Sewer Line', category: 'plumbing', defaultDensity: null, unit: 'lnft', depthUnit: null, costLabel: '$/lnft' },
  // HVAC
  hvac_sys:  { label: 'HVAC System', category: 'hvac', defaultDensity: null, unit: 'unit', depthUnit: null, costLabel: '$/ton' },
  hvac_duct: { label: 'Ductwork', category: 'hvac', defaultDensity: null, unit: 'lnft', depthUnit: null, costLabel: '$/lnft' },
  // Carpentry
  frame: { label: 'Framing', category: 'carpentry', defaultDensity: null, unit: 'sqft', depthUnit: null, costLabel: '$/sqft' },
  deck:  { label: 'Decking', category: 'carpentry', defaultDensity: null, unit: 'sqft', depthUnit: null, costLabel: '$/sqft' },
  trim:  { label: 'Trim Work', category: 'carpentry', defaultDensity: null, unit: 'lnft', depthUnit: null, costLabel: '$/lnft' },
  // Painting
  paint_in: { label: 'Interior Painting', category: 'painting', defaultDensity: null, unit: 'sqft', depthUnit: null, costLabel: '$/sqft' },
  paint_ex: { label: 'Exterior Painting', category: 'painting', defaultDensity: null, unit: 'sqft', depthUnit: null, costLabel: '$/sqft' },
  // Landscaping
  land:  { label: 'Full Landscape Install', category: 'landscaping', defaultDensity: null, unit: 'sqft', depthUnit: null, costLabel: '$/sqft' },
  fence: { label: 'Fencing', category: 'landscaping', defaultDensity: null, unit: 'lnft', depthUnit: null, costLabel: '$/lnft' },
  tree:  { label: 'Tree Removal', category: 'landscaping', defaultDensity: null, unit: 'unit', depthUnit: null, costLabel: '$/tree' },
  // Interior Finishes
  drywall:   { label: 'Drywall', category: 'interior', defaultDensity: null, unit: 'sqft', depthUnit: null, costLabel: '$/sqft' },
  floor_hw:  { label: 'Hardwood Flooring', category: 'interior', defaultDensity: null, unit: 'sqft', depthUnit: null, costLabel: '$/sqft' },
  floor_tile:{ label: 'Tile Flooring', category: 'interior', defaultDensity: null, unit: 'sqft', depthUnit: null, costLabel: '$/sqft' },
  insul:     { label: 'Insulation', category: 'interior', defaultDensity: null, unit: 'sqft', depthUnit: null, costLabel: '$/sqft' },
  // Specialty
  weld:     { label: 'Welding / Fabrication', category: 'specialty', defaultDensity: null, unit: 'hr', depthUnit: null, costLabel: '$/hr' },
  pool:     { label: 'Pool Construction', category: 'specialty', defaultDensity: null, unit: 'sqft', depthUnit: null, costLabel: '$/sqft' },
  epoxy:    { label: 'Epoxy Floor Coating', category: 'specialty', defaultDensity: null, unit: 'sqft', depthUnit: null, costLabel: '$/sqft' },
  pressure: { label: 'Pressure Washing', category: 'specialty', defaultDensity: null, unit: 'sqft', depthUnit: null, costLabel: '$/sqft' },
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
