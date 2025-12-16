// import { Pinecone } from '@pinecone-database/pinecone';

// const pc = new Pinecone({
//   apiKey: process.env.PINECONE_API_KEY!,
// });

// export async function getPineconeIndex() {
//   return pc.Index(process.env.PINECONE_INDEX_NAME!);
// }



// lib/pinecone.ts
import { Pinecone } from '@pinecone-database/pinecone';

const client = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

export async function getPineconeIndex() {
  return client.Index(process.env.PINECONE_INDEX_NAME!);
}

// Used by the chatbot to search
export async function searchPinecone(queryEmbedding: number[]) {
  const index = await getPineconeIndex();
  const namespace = index.namespace('chunk-chat-bucket');

  const res = await namespace.query({
    topK: 5,
    includeMetadata: true,
    vector: queryEmbedding,
  });

  return res.matches?.map((m: any) => m.metadata) ?? [];
}
