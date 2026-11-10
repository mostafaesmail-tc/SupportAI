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

@Controller('agents')
export class AgentsController {
  constructor(
    private readonly agentsService: AgentsService,
    private readonly knowledgeProcessingService: KnowledgeProcessingService,
  ) {}

  @Post()
  create(@Body() dto: CreateAgentDto) {
    return this.agentsService.create(dto);
  }

  @Get()
  findAll() {
    return this.agentsService.findAll();
  }

  @Get(':id')
  findOneAgentById(@Param('id') id: string) {
    return this.agentsService.findOneAgentById(id);
  }

  @Patch(':id')
  updateAgentById(
    @Param('id') id: string,
    @Body() dto: UpdateAgentDto,
  ) {
    return this.agentsService.updateAgentById(id, dto);
  }

  @Delete(':id')
  deleteAgentById(@Param('id') id: string) {
    return this.agentsService.deleteAgentById(id);
  }

  @Get(':agentId/search')
  searchKnowledge(
    @Param('agentId') agentId: string,
    @Query() query: SearchKnowledgeDto,
  ) {
    return this.knowledgeProcessingService.searchKnowledge(
      agentId,
      query.q,
    );
  }
}