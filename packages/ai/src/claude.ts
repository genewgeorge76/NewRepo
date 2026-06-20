/**
 * Claude client factory — claude-sonnet-4-6 is the platform default.
 * All server-side callers import from here so the model ID stays in one place.
 */

import Anthropic from '@anthropic-ai/sdk';

export const DEFAULT_MODEL = 'claude-sonnet-4-6';
export const FAST_MODEL = 'claude-haiku-4-5-20251001';

let _client: Anthropic | null = null;

export function getClaudeClient(): Anthropic {
  if (!_client) {
    const apiKey = typeof process !== 'undefined' ? process.env.ANTHROPIC_API_KEY : undefined;
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');
    _client = new Anthropic({ apiKey });
  }
  return _client;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/** One-shot text completion via Claude */
export async function claudeChat(
  messages: ChatMessage[],
  system?: string,
  model = DEFAULT_MODEL,
  maxTokens = 1024,
): Promise<string> {
  const client = getClaudeClient();
  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    system,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });
  const block = response.content[0];
  if (block.type !== 'text') throw new Error('Unexpected content type');
  return block.text;
}
