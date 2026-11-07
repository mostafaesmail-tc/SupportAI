var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { eq, and, desc } from 'drizzle-orm';
import { DatabaseProvider } from '../db/database.provider.js';
import { conversations, messages, } from '../db/schema.js';
let ConversationsService = class ConversationsService {
    database;
    constructor(database) {
        this.database = database;
    }
    async create(agentId) {
        const [conversation] = await this.database.db
            .insert(conversations)
            .values({ agentId })
            .returning();
        return conversation;
    }
    async findById(id, agentId) {
        const [conversation] = await this.database.db
            .select()
            .from(conversations)
            .where(and(eq(conversations.id, id), eq(conversations.agentId, agentId)));
        return conversation;
    }
    async addMessage(conversationId, role, content, sources) {
        const [message] = await this.database.db
            .insert(messages)
            .values({
            conversationId,
            role,
            content,
            sources: sources ?? null,
        })
            .returning();
        await this.database.db
            .update(conversations)
            .set({ updatedAt: new Date() })
            .where(eq(conversations.id, conversationId));
        return message;
    }
    async getMessages(conversationId) {
        return this.database.db
            .select()
            .from(messages)
            .where(eq(messages.conversationId, conversationId))
            .orderBy(messages.createdAt);
    }
    async findAllByAgentId(agentId) {
        return this.database.db
            .select()
            .from(conversations)
            .where(eq(conversations.agentId, agentId))
            .orderBy(desc(conversations.updatedAt));
    }
};
ConversationsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [DatabaseProvider])
], ConversationsService);
export { ConversationsService };
//# sourceMappingURL=conversations.service.js.map