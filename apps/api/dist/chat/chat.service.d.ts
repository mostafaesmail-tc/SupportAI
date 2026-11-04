import { LlmService } from '../llm/llm.service.js';
import { KnowledgeProcessingService } from '../knowledge-sources/knowledge-processing.service.js';
import { AgentsService } from '../agents/agents.service.js';
import { ConversationsService } from '../conversations/conversations.service.js';
export interface ChatAnswer {
    answer: string;
    sources: {
        sourceId: string;
        sourceTitle: string;
        chunkIndex: number;
    }[];
}
export declare class ChatService {
    private readonly llmService;
    private readonly knowledgeProcessingService;
    private readonly agentsService;
    private readonly conversationsService;
    constructor(llmService: LlmService, knowledgeProcessingService: KnowledgeProcessingService, agentsService: AgentsService, conversationsService: ConversationsService);
    generateAnswer(agentId: string, question: string, conversationId?: string): Promise<{
        conversationId: string;
        answer: string;
        sources: {
            sourceId: string;
            sourceTitle: string;
            chunkIndex: number;
        }[];
    }>;
}
