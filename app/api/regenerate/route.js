import { NextResponse } from 'next/server';
import { callClaude, parseJSON } from '../../lib/claude';
import { buildRegeneratePrompt } from '../../lib/prompts';

export async function POST(req) {
  try {
    const body = await req.json();
    const prompt = buildRegeneratePrompt(body);
    const text = await callClaude(prompt);
    const data = parseJSON(text);
    const topic = data.topics ? data.topics[0] : data;
    return NextResponse.json(topic);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.message.includes('Rate') ? 429 : 500 });
  }
}
