import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  ParseUUIDPipe,
  Delete,
  Query,
  NotFoundException,
} from '@nestjs/common';

import { KnowledgeSourcesService } from './knowledge-sources.service.js';
import { CreateKnowledgeSourceDto } from './dto/create-knowledge-source.dto.js';
import { KnowledgeProcessingService } from './knowledge-processing.service.js';
import { AgentsService } from '../agents/agents.service.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator.js';

@Controller('agents/:agentId/knowledge-sources')
export class KnowledgeSourcesController {
  constructor(
    private readonly knowledgeSourcesService: KnowledgeSourcesService,
    private readonly knowledgeProcessingService: KnowledgeProcessingService,
    private readonly agentsService: AgentsService,
  ) {}

  private async ensureAgentOwnership(
    agentId: string,
    user: AuthenticatedUser,
  ): Promise<void> {
    const agent = await this.agentsService.findOneAgentById(
      agentId,
      user.id,
    );

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }
  }

  @Post()
  async create(
    @Param('agentId', ParseUUIDPipe) agentId: string,
    @Body() input: CreateKnowledgeSourceDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.ensureAgentOwnership(agentId, user);

    return this.knowledgeSourcesService.createKnowledgeSource(
      agentId,
      input,
    );
  }

  @Get()
  async findAllByAgentId(
    @Param('agentId', ParseUUIDPipe) agentId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.ensureAgentOwnership(agentId, user);

    return this.knowledgeSourcesService.findAllKnowledgeSourcesByAgentId(
      agentId,
    );
  }

  @Get('search')
  async searchKnowledge(
    @Param('agentId', ParseUUIDPipe) agentId: string,
    @Query('q') question: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.ensureAgentOwnership(agentId, user);

    return this.knowledgeProcessingService.searchKnowledge(
      agentId,
      question,
    );
  }

  @Get(':knowledgeSourceId')
  async findOneById(
    @Param('agentId', ParseUUIDPipe) agentId: string,
    @Param('knowledgeSourceId', ParseUUIDPipe) knowledgeSourceId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.ensureAgentOwnership(agentId, user);

    return this.knowledgeSourcesService.findKnowledgeSourceById(
      agentId,
      knowledgeSourceId,
    );
  }

  @Delete(':knowledgeSourceId')
  async deleteById(
    @Param('agentId', ParseUUIDPipe) agentId: string,
    @Param('knowledgeSourceId', ParseUUIDPipe) knowledgeSourceId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.ensureAgentOwnership(agentId, user);

    return this.knowledgeSourcesService.deleteKnowledgeSourceById(
      agentId,
      knowledgeSourceId,
    );
  }

  @Post(':knowledgeSourceId/process')
  async processKnowledgeSource(
    @Param('agentId', ParseUUIDPipe) agentId: string,
    @Param('knowledgeSourceId', ParseUUIDPipe) knowledgeSourceId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.ensureAgentOwnership(agentId, user);

    return this.knowledgeProcessingService.processKnowledgeSource(
      agentId,
      knowledgeSourceId,
    );
  }
}