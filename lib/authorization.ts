import { db } from './db';
import { getCurrentUser } from './session';

export class AuthorizationError extends Error {
  constructor(public readonly status: 401 | 403, message: string) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export function matterExistsInProjection(state: unknown, matterId: string): boolean {
  if (!state || typeof state !== 'object' || !Array.isArray((state as { item_queue?: unknown }).item_queue)) return false;
  return (state as { item_queue: Array<{ id?: unknown }> }).item_queue.some((item) => item?.id === matterId);
}

export async function requireProjectAccess(projectId: string, matterId?: string) {
  const user = await getCurrentUser();
  if (!user) throw new AuthorizationError(401, 'Authentication required');

  const membership = await db.projectMembership.findUnique({
    where: { userId_projectId: { userId: user.id, projectId } },
  });
  if (!membership) throw new AuthorizationError(403, 'Project access denied');

  if (matterId) {
    const projection = await db.projectionRecord.findFirst({
      where: { projectId, projection: 'workspace-state' },
      select: { state: true },
    });
    if (!matterExistsInProjection(projection?.state, matterId)) {
      throw new AuthorizationError(403, 'Matter access denied');
    }
  }

  return { user, membership };
}

/**
 * Local fixture mode intentionally remains usable without PostgreSQL. Any
 * configured database uses the real authentication and membership boundary.
 */
export async function requireLandAccess(matterId?: string) {
  if (!process.env.DATABASE_URL) return null;
  return requireProjectAccess('land-project', matterId);
}
