import { Test, TestingModule } from '@nestjs/testing';
import { AgentsController } from './agents.controller.js';
import { AgentsService } from './agents.service.js';
import { KnowledgeProcessingService } from '../knowledge-sources/knowledge-processing.service.js';

describe('AgentsController', () => {
  let controller: AgentsController;

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

  it('creates an agent', async () => {
    const input = { name: 'Support', systemPrompt: 'Assist customers' };
    const agent = { id: '1', ...input };

    agentsService.create.mockResolvedValue(agent);

    await expect(controller.create(input)).resolves.toEqual(agent);
    expect(agentsService.create).toHaveBeenCalledWith(input);
  });

  it('returns all agents', async () => {
    const agents = [{ id: '1', name: 'Support' }];

    agentsService.findAll.mockResolvedValue(agents);

    await expect(controller.findAll()).resolves.toEqual(agents);
  });
});
