// import { Pinecone } from '@pinecone-database/pinecone'

// const apiKey = process.env.PINECONE_API_KEY!
// const indexName = process.env.PINECONE_INDEX_NAME!

// const pinecone = new Pinecone({ apiKey })

// export function getPineconeIndex() {
//   return pinecone.index(indexName)
// }

import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

export async function getPineconeIndex() {
  return pc.Index(process.env.PINECONE_INDEX_NAME!);
}
