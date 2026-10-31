export declare class EmbeddingService {
    private readonly ollamaUrl;
    private readonly model;
    generateEmbedding(text: string): Promise<number[]>;
}
