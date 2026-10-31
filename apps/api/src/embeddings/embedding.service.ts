
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class EmbeddingService {
  private readonly ollamaUrl = 'http://localhost:11434';
  private readonly model = 'nomic-embed-text';

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await fetch(`${this.ollamaUrl}/api/embed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          input: text,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama returned status ${response.status}`);
      }

      const data: { embeddings: number[][] } = await response.json();

      const embedding = data.embeddings[0];

      if (!embedding || embedding.length !== 768) {
        throw new Error('Invalid embedding returned by Ollama');
      }

      return embedding;
    } catch (error) {
      console.error('Embedding generation failed:', error);

      throw new InternalServerErrorException(
        'Failed to generate text embedding',
      );
    }
  }
}
