
export interface ChunkingOptions {
  chunkSize?: number;
  overlap?: number;
}

export function normalizeText(text: string): string {
  return text
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function chunkText(
  input: string,
  options: ChunkingOptions = {},
): string[] {
  const chunkSize = options.chunkSize ?? 1000;
  const overlap = options.overlap ?? 150;

  if (!Number.isInteger(chunkSize) || chunkSize <= 0) {
    throw new Error('chunkSize must be a positive integer');
  }

  if (
    !Number.isInteger(overlap) ||
    overlap < 0 ||
    overlap >= chunkSize
  ) {
    throw new Error(
      'overlap must be a non-negative integer smaller than chunkSize',
    );
  }

  const text = normalizeText(input);

  if (!text) {
    return [];
  }

  const chunks: string[] = [];
  const step = chunkSize - overlap;

  for (let start = 0; start < text.length; start += step) {
    const chunk = text.slice(start, start + chunkSize).trim();

    if (chunk) {
      chunks.push(chunk);
    }
  }

  return chunks;
}