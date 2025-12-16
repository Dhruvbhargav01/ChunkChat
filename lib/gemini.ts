// lib/gemini.ts
import { langfuse } from './langfuse';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateText?key=${GEMINI_API_KEY}`;

if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY missing in .env.local');

export async function generateGeminiAnswer(prompt: string): Promise<string> {
  const trace = langfuse.trace({ name: 'gemini-llm-call', input: { prompt } });

  try {
    const res = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        prompt: [
          { text: prompt }
        ],
        temperature: 0.3,
        maxOutputTokens: 1000,
      }),
    });

    if (!res.ok) throw new Error(await res.text());

    const data = (await res.json()) as { candidates?: { content?: string }[] };
    const reply = data.candidates?.[0]?.content ?? 'Gemini returned empty response.';

    trace.update?.({ output: { reply } });
    return reply;
  } catch (err: any) {
    trace.update?.({ output: { error: err.message || String(err) } });
    return 'Sorry, there was an error with Gemini.';
  }
}

export async function getEmbedding(text: string): Promise<number[]> {
  const dim = 768;
  return Array.from({ length: dim }, (_, i) => ((text.charCodeAt(i % text.length) || 0) % 100) / 100);
}
