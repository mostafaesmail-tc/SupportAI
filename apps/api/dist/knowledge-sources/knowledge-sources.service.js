var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseProvider } from '../db/database.provider.js';
import { knowledgeSources, agents } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
let KnowledgeSourcesService = class KnowledgeSourcesService {
    database;
    constructor(database) {
        this.database = database;
    }
    async ensureAgentExists(agentId) {
        const [agent] = await this.database.db
            .select({ id: agents.id })
            .from(agents)
            .where(eq(agents.id, agentId))
            .limit(1);
        if (!agent) {
            throw new NotFoundException(`Agent with ID ${agentId} not found`);
        }
    }
    async createKnowledgeSource(agentId, input) {
        await this.ensureAgentExists(agentId);
        const values = {
            agentId: agentId,
            title: input.title,
            content: input.content,
        };
        return await this.database.db.insert(knowledgeSources).values(values).returning();
    }
    async findAllKnowledgeSourcesByAgentId(agentId) {
        await this.ensureAgentExists(agentId);
        const knowledgeSourcesList = await this.database.db
            .select()
            .from(knowledgeSources)
            .where(eq(knowledgeSources.agentId, agentId));
        return knowledgeSourcesList;
    }
    async findKnowledgeSourceById(agentId, knowledgeSourceId) {
        await this.ensureAgentExists(agentId);
        const [knowledgeSource] = await this.database.db
            .select()
            .from(knowledgeSources)
            .where(and(eq(knowledgeSources.agentId, agentId), eq(knowledgeSources.id, knowledgeSourceId)))
            .limit(1);
        if (!knowledgeSource) {
            throw new NotFoundException(`Knowledge source with ID ${knowledgeSourceId} not found for agent with ID ${agentId}`);
        }
        return knowledgeSource;
    }
    async deleteKnowledgeSourceById(agentId, knowledgeSourceId) {
        await this.ensureAgentExists(agentId);
        const deleteResult = await this.database.db
            .delete(knowledgeSources)
            .where(and(eq(knowledgeSources.agentId, agentId), eq(knowledgeSources.id, knowledgeSourceId)))
            .returning();
        if (deleteResult.length === 0) {
            throw new NotFoundException(`Knowledge source with ID ${knowledgeSourceId} not found for agent with ID ${agentId}`);
        }
        return deleteResult[0];
    }
};
KnowledgeSourcesService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [DatabaseProvider])
], KnowledgeSourcesService);
export { KnowledgeSourcesService };
//# sourceMappingURL=knowledge-sources.service.js.map