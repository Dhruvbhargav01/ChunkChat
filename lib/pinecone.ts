import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

export const PINECONE_NAMESPACE = 'rag';

export async function getPineconeIndex() {
  return pc.Index(process.env.PINECONE_INDEX_NAME!);
}
