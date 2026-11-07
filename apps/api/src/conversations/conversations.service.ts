import { Injectable } from '@nestjs/common';
import { eq, and, desc } from 'drizzle-orm';

import { DatabaseProvider } from '../db/database.provider.js';
import {
  conversations,
  messages,
} from '../db/schema.js';
import type { InferInsertModel } from 'drizzle-orm';
import type { messageRoleEnum } from '../db/schema.js';

type MessageRole = 'user' | 'assistant';

interface MessageSource {
  sourceId: string;
  sourceTitle: string;
  chunkIndex: number;
}

@Injectable()
export class ConversationsService {
  constructor(private readonly database: DatabaseProvider) {}

  async create(agentId: string) {
    const [conversation] = await this.database.db
      .insert(conversations)
      .values({ agentId })
      .returning();

    return conversation;
  }

  async findById(id: string, agentId: string) {
    const [conversation] = await this.database.db
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.id, id),
          eq(conversations.agentId, agentId),
        ),
      );

    return conversation;
  }

  async addMessage(
    conversationId: string,
    role: MessageRole,
    content: string,
    sources?: MessageSource[],
  ) {
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

  async getMessages(conversationId: string) {
    return this.database.db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);
  }

  async findAllByAgentId(agentId: string) {

    return this.database.db
      .select()
      .from(conversations)
      .where(eq(conversations.agentId, agentId))
      .orderBy(desc(conversations.updatedAt));
  }

  async updateTitle(id: string, title: string) {
    const [conversation] = await this.database.db
      .update(conversations)
      .set({
        title,
        updatedAt: new Date(),
      })
      .where(eq(conversations.id, id))
      .returning();

    return conversation;
  }
}