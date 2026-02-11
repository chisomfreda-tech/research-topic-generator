import { NextResponse } from 'next/server';
import { callClaude } from '../../lib/claude';
import { buildGeneratePrompt } from '../../lib/prompts';

export async function POST(request) {
  try {
    const body = await request.json();
    const prompt = buildGeneratePrompt(body);
    const result = await callClaude(prompt, 8000);
    return NextResponse.json({ topics: result.topics || [] });
  } catch (error) {
    if (error.message.startsWith('RATE_LIMIT:')) {
      const seconds = parseInt(error.message.split(':')[1]) || 120;
      const minutes = Math.ceil(seconds / 60);
      return NextResponse.json(
        { error: `Usage limit reached. Try again in about ${minutes} minutes.` },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to generate topics' },
      { status: 500 }
    );
  }
}
