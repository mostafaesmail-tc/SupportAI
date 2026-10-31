import { KnowledgeSourcesService } from './knowledge-sources.service.js';
import { CreateKnowledgeSourceDto } from './dto/create-knowledge-source.dto.js';
import { KnowledgeProcessingService } from './knowledge-processing.service.js';
export declare class KnowledgeSourcesController {
    private readonly knowledgeSourcesService;
    private readonly knowledgeProcessingService;
    constructor(knowledgeSourcesService: KnowledgeSourcesService, knowledgeProcessingService: KnowledgeProcessingService);
    create(agentId: string, input: CreateKnowledgeSourceDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        agentId: string;
        title: string;
        content: string;
        status: import("../db/schema.js").KnowledgeSourceStatus;
        errorMessage: string | null;
    }[]>;
    findAllByAgentId(agentId: string): Promise<{
        id: string;
        agentId: string;
        title: string;
        content: string;
        status: import("../db/schema.js").KnowledgeSourceStatus;
        errorMessage: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOneById(agentId: string, knowledgeSourceId: string): Promise<{
        id: string;
        agentId: string;
        title: string;
        content: string;
        status: import("../db/schema.js").KnowledgeSourceStatus;
        errorMessage: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteById(agentId: string, knowledgeSourceId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        agentId: string;
        title: string;
        content: string;
        status: import("../db/schema.js").KnowledgeSourceStatus;
        errorMessage: string | null;
    }>;
    processKnowledgeSource(agentId: string, knowledgeSourceId: string): Promise<{
        knowledgeSourceId: string;
        status: "ready";
        chunkCount: number;
    }>;
}
