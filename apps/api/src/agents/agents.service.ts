import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { agents } from '../db/schema.js';
import { DatabaseProvider } from '../db/database.provider.js';
import { CreateAgentDto } from './dto/create-agent.dto.js';
import { UpdateAgentDto } from './dto/update-agent.dto.js';

@Injectable()
export class AgentsService {
  constructor(private readonly database: DatabaseProvider) {}

  async create(input: CreateAgentDto) {
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

  async findOneAgentById(id: string) {

    const [agent] = await this.database.db
      .select()
      .from(agents)
      .where(eq(agents.id, id));

    return agent;
  }

  async updateAgentById(id: string, input: UpdateAgentDto) {
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

  async deleteAgentById(id: string) {
    const [agent] = await this.database.db
      .delete(agents)
      .where(eq(agents.id, id))
      .returning();

    return agent;
  }
}