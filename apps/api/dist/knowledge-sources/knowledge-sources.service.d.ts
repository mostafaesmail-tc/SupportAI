import { DatabaseProvider } from '../db/database.provider.js';
import { CreateKnowledgeSourceDto } from './dto/create-knowledge-source.dto.js';
export declare class KnowledgeSourcesService {
    private readonly database;
    constructor(database: DatabaseProvider);
    private ensureAgentExists;
    createKnowledgeSource(agentId: string, input: CreateKnowledgeSourceDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        agentId: string;
        title: string;
        content: string;
        status: import("../db/schema.js").KnowledgeSourceStatus;
        errorMessage: string | null;
    }[]>;
    findAllKnowledgeSourcesByAgentId(agentId: string): Promise<{
        id: string;
        agentId: string;
        title: string;
        content: string;
        status: import("../db/schema.js").KnowledgeSourceStatus;
        errorMessage: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findKnowledgeSourceById(agentId: string, knowledgeSourceId: string): Promise<{
        id: string;
        agentId: string;
        title: string;
        content: string;
        status: import("../db/schema.js").KnowledgeSourceStatus;
        errorMessage: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteKnowledgeSourceById(agentId: string, knowledgeSourceId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        agentId: string;
        title: string;
        content: string;
        status: import("../db/schema.js").KnowledgeSourceStatus;
        errorMessage: string | null;
    }>;
}
