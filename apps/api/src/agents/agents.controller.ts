import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Param,
  Query
} from '@nestjs/common';
import { AgentsService } from './agents.service.js';
import { CreateAgentDto } from './dto/create-agent.dto.js';
import { UpdateAgentDto } from './dto/update-agent.dto.js';
import { KnowledgeProcessingService } from '../knowledge-sources/knowledge-processing.service.js';

@Controller('agents')
export class AgentsController {
  constructor(
    private readonly agentsService: AgentsService,
    private readonly knowledgeProcessingService: KnowledgeProcessingService,
  ) {}

  @Post()
  create(@Body() createAgentDto: CreateAgentDto) {

    return this.agentsService.create(createAgentDto);
  }

  @Get()
  findAll() {
    return this.agentsService.findAll();
  }

  @Get(':id')
  findOneAgentById(@Param('id')id: string) {
    return this.agentsService.findOneAgentById(id);
  }

  @Patch(':id')
  updateAgentById(@Param('id')id: string, @Body() updateAgentDto: UpdateAgentDto) {
    return this.agentsService.updateAgentById(id, updateAgentDto);
  }

  @Delete(':id')
  deleteAgentById(@Param('id')id: string) {
    return this.agentsService.deleteAgentById(id);
  }

      @Get(':agentId/search')
    searchKnowledge(
    @Param('agentId') agentId: string,
    @Query('q') question: string,
    ) {
    return this.knowledgeProcessingService.searchKnowledge(
        agentId,
        question,
    );
    }
}