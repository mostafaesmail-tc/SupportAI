import { ConversationsService } from './conversations.service.js';
import { AgentsService } from '../agents/agents.service.js';
export declare class ConversationsController {
    private readonly conversationsService;
    private readonly agentsService;
    constructor(conversationsService: ConversationsService, agentsService: AgentsService);
    findAll(agentId: string): Promise<{
        id: string;
        agentId: string;
        title: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getMessages(agentId: string, conversationId: string): Promise<{
        id: string;
        conversationId: string;
        role: "user" | "assistant";
        content: string;
        sources: unknown;
        createdAt: Date;
    }[]>;
}
