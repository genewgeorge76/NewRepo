import Anthropic from '@anthropic-ai/sdk';
import legacyData from '../data/legacyPortfolio.json';
import { sovereignElite } from '../logic/sovereignElite';
import { coastalEmpire } from '../utils/coastalLogic';

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || 'STANDBY_MODE',
  dangerouslyAllowBrowser: true,
});

function resolveHeritageSummary(): string {
  const heritage = legacyData.heritage as unknown;
  if (typeof heritage === 'string') return heritage;
  if (heritage && typeof heritage === 'object' && 'summary' in heritage) {
    const summary = (heritage as { summary?: unknown }).summary;
    return typeof summary === 'string' ? summary : 'Legacy heritage profile available.';
  }
  return 'Legacy heritage profile available.';
}

export class JWordenAI {
  static async generateAutonomousBid(targetAddress: string, estimatedSqFt: number) {
    const basePricePerSqFt = 2.5;
    const zonePremium = coastalEmpire.calculateZonePremium('Fredericksburg');
    const totalEstimate = estimatedSqFt * basePricePerSqFt * zonePremium;

    const systemPrompt = `
      You are JWordenAI, the autonomous bidding engine for J. Worden & Sons.
      Heritage: ${resolveHeritageSummary()}
      Legal Authority: ${sovereignElite.legal.clauses.join(', ')}
      VDOT Specs: ${coastalEmpire.vdotSpecs.mix} at ${coastalEmpire.vdotSpecs.temp}.
      Generate a hyper-persuasive executive summary for a paving contract at ${targetAddress} for $${totalEstimate}. Demand a 10% Stripe deposit.
    `;

    try {
      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        temperature: 0.2,
        system: 'You are the apex AI estimator for an elite national paving syndicate.',
        messages: [{ role: 'user', content: systemPrompt }],
      });

      return {
        totalEstimate,
        aiProposal: response.content[0].type === 'text' ? response.content[0].text : 'Error',
      };
    } catch (error) {
      console.error('AI Engine Failure:', error);
      return null;
    }
  }
}
