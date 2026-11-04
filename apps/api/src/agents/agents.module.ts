import { Module } from '@nestjs/common';
import { AgentsController } from './agents.controller.js';
import { AgentsService } from './agents.service.js';
import { DatabaseModule } from '../db/database.module.js';
import { KnowledgeProcessingService } from '../knowledge-sources/knowledge-processing.service.js';
import { EmbeddingModule } from '../embeddings/embedding.module.js';

@Module({
  imports: [DatabaseModule, EmbeddingModule],
  controllers: [AgentsController],
  providers: [AgentsService, KnowledgeProcessingService],
  exports: [AgentsService]
})
export class AgentsModule {}