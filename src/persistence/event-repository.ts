import type { Prisma, PrismaClient } from '@prisma/client';

export type EventInput = {
  id: string;
  projectId: string;
  type: string;
  targetId: string;
  actor: string;
  detail: string;
  payload?: Prisma.InputJsonObject;
};

export type EventRepository = {
  append(event: EventInput): Promise<void>;
};

export class InMemoryEventRepository implements EventRepository {
  private readonly events: EventInput[] = [];

  append(event: EventInput): Promise<void> {
    this.events.push({ ...event });
    return Promise.resolve();
  }

  getEvents(): EventInput[] {
    return this.events.map((event) => ({ ...event }));
  }
}

export class PrismaEventRepository implements EventRepository {
  constructor(private readonly client: PrismaClient) {}

  async append(event: EventInput): Promise<void> {
    await this.client.projectRecord.upsert({
      where: { id: event.projectId },
      update: {},
      create: { id: event.projectId, name: event.projectId },
    });
    await this.client.eventRecord.create({
      data: {
        id: event.id,
        projectId: event.projectId,
        type: event.type,
        targetId: event.targetId,
        actor: event.actor,
        detail: event.detail,
        payload: event.payload,
      },
    });
  }
}
