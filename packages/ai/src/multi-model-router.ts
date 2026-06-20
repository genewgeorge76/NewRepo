/**
 * Multi-Model Router
 *
 * Dispatches tasks to the best model for the job:
 *   - Bidding / proposals / knowledge     → Claude (claude-sonnet-4-6)
 *   - Vision / photo inspection           → OpenAI GPT-4o (when OPENAI_API_KEY set)
 *   - Specs / regulatory lookup           → Claude
 *   - Fast field responses / Jarvis chat  → Claude Haiku
 *
 * Latency target: <3s for chat, <10s for bid proposal.
 */

import { claudeChat, DEFAULT_MODEL, FAST_MODEL } from './claude.js';

export type TaskType =
  | 'chat'
  | 'bid-analysis'
  | 'proposal-draft'
  | 'spec-lookup'
  | 'field-quick'
  | 'seo-content';

interface RoutingResult {
  provider: 'claude' | 'openai';
  model: string;
  rationale: string;
}

export function routeTask(task: TaskType): RoutingResult {
  switch (task) {
    case 'field-quick':
    case 'chat':
      return { provider: 'claude', model: FAST_MODEL, rationale: 'Fast conversational response' };
    case 'bid-analysis':
    case 'proposal-draft':
    case 'spec-lookup':
    case 'seo-content':
    default:
      return { provider: 'claude', model: DEFAULT_MODEL, rationale: 'Full reasoning for complex task' };
  }
}

/** Route a text task to the appropriate model and return the response */
export async function routeToModel(
  task: TaskType,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  system?: string,
): Promise<string> {
  const route = routeTask(task);
  if (route.provider === 'claude') {
    return claudeChat(messages, system, route.model);
  }
  throw new Error(`Provider ${route.provider} not configured`);
}
