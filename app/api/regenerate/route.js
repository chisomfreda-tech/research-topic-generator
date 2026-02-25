export const maxDuration = 60;
import { NextResponse } from 'next/server';
import { callClaude, parseJSON } from '../../lib/claude';
import { buildRegeneratePrompt } from '../../lib/prompts';

export async function POST(req) {
  try {
    const body = await req.json();
    const prompt = buildRegeneratePrompt({
      currentTitle: body.topic?.title || '',
      focusArea: body.topic?.focusArea || '',
      equipment: body.equipment || [],
      timeline: body.timeline || '8',
    });
    const text = await callClaude(prompt, { maxTokens: 4096, model: 'claude-haiku-4-5-20251001' });
    const data = parseJSON(text);
    const topic = data.topics ? data.topics[0] : data;
    return NextResponse.json({ topic });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.message.includes('Rate') ? 429 : 500 });
  }
}
