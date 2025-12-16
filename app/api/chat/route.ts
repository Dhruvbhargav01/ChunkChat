import { NextRequest, NextResponse } from 'next/server';
import { getPineconeIndex } from '@/lib/pinecone';
import { getEmbedding, generateAnswer } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    const embedding = await getEmbedding(message);
    const index = await getPineconeIndex();
    const namespace = index.namespace('chunk-chat-bucket'); // FIXED

    const result = await namespace.query({
      vector: embedding,
      topK: 5,
      includeMetadata: true,
    });

    const matches = result.matches ?? [];

    const context = matches
      .map(m => m.metadata?.text)
      .filter(Boolean)
      .join('\n\n');

    const prompt = `
You are a document assistant.

Context:
${context || 'No relevant content found.'}

Question:
${message}

Rules:
- Answer ONLY from the context
- If no context, say you don’t know
`;

    const reply = await generateAnswer(prompt);

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
