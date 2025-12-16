// lib/openai.ts
import { langfuse } from './langfuse';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
if (!OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY missing in environment');
}

const DEFAULT_OPENAI_MODEL = 'gpt-4o-mini';

type ChatMessage = {
  role: 'system' | 'user' | 'assistant' | 'tool' | 'function';
  content: string;
  name?: string;
};

type ChatReq = {
  messages: ChatMessage[];
  tools?: any[];
  tool_choice?: 'auto' | 'none' | { type: 'function'; function: { name: string } };
};

export async function callOpenAIWithTools(req: ChatReq) {
  const payload = { model: DEFAULT_OPENAI_MODEL, ...req };

  const trace = langfuse.trace({
    name: 'openai-chat',
    input: payload,
  });

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();

    if (!res.ok) {
      const errMsg = `OpenAI HTTP ${res.status} – ${text || 'empty error body'}`;
      trace.update?.({ output: { error: errMsg } });
      throw new Error(errMsg);
    }

    const data = JSON.parse(text) as any;
    trace.update?.({ output: data });
    return data;
  } catch (err: any) {
    trace.update?.({ output: { error: err.message || String(err) } });
    throw err;
  }
}

// your deterministic 768‑dim embedding so Pinecone index stays valid
export async function getEmbedding(text: string): Promise<number[]> {
  const dim = 768;
  return Array.from(
    { length: dim },
    (_, i) => ((text.charCodeAt(i % text.length) || 0) % 100) / 100,
  );
}
