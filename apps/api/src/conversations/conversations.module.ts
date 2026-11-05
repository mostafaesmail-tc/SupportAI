import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module.js';
import { ConversationsService } from './conversations.service.js';

@Module({
  imports: [DatabaseModule],
  providers: [ConversationsService],
  exports: [ConversationsService],
})
export class ConversationsModule {}