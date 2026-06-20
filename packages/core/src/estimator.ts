/**
 * Worden Standard Estimator — core pricing formulas.
 * Single source of truth for ALL apps (web, ops).
 *
 * Margin floor: 35%
 * Binder index: $627.50
 * Machine health: $0.08/ton
 * Oil shield buffer: ±$9/ton
 */

import {
  GROSS_MARGIN_FLOOR,
  BINDER_INDEX,
  MACHINE_HEALTH_PER_TON,
  OIL_SHIELD_BUFFER_PER_TON,
  LARGE_JOB_SQFT_THRESHOLD,
} from './constants.js';
import type { EstimateInput, EstimateOutput } from './types.js';

export function calculateTonnage(
  sqft: number,
  depthIn: number,
  density: number,
): number {
  return (sqft / 9) * depthIn * density / 24_000;
}

export function applyMarginFloor(subtotal: number, margin = GROSS_MARGIN_FLOOR): number {
  return subtotal / (1 - margin);
}

export function generateJobId(): string {
  const now = new Date();
  const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `WS-${ymd}-${rand}`;
}

export function calculateEstimate(
  input: EstimateInput,
  density: number | null,
): EstimateOutput {
  const { quantity, depthIn, costPerUnit, location = '', tradeKey } = input;

  let tonnage: number | null = null;
  let materialCost: number;
  let machineHealth = 0;

  if (density !== null && depthIn !== undefined && depthIn > 0) {
    tonnage = calculateTonnage(quantity, depthIn, density);
    const oilAdjustedCost = costPerUnit + OIL_SHIELD_BUFFER_PER_TON;
    materialCost = tonnage * oilAdjustedCost;
    machineHealth = tonnage * MACHINE_HEALTH_PER_TON;
  } else {
    materialCost = quantity * costPerUnit;
  }

  const subtotal = materialCost + machineHealth + BINDER_INDEX;
  const finalBid = applyMarginFloor(subtotal);

  return {
    id: generateJobId(),
    tradeLabel: tradeKey,
    quantity,
    tonnage,
    materialCost,
    binderCost: BINDER_INDEX,
    machineHealth,
    subtotal,
    finalBid,
    margin: GROSS_MARGIN_FLOOR,
    location,
    isLargeJob: quantity > LARGE_JOB_SQFT_THRESHOLD,
    generatedAt: new Date().toISOString(),
  };
}

export function formatDollars(n: number): string {
  return '$' + Number(n).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Weather paving go/no-go decision */
import {
  PAVING_MIN_TEMP_F,
  PAVING_CAUTION_TEMP_F,
  PAVING_MAX_PRECIP_PCT,
  PAVING_CAUTION_PRECIP_PCT,
  PAVING_MAX_WIND_MPH,
  PAVING_CAUTION_WIND_MPH,
} from './constants.js';
import type { PavingDecision } from './types.js';

export function pavingDecision(
  highF: number,
  precipPct: number,
  windMph: number,
): PavingDecision {
  if (precipPct > PAVING_MAX_PRECIP_PCT || highF < PAVING_MIN_TEMP_F || windMph > PAVING_MAX_WIND_MPH) {
    return 'NO-GO';
  }
  if (precipPct > PAVING_CAUTION_PRECIP_PCT || highF < PAVING_CAUTION_TEMP_F || windMph > PAVING_CAUTION_WIND_MPH) {
    return 'CAUTION';
  }
  return 'GO';
}
