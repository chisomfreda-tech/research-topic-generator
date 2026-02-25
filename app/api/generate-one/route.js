export const maxDuration = 60;
import { NextResponse } from 'next/server';
import { callClaude, parseJSON } from '../../lib/claude';
import { buildSingleTopicPrompt } from '../../lib/prompts';

export async function POST(req) {
  try {
    const body = await req.json();
    const prompt = buildSingleTopicPrompt(body);
    const text = await callClaude(prompt, { maxTokens: 4096, model: 'claude-haiku-4-5-20251001' });
    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Empty response. Try again.' }, { status: 500 });
    }
    const data = parseJSON(text);
    const topic = data.topics?.[0] || data;
    if (!topic || !topic.title) {
      return NextResponse.json({ error: 'Invalid response. Try again.' }, { status: 500 });
    }
    return NextResponse.json({ topic });
  } catch (err) {
    console.error('Generate-one error:', err.message);
    return NextResponse.json({ error: err.message }, { status: err.message.includes('Rate') ? 429 : 500 });
  }
}
