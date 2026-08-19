import type { Prisma, PrismaClient } from '@prisma/client';
import type { Event } from '@awp/types';

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

export type RuntimeEventRepository = {
  append(event: Event): Promise<void>;
  list(projectId: string): Promise<Event[]>;
};

type RuntimeEnvelope = {
  runId?: string;
  artifactId?: string;
  threadId?: string;
  agentSessionId?: string;
  participantId?: string;
  metadata?: Record<string, unknown>;
};

function runtimeTargetId(event: Event): string {
  return event.runId
    ?? event.artifactId
    ?? event.threadId
    ?? event.agentSessionId
    ?? event.participantId
    ?? event.id;
}

function runtimePayload(event: Event): Prisma.InputJsonObject {
  return {
    value: (event.payload ?? {}) as Prisma.InputJsonObject,
    runtime: {
      runId: event.runId,
      artifactId: event.artifactId,
      threadId: event.threadId,
      agentSessionId: event.agentSessionId,
      participantId: event.participantId,
      metadata: (event.metadata ?? {}) as Prisma.InputJsonObject,
    },
  };
}

function fromRuntimeRecord(record: {
  id: string;
  projectId: string;
  type: string;
  targetId: string;
  actor: string;
  payload: Prisma.JsonValue | null;
  occurredAt: Date;
}): Event {
  const payload = record.payload && typeof record.payload === 'object' && !Array.isArray(record.payload)
    ? record.payload as Record<string, unknown>
    : {};
  const runtime = payload.runtime && typeof payload.runtime === 'object' && !Array.isArray(payload.runtime)
    ? payload.runtime as RuntimeEnvelope
    : {};
  const value = payload.value && typeof payload.value === 'object' && !Array.isArray(payload.value)
    ? payload.value as Record<string, unknown>
    : {};

  return {
    id: record.id,
    name: record.type,
    timestamp: record.occurredAt.toISOString(),
    projectId: record.projectId,
    runId: runtime.runId ?? (record.type.startsWith('run.') ? record.targetId : undefined),
    artifactId: runtime.artifactId,
    threadId: runtime.threadId,
    agentSessionId: runtime.agentSessionId,
    participantId: runtime.participantId,
    payload: value,
    metadata: runtime.metadata,
  };
}

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

export class InMemoryRuntimeEventRepository implements RuntimeEventRepository {
  private readonly events: Event[] = [];

  async append(event: Event): Promise<void> {
    if (this.events.some((existing) => existing.id === event.id)) {
      throw new Error(`Event already exists: ${event.id}`);
    }
    this.events.push({
      ...event,
      payload: event.payload ? { ...event.payload } : undefined,
      metadata: event.metadata ? { ...event.metadata } : undefined,
    });
    return Promise.resolve();
  }

  list(projectId: string): Promise<Event[]> {
    return Promise.resolve(
      this.events
        .filter((event) => event.projectId === projectId)
        .map((event) => ({
          ...event,
          payload: event.payload ? { ...event.payload } : undefined,
          metadata: event.metadata ? { ...event.metadata } : undefined,
        })),
    );
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

export class PrismaRuntimeEventRepository implements RuntimeEventRepository {
  constructor(private readonly client: PrismaClient) {}

  async append(event: Event): Promise<void> {
    await this.client.projectRecord.upsert({
      where: { id: event.projectId },
      update: {},
      create: { id: event.projectId, name: event.projectId },
    });
    await this.client.eventRecord.create({
      data: {
        id: event.id,
        projectId: event.projectId,
        type: event.name,
        targetId: runtimeTargetId(event),
        actor: typeof event.metadata?.triggeredBy === 'string' ? event.metadata.triggeredBy : 'system',
        detail: event.name,
        payload: runtimePayload(event),
        occurredAt: new Date(event.timestamp),
      },
    });
  }

  async list(projectId: string): Promise<Event[]> {
    const records = await this.client.eventRecord.findMany({
      where: { projectId },
      orderBy: { occurredAt: 'asc' },
    });
    return records.map(fromRuntimeRecord);
  }
}
