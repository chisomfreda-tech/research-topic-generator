import { NextResponse } from 'next/server';
import { callClaude } from '../../lib/claude';
import { buildRegeneratePrompt } from '../../lib/prompts';

export async function POST(request) {
  try {
    const body = await request.json();
    const prompt = buildRegeneratePrompt(body);
    const result = await callClaude(prompt, 4000);
    return NextResponse.json(result);
  } catch (error) {
    if (error.message.startsWith('RATE_LIMIT:')) {
      return NextResponse.json({ error: 'Rate limited. Try again shortly.' }, { status: 429 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
