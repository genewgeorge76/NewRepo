export interface EliteBidInput {
  zip: string;
  sqft: number;
  type: 'commercial' | 'residential';
}

const BASE_RATE_PER_SQFT = {
  commercial: 7.4,
  residential: 5.6,
} as const;

const ZIP_MODIFIERS: Record<string, number> = {
  '23221': 1.08,
  '23220': 1.06,
  '23226': 1.07,
};

export const premiumSuite = {
  status: 'ACTIVE',
  calculateEliteBid(input: EliteBidInput): number {
    const typeRate = BASE_RATE_PER_SQFT[input.type] ?? BASE_RATE_PER_SQFT.commercial;
    const zipModifier = ZIP_MODIFIERS[input.zip] ?? 1;
    const subtotal = input.sqft * typeRate * zipModifier;

    // Includes mobilization, prep, and QC overhead for premium-tier estimates.
    const total = subtotal + 1450;

    return Math.round(total);
  },
};
