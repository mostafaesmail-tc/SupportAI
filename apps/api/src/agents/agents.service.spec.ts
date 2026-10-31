import { Test, TestingModule } from '@nestjs/testing';
import { AgentsService } from './agents.service.js';
import { DatabaseProvider } from '../db/database.provider.js';

describe('AgentsService', () => {
  let service: AgentsService;
  const returning = vi.fn();
  const values = vi.fn(() => ({ returning }));
  const insert = vi.fn(() => ({ values }));
  const from = vi.fn();
  const select = vi.fn(() => ({ from }));
  const database = { db: { insert, select } };

  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgentsService,
        { provide: DatabaseProvider, useValue: database },
      ],
    }).compile();

    service = module.get<AgentsService>(AgentsService);
  });

  it('inserts and returns a created agent', async () => {
    const input = { name: 'Support', systemPrompt: 'Assist customers' };
    const agent = { id: '1', ...input };
    returning.mockResolvedValue([agent]);

    await expect(service.create(input)).resolves.toEqual(agent);
    expect(insert).toHaveBeenCalled();
    expect(values).toHaveBeenCalledWith(input);
  });

  it('lists agents from the database', async () => {
    const agents = [{ id: '1', name: 'Support' }];
    from.mockResolvedValue(agents);

    await expect(service.findAll()).resolves.toEqual(agents);
    expect(select).toHaveBeenCalled();
  });
});
