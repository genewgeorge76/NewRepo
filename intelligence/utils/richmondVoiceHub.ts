/**
 * JWORDENAI Voice Hub Update
 * Node: Richmond Metro (804)
 */

import { virtualForeman } from './virtualForeman';

export const richmondVoiceHub = {
  activeNumber: '8044461296',
  primaryHQ: '1601 Ware Bottom Spring Rd, Suite 214, Chester, VA 23836',

  matchCityNode: function (address: string): string {
    // Match against the 72-city SEO grid
    const cities = ['Chester', 'Richmond', 'Midlothian', 'Petersburg', 'Hopewell'];
    const matchedCity = cities.find((city) => address.includes(city)) ?? 'Richmond Metro Area';
    return matchedCity;
  },

  onCallReceived: function (leadInfo: {
    callerName: string;
    address: string;
    phone: string;
  }): string {
    console.log(`[JWORDENAI]: Incoming 804 Lead. Activating Richmond-specific logic.`);

    // Auto-reference 72-city SEO grid
    const cityNode = this.matchCityNode(leadInfo.address);
    console.log(`[JWORDENAI-SEO]: Matched lead to SEO Node: ${cityNode}`);

    // Trigger "Satellite Auto-Measure" for the Richmond Metro area
    const sweepResult = virtualForeman.onIncomingCall(
      leadInfo.phone,
      leadInfo.callerName,
      leadInfo.address,
    );

    return `Richmond Lead captured on 804-446-1296. City Node: ${cityNode}. Synced to Kickserv. ${sweepResult}`;
  },
};
