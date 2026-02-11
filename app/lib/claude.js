export async function callClaude(prompt, { maxTokens = 4096, retries = 2 } = {}) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not configured');

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: maxTokens,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (res.status === 429) {
        const retryAfter = parseInt(res.headers.get('retry-after') || '30');
        if (attempt < retries) { await new Promise(r => setTimeout(r, retryAfter * 1000)); continue; }
        throw new Error(`Rate limited. Try again in ${retryAfter}s.`);
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `API error ${res.status}`);
      }

      const data = await res.json();
      return data.content?.[0]?.text || '';
    } catch (err) {
      if (attempt === retries) throw err;
    }
  }
}

export function parseJSON(text) {
  let cleaned = text.trim();
  const codeBlock = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock) cleaned = codeBlock[1].trim();
  const start = cleaned.indexOf('{');
  if (start > 0) cleaned = cleaned.slice(start);
  const end = cleaned.lastIndexOf('}');
  if (end !== -1) cleaned = cleaned.slice(0, end + 1);
  cleaned = cleaned.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']').replace(/[\x00-\x1F\x7F]/g, ' ');
  return JSON.parse(cleaned);
}
