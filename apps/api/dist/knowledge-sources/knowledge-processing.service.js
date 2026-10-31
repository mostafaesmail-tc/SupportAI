var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BadRequestException, Injectable, NotFoundException, } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { DatabaseProvider } from '../db/database.provider.js';
import { EmbeddingService } from '../embeddings/embedding.service.js';
import { knowledgeSources, knowledgeSourceChunks, } from '../db/schema.js';
import { chunkText } from './text-chunker.js';
let KnowledgeProcessingService = class KnowledgeProcessingService {
    database;
    embeddingService;
    constructor(database, embeddingService) {
        this.database = database;
        this.embeddingService = embeddingService;
    }
    async processKnowledgeSource(agentId, knowledgeSourceId) {
        const [source] = await this.database.db
            .select()
            .from(knowledgeSources)
            .where(and(eq(knowledgeSources.id, knowledgeSourceId), eq(knowledgeSources.agentId, agentId)))
            .limit(1);
        if (!source) {
            throw new NotFoundException('Knowledge source not found');
        }
        await this.database.db
            .update(knowledgeSources)
            .set({
            status: 'processing',
            errorMessage: null,
            updatedAt: new Date(),
        })
            .where(eq(knowledgeSources.id, source.id));
        try {
            const chunks = chunkText(source.content);
            const chunksWithEmbeddings = await Promise.all(chunks.map(async (content, chunkIndex) => ({
                content,
                chunkIndex,
                embedding: await this.embeddingService.generateEmbedding(content),
            })));
            if (chunks.length === 0) {
                throw new BadRequestException('Knowledge source contains no usable text');
            }
            await this.database.db.transaction(async (tx) => {
                await tx
                    .delete(knowledgeSourceChunks)
                    .where(eq(knowledgeSourceChunks.knowledgeSourceId, source.id));
                await tx.insert(knowledgeSourceChunks).values(chunksWithEmbeddings.map((chunk) => ({
                    knowledgeSourceId: source.id,
                    content: chunk.content,
                    chunkIndex: chunk.chunkIndex,
                    embedding: chunk.embedding,
                })));
                await tx
                    .update(knowledgeSources)
                    .set({
                    status: 'ready',
                    errorMessage: null,
                    updatedAt: new Date(),
                })
                    .where(eq(knowledgeSources.id, source.id));
            });
            return {
                knowledgeSourceId: source.id,
                status: 'ready',
                chunkCount: chunks.length,
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'An unexpected processing error occurred';
            await this.database.db
                .update(knowledgeSources)
                .set({
                status: 'failed',
                errorMessage: errorMessage.slice(0, 1000),
                updatedAt: new Date(),
            })
                .where(eq(knowledgeSources.id, source.id));
            throw error;
        }
    }
};
KnowledgeProcessingService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [DatabaseProvider,
        EmbeddingService])
], KnowledgeProcessingService);
export { KnowledgeProcessingService };
//# sourceMappingURL=knowledge-processing.service.js.map