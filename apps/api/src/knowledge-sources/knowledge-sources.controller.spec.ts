import { Test, TestingModule } from '@nestjs/testing';
import { KnowledgeSourcesController } from './knowledge-sources.controller.js';
import { KnowledgeSourcesService } from './knowledge-sources.service.js';
import { KnowledgeProcessingService } from './knowledge-processing.service.js';
import { AgentsService } from '../agents/agents.service.js';
describe('KnowledgeSourcesController', () => {
  let controller: KnowledgeSourcesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KnowledgeSourcesController],
      providers: [
        {
          provide: KnowledgeSourcesService,
          useValue: {},
        },
        {
          provide: KnowledgeProcessingService,
          useValue: {},
        },
        {
          provide: AgentsService,
          useValue: {
            findOneAgentById: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<KnowledgeSourcesController>(
      KnowledgeSourcesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
