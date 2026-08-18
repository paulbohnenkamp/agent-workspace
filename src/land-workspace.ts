import type { WorkspaceNavigationItem } from '../packages/types/src/workspace';

export const landViewIds = [
  'acquisition-rights-queue',
  'title-curative-review',
  'lease-administration-queue',
  'division-order-owner-relations-queue',
  'land-portfolio',
] as const;

export const landDefaultMatterIds: Record<string, string> = {
  'acquisition-rights-queue': 'acq-001',
  'title-curative-review': 'title-001',
  'lease-administration-queue': 'lease-001',
  'division-order-owner-relations-queue': 'division-001',
  'land-portfolio': 'portfolio-001',
};

export const landRouteSegments: Record<string, string> = {
  'acquisition-rights-queue': 'acquisition-rights-queue',
  'title-curative-review': 'title-curative-review',
  'lease-administration-queue': 'lease-administration-queue',
  'division-order-owner-relations-queue': 'division-order-owner-relations-queue',
  'land-portfolio': 'portfolio',
};

export function landPath(viewId: string, matterId?: string): string {
  const segment = landRouteSegments[viewId] ?? viewId;
  return `/land/${segment}${matterId ? `?matterId=${encodeURIComponent(matterId)}` : ''}`;
}

export function landNavigation(): WorkspaceNavigationItem[] {
  return landViewIds.map((id) => ({
    id,
    label: id.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' '),
    href: landPath(id, landDefaultMatterIds[id]),
  }));
}
