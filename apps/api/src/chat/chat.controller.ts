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

@Controller('agents/:agentId/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async chat(
    @Param('agentId') agentId: string,
    @Body() dto: ChatRequestDto,
  ) {
    return this.chatService.generateAnswer(agentId, dto.question, dto.conversationId);
  }
}