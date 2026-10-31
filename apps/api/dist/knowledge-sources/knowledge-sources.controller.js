var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Param, Post, Body, ParseUUIDPipe, Delete } from '@nestjs/common';
import { KnowledgeSourcesService } from './knowledge-sources.service.js';
import { CreateKnowledgeSourceDto } from './dto/create-knowledge-source.dto.js';
import { KnowledgeProcessingService } from './knowledge-processing.service.js';
let KnowledgeSourcesController = class KnowledgeSourcesController {
    knowledgeSourcesService;
    knowledgeProcessingService;
    constructor(knowledgeSourcesService, knowledgeProcessingService) {
        this.knowledgeSourcesService = knowledgeSourcesService;
        this.knowledgeProcessingService = knowledgeProcessingService;
    }
    create(agentId, input) {
        return this.knowledgeSourcesService.createKnowledgeSource(agentId, input);
    }
    findAllByAgentId(agentId) {
        return this.knowledgeSourcesService.findAllKnowledgeSourcesByAgentId(agentId);
    }
    findOneById(agentId, knowledgeSourceId) {
        return this.knowledgeSourcesService.findKnowledgeSourceById(agentId, knowledgeSourceId);
    }
    deleteById(agentId, knowledgeSourceId) {
        return this.knowledgeSourcesService.deleteKnowledgeSourceById(agentId, knowledgeSourceId);
    }
    processKnowledgeSource(agentId, knowledgeSourceId) {
        return this.knowledgeProcessingService.processKnowledgeSource(agentId, knowledgeSourceId);
    }
};
__decorate([
    Post(),
    __param(0, Param('agentId')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CreateKnowledgeSourceDto]),
    __metadata("design:returntype", void 0)
], KnowledgeSourcesController.prototype, "create", null);
__decorate([
    Get(),
    __param(0, Param('agentId', new ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], KnowledgeSourcesController.prototype, "findAllByAgentId", null);
__decorate([
    Get(':knowledgeSourceId'),
    __param(0, Param('agentId', new ParseUUIDPipe())),
    __param(1, Param('knowledgeSourceId', new ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], KnowledgeSourcesController.prototype, "findOneById", null);
__decorate([
    Delete(':knowledgeSourceId'),
    __param(0, Param('agentId', new ParseUUIDPipe())),
    __param(1, Param('knowledgeSourceId', new ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], KnowledgeSourcesController.prototype, "deleteById", null);
__decorate([
    Post(':knowledgeSourceId/process'),
    __param(0, Param('agentId')),
    __param(1, Param('knowledgeSourceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], KnowledgeSourcesController.prototype, "processKnowledgeSource", null);
KnowledgeSourcesController = __decorate([
    Controller('agents/:agentId/knowledge-sources'),
    __metadata("design:paramtypes", [KnowledgeSourcesService, KnowledgeProcessingService])
], KnowledgeSourcesController);
export { KnowledgeSourcesController };
//# sourceMappingURL=knowledge-sources.controller.js.map