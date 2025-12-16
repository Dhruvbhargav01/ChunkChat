// import { langfuse } from './langfuse';
// import { getPineconeIndex } from './pinecone';
// import { generateGeminiAnswer } from './gemini';

// type RagAssistantArgs = {
//   message: string;
// };

// export async function ragAssistant({ message }: RagAssistantArgs): Promise<string> {
//   const lower = message.toLowerCase();

//   let toolType: 'none' | 'list_files' | 'search_docs' = 'none';

//   if (lower.includes('list files') || lower.includes('show files') || lower.includes('available documents') || lower.includes('files')) {
//     toolType = 'list_files';
//   } else if (lower.includes('pdf') || lower.includes('document') || lower.includes('resume') || lower.includes('file') || lower.includes('based on my docs')) {
//     toolType = 'search_docs';
//   }

//   const trace = langfuse.trace({
//     name: 'rag-chatbot',
//     input: { user_message: message, toolType },
//   });

//   let toolContext = '';

//   try {
//     if (toolType === 'list_files') {
//       const res = await fetch('http://localhost:3000/api/files');
//       const data = await res.json();
//       if (data.files && data.files.length > 0) {
//         toolContext = 'Available files:\n' + data.files.map((f: string) => `- ${f}`).join('\n');
//       } else {
//         toolContext = 'No files uploaded yet.';
//       }
//     }

//     if (toolType === 'search_docs') {
//       try {
//         const index = await getPineconeIndex();
//         const embedding = new Array(1024).fill(0); // placeholder for vector search
//         const result = await index.query({
//           vector: embedding,
//           topK: 5,
//           includeMetadata: true,
//         });

//         const matches = (result.matches || []) as any[];

//         if (matches.length === 0) {
//           toolContext = 'No relevant content found in the stored document chunks for this question.';
//         } else {
//           toolContext = matches
//             .map((m: any) => {
//               const text = m.metadata?.text ?? '';
//               const filename = m.metadata?.filename ?? 'unknown file';
//               const score = m.score ?? 0;
//               return `From file "${filename}" (score ${(score * 100).toFixed(1)}%):\n${text.slice(0, 300)}...`;
//             })
//             .join('\n\n');
//         }
//       } catch (err: any) {
//         console.error('Pinecone search failed:', err);
//         toolContext = 'Document search is currently unavailable.';
//       }
//     }

//     const systemPrompt = `
// You are ChunkChat Assistant.

// RULES:
// - TOOL TYPE: ${toolType}
// - TOOL CONTEXT: ${toolContext || 'No tool used or no context returned.'}
// - USER MESSAGE: ${message}

// Respond as the assistant following the rules above.
// `;

//     const reply = await generateGeminiAnswer(systemPrompt);

//     trace.update?.({
//       output: { reply, toolType, toolContextLength: toolContext.length },
//     });

//     return reply;
//   } catch (err: any) {
//     console.error('ragAssistant error:', err);

//     trace.update?.({
//       output: { error: err.message || String(err) },
//       // level: 'ERROR',
//     });

//     return 'Sorry, something went wrong while generating the response.';
//   }
// }

// lib/llm.ts
import { generateGeminiAnswer } from './gemini';

type RagAssistantArgs = {
  message: string;
};

export async function ragAssistant({ message }: RagAssistantArgs): Promise<string> {
  try {
    if (!message || !message.trim()) return 'Please enter a message.';

    const systemPrompt = `
You are ChunkChat Assistant.

USER MESSAGE: ${message}

Respond naturally and clearly.
`;

    const reply = await generateGeminiAnswer(systemPrompt);
    return reply;
  } catch (err: any) {
    console.error('ragAssistant error:', err);
    return 'Sorry, something went wrong while generating the response.';
  }
}
