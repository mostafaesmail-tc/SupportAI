import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module.js';
import { ConversationsService } from './conversations.service.js';
import { ConversationsController } from './conversations.controller.js';
import { AgentsService } from '../agents/agents.service.js';
@Module({
  imports: [DatabaseModule],
  providers: [ConversationsService, AgentsService],
  exports: [ConversationsService],
  controllers: [ConversationsController],
})
export class ConversationsModule {}