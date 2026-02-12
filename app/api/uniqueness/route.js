export const maxDuration = 60;
import { NextResponse } from 'next/server';
import { callClaude, parseJSON } from '../../lib/claude';
import { buildUniquenessPrompt } from '../../lib/prompts';

export async function POST(req) {
  try {
    const { title } = await req.json();
    const prompt = buildUniquenessPrompt(title);
    const text = await callClaude(prompt);
    const data = parseJSON(text);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.message.includes('Rate') ? 429 : 500 });
  }
}
