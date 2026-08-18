import { NextResponse } from 'next/server';

import { appendLandAction } from '../../../../lib/land-workspace';

const supportedActions = new Set([
  'land.assign-matter',
  'land.mark-handoff-ready',
  'land.request-missing-record',
  'land.escalate-review',
  'land.acknowledge-owner-response',
  'land.record-administrative-follow-up',
]);

export async function POST(request: Request) {
  const form = await request.formData();
  const targetId = String(form.get('targetId') ?? 'portfolio-001');
  const actionId = String(form.get('actionId') ?? 'record-administrative-follow-up');
  const viewId = String(form.get('viewId') ?? 'land-portfolio');

  if (!supportedActions.has(`land.${actionId}`)) {
    return NextResponse.json({ error: 'Unsupported land action' }, { status: 400 });
  }

  await appendLandAction(actionId, targetId);
  return NextResponse.redirect(new URL(`/land/${viewId}?matterId=${targetId}`, request.url));
}
