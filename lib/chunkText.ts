export function chunkText(
  text: string,
  size = 800
): { text: string; index: number }[] {
  const chunks = [];
  let idx = 0;

  for (let i = 0; i < text.length; i += size) {
    const part = text.slice(i, i + size).trim();
    if (!part) continue;
    chunks.push({ text: part, index: idx++ });
  }

  return chunks;
}
