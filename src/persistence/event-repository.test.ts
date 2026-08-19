import type { PrismaClient } from '@prisma/client';
import type { Event } from '@awp/types';
import { describe, expect, it, jest } from '@jest/globals';
import {
  InMemoryRuntimeEventRepository,
  PrismaRuntimeEventRepository,
} from './event-repository';

const event: Event = {
  id: 'runtime-event-001',
  name: 'run.succeeded',
  timestamp: '2026-08-19T00:00:00.000Z',
  projectId: 'project-001',
  runId: 'run-001',
  payload: { result: 'ok' },
  metadata: { triggeredBy: 'user-001', source: 'test' },
};

describe('runtime event persistence adapters', () => {
  it('stores and lists canonical events in memory', async () => {
    const repository = new InMemoryRuntimeEventRepository();

    await repository.append(event);

    expect(await repository.list(event.projectId)).toEqual([event]);
    await expect(repository.append(event)).rejects.toThrow('Event already exists');
  });

  it('maps canonical events to and from Prisma event records', async () => {
    const records: Record<string, unknown>[] = [];
    const projectUpsert = jest.fn();
    const client = {
      projectRecord: { upsert: projectUpsert },
      eventRecord: {
        create: jest.fn(({ data }: { data: Record<string, unknown> }) => {
          records.push(data);
          return Promise.resolve(data);
        }),
        findMany: jest.fn(() => Promise.resolve(records.map((record) => ({
          ...record,
          payload: record.payload,
          occurredAt: record.occurredAt,
        })))),
      },
    } as unknown as PrismaClient;
    const repository = new PrismaRuntimeEventRepository(client);

    await repository.append(event);
    const restored = await repository.list(event.projectId);

    expect(projectUpsert).toHaveBeenCalled();
    expect(records[0]).toEqual(expect.objectContaining({
      id: event.id,
      type: event.name,
      targetId: event.runId,
      actor: 'user-001',
    }));
    expect(restored).toEqual([event]);
  });
});
