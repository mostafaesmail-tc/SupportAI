import { Test, TestingModule } from '@nestjs/testing';
import { KnowledgeSourcesService } from './knowledge-sources.service.js';

describe('KnowledgeSourcesService', () => {
  let service: KnowledgeSourcesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KnowledgeSourcesService],
    }).compile();

    service = module.get<KnowledgeSourcesService>(KnowledgeSourcesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
