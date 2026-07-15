/**
 * ============================================================================
 * PROPRIETARY AND CONFIDENTIAL
 * Copyright (c) 2026 Gene W. George / J. Worden & Sons Paving LLC.
 * All Rights Reserved.
 *
 * Unauthorized copying of this file, via any medium, is strictly prohibited.
 * The algorithms, pricing models, and logic contained herein ("JWORDENAI")
 * are the exclusive property of Gene W. George.
 * ============================================================================
 */

/**
 * JWORDENAI Labor & Subcontractor Treasury Engine
 * Objective: Real-time OT Burn Tracking & Automated 1099 Payouts
 */
export const payrollTreasury = {
  monitorOTBurnRate: function(crewId: string, currentHours: number) {
    if (currentHours >= 38) {
      return `[MARGIN ALERT]: Crew ${crewId} is 2 hours from OT. Pull from site to protect 35% margin.`;
    }
    return `Crew ${crewId} hours nominal (${currentHours}h).`;
  },

  calculateSubPayout: function(tonsLaid: number, subRatePerTon: number) {
    const payout = tonsLaid * subRatePerTon;
    return `Generate 1099 Payout: $${payout.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} for ${tonsLaid} tons.`;
  },

  marginAuditLock: function(estimatedBid: number, actualLaborCost: number, actualMaterialCost: number) {
    if (estimatedBid <= 0) {
      return `[CFO AUDIT REQUIRED]: Invalid estimated bid value.`;
    }
    const totalActualCost = actualLaborCost + actualMaterialCost;
    if (totalActualCost > estimatedBid) {
      const overrun = (totalActualCost - estimatedBid).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
      return `[CFO AUDIT REQUIRED]: Project over budget by $${overrun}. Margin is negative.`;
    }
    const actualMargin = ((estimatedBid - totalActualCost) / estimatedBid) * 100;
    if (actualMargin < 35) {
      return `[CFO AUDIT REQUIRED]: Margin dropped to ${actualMargin.toFixed(2)}%. Below 35% threshold.`;
    }
    return `Margin Secured: ${actualMargin.toFixed(2)}%.`;
  },
};
