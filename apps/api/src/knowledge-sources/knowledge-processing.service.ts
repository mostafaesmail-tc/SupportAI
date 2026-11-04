
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { and, eq, sql } from 'drizzle-orm';
import { SearchResult } from './interfaces/search-result.interface.js';

import { DatabaseProvider } from '../db/database.provider.js';
import { EmbeddingService } from '../embeddings/embedding.service.js';

import {
  knowledgeSources,
  knowledgeSourceChunks,
} from '../db/schema.js';

import { chunkText } from './text-chunker.js';

@Injectable()
export class KnowledgeProcessingService {
  constructor(
    private readonly database: DatabaseProvider,
    private readonly embeddingService: EmbeddingService
  ) {}

  async searchKnowledge(
    agentId: string,
    question: string,
    limit = 5,
    maxDistance = 0.5
  ): Promise<SearchResult[]> {
    const queryEmbedding =
      await this.embeddingService.generateEmbedding(question);

    const similarity = sql<number>`
      ${knowledgeSourceChunks.embedding} <=> ${JSON.stringify(queryEmbedding)}::vector
    `;

    const results = await this.database.db
      .select({
        content: knowledgeSourceChunks.content,
        distance: similarity,
        sourceId: knowledgeSourceChunks.knowledgeSourceId,
        sourceTitle: knowledgeSources.title,
        chunkIndex: knowledgeSourceChunks.chunkIndex,
      })
      .from(knowledgeSourceChunks)
      .innerJoin(
        knowledgeSources,
        eq(
          knowledgeSourceChunks.knowledgeSourceId,
          knowledgeSources.id,
        ),
      )
      .where(
        sql`
          ${knowledgeSources.agentId} = ${agentId}
          AND ${knowledgeSources.status} = 'ready'
          AND ${knowledgeSourceChunks.embedding} IS NOT NULL
        `,
      )
      .orderBy(similarity)
      .limit(limit);

    return results.filter(
    (result) => result.distance <= maxDistance,
  );
  }

  async processKnowledgeSource(
    agentId: string,
    knowledgeSourceId: string,
  ) {
    const [source] = await this.database.db
      .select()
      .from(knowledgeSources)
      .where(
        and(
          eq(knowledgeSources.id, knowledgeSourceId),
          eq(knowledgeSources.agentId, agentId),
        ),
      )
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
      const chunksWithEmbeddings = await Promise.all(
      chunks.map(async (content, chunkIndex) => ({
        content,
        chunkIndex,
        embedding: await this.embeddingService.generateEmbedding(content),
      })),
    );
      if (chunks.length === 0) {
        throw new BadRequestException(
          'Knowledge source contains no usable text',
        );
      }

      await this.database.db.transaction(async (tx) => {
        // Remove old chunks so reprocessing doesn't duplicate them.
        await tx
          .delete(knowledgeSourceChunks)
          .where(
            eq(
              knowledgeSourceChunks.knowledgeSourceId,
              source.id,
            ),
          );

        // Save chunks with zero-based indexes.
        await tx.insert(knowledgeSourceChunks).values(
          chunksWithEmbeddings.map((chunk) => ({
            knowledgeSourceId: source.id,
            content: chunk.content,
            chunkIndex: chunk.chunkIndex,
            embedding: chunk.embedding,
          })),
        );

        // Mark ready in the same transaction as the chunk writes.
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
        status: 'ready' as const,
        chunkCount: chunks.length,
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
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
}