import { Test, TestingModule } from '@nestjs/testing';
import { KnowledgeSourcesController } from './knowledge-sources.controller.js';

describe('KnowledgeSourcesController', () => {
  let controller: KnowledgeSourcesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KnowledgeSourcesController],
    }).compile();

    controller = module.get<KnowledgeSourcesController>(KnowledgeSourcesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
