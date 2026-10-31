import { Controller, Get, Param, Post, Body, ParseUUIDPipe, Delete } from '@nestjs/common';
import { KnowledgeSourcesService } from './knowledge-sources.service.js';
import { CreateKnowledgeSourceDto } from './dto/create-knowledge-source.dto.js';
import { KnowledgeProcessingService } from './knowledge-processing.service.js';

@Controller('agents/:agentId/knowledge-sources')
export class KnowledgeSourcesController {

    constructor(private readonly knowledgeSourcesService: KnowledgeSourcesService, private readonly knowledgeProcessingService: KnowledgeProcessingService) {}

    @Post()
    create(@Param('agentId') agentId: string, @Body()input: CreateKnowledgeSourceDto) {
        return this.knowledgeSourcesService.createKnowledgeSource(agentId, input);
    }

    @Get()
    findAllByAgentId(@Param('agentId', new ParseUUIDPipe()) agentId: string) {
        return this.knowledgeSourcesService.findAllKnowledgeSourcesByAgentId(agentId);
    }

    @Get(':knowledgeSourceId')
    findOneById(@Param('agentId', new ParseUUIDPipe()) agentId: string, @Param('knowledgeSourceId', new ParseUUIDPipe()) knowledgeSourceId: string) {
        return this.knowledgeSourcesService.findKnowledgeSourceById(agentId, knowledgeSourceId);
    }

    @Delete(':knowledgeSourceId')
    deleteById(@Param('agentId', new ParseUUIDPipe()) agentId: string, @Param('knowledgeSourceId', new ParseUUIDPipe()) knowledgeSourceId: string) {
        return this.knowledgeSourcesService.deleteKnowledgeSourceById(agentId, knowledgeSourceId);
    }

    @Post(':knowledgeSourceId/process')
    processKnowledgeSource(
    @Param('agentId') agentId: string,
    @Param('knowledgeSourceId') knowledgeSourceId: string,
    ) {
    return this.knowledgeProcessingService.processKnowledgeSource(
        agentId,
        knowledgeSourceId,
    );
    }
}
