import { NextResponse } from 'next/server';
import { callClaude, parseJSON } from '../../lib/claude';
import { buildGeneratePrompt } from '../../lib/prompts';

export const maxDuration = 120;

export async function POST(req) {
  try {
    const body = await req.json();
    const prompt = buildGeneratePrompt(body);
    const text = await callClaude(prompt, { maxTokens: 16384 });
    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Empty response from API. Try again.' }, { status: 500 });
    }
    const data = parseJSON(text);
    if (!data.topics || !Array.isArray(data.topics)) {
      return NextResponse.json({ error: 'Invalid response format. Try again.' }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error('Generate error:', err.message);
    return NextResponse.json({ error: err.message }, { status: err.message.includes('Rate') ? 429 : 500 });
  }
}
