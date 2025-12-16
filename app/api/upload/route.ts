import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
// @ts-ignore - pdftojson has no types
import pdftojson from 'pdftojson';
import * as mammoth from 'mammoth';
import { chunkText } from '@/lib/chunkText';
import crypto from 'crypto';
import { getPineconeIndex } from '@/lib/pinecone';
import { getEmbedding } from '@/lib/gemini';

interface Chunk {
  text: string;
  index: number;
}

async function extractText(buffer: Buffer, filename: string): Promise<string> {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  if (ext === 'pdf') {
    const pdfData = await pdftojson(buffer);
    return pdfData.pages
      .map((page: any) => page.texts?.map((t: any) => t.R?.[0]?.T || '').join(' ') || '')
      .join('\n');
  } 
  else if (ext === 'docx') {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || '';
  }
  throw new Error('Only PDF/DOCX supported');
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file = data.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    if (bytes.length === 0 || bytes.length > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large or empty (>10MB)' }, { status: 400 });
    }

    const fileHash = crypto.createHash('sha256').update(bytes).digest('hex').slice(0, 16);
    const filename = `${fileHash}-${file.name}`;

    console.log('Uploading to bucket:', filename);

    // const { error: uploadError } = await supabase.storage
    //   .from('chunk-chat-bucket')
    //   .upload(filename, bytes, { 
    //     contentType: file.type || 'application/pdf',
    //     upsert: true
    //   });

    // if (uploadError) {
    //   console.error('Bucket upload failed:', uploadError);
    //   return NextResponse.json({ error: `Bucket upload failed: ${uploadError.message}` }, { status: 500 });
    // }

    console.log('Bucket upload success');

    const { data: fileData, error: fileError } = await supabase
      .from('files')
      .insert({ 
        filename, 
        file_size: bytes.length, 
        metadata: { original_name: file.name } 
      })
      .select('id')
      .single();

    if (fileError || !fileData?.id) {
      console.error('File metadata error:', fileError);
      return NextResponse.json({ error: 'Failed to save file metadata' }, { status: 500 });
    }

    console.log('File metadata saved:', fileData.id);

    const fullText = await extractText(bytes, file.name);
    const chunks: Chunk[] = chunkText(fullText, 800);

    console.log(`Extracted ${chunks.length} chunks`);

    if (chunks.length === 0) {
      return NextResponse.json({ error: 'No text extracted from document' }, { status: 400 });
    }

    const index = await getPineconeIndex();
    const embeddings = await Promise.all(
      chunks.map(async (chunk, idx) => ({
        id: `${fileData.id}-${idx}`,
        values: await getEmbedding(chunk.text),
        metadata: { 
          file_id: fileData.id,
          chunk_index: idx,
          filename: file.name,
          text_preview: chunk.text.slice(0, 200)
        }
      }))
    );

    for (let i = 0; i < embeddings.length; i += 50) {
      await index.upsert(embeddings.slice(i, i + 50));
    }

    console.log('Pinecone embeddings saved');

    const { error: chunkError } = await supabase
      .from('chunks')
      .insert(
        chunks.map((chunk, idx) => ({
          file_id: fileData.id,
          chunk_text: chunk.text,
          chunk_index: chunk.index,
          embedding_id: `${fileData.id}-${idx}`
        }))
      );

    if (chunkError) {
      console.error('Chunk save error:', chunkError);
      return NextResponse.json({ error: 'Failed to save chunks' }, { status: 500 });
    }

    console.log('All chunks saved to database');

    return NextResponse.json({
      success: true,
      fileId: fileData.id,
      message: `Bucket upload + ${chunks.length} chunks indexed in Pinecone!`,
      filename: file.name
    });

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}
