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
import { Controller, Get, NotFoundException, Param, } from '@nestjs/common';
import { ConversationsService } from './conversations.service.js';
import { AgentsService } from '../agents/agents.service.js';
let ConversationsController = class ConversationsController {
    conversationsService;
    agentsService;
    constructor(conversationsService, agentsService) {
        this.conversationsService = conversationsService;
        this.agentsService = agentsService;
    }
    async findAll(agentId) {
        const agent = await this.agentsService.findOneAgentById(agentId);
        if (!agent) {
            throw new NotFoundException('Agent not found');
        }
        return this.conversationsService.findAllByAgentId(agentId);
    }
    async getMessages(agentId, conversationId) {
        const conversation = await this.conversationsService.findById(conversationId, agentId);
        if (!conversation) {
            throw new NotFoundException('Conversation not found');
        }
        return this.conversationsService.getMessages(conversationId);
    }
};
__decorate([
    Get(),
    __param(0, Param('agentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConversationsController.prototype, "findAll", null);
__decorate([
    Get(':conversationId/messages'),
    __param(0, Param('agentId')),
    __param(1, Param('conversationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ConversationsController.prototype, "getMessages", null);
ConversationsController = __decorate([
    Controller('agents/:agentId/conversations'),
    __metadata("design:paramtypes", [ConversationsService,
        AgentsService])
], ConversationsController);
export { ConversationsController };
//# sourceMappingURL=conversations.controller.js.map