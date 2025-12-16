// interface Chunk {
//   text: string
//   index: number
// }

// export function chunkText(text: string, chunkSize: number = 800, overlap: number = 100): Chunk[] {
//   const chunks: Chunk[] = []
//   const words = text.split(' ')
  
//   for (let i = 0; i < words.length; i += chunkSize - overlap) {
//     const chunkWords = words.slice(i, i + chunkSize)
//     const chunkText = chunkWords.join(' ').trim()
    
//     if (chunkText.length > 50) { // Min length filter
//       chunks.push({ text: chunkText, index: chunks.length })
//     }
//   }
  
//   return chunks
// }


export function chunkText(text: string, size = 800): { text: string; index: number }[] {
  const chunks: { text: string; index: number }[] = []
  let idx = 0
  for (let i = 0; i < text.length; i += size) {
    const part = text.slice(i, i + size).trim()
    if (!part) continue
    chunks.push({ text: part, index: idx })
    idx += 1
  }
  return chunks
}
