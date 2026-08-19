import { describe, expect, it } from '@jest/globals';

import { matterExistsInProjection } from '../lib/authorization';

describe('workspace authorization projection checks', () => {
  it('recognizes matters in the projected queue', () => {
    expect(matterExistsInProjection({ item_queue: [{ id: 'title-001' }] }, 'title-001')).toBe(true);
    expect(matterExistsInProjection({ item_queue: [{ id: 'title-001' }] }, 'lease-001')).toBe(false);
  });

  it('rejects malformed or absent projections', () => {
    expect(matterExistsInProjection(undefined, 'title-001')).toBe(false);
    expect(matterExistsInProjection({ item_queue: 'not-an-array' }, 'title-001')).toBe(false);
  });
});
