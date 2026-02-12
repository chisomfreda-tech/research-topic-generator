export const maxDuration = 60;
import { NextResponse } from 'next/server';
import { callClaude, parseJSON } from '../../lib/claude';
import { buildGeneratePrompt } from '../../lib/prompts';

export async function POST(req) {
  try {
    const body = await req.json();
    // Force numTopics to 1, pass existing titles to avoid duplicates
    const prompt = buildGeneratePrompt({
      ...body,
      numTopics: 1,
      existingTitles: body.existingTitles || [],
    });
    const text = await callClaude(prompt, { maxTokens: 4096, model: 'claude-haiku-4-5-20251001' });
    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Empty response from API. Try again.' }, { status: 500 });
    }
    const data = parseJSON(text);
    // Extract single topic from array or object
    const topic = data.topics?.[0] || data;
    if (!topic || !topic.title) {
      return NextResponse.json({ error: 'Invalid topic format. Try again.' }, { status: 500 });
    }
    return NextResponse.json({ topic });
  } catch (err) {
    console.error('Generate-one error:', err.message);
    return NextResponse.json({ error: err.message }, { status: err.message.includes('Rate') ? 429 : 500 });
  }
}
