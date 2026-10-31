import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { AgentsController } from './agents.controller.js';
import { AgentsService } from './agents.service.js';

describe('AgentsController', () => {
  let controller: AgentsController;
  const agentsService = {
    create: vi.fn(),
    findAll: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgentsController],
      providers: [{ provide: AgentsService, useValue: agentsService }],
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

  it('rejects invalid agent input', () => {
    expect(() =>
      controller.create({ name: 'x'.repeat(101), systemPrompt: '' }),
    ).toThrow(BadRequestException);
  });

  it('returns all agents', async () => {
    const agents = [{ id: '1', name: 'Support' }];
    agentsService.findAll.mockResolvedValue(agents);

    await expect(controller.findAll()).resolves.toEqual(agents);
  });
});
