import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { chunkText } from '@/lib/chunkText';
import crypto from 'crypto';
import { getPineconeIndex } from '@/lib/pinecone';
import { getEmbedding } from '@/lib/openai';
import { extractText } from 'unpdf';
import * as mammoth from 'mammoth';

async function extractDocumentText(
  data: Uint8Array,
  filename: string
): Promise<string> {
  const ext = filename.split('.').pop()?.toLowerCase();

  if (ext === 'pdf') {
    const result = await extractText(data); // ✅ unpdf works with Uint8Array
    return result.text.join('\n');
  }

  if (ext === 'docx') {
    const result = await mammoth.extractRawText({ buffer: Buffer.from(data) });
    return result.value;
  }

  throw new Error('Unsupported file type');
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // ✅ Convert file to Uint8Array
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const hash = crypto
      .createHash('sha256')
      .update(uint8Array)
      .digest('hex')
      .slice(0, 16);

    const storedFilename = `${hash}-${file.name}`;

    // ✅ Upload to Supabase bucket "chunk-chat-bucket"
    const { error: uploadError } = await supabase.storage
      .from('chunk-chat-bucket')
      .upload(storedFilename, uint8Array, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // ✅ Save file metadata
    const { data: fileRow, error: fileError } = await supabase
      .from('files')
      .insert({
        filename: storedFilename,
        file_size: uint8Array.length,
        metadata: { original_name: file.name },
      })
      .select()
      .single();

    if (fileError) throw fileError;

    // ✅ Extract + chunk
    const fullText = await extractDocumentText(uint8Array, file.name);
    const chunks = chunkText(fullText, 800);

    if (!chunks.length) {
      return NextResponse.json(
        { error: 'No text extracted' },
        { status: 400 }
      );
    }

    // ✅ Pinecone upsert
    const index = await getPineconeIndex();
    const namespace = index.namespace('chunk-chat-bucket');

    const vectors = await Promise.all(
      chunks.map(async (chunk, i) => ({
        id: `${fileRow.id}-${i}`,
        values: await getEmbedding(chunk.text),
        metadata: {
          file_id: fileRow.id,
          filename: file.name,
          text: chunk.text,
        },
      }))
    );

    await namespace.upsert(vectors);

    // ✅ Save chunks in Supabase
    await supabase.from('chunks').insert(
      chunks.map((chunk, i) => ({
        file_id: fileRow.id,
        chunk_text: chunk.text,
        chunk_index: i,
        embedding_id: `${fileRow.id}-${i}`,
      }))
    );

    return NextResponse.json({
      success: true,
      chunks: chunks.length,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
