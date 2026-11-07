import { DatabaseProvider } from '../db/database.provider.js';
type MessageRole = 'user' | 'assistant';
interface MessageSource {
    sourceId: string;
    sourceTitle: string;
    chunkIndex: number;
}
export declare class ConversationsService {
    private readonly database;
    constructor(database: DatabaseProvider);
    create(agentId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        agentId: string;
        title: string | null;
    }>;
    findById(id: string, agentId: string): Promise<{
        id: string;
        agentId: string;
        title: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    addMessage(conversationId: string, role: MessageRole, content: string, sources?: MessageSource[]): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        conversationId: string;
        role: "user" | "assistant";
        sources: unknown;
    }>;
    getMessages(conversationId: string): Promise<{
        id: string;
        conversationId: string;
        role: "user" | "assistant";
        content: string;
        sources: unknown;
        createdAt: Date;
    }[]>;
    findAllByAgentId(agentId: string): Promise<{
        id: string;
        agentId: string;
        title: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
export {};
