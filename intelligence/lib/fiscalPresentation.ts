/**
 * JWORDENAI: FISCAL PRESENTATION ENGINE
 * Logic: Asset Longevity vs. Recurring CapEx Expense
 *
 * Demonstrates how the Worden Standard (96% Marshall, VDOT-grade base) reduces
 * long-term depreciation and eliminates unnecessary repave cycles for portfolio clients.
 */

// ── Depreciation constants ────────────────────────────────────────────────────

/** Annual asset depreciation rate for generic/unmanaged parking lots */
const STANDARD_DEPRECIATION_RATE = 0.15;

/** Annual asset depreciation rate under the JWORDENAI maintenance standard */
const JWORDENAI_DEPRECIATION_RATE = 0.04;

/** Baseline full repave cost per site (USD) */
const REPAVE_COST_PER_SITE = 76_000;

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AssetHealthResult {
  /** Annual depreciation rate applied to the asset */
  annualDepreciationRate: number;
  /** Human-readable label */
  standard: "JWORDENAI Standard" | "Generic / No Maintenance Program";
}

export interface CEOPortfolioReport {
  /** Total estimated portfolio savings vs. recurring repave cycles (USD) */
  totalPortfolioSavings: number;
  /** Per-site savings (USD) */
  savingsPerStore: number;
  /** Executive summary message */
  message: string;
}

// ── Core logic ────────────────────────────────────────────────────────────────

export const JWORDENAI_Fiscal_Logic = {
  /**
   * Returns the applicable annual depreciation rate for a paved asset.
   *
   * Depreciation is modelled as a flat annual rate for simplicity. Pavement age
   * (`yearsSincePour`) is used to apply an accelerated-degradation multiplier
   * after 15 years without a maintenance program — a well-documented inflection
   * point in VDOT Pavement Management data.
   *
   * @param yearsSincePour  - Age of the pavement surface in years
   * @param maintenanceHistory - `true` if site is enrolled in JWORDENAI maintenance program
   */
  calculateAssetHealth: (
    yearsSincePour: number,
    maintenanceHistory: boolean
  ): AssetHealthResult => {
    if (maintenanceHistory) {
      return {
        annualDepreciationRate: JWORDENAI_DEPRECIATION_RATE,
        standard: "JWORDENAI Standard",
      };
    }

    // After 15 years without maintenance, degradation accelerates — apply a 1.5×
    // multiplier capped at 100 % to model the well-documented VDOT pavement
    // management inflection point.
    const accelerated = yearsSincePour > 15
      ? Math.min(STANDARD_DEPRECIATION_RATE * 1.5, 1.0)
      : STANDARD_DEPRECIATION_RATE;

    return {
      annualDepreciationRate: accelerated,
      standard: "Generic / No Maintenance Program",
    };
  },

  /**
   * Generates a C-suite portfolio savings report.
   *
   * **Simplified model**: savings represent one avoided full-repave cycle per
   * site. The depreciation rates in `calculateAssetHealth` quantify the ongoing
   * asset-value benefit; this method captures the discrete CapEx avoidance — i.e.
   * the JWORDENAI program converts the initial investment into a one-time event
   * rather than a recurring capital expense.
   *
   * @param storeCount - Number of locations in the client's portfolio
   */
  generateCEOReport: (storeCount: number): CEOPortfolioReport => {
    const savingsPerStore = REPAVE_COST_PER_SITE; // One full repave cycle avoided per site
    const totalPortfolioSavings = storeCount * savingsPerStore;
    const costLabel = `$${(REPAVE_COST_PER_SITE / 1_000).toFixed(0)}k`;

    return {
      totalPortfolioSavings,
      savingsPerStore,
      message: `JWORDENAI makes the ${costLabel} investment a necessity of one, not a cycle of many.`,
    };
  },
} as const;
