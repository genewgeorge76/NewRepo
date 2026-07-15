export const negotiationCloser = {
  floorConfig: {
    minMargin: 0.12, // 12% absolute profit floor
    materialCostTon: 115.0, // Grandfathered SM-9.5A rate
    laborDayRate: 4200.0, // Full crew/equipment daily burn
  },

  calculateBottomDollar: (tonnage: number, days: number, zonePremium = 1.0) => {
    void zonePremium;
    const rawMaterial = tonnage * negotiationCloser.floorConfig.materialCostTon;
    const rawLabor = days * negotiationCloser.floorConfig.laborDayRate;
    const operationalFloor =
      (rawMaterial + rawLabor) * (1 + negotiationCloser.floorConfig.minMargin);

    // Bottom Dollar ignores the 35% Zone Premium to secure the win
    return Math.ceil(operationalFloor);
  },

  getClosingScript: (
    accountName: string,
    standardPrice: number,
    bottomDollar: number,
  ) => {
    const savings = standardPrice - bottomDollar;
    return `
      "Peggy, as a 4th-generation contractor, my goal isn't just a job; it's the partnership.
      For ${accountName}, I'm applying the 'Grandfather Standard.'
      I've authorized a bottom-dollar adjustment of $${savings.toLocaleString()}.
      This gets you our 96% Marshall Density work at my legacy cost.
      Do we have a deal?"
    `;
  },
};
