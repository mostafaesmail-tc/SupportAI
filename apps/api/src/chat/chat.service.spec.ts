
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NotFoundException } from '@nestjs/common';

import { ChatService } from './chat.service.js';
import { LlmService } from '../llm/llm.service.js';
import { KnowledgeProcessingService } from '../knowledge-sources/knowledge-processing.service.js';
import { AgentsService } from '../agents/agents.service.js';
import { ConversationsService } from '../conversations/conversations.service.js';

describe('ChatService', () => {
  let service: ChatService;

  const agentId = 'agent-uuid';
  const conversationId = 'conversation-uuid';

  const agent = {
    id: agentId,
    systemPrompt: 'You are a helpful support assistant.',
  };

  const conversation = {
    id: conversationId,
    title: 'How do I reset my password?',
  };

  const history = [
    { role: 'user', content: 'Hello' },
    { role: 'assistant', content: 'How can I help?' },
  ];

  const searchResults = [
    {
      sourceId: 'source-uuid',
      sourceTitle: 'Password Guide',
      chunkIndex: 0,
      content: 'Users can reset their password from account settings.',
    },
  ];

  const llmService = {
    generateResponse: vi.fn(),
  };

  const knowledgeProcessingService = {
    searchKnowledge: vi.fn(),
  };

  const agentsService = {
    findOneAgentById: vi.fn(),
  };

  const conversationsService = {
    findById: vi.fn(),
    create: vi.fn(),
    getMessages: vi.fn(),
    addMessage: vi.fn(),
    updateTitle: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    service = new ChatService(
      llmService as unknown as LlmService,
      knowledgeProcessingService as unknown as KnowledgeProcessingService,
      agentsService as unknown as AgentsService,
      conversationsService as unknown as ConversationsService,
    );

    agentsService.findOneAgentById.mockResolvedValue(agent);
    conversationsService.create.mockResolvedValue({
      id: conversationId,
      title: null,
    });
    conversationsService.findById.mockResolvedValue(conversation);
    conversationsService.getMessages.mockResolvedValue([]);
    conversationsService.addMessage.mockResolvedValue(undefined);
    conversationsService.updateTitle.mockImplementation(
      async (_id, title) => ({
        id: conversationId,
        title,
      }),
    );

    knowledgeProcessingService.searchKnowledge.mockResolvedValue(
      searchResults,
    );
    llmService.generateResponse.mockResolvedValue(
      'You can reset your password from account settings.',
    );
  });

  describe('generateAnswer', () => {
    it('throws NotFoundException when the agent does not exist', async () => {
      agentsService.findOneAgentById.mockResolvedValue(null);

      await expect(
        service.generateAnswer(agentId, 'How do I reset my password?'),
      ).rejects.toThrow(NotFoundException);

      expect(conversationsService.create).not.toHaveBeenCalled();
      expect(knowledgeProcessingService.searchKnowledge).not.toHaveBeenCalled();
    });

    it('creates a new conversation when no conversation ID is provided', async () => {
      await service.generateAnswer(
        agentId,
        'How do I reset my password?',
      );

      expect(conversationsService.create).toHaveBeenCalledWith(agentId);
      expect(conversationsService.findById).not.toHaveBeenCalled();
    });

    it('throws NotFoundException when the requested conversation does not exist', async () => {
      conversationsService.findById.mockResolvedValue(null);

      await expect(
        service.generateAnswer(
          agentId,
          'How do I reset my password?',
          conversationId,
        ),
      ).rejects.toThrow(NotFoundException);

      expect(conversationsService.getMessages).not.toHaveBeenCalled();
      expect(knowledgeProcessingService.searchKnowledge).not.toHaveBeenCalled();
    });

    it('uses an existing conversation without changing its title', async () => {
      await service.generateAnswer(
        agentId,
        'How do I reset my password?',
        conversationId,
      );

      expect(conversationsService.findById).toHaveBeenCalledWith(
        conversationId,
        agentId,
      );
      expect(conversationsService.create).not.toHaveBeenCalled();
      expect(conversationsService.updateTitle).not.toHaveBeenCalled();
    });

    it('saves the user message before retrieving the answer', async () => {
      await service.generateAnswer(
        agentId,
        'How do I reset my password?',
      );

      expect(conversationsService.addMessage).toHaveBeenNthCalledWith(
        1,
        conversationId,
        'user',
        'How do I reset my password?',
      );

      expect(conversationsService.addMessage).toHaveBeenNthCalledWith(
        2,
        conversationId,
        'assistant',
        'You can reset your password from account settings.',
        [
          {
            sourceId: 'source-uuid',
            sourceTitle: 'Password Guide',
            chunkIndex: 0,
          },
        ],
      );
    });

    it('generates an answer using retrieved knowledge and previous messages', async () => {
      conversationsService.getMessages.mockResolvedValue(history);

      await service.generateAnswer(
        agentId,
        'How do I reset my password?',
        conversationId,
      );

      expect(knowledgeProcessingService.searchKnowledge).toHaveBeenCalledWith(
        agentId,
        'How do I reset my password?',
      );

      const messages = llmService.generateResponse.mock.calls[0][0];

      expect(messages[0].role).toBe('system');
      expect(messages[0].content).toContain(agent.systemPrompt);

      expect(messages).toContainEqual({
        role: 'user',
        content: 'Hello',
      });

      expect(messages).toContainEqual({
        role: 'assistant',
        content: 'How can I help?',
      });

      expect(messages[messages.length - 1].content).toContain(
        'Users can reset their password from account settings.',
      );

      expect(messages[messages.length - 1].content).toContain(
        'How do I reset my password?',
      );
    });

    it('returns the fallback answer and skips the LLM when no knowledge is found', async () => {
      knowledgeProcessingService.searchKnowledge.mockResolvedValue([]);

      const result = await service.generateAnswer(
        agentId,
        'What is the meaning of life?',
      );

      expect(llmService.generateResponse).not.toHaveBeenCalled();

      expect(result.answer).toBe(
        "I couldn't find relevant information to answer your question.",
      );

      expect(result.sources).toEqual([]);

      expect(conversationsService.addMessage).toHaveBeenNthCalledWith(
        2,
        conversationId,
        'assistant',
        "I couldn't find relevant information to answer your question.",
        [],
      );
    });

    it('returns the conversation ID, title, answer, and sources', async () => {
      const result = await service.generateAnswer(
        agentId,
        'How do I reset my password?',
      );

      expect(result).toEqual({
        conversationId,
        title: 'How do I reset my password?',
        answer: 'You can reset your password from account settings.',
        sources: [
          {
            sourceId: 'source-uuid',
            sourceTitle: 'Password Guide',
            chunkIndex: 0,
          },
        ],
      });
    });

    it('normalizes whitespace when generating a new conversation title', async () => {
      const result = await service.generateAnswer(
        agentId,
        '  How   do I\n reset   my password?  ',
      );

      expect(result.title).toBe('How do I reset my password?');

      expect(conversationsService.updateTitle).toHaveBeenCalledWith(
        conversationId,
        'How do I reset my password?',
      );
    });

    it('truncates long conversation titles to 60 characters', async () => {
      const question =
        'How can I configure the application to automatically reset passwords for all users?';

      const result = await service.generateAnswer(agentId, question);

      expect(result.title).toHaveLength(60);
      expect(result.title.endsWith('...')).toBe(true);
    });
  });
});
