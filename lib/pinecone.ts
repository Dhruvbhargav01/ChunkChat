import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

// export const PINECONE_NAMESPACE = 'rag';

export async function getPineconeIndex() {
  return pc.Index(process.env.PINECONE_INDEX_NAME!);
}

// // lib/pinecone.ts
// import { Pinecone } from '@pinecone-database/pinecone';

// const pc = new Pinecone({
//   apiKey: process.env.PINECONE_API_KEY!,
// });

// const INDEX_NAME = process.env.PINECONE_INDEX_NAME!;
// const NAMESPACE = 'rag'; // same namespace used during upload

// export async function getPineconeIndex() {
//   return pc.Index(INDEX_NAME).namespace(NAMESPACE);
// }
