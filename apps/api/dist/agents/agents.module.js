var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { AgentsController } from './agents.controller.js';
import { AgentsService } from './agents.service.js';
import { DatabaseModule } from '../db/database.module.js';
import { KnowledgeProcessingService } from '../knowledge-sources/knowledge-processing.service.js';
import { EmbeddingModule } from '../embeddings/embedding.module.js';
let AgentsModule = class AgentsModule {
};
AgentsModule = __decorate([
    Module({
        imports: [DatabaseModule, EmbeddingModule],
        controllers: [AgentsController],
        providers: [AgentsService, KnowledgeProcessingService],
        exports: [AgentsService]
    })
], AgentsModule);
export { AgentsModule };
//# sourceMappingURL=agents.module.js.map