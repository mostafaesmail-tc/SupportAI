import { DatabaseProvider } from '../db/database.provider.js';
import { EmbeddingService } from '../embeddings/embedding.service.js';
export declare class KnowledgeProcessingService {
    private readonly database;
    private readonly embeddingService;
    constructor(database: DatabaseProvider, embeddingService: EmbeddingService);
    processKnowledgeSource(agentId: string, knowledgeSourceId: string): Promise<{
        knowledgeSourceId: string;
        status: "ready";
        chunkCount: number;
    }>;
}
