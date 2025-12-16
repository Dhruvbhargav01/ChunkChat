// import { Langfuse } from 'langfuse'

// export const langfuse = new Langfuse({
//   secretKey: process.env.LANGFUSE_SECRET_KEY!,
//   publicKey: process.env.LANGFUSE_PUBLIC_KEY!,
//   baseUrl: process.env.LANGFUSE_BASE_URL!,
//   release: 'step-1-upload',
// })

import { Langfuse } from 'langfuse';

export const langfuse = new Langfuse({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY!,
  secretKey: process.env.LANGFUSE_SECRET_KEY!,
  baseUrl: process.env.LANGFUSE_BASE_URL || 'https://cloud.langfuse.com'  
});

console.log('✅ Langfuse v3 client initialized');
