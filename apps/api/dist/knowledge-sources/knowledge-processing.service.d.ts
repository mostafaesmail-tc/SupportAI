import { SearchResult } from './interfaces/search-result.interface.js';
import { DatabaseProvider } from '../db/database.provider.js';
import { EmbeddingService } from '../embeddings/embedding.service.js';
export declare class KnowledgeProcessingService {
    private readonly database;
    private readonly embeddingService;
    constructor(database: DatabaseProvider, embeddingService: EmbeddingService);
    searchKnowledge(agentId: string, question: string, limit?: number, maxDistance?: number): Promise<SearchResult[]>;
    processKnowledgeSource(agentId: string, knowledgeSourceId: string): Promise<{
        knowledgeSourceId: string;
        status: "ready";
        chunkCount: number;
    }>;
}
