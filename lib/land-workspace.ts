import path from 'node:path';

import { interpretView } from '../src/interpreter';
import { landDefaultMatterIds, landNavigation, landViewIds } from '../src/land-workspace';
import { initialLandProjectState } from '../src/data/land-project-state';
import { InMemoryLandWorkspaceRepository, PrismaLandWorkspaceRepository, type LandAssistantRecord, type LandWorkspaceRepository } from '../src/data/land-workspace-repository';
import { prisma } from '../src/persistence/prisma-client';
import { loadView } from '../src/view-loader';
import type { LooseRecord, WorkspaceInterpretedView } from '../packages/types/src/workspace';

const projectRoot = path.join(process.cwd(), 'docs', 'examples', 'land-project');

let fallbackRepository: InMemoryLandWorkspaceRepository | undefined;

function repository(): LandWorkspaceRepository {
  if (process.env.DATABASE_URL) {
    return new PrismaLandWorkspaceRepository(prisma);
  }

  fallbackRepository ??= new InMemoryLandWorkspaceRepository();
  return fallbackRepository;
}

export async function loadLandWorkspace(viewId: string, matterId?: string): Promise<WorkspaceInterpretedView> {
  const validViewId = (landViewIds as readonly string[]).includes(viewId) ? viewId : 'land-portfolio';
  const selectedMatterId = matterId ?? landDefaultMatterIds[validViewId];
  const view = loadView(projectRoot, validViewId);
  const state = await repository().getState();

  return interpretView(view, state ?? initialLandProjectState, { matterId: selectedMatterId });
}

export async function appendLandAction(actionId: string, targetId: string, actor?: string) {
  return repository().appendAction(actionId, targetId, actor);
}

export async function seedLandDemo(): Promise<void> {
  await repository().seed();
}

export async function resetLandDemo(): Promise<void> {
  await repository().reset();
}

export async function recordLandAssistantRun(record: LandAssistantRecord): Promise<void> {
  await repository().recordAssistantRun?.(record);
}

export function landWorkspaceNavigation() {
  return landNavigation().map((item) => ({
    ...item,
    href: `/land/${item.id === 'land-portfolio' ? 'land-portfolio' : item.id}?matterId=${item.href.split('matterId=')[1]}`,
  }));
}

export function records(value: unknown): LooseRecord[] {
  return Array.isArray(value) ? value.filter((item): item is LooseRecord => Boolean(item) && typeof item === 'object') : [];
}

export function text(value: unknown, fallback = ''): string {
  return typeof value === 'string' || typeof value === 'number' ? String(value) : fallback;
}
