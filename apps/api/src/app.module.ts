import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AgentsModule } from './agents/agents.module.js';
import { KnowledgeSourcesModule } from './knowledge-sources/knowledge-sources.module.js';
import { LlmModule } from './llm/llm.module.js';
import { ChatModule } from './chat/chat.module.js';
import { AuthModule } from './auth/auth.module.js';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard.js';
@Module({
  imports: [
    AuthModule,
    AgentsModule,
    KnowledgeSourcesModule,
    LlmModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
