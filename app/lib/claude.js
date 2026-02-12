export async function callClaude(prompt, { maxTokens = 4096, retries = 2, model = 'claude-sonnet-4-20250514' } = {}) {
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
          model,
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
  // Strip markdown code blocks
  const codeBlock = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock) cleaned = codeBlock[1].trim();
  // Find JSON boundaries
  const start = cleaned.indexOf('{');
  if (start > 0) cleaned = cleaned.slice(start);
  const end = cleaned.lastIndexOf('}');
  if (end !== -1) cleaned = cleaned.slice(0, end + 1);
  // Clean trailing commas
  cleaned = cleaned.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
  // Fix unescaped newlines inside string values
  cleaned = cleaned.replace(/"([^"]*?)"/g, (match) => {
    return match.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
  });
  // Remove other control chars
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ' ');
  
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    // Last resort: try to extract just the topics array
    const topicsMatch = text.match(/"topics"\s*:\s*\[([\s\S]*)\]/);
    if (topicsMatch) {
      try {
        let arr = topicsMatch[1].replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
        arr = arr.replace(/"([^"]*?)"/g, (m) => m.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t'));
        return JSON.parse(`{"topics":[${arr}]}`);
      } catch (e2) {}
    }
    throw new Error(`Failed to parse AI response. Please try again.`);
  }
}
