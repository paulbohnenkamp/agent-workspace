import { randomUUID } from 'node:crypto';

import type { Prisma, PrismaClient } from '@prisma/client';
import type { WorkspaceStateRecord } from '../../packages/types/src/workspace';
import {
  applyLandAction,
  initialLandProjectState,
  LandDemoStore,
  type LandDemoEvent,
} from './land-project-state';

const projectId = 'land-project';
const projection = 'workspace-state';
const recordKey = 'land-project';

function jsonState(state: WorkspaceStateRecord): Prisma.InputJsonObject {
  return state as unknown as Prisma.InputJsonObject;
}

export type LandWorkspaceRepository = {
  getState(): Promise<WorkspaceStateRecord>;
  getEvents(): Promise<LandDemoEvent[]>;
  appendAction(actionId: string, targetId: string): Promise<LandDemoEvent>;
  seed(): Promise<void>;
  reset(): Promise<void>;
  recordAssistantRun?(record: LandAssistantRecord): Promise<void>;
};

export type LandAssistantRecord = {
  runId: string;
  matterId: string;
  query: string;
  response: string;
  mode: string;
  status: string;
  citations: { id: string; title: string; href: string }[];
};

export class InMemoryLandWorkspaceRepository implements LandWorkspaceRepository {
  private readonly store = new LandDemoStore();

  getState(): Promise<WorkspaceStateRecord> {
    return Promise.resolve(this.store.getState());
  }

  getEvents(): Promise<LandDemoEvent[]> {
    return Promise.resolve(this.store.getEvents());
  }

  appendAction(actionId: string, targetId: string): Promise<LandDemoEvent> {
    return Promise.resolve(this.store.applyAction(actionId, targetId));
  }

  seed(): Promise<void> {
    return Promise.resolve();
  }

  reset(): Promise<void> {
    this.store.reset();
    return Promise.resolve();
  }
}

export class PrismaLandWorkspaceRepository implements LandWorkspaceRepository {
  constructor(private readonly client: PrismaClient) {}

  async getState(): Promise<WorkspaceStateRecord> {
    const record = await this.client.projectionRecord.findUnique({
      where: { projectId_projection_recordKey: { projectId, projection, recordKey } },
    });

    return record ? (record.state as WorkspaceStateRecord) : initialLandProjectState;
  }

  async getEvents(): Promise<LandDemoEvent[]> {
    const events = await this.client.eventRecord.findMany({
      where: { projectId },
      orderBy: { occurredAt: 'asc' },
    });

    return events.map((event) => ({
      id: event.id,
      type: event.type,
      targetId: event.targetId,
      actor: event.actor,
      timestamp: event.occurredAt.toISOString(),
      detail: event.detail,
    }));
  }

  async appendAction(actionId: string, targetId: string): Promise<LandDemoEvent> {
    return this.client.$transaction(async (transaction) => {
      const current = await transaction.projectionRecord.findUnique({
        where: { projectId_projection_recordKey: { projectId, projection, recordKey } },
      });
      const timestamp = new Date();
      const result = applyLandAction(
        current ? (current.state as WorkspaceStateRecord) : initialLandProjectState,
        actionId,
        targetId,
        `land-event-${randomUUID()}`,
        timestamp.toISOString(),
      );

      await transaction.projectRecord.upsert({
        where: { id: projectId },
        update: {},
        create: { id: projectId, name: initialLandProjectState.project.name },
      });
      await transaction.eventRecord.create({
        data: {
          id: result.event.id,
          projectId,
          type: result.event.type,
          targetId,
          actor: result.event.actor,
          detail: result.event.detail,
          payload: { actionId },
          occurredAt: timestamp,
        },
      });
      await transaction.projectionRecord.upsert({
        where: { projectId_projection_recordKey: { projectId, projection, recordKey } },
        update: { state: jsonState(result.state) },
        create: { id: `${projectId}-${projection}`, projectId, projection, recordKey, state: jsonState(result.state) },
      });

      return result.event;
    });
  }

  async seed(): Promise<void> {
    await this.client.projectRecord.upsert({
      where: { id: projectId },
      update: { name: initialLandProjectState.project.name },
      create: { id: projectId, name: initialLandProjectState.project.name },
    });
    await this.client.projectionRecord.upsert({
      where: { projectId_projection_recordKey: { projectId, projection, recordKey } },
      update: {},
      create: { id: `${projectId}-${projection}`, projectId, projection, recordKey, state: jsonState(initialLandProjectState) },
    });
  }

  async reset(): Promise<void> {
    await this.client.$transaction(async (transaction) => {
      await transaction.eventRecord.deleteMany({ where: { projectId } });
      await transaction.projectionRecord.deleteMany({ where: { projectId } });
      await transaction.projectRecord.upsert({
        where: { id: projectId },
        update: { name: initialLandProjectState.project.name },
        create: { id: projectId, name: initialLandProjectState.project.name },
      });
      await transaction.projectionRecord.create({
        data: { id: `${projectId}-${projection}`, projectId, projection, recordKey, state: jsonState(initialLandProjectState) },
      });
    });
  }

  async recordAssistantRun(record: LandAssistantRecord): Promise<void> {
    const database = this.client as unknown as {
      projectRecord: { upsert(args: unknown): Promise<unknown> };
      threadRecord: { upsert(args: unknown): Promise<unknown> };
      messageRecord: { create(args: unknown): Promise<unknown> };
      assistantRunRecord: { create(args: unknown): Promise<unknown> };
      assistantCitation: { createMany(args: unknown): Promise<unknown> };
    };
    const threadId = `land-thread-${record.matterId}`;
    await database.projectRecord.upsert({
      where: { id: projectId },
      update: {},
      create: { id: projectId, name: initialLandProjectState.project.name },
    });
    await database.threadRecord.upsert({
      where: { id: threadId },
      update: {},
      create: { id: threadId, projectId, matterId: record.matterId },
    });
    await database.messageRecord.create({
      data: { id: `${record.runId}-user`, threadId, role: 'user', content: record.query },
    });
    await database.assistantRunRecord.create({
      data: {
        id: record.runId,
        projectId,
        threadId,
        mode: record.mode,
        status: record.status,
        query: record.query,
        response: record.response,
        completedAt: new Date(),
      },
    });
    await database.messageRecord.create({
      data: { id: `${record.runId}-assistant`, threadId, role: 'assistant', content: record.response },
    });
    await database.assistantCitation.createMany({
      data: record.citations.map((citation) => ({
        id: `${record.runId}-${citation.id}`,
        runId: record.runId,
        sourceId: citation.id,
        title: citation.title,
        href: citation.href,
      })),
    });
  }
}
