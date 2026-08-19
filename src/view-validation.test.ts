import { describe, expect, it } from '@jest/globals';

import {
  validateWorkspaceView,
  validateWorkspaceViewOverlay,
  validateWorkspaceViewReferences,
} from './view-validation';

const validView = {
  id: 'example',
  title: 'Example',
  route: '/example',
  fields: [{ name: 'selectedId', source: '$route.id' }],
  layout: {
    type: 'grid',
    columns: ['1fr'],
    regions: [{ id: 'main', columnStart: 1, columnSpan: 1 }],
  },
  regions: {
    main: [{ component: 'text', bind: { value: '$fields.selectedId' } }],
  },
};

describe('workspace view validation', () => {
  it('accepts valid fields and references', () => {
    expect(validateWorkspaceView(validView)).toEqual([]);
    expect(validateWorkspaceViewReferences(validView)).toEqual([]);
  });

  it('rejects duplicate regions, fields, and unknown field references', () => {
    const invalid = {
      ...validView,
      fields: [
        { name: 'selectedId', source: '$route.id' },
        { name: 'selectedId', source: '$fields.missing' },
      ],
      layout: {
        ...validView.layout,
        regions: [
          { id: 'main', columnStart: 1, columnSpan: 1 },
          { id: 'main', columnStart: 1, columnSpan: 1 },
        ],
      },
    };
    const errors = [...validateWorkspaceView(invalid), ...validateWorkspaceViewReferences(invalid)];
    expect(errors.map((error) => error.message).join('; ')).toMatch(/duplicate region id/);
    expect(errors.map((error) => error.message).join('; ')).toMatch(/duplicate field name/);
    expect(errors.map((error) => error.message).join('; ')).toMatch(/unknown field/);
  });

  it('requires renderer overlays to identify their base and renderer', () => {
    expect(validateWorkspaceViewOverlay({ extends: '../view.json', renderer: 'react' }, 'example', 'react')).toEqual([]);
    expect(validateWorkspaceViewOverlay({ extends: '../other.json', renderer: 'ink' }, 'example', 'react')).toEqual([
      { path: 'extends', message: 'expected "../view.json" for a renderer overlay' },
      { path: 'renderer', message: 'expected renderer "react"' },
    ]);
  });
});
