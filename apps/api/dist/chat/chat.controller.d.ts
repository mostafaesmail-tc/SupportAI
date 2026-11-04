import { ChatService } from './chat.service.js';
import { ChatRequestDto } from './dto/chat-request.dto.js';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    chat(agentId: string, dto: ChatRequestDto): Promise<{
        conversationId: string;
        answer: string;
        sources: {
            sourceId: string;
            sourceTitle: string;
            chunkIndex: number;
        }[];
    }>;
}
