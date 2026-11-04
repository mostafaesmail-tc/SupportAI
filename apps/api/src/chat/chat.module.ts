
import { Module } from '@nestjs/common';

import { KnowledgeSourcesModule } from '../knowledge-sources/knowledge-sources.module.js';
import { LlmModule } from '../llm/llm.module.js';
import { ChatController } from './chat.controller.js';
import { ChatService } from './chat.service.js';
import { AgentsModule } from '../agents/agents.module.js';

@Module({
  imports: [KnowledgeSourcesModule, LlmModule, AgentsModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
