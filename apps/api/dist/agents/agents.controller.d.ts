import { AgentsService } from './agents.service.js';
import { CreateAgentDto } from './dto/create-agent.dto.js';
import { UpdateAgentDto } from './dto/update-agent.dto.js';
import { KnowledgeProcessingService } from '../knowledge-sources/knowledge-processing.service.js';
export declare class AgentsController {
    private readonly agentsService;
    private readonly knowledgeProcessingService;
    constructor(agentsService: AgentsService, knowledgeProcessingService: KnowledgeProcessingService);
    create(createAgentDto: CreateAgentDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        systemPrompt: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        description: string | null;
        systemPrompt: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOneAgentById(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        systemPrompt: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateAgentById(id: string, updateAgentDto: UpdateAgentDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        systemPrompt: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteAgentById(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        systemPrompt: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    searchKnowledge(agentId: string, question: string): Promise<import("../knowledge-sources/interfaces/search-result.interface.js").SearchResult[]>;
}
