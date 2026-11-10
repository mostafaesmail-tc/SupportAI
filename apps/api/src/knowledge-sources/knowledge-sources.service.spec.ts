
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { KnowledgeSourcesService } from './knowledge-sources.service.js';
import { DatabaseProvider } from '../db/database.provider.js';

describe('KnowledgeSourcesService', () => {
  let service: KnowledgeSourcesService;

  const mockDb = {
    select: vi.fn(),
    insert: vi.fn(),
    delete: vi.fn(),
  };

  const mockDatabase = { db: mockDb };

  const agentId = 'agent-uuid';
  const sourceId = 'source-uuid';

  const mockAgent = { id: agentId };

  const mockSource = {
    id: sourceId,
    agentId,
    title: 'Support documentation',
    content: 'Instructions for resetting passwords.',
  };

  // Every public operation first checks whether its agent exists.
  function mockExistingAgent() {
    const limit = vi.fn().mockResolvedValue([mockAgent]);
    const where = vi.fn().mockReturnValue({ limit });
    const from = vi.fn().mockReturnValue({ where });

    mockDb.select.mockReturnValueOnce({ from });
  }

  function mockMissingAgent() {
    const limit = vi.fn().mockResolvedValue([]);
    const where = vi.fn().mockReturnValue({ limit });
    const from = vi.fn().mockReturnValue({ where });

    mockDb.select.mockReturnValueOnce({ from });
  }

  beforeEach(() => {
    vi.clearAllMocks();
    service = new KnowledgeSourcesService(
      mockDatabase as unknown as DatabaseProvider,
    );
  });

  describe('createKnowledgeSource', () => {
    it('creates a knowledge source for an existing agent', async () => {
      mockExistingAgent();

      const input = {
        title: mockSource.title,
        content: mockSource.content,
      };

      const returning = vi.fn().mockResolvedValue([mockSource]);
      const values = vi.fn().mockReturnValue({ returning });

      mockDb.insert.mockReturnValue({ values });

      const result = await service.createKnowledgeSource(agentId, input);

      expect(result).toEqual([mockSource]);
      expect(values).toHaveBeenCalledWith({
        agentId,
        ...input,
      });
    });

    it('throws NotFoundException when the agent does not exist', async () => {
      mockMissingAgent();

      await expect(
        service.createKnowledgeSource(agentId, {
          title: 'Test',
          content: 'Test content',
        }),
      ).rejects.toThrow(NotFoundException);

      expect(mockDb.insert).not.toHaveBeenCalled();
    });
  });

  describe('findAllKnowledgeSourcesByAgentId', () => {
    it('returns all knowledge sources belonging to an agent', async () => {
      mockExistingAgent();

      const sources = [mockSource];
      const where = vi.fn().mockResolvedValue(sources);
      const from = vi.fn().mockReturnValue({ where });

      mockDb.select.mockReturnValueOnce({ from });

      const result =
        await service.findAllKnowledgeSourcesByAgentId(agentId);

      expect(result).toEqual(sources);
      expect(where).toHaveBeenCalled();
    });

    it('throws NotFoundException when the agent does not exist', async () => {
      mockMissingAgent();

      await expect(
        service.findAllKnowledgeSourcesByAgentId(agentId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findKnowledgeSourceById', () => {
    it('returns a knowledge source belonging to the specified agent', async () => {
      mockExistingAgent();

      const limit = vi.fn().mockResolvedValue([mockSource]);
      const where = vi.fn().mockReturnValue({ limit });
      const from = vi.fn().mockReturnValue({ where });

      mockDb.select.mockReturnValueOnce({ from });

      const result = await service.findKnowledgeSourceById(
        agentId,
        sourceId,
      );

      expect(result).toEqual(mockSource);
      expect(where).toHaveBeenCalled();
    });

    it('throws NotFoundException when the source does not exist for the agent', async () => {
      mockExistingAgent();

      const limit = vi.fn().mockResolvedValue([]);
      const where = vi.fn().mockReturnValue({ limit });
      const from = vi.fn().mockReturnValue({ where });

      mockDb.select.mockReturnValueOnce({ from });

      await expect(
        service.findKnowledgeSourceById(agentId, sourceId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteKnowledgeSourceById', () => {
    it('deletes and returns a knowledge source', async () => {
      mockExistingAgent();

      const returning = vi.fn().mockResolvedValue([mockSource]);
      const where = vi.fn().mockReturnValue({ returning });

      mockDb.delete.mockReturnValue({ where });

      const result = await service.deleteKnowledgeSourceById(
        agentId,
        sourceId,
      );

      expect(result).toEqual(mockSource);
      expect(where).toHaveBeenCalled();
    });

    it('throws NotFoundException when the source does not exist for the agent', async () => {
      mockExistingAgent();

      const returning = vi.fn().mockResolvedValue([]);
      const where = vi.fn().mockReturnValue({ returning });

      mockDb.delete.mockReturnValue({ where });

      await expect(
        service.deleteKnowledgeSourceById(agentId, sourceId),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException when the agent does not exist', async () => {
      mockMissingAgent();

      await expect(
        service.deleteKnowledgeSourceById(agentId, sourceId),
      ).rejects.toThrow(NotFoundException);

      expect(mockDb.delete).not.toHaveBeenCalled();
    });
  });
});
