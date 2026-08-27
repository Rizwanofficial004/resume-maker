const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_TIMEOUT_MS = 45000;

export async function callOpenRouter(messages, options = {}) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    const error = new Error('OpenRouter API key is not configured on the server');
    error.statusCode = 503;
    throw error;
  }

  // Prefer free OpenRouter models (IDs ending in :free, or the free router)
  const model = options.model || process.env.OPENROUTER_MODEL || 'openrouter/free';
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let response;
  try {
    response = await fetch(OPENROUTER_URL, {
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
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      const error = new Error('AI request timed out. Please try again.');
      error.statusCode = 504;
      throw error;
    }
    const error = new Error('Could not reach AI provider. Check your network connection.');
    error.statusCode = 502;
    throw error;
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    const text = await response.text();
    let detail = '';
    try {
      const j = JSON.parse(text);
      detail = j?.error?.message || text.slice(0, 200);
    } catch {
      detail = text.slice(0, 200);
    }

    if (response.status === 401 || response.status === 403) {
      const error = new Error('AI service is not configured correctly. Please check the API key.');
      error.statusCode = 503;
      throw error;
    }
    if (response.status === 429) {
      const error = new Error('AI rate limit reached. Please wait a moment and try again.');
      error.statusCode = 429;
      throw error;
    }
    const error = new Error(detail ? `AI request failed: ${detail}` : `AI request failed (${response.status})`);
    error.statusCode = 502;
    throw error;
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    const error = new Error('AI returned no content. Try again with a shorter prompt.');
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
