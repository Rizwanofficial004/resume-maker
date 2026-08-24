const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function callOpenRouter(messages, options = {}) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    const error = new Error('OpenRouter API key is not configured on the server');
    error.statusCode = 503;
    throw error;
  }

  const model = options.model || process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:3010',
      'X-Title': 'ResumeMaster',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 700,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    let msg = `OpenRouter request failed (${response.status})`;
    try { const j = JSON.parse(text); msg += `: ${j?.error?.message || text.slice(0, 200)}`; } catch { msg += `: ${text.slice(0, 200)}`; }
    if (response.status === 401) {
      const error = new Error('AI service is not configured correctly. Please check the API key.');
      error.statusCode = 503;
      throw error;
    }
    const error = new Error(msg);
    error.statusCode = 502;
    throw error;
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    const error = new Error('OpenRouter returned no content');
    error.statusCode = 502;
    throw error;
  }
  return content.trim();
}

export function cleanJsonString(str) {
  const cleaned = str.replace(/```json|```/g, '').trim();
  const start = cleaned.indexOf('[');
  const end = cleaned.lastIndexOf(']');
  if (start !== -1 && end !== -1) {
    return cleaned.slice(start, end + 1);
  }
  return cleaned;
}
