import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseProvider } from '../db/database.provider.js';
import { CreateKnowledgeSourceDto } from './dto/create-knowledge-source.dto.js';
import { knowledgeSources, agents } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';


@Injectable()
export class KnowledgeSourcesService {

    constructor(private readonly database: DatabaseProvider) {}
    private async ensureAgentExists(agentId: string): Promise<void> {

        const [agent] = await this.database.db
            .select({ id: agents.id })
            .from(agents)
            .where(eq(agents.id, agentId))
            .limit(1);

        if (!agent) {
            throw new NotFoundException(
                `Agent with ID ${agentId} not found`,
                );
            }
    }

    async createKnowledgeSource(agentId: string, input: CreateKnowledgeSourceDto) {
        await this.ensureAgentExists(agentId);
        
        const values = {
            agentId: agentId,
            title: input.title,
            content: input.content,
        };

        return await this.database.db.insert(knowledgeSources).values(values).returning();
    }

    async findAllKnowledgeSourcesByAgentId(agentId: string) {
        await this.ensureAgentExists(agentId);

        const knowledgeSourcesList = await this.database.db
        .select()
        .from(knowledgeSources)
        .where(eq(knowledgeSources.agentId, agentId));

        return knowledgeSourcesList;
    }

    async findKnowledgeSourceById(agentId: string, knowledgeSourceId: string) {
        await this.ensureAgentExists(agentId);
        
        const [knowledgeSource] = await this.database.db
        .select()
        .from(knowledgeSources)
        .where(
            and(
                eq(knowledgeSources.agentId, agentId),
                eq(knowledgeSources.id, knowledgeSourceId),
            ),
        )
        .limit(1);

        if (!knowledgeSource) {
            throw new NotFoundException(
                `Knowledge source with ID ${knowledgeSourceId} not found for agent with ID ${agentId}`,
                );
            }

        return knowledgeSource;
    }

    async deleteKnowledgeSourceById(agentId: string, knowledgeSourceId: string) {
        await this.ensureAgentExists(agentId);

        const deleteResult = await this.database.db
        .delete(knowledgeSources)
        .where(
            and(
                eq(knowledgeSources.agentId, agentId),
                eq(knowledgeSources.id, knowledgeSourceId),
            ),
        )
        .returning();

        if (deleteResult.length === 0) {
            throw new NotFoundException(
                `Knowledge source with ID ${knowledgeSourceId} not found for agent with ID ${agentId}`,
                );
            }

        return deleteResult[0];
    }
}
