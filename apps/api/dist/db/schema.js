import { pgTable, uuid, varchar, text, timestamp, integer, unique, check, vector, jsonb, pgEnum, } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm/sql/sql';
export const agents = pgTable('agents', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 128 }).notNull(),
    description: text('description'),
    systemPrompt: text('system_prompt').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
export const knowledgeSources = pgTable('knowledge_sources', {
    id: uuid('id').defaultRandom().primaryKey(),
    agentId: uuid('agent_id')
        .notNull()
        .references(() => agents.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 256 }).notNull(),
    content: text('content').notNull(),
    status: varchar('status', { length: 20 })
        .$type()
        .notNull()
        .default('pending'),
    errorMessage: text('error_message'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
export const knowledgeSourceChunks = pgTable('knowledge_source_chunks', {
    id: uuid('id').defaultRandom().primaryKey(),
    knowledgeSourceId: uuid('knowledge_source_id')
        .notNull()
        .references(() => knowledgeSources.id, { onDelete: 'cascade' }),
    content: text('content').notNull(),
    chunkIndex: integer('chunk_index').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    embedding: vector('embedding', { dimensions: 768 }),
}, (table) => [
    unique('knowledge_source_chunks_source_index_unique').on(table.knowledgeSourceId, table.chunkIndex),
    check('knowledge_source_chunks_index_nonnegative', sql `${table.chunkIndex} >= 0`),
]);
export const conversations = pgTable('conversations', {
    id: uuid('id').defaultRandom().primaryKey(),
    agentId: uuid('agent_id')
        .notNull()
        .references(() => agents.id, { onDelete: 'cascade' }),
    title: varchar('title'),
    createdAt: timestamp('created_at')
        .defaultNow()
        .notNull(),
    updatedAt: timestamp('updated_at')
        .defaultNow()
        .notNull(),
});
export const messageRoleEnum = pgEnum('message_role', [
    'user',
    'assistant',
]);
export const messages = pgTable('messages', {
    id: uuid('id').defaultRandom().primaryKey(),
    conversationId: uuid('conversation_id')
        .notNull()
        .references(() => conversations.id, { onDelete: 'cascade' }),
    role: messageRoleEnum('role').notNull(),
    content: text('content').notNull(),
    sources: jsonb('sources'),
    createdAt: timestamp('created_at')
        .defaultNow()
        .notNull(),
});
//# sourceMappingURL=schema.js.map