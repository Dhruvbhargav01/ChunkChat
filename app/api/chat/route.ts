import { NextRequest, NextResponse } from 'next/server';
import { getPineconeIndex } from '@/lib/pinecone';
import { getEmbedding } from '@/lib/gemini';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { langfuse } from '@/lib/langfuse';
import { supabase } from '@/lib/supabase';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'No message provided' }, { status: 400 });
    }

    console.log('Chat query:', message);

    // STEP 1: Get all uploaded files
    const { data: files } = await supabase
      .from('files')
      .select('id, filename, metadata')
      .order('uploaded_at', { ascending: false });

    const fileNames = files?.map(f => f.metadata?.original_name || f.filename) || [];
    console.log('Available files:', fileNames.length);

    // STEP 2: Generate query embedding + Pinecone search
    const queryEmbedding = await getEmbedding(message);
    const index = await getPineconeIndex();
    
    const queryResult = await index.query({
      vector: queryEmbedding,
      topK: 5,
      includeMetadata: true
    });

    const relevantChunks = queryResult.matches
      ?.map(match => ({
        text: (match.metadata?.text_preview as string) || '',
        filename: (match.metadata?.filename as string) || 'unknown',
        score: match.score || 0
      }))
      .filter(chunk => chunk.text.length > 20 && chunk.score! > 0.7) || [];

    console.log('Relevant chunks found:', relevantChunks.length);

    // STEP 3: Build RAG context
    const context = relevantChunks.length > 0 
      ? `Relevant document sections:
${relevantChunks.map(c => 
  `From "${c.filename}" (${(c.score! * 100).toFixed(1)}% match):
${c.text.slice(0, 400)}...`
).join('\n\n')}`
      : 'No relevant document sections found.';

    const systemPrompt = `You are ChunkChat, a helpful document assistant.

INSTRUCTIONS:
1. Answer using the provided document context FIRST
2. Mention which file(s) the information comes from
3. If context is empty or irrelevant, say "I couldn't find relevant information in the uploaded documents"
4. Keep answers concise but complete
5. Use natural conversational tone

AVAILABLE FILES: ${fileNames.join(', ') || 'None uploaded yet'}

CONTEXT:
${context}

USER QUESTION: ${message}

Answer only based on the context above.`;

    // STEP 4: Gemini generation
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(systemPrompt);
    const response = await result.response.text();

    console.log('Response generated');

    return NextResponse.json({ 
      response,
      sources: relevantChunks,
      files: fileNames.length 
    });

  } catch (error: any) {
    console.error('Chat error:', error.message);
    return NextResponse.json({ 
      error: error.message || 'Chat failed',
      sources: []
    }, { status: 500 });
  }
}
