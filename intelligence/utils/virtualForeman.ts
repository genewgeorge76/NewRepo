/**
 * JWORDENAI Voice Assistant v1.0
 * Logic: AI-Foreman Persona + Satellite Trigger
 * Node: Chester, VA HQ — 1601 Ware Bottom Spring Rd, Suite 214, Chester, VA 23836
 */

export interface LeadInfo {
  callerName: string;
  address: string;
  phone: string;
}

export interface KickservPayload {
  name: string;
  address: string;
  sqft: number;
  proofCity: string;
  status: string;
}

// Mock satellite measurement — returns estimated sq ft based on address keyword
function satelliteMeasure(address: string): number {
  const commercialKeywords = ['blvd', 'pkwy', 'plaza', 'way', 'dr', 'commercial', 'industrial'];
  const isCommercial = commercialKeywords.some((kw) => address.toLowerCase().includes(kw));
  return isCommercial ? Math.floor(Math.random() * 40000) + 10000 : Math.floor(Math.random() * 5000) + 1200;
}

// Mock history lookup — returns a nearby city name for social proof
function findNearbyHistory(address: string): string {
  const cities = ['Chester', 'Richmond', 'Midlothian', 'Chesterfield', 'Hopewell'];
  return cities.find((city) => address.includes(city)) ?? 'Chester';
}

// Mock Kickserv injection
function createKickservLead(payload: KickservPayload): void {
  console.log('[JWORDENAI → Kickserv] Lead injected:', payload);
}

export const virtualForeman = {
  voiceModel: 'Industrial-Professional-Male',
  hq: '1601 Ware Bottom Spring Rd, Suite 214, Chester, VA 23836',

  onIncomingCall: function (
    callerID: string,
    callerName: string,
    address: string,
  ): string {
    console.log(`[JWORDENAI Voice]: Incoming call from ${callerID} — ${callerName}`);

    const sqft = satelliteMeasure(address);
    const proofCity = findNearbyHistory(address);

    createKickservLead({
      name: callerName,
      address,
      sqft,
      proofCity,
      status: 'AI-Qualified',
    });

    return `Lead secured. ${sqft.toLocaleString()} sqft measured. Proof of work in ${proofCity} cited.`;
  },
};
