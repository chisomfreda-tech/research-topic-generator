import { NextResponse } from 'next/server';
import { callClaude } from '../../lib/claude';
import { buildProposalPrompt } from '../../lib/prompts';

export async function POST(request) {
  try {
    const { topic } = await request.json();
    const prompt = buildProposalPrompt(topic);
    const result = await callClaude(prompt, 6000);
    return NextResponse.json(result);
  } catch (error) {
    if (error.message.startsWith('RATE_LIMIT:')) {
      return NextResponse.json({ error: 'Rate limited.' }, { status: 429 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
