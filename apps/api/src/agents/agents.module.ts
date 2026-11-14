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

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxZDY1YmU1OC04MzQyLTQ0ZmMtOGFjMy03MmE0YzRiYTViZjUiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE3OTQ0MTM2MDIsImV4cCI6MTc5NDQxNDUwMn0.tpnQWhgnYPszHgZbDlrKth74uaiWqcTpPI03gvQIvkA

// 

/*


*/
