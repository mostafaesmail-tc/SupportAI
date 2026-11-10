import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { AgentsService } from './agents.service.js';
import { DatabaseProvider } from '../db/database.provider.js';

describe('AgentsService', () => {
  let service: AgentsService;

  const mockDb = {
    insert: vi.fn(),
    select: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  const mockDatabase = {
    db: mockDb,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    service = new AgentsService(
      mockDatabase as unknown as DatabaseProvider,
    );
  });

  describe('create', () => {
    it('should create and return an agent', async () => {
      const input = {
        name: 'Support Agent',
        systemPrompt: 'You are a helpful support assistant.',
        description: 'Customer support agent',
      };

      const expectedAgent = {
        id: 'agent-uuid',
        ...input,
      };

      mockDb.insert.mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([expectedAgent]),
        }),
      });

      const result = await service.create(input);

      expect(result).toEqual(expectedAgent);
      expect(mockDb.insert).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all agents', async () => {
      const expectedAgents = [
        { id: 'agent-1', name: 'Agent One' },
        { id: 'agent-2', name: 'Agent Two' },
      ];

      mockDb.select.mockReturnValue({
        from: vi.fn().mockResolvedValue(expectedAgents),
      });

      const result = await service.findAll();

      expect(result).toEqual(expectedAgents);
    });
  });

  describe('findOneAgentById', () => {
    it('should return an agent when it exists', async () => {
      const expectedAgent = {
        id: 'agent-uuid',
        name: 'Support Agent',
      };

      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([expectedAgent]),
        }),
      });

      const result = await service.findOneAgentById('agent-uuid');

      expect(result).toEqual(expectedAgent);
    });

    it('should throw NotFoundException when agent does not exist', async () => {
      mockDb.select.mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      });

      await expect(
        service.findOneAgentById('missing-agent'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateAgentById', () => {
    it('should update the supplied fields', async () => {
      const input = {
        description: 'Updated description',
      };

      const expectedAgent = {
        id: 'agent-uuid',
        name: 'Support Agent',
        systemPrompt: 'You are helpful.',
        description: 'Updated description',
      };

      const returning = vi.fn().mockResolvedValue([expectedAgent]);
      const where = vi.fn().mockReturnValue({ returning });
      const set = vi.fn().mockReturnValue({ where });

      mockDb.update.mockReturnValue({ set });

      const result = await service.updateAgentById(
        'agent-uuid',
        input,
      );

      expect(result).toEqual(expectedAgent);
      expect(set).toHaveBeenCalledWith(input);
    });

    it('should reject an empty update', async () => {
      await expect(
        service.updateAgentById('agent-uuid', {}),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when agent does not exist', async () => {
      const returning = vi.fn().mockResolvedValue([]);
      const where = vi.fn().mockReturnValue({ returning });
      const set = vi.fn().mockReturnValue({ where });

      mockDb.update.mockReturnValue({ set });

      await expect(
        service.updateAgentById('missing-agent', {
          description: 'Updated description',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteAgentById', () => {
    it('should delete and return an agent', async () => {
      const expectedAgent = {
        id: 'agent-uuid',
        name: 'Support Agent',
      };

      const returning = vi.fn().mockResolvedValue([expectedAgent]);
      const where = vi.fn().mockReturnValue({ returning });

      mockDb.delete.mockReturnValue({ where });

      const result = await service.deleteAgentById('agent-uuid');

      expect(result).toEqual(expectedAgent);
    });

    it('should throw NotFoundException when agent does not exist', async () => {
      const returning = vi.fn().mockResolvedValue([]);
      const where = vi.fn().mockReturnValue({ returning });

      mockDb.delete.mockReturnValue({ where });

      await expect(
        service.deleteAgentById('missing-agent'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
