
import { Module } from '@nestjs/common';

import { KnowledgeSourcesController } from './knowledge-sources.controller.js';
import { KnowledgeSourcesService } from './knowledge-sources.service.js';
import { KnowledgeProcessingService } from './knowledge-processing.service.js';

import { DatabaseModule } from '../db/database.module.js';
import { EmbeddingModule } from '../embeddings/embedding.module.js';
import { AgentsModule } from '../agents/agents.module.js';

@Module({
  imports: [DatabaseModule, EmbeddingModule, AgentsModule],
  exports: [KnowledgeProcessingService],
  controllers: [KnowledgeSourcesController],
  providers: [
    KnowledgeSourcesService,
    KnowledgeProcessingService,
  ],
})
export class KnowledgeSourcesModule {}
