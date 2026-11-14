
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';

import { ChatService } from './chat.service.js';
import { ChatRequestDto } from './dto/chat-request.dto.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator.js';

@Controller('agents/:agentId/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async chat(
    @Param('agentId') agentId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ChatRequestDto,
  ) {
    return this.chatService.generateAnswer(
      agentId,
      user.id,
      dto.question,
      dto.conversationId,
    );
  }
}
