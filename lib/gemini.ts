// import { GoogleGenerativeAI } from '@google/generative-ai';

// export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// export async function getEmbedding(text: string): Promise<number[]> {
//   const model = genAI.getGenerativeModel({ 
//     model: "text-embedding-004" 
//   });
  
//   const result = await model.embedContent(text);
//   return result.embedding.values;
// }

import { GoogleGenerativeAI } from '@google/generative-ai';

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function getEmbedding(text: string): Promise<number[]> {
  const model = genAI.getGenerativeModel({ model: "embedding-001" }); 
  const result = await model.embedContent(text);
  return result.embedding.values || [];
}
