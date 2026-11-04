import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AgentsModule } from './agents/agents.module.js';
import { KnowledgeSourcesModule } from './knowledge-sources/knowledge-sources.module.js';
import { LlmModule } from './llm/llm.module.js';
import { ChatModule } from './chat/chat.module.js';

@Module({
  imports: [AgentsModule, KnowledgeSourcesModule, LlmModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
