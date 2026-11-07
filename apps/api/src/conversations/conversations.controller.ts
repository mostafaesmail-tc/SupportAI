import {
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';

import { ConversationsService } from './conversations.service.js';
import { AgentsService } from '../agents/agents.service.js';

@Controller('agents/:agentId/conversations')
export class ConversationsController {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly agentsService: AgentsService,
  ) {}

  @Get()
  async findAll(@Param('agentId') agentId: string) {
    const agent = await this.agentsService.findOneAgentById(agentId);

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    return this.conversationsService.findAllByAgentId(agentId);
  }

  @Get(':conversationId/messages')
  async getMessages(
    @Param('agentId') agentId: string,
    @Param('conversationId') conversationId: string,
  ) {
    const conversation = await this.conversationsService.findById(
      conversationId,
      agentId,
    );

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return this.conversationsService.getMessages(conversationId);
  }
}