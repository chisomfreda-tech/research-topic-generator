import { NextResponse } from 'next/server';
import { callClaude, parseJSON } from '../../lib/claude';
import { buildProposalPrompt } from '../../lib/prompts';

export async function POST(req) {
  try {
    const { topic } = await req.json();
    const prompt = buildProposalPrompt(topic);
    const text = await callClaude(prompt, { maxTokens: 6000 });
    const data = parseJSON(text);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.message.includes('Rate') ? 429 : 500 });
  }
}
