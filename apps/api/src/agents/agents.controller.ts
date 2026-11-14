
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Param,
  Query,
} from '@nestjs/common';

import { AgentsService } from './agents.service.js';
import { CreateAgentDto } from './dto/create-agent.dto.js';
import { UpdateAgentDto } from './dto/update-agent.dto.js';
import { SearchKnowledgeDto } from './dto/search-knowledge.dto.js';
import { KnowledgeProcessingService } from '../knowledge-sources/knowledge-processing.service.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator.js';

@Controller('agents')
export class AgentsController {
  constructor(
    private readonly agentsService: AgentsService,
    private readonly knowledgeProcessingService: KnowledgeProcessingService,
  ) {}

  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateAgentDto,
  ) {
    return this.agentsService.create(user.id, dto);
  }

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.agentsService.findAll(user.id);
  }

  @Get(':id')
  findOneAgentById(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.agentsService.findOneAgentById(id, user.id);
  }

  @Patch(':id')
  updateAgentById(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateAgentDto,
  ) {
    return this.agentsService.updateAgentById(id, user.id, dto);
  }

  @Delete(':id')
  deleteAgentById(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.agentsService.deleteAgentById(id, user.id);
  }

  @Get(':agentId/search')
  async searchKnowledge(
    @Param('agentId') agentId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: SearchKnowledgeDto,
  ) {
    // Verify ownership before searching the agent's knowledge base.
    await this.agentsService.findOneAgentById(agentId, user.id);

    return this.knowledgeProcessingService.searchKnowledge(
      agentId,
      query.q,
    );
  }
}
