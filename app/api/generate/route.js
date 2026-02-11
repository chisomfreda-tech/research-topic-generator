import { NextResponse } from 'next/server';
import { callClaude, parseJSON } from '../../lib/claude';
import { buildGeneratePrompt } from '../../lib/prompts';

export async function POST(req) {
  try {
    const body = await req.json();
    const prompt = buildGeneratePrompt(body);
    const text = await callClaude(prompt, { maxTokens: 8192 });
    const data = parseJSON(text);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.message.includes('Rate') ? 429 : 500 });
  }
}
