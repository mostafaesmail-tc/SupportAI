var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable, InternalServerErrorException } from '@nestjs/common';
let EmbeddingService = class EmbeddingService {
    ollamaUrl = 'http://localhost:11434';
    model = 'nomic-embed-text';
    async generateEmbedding(text) {
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
            const data = await response.json();
            const embedding = data.embeddings[0];
            if (!embedding || embedding.length !== 768) {
                throw new Error('Invalid embedding returned by Ollama');
            }
            return embedding;
        }
        catch (error) {
            console.error('Embedding generation failed:', error);
            throw new InternalServerErrorException('Failed to generate text embedding');
        }
    }
};
EmbeddingService = __decorate([
    Injectable()
], EmbeddingService);
export { EmbeddingService };
//# sourceMappingURL=embedding.service.js.map