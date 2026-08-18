import path from 'path';
import { describe, expect, it } from '@jest/globals';

import { interpretView } from './interpreter';
import { landDefaultMatterIds, landNavigation, landPath, landViewIds } from './land-workspace';
import { renderWorkspace } from './render-workspace';
import { loadView } from './view-loader';
import { LandDemoStore, initialLandProjectState } from './data/land-project-state';
import { InMemoryLandWorkspaceRepository } from './data/land-workspace-repository';

const projectRoot = path.join(process.cwd(), 'docs/examples/land-project');

describe('land workspace demo', () => {
  it('loads all five views with the shared four-column composition', () => {
    for (const viewId of landViewIds) {
      const view = loadView(projectRoot, viewId);
      expect(view.layout.columns).toHaveLength(4);
      expect(view.layout.regions.map((region) => region.id)).toEqual([
        'queue',
        'assistant',
        'main',
        'context',
      ]);
    }
  });

  it('provides navigation and representative state for both land tracks', () => {
    expect(landNavigation()).toHaveLength(5);
    expect(landNavigation()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'land-portfolio',
          label: 'Land Portfolio',
          href: '/land/portfolio?matterId=portfolio-001',
        }),
      ]),
    );
    expect(landPath('land-portfolio', 'portfolio-001')).toBe('/land/portfolio?matterId=portfolio-001');
    expect(initialLandProjectState.item_queue).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ track: 'land-management' }),
        expect.objectContaining({ track: 'land-administration' }),
      ]),
    );
    expect(Object.keys(landDefaultMatterIds)).toHaveLength(5);
  });

  it('renders sources, agents, actions, and the primary artifact surface', () => {
    const view = loadView(projectRoot, 'title-curative-review');
    const interpreted = interpretView(view, initialLandProjectState, { matterId: 'title-001' });
    const html = renderWorkspace(interpreted, landNavigation());

    expect(html).toContain('Knowledge Sources');
    expect(html).toContain('Agents');
    expect(html).toContain('Actions');
    expect(html).toContain('Ask Anything');
    expect(html).toContain('WV Appalachian Land Context');
    expect(html).toContain('Title and Ownership Analyst');
    expect(html).toContain('Land Portfolio');
    expect(html).toContain('href="/land/portfolio?matterId=portfolio-001"');
    expect(html).toContain('Harrison Mineral Estate Title Examination');
    expect(html).toContain('actionId');
    expect(html).toContain('escalate-review');
    expect(html).toContain('<svg');
    expect(html).toContain('aria-label="Land Portfolio"');
  });

  it('applies local actions as in-memory events and projections', () => {
    const store = new LandDemoStore();
    const event = store.applyAction('mark-handoff-ready', 'title-001');
    const item = store.getState().item_queue?.find((entry) => entry.id === 'title-001');

    expect(event.type).toBe('land.mark-handoff-ready');
    expect(store.getEvents()).toHaveLength(1);
    expect(item).toEqual(expect.objectContaining({ status: 'Handoff Ready', updatedAgo: 'just now' }));
  });

  it('preserves the event-first flow through the repository boundary and resets to baseline', async () => {
    const repository = new InMemoryLandWorkspaceRepository();
    await repository.appendAction('mark-handoff-ready', 'title-001');

    expect((await repository.getState()).item_queue).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'title-001', status: 'Handoff Ready' })]),
    );
    expect(await repository.getEvents()).toHaveLength(1);

    await repository.reset();
    expect((await repository.getState()).item_queue).toEqual(initialLandProjectState.item_queue);
    expect(await repository.getEvents()).toHaveLength(0);
  });
});
