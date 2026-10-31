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
import { eq } from 'drizzle-orm';
import { agents } from '../db/schema.js';
import { DatabaseProvider } from '../db/database.provider.js';
let AgentsService = class AgentsService {
    database;
    constructor(database) {
        this.database = database;
    }
    async create(input) {
        const values = {
            name: input.name,
            systemPrompt: input.systemPrompt,
            ...(input.description !== undefined
                ? { description: input.description }
                : null),
        };
        const [agent] = await this.database.db
            .insert(agents)
            .values(values)
            .returning();
        return agent;
    }
    async findAll() {
        return this.database.db.select().from(agents);
    }
    async findOneAgentById(id) {
        const [agent] = await this.database.db
            .select()
            .from(agents)
            .where(eq(agents.id, id));
        return agent;
    }
    async updateAgentById(id, input) {
        const values = {
            name: input.name,
            systemPrompt: input.systemPrompt,
            ...(input.description !== undefined
                ? { description: input.description }
                : null),
        };
        const [agent] = await this.database.db
            .update(agents)
            .set(values)
            .where(eq(agents.id, id))
            .returning();
        return agent;
    }
    async deleteAgentById(id) {
        const [agent] = await this.database.db
            .delete(agents)
            .where(eq(agents.id, id))
            .returning();
        return agent;
    }
};
AgentsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [DatabaseProvider])
], AgentsService);
export { AgentsService };
//# sourceMappingURL=agents.service.js.map