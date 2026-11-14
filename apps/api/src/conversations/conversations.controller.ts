
import {
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';

import { ConversationsService } from './conversations.service.js';
import { AgentsService } from '../agents/agents.service.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator.js';

@Controller('agents/:agentId/conversations')
export class ConversationsController {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly agentsService: AgentsService,
  ) {}

  @Get()
  async findAll(
    @Param('agentId') agentId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const agent = await this.agentsService.findOneAgentById(
      agentId,
      user.id,
    );

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    return this.conversationsService.findAllByAgentId(agentId);
  }

  @Get(':conversationId/messages')
  async getMessages(
    @Param('agentId') agentId: string,
    @Param('conversationId') conversationId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const agent = await this.agentsService.findOneAgentById(
      agentId,
      user.id,
    );

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

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
