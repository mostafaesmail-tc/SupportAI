
import { Test, TestingModule } from '@nestjs/testing';
import { KnowledgeSourcesService } from './knowledge-sources.service.js';
import { DatabaseProvider } from '../db/database.provider.js';

describe('KnowledgeSourcesService', () => {
  let service: KnowledgeSourcesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KnowledgeSourcesService,
        {
          provide: DatabaseProvider,
          useValue: {
            db: {},
          },
        },
      ],
    }).compile();

    service = module.get<KnowledgeSourcesService>(KnowledgeSourcesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
