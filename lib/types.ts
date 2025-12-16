export type ChatRole = 'system' | 'user' | 'assistant'

export type ChatMessage = {
  role: ChatRole
  content: string
}

// declare module 'pdf-parse' {
//   export default function pdfParse(buffer: Buffer): Promise<{
//     text: string;
//     info: any;
//     numpages: number;
//     version: string;
//   }>;
// }

// declare module 'unpdf' {
//   export default function unpdf(buffer: Buffer | Uint8Array): Promise<{
//     text: string;
//     metadata: any;
//   }>
// }
