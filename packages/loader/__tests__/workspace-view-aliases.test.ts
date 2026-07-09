import fs from 'fs';
import os from 'os';
import path from 'path';

import { createDefaultComponentRegistry } from '../../../src/ComponentRegistry';
import { loadView } from '../../../src/view-loader';

describe('workspace view component aliases', () => {
  const projectRoot = path.join(process.cwd(), 'docs/examples/hiring-project');

  it('loads the example views with the canonical aliases', () => {
    expect(() => loadView(projectRoot, 'candidate-review')).not.toThrow();
    expect(() => loadView(projectRoot, 'candidate-review', 'react')).not.toThrow();
    expect(() => loadView(projectRoot, 'open-roles-board')).not.toThrow();
    expect(() => loadView(projectRoot, 'approval-queue')).not.toThrow();
  });

  it('exposes the expanded primitive catalog', () => {
    const registry = createDefaultComponentRegistry();

    expect(registry.has('shell')).toBe(true);
    expect(registry.has('rail')).toBe(true);
    expect(registry.has('canvas')).toBe(true);
    expect(registry.has('section')).toBe(true);
    expect(registry.has('stack')).toBe(true);
    expect(registry.has('grid')).toBe(true);
    expect(registry.has('toolbar')).toBe(true);
    expect(registry.has('badge')).toBe(true);
    expect(registry.has('panel')).toBe(true);
    expect(registry.has('card')).toBe(true);
    expect(registry.has('list')).toBe(true);
    expect(registry.has('document')).toBe(true);
    expect(registry.has('text')).toBe(true);
    expect(registry.has('divider')).toBe(true);
    expect(registry.has('header')).toBe(true);
    expect(registry.has('queue')).toBe(true);
    expect(registry.has('summaryCard')).toBe(true);
    expect(registry.has('timeline')).toBe(true);
    expect(registry.has('composer')).toBe(true);
    expect(registry.has('tabs')).toBe(true);
    expect(registry.has('sources')).toBe(true);
    expect(registry.has('statusList')).toBe(true);
    expect(registry.has('actions')).toBe(true);
  });

  it('loads a view that uses the generic primitives', () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'awp-view-primitives-'));
    const viewDir = path.join(tempRoot, 'views', 'primitive-aliases');

    fs.mkdirSync(viewDir, { recursive: true });
    fs.writeFileSync(
      path.join(viewDir, 'view.json'),
      JSON.stringify(
        {
          id: 'primitive-aliases',
          title: 'Primitive Aliases',
          route: '/primitives',
          shell: {
            type: 'workspace-shell',
            header: {
              component: 'shell',
            },
          },
          layout: {
            type: 'grid',
            columns: ['minmax(0, 1fr)', 'minmax(0, 1fr)'],
            regions: [
              { id: 'main', columnStart: 1, columnSpan: 1 },
              { id: 'side', columnStart: 2, columnSpan: 1 },
            ],
          },
          regions: {
            main: [
              {
                component: 'rail',
                bind: {
                  title: 'Rail',
                  items: [{ id: 'r1', title: 'Rail item', detail: 'Detail' }],
                },
              },
              {
                component: 'canvas',
                bind: {
                  title: 'Canvas',
                  items: [{ id: 'c1', title: 'Canvas item', detail: 'Detail' }],
                },
              },
              { component: 'section', bind: { title: 'Section', body: 'Section body' } },
              {
                component: 'stack',
                bind: {
                  title: 'Stack',
                  items: [{ id: 's1', title: 'Stack item', detail: 'Detail' }],
                },
              },
              {
                component: 'grid',
                bind: {
                  title: 'Grid',
                  columns: ['repeat(2, minmax(0, 1fr))'],
                  items: [{ id: 'g1', title: 'Grid cell', detail: 'Detail' }],
                },
              },
              { component: 'toolbar', actions: ['refresh', 'advance'] },
              {
                component: 'actions',
                title: 'Actions',
                actions: [
                  { label: 'Save Changes', variant: 'primary' },
                  { label: 'Add Reviewer', variant: 'secondary' },
                ],
              },
              { component: 'card', bind: { title: 'Card', value: '42', detail: 'Metric' } },
              { component: 'text', bind: { body: 'Prose block' } },
              { component: 'divider', bind: { label: 'Separator' } },
              { component: 'badge', bind: { label: 'Active' } },
              { component: 'panel', bind: { body: 'Panel body' } },
              {
                component: 'list',
                bind: { items: [{ id: '1', title: 'Item one', detail: 'Detail' }] },
              },
              {
                component: 'document',
                bind: {
                  title: 'Doc',
                  body: 'Document body',
                  sections: [{ title: 'Section', body: 'Section body' }],
                },
              },
            ],
            side: [{ component: 'shell', bind: { title: 'Shell', body: 'Shell body' } }],
          },
        },
        null,
        2
      )
    );

    expect(() => loadView(tempRoot, 'primitive-aliases')).not.toThrow();
  });

  it('rejects unknown component aliases', () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'awp-view-alias-'));
    const viewDir = path.join(tempRoot, 'views', 'invalid-alias');

    fs.mkdirSync(viewDir, { recursive: true });
    fs.writeFileSync(
      path.join(viewDir, 'view.json'),
      JSON.stringify(
        {
          id: 'invalid-alias',
          title: 'Invalid Alias',
          route: '/invalid',
          layout: {
            type: 'grid',
            columns: ['minmax(0, 1fr)'],
            regions: [{ id: 'main', columnStart: 1, columnSpan: 1 }],
          },
          regions: {
            main: [
              {
                component: 'candidate.header',
              },
            ],
          },
        },
        null,
        2
      )
    );

    expect(() => loadView(tempRoot, 'invalid-alias')).toThrow(/unknown component alias/i);
  });
});
