import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { agents } from '../db/schema.js';
import { DatabaseProvider } from '../db/database.provider.js';
import { CreateAgentDto } from './dto/create-agent.dto.js';
import { UpdateAgentDto } from './dto/update-agent.dto.js';

@Injectable()
export class AgentsService {
  constructor(private readonly database: DatabaseProvider) {}

  async create(input: CreateAgentDto) {
    const [agent] = await this.database.db
      .insert(agents)
      .values({
        name: input.name,
        systemPrompt: input.systemPrompt,
        description: input.description,
      })
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

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    return agent;
  }

  async updateAgentById(id: string, input: UpdateAgentDto) {
    if (Object.keys(input).length === 0) {
      throw new BadRequestException('At least one field must be provided');
    }

    const values = {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.systemPrompt !== undefined && {
        systemPrompt: input.systemPrompt,
      }),
      ...(input.description !== undefined && {
        description: input.description,
      }),
    };

    const [agent] = await this.database.db
      .update(agents)
      .set(values)
      .where(eq(agents.id, id))
      .returning();

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    return agent;
  }

  async deleteAgentById(id: string) {
    const [agent] = await this.database.db
      .delete(agents)
      .where(eq(agents.id, id))
      .returning();

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    return agent;
  }
}