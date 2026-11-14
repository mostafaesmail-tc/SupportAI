
import { Test, TestingModule } from '@nestjs/testing';
import { AgentsController } from './agents.controller.js';
import { AgentsService } from './agents.service.js';
import { KnowledgeProcessingService } from '../knowledge-sources/knowledge-processing.service.js';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator.js';

describe('AgentsController', () => {
  let controller: AgentsController;

  const user: AuthenticatedUser = {
    id: 'user-1',
    email: 'mostafa@example.com',
  };

  const agentsService = {
    create: vi.fn(),
    findAll: vi.fn(),
  };

  const knowledgeProcessingService = {};

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgentsController],
      providers: [
        { provide: AgentsService, useValue: agentsService },
        {
          provide: KnowledgeProcessingService,
          useValue: knowledgeProcessingService,
        },
      ],
    }).compile();

    controller = module.get<AgentsController>(AgentsController);
  });

  it('creates an agent for the authenticated user', async () => {
    const input = { name: 'Support', systemPrompt: 'Assist customers' };
    const agent = { id: '1', ...input, userId: user.id };

    agentsService.create.mockResolvedValue(agent);

    await expect(controller.create(user, input)).resolves.toEqual(agent);
    expect(agentsService.create).toHaveBeenCalledWith(user.id, input);
  });

  it('returns only the authenticated user’s agents', async () => {
    const agents = [{ id: '1', name: 'Support', userId: user.id }];

    agentsService.findAll.mockResolvedValue(agents);

    await expect(controller.findAll(user)).resolves.toEqual(agents);
    expect(agentsService.findAll).toHaveBeenCalledWith(user.id);
  });
});
