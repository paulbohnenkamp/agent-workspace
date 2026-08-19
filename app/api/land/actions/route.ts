import { NextResponse } from 'next/server';

import { AuthorizationError, requireLandAccess } from '../../../../lib/authorization';
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

  let actor: string | undefined;
  try {
    const access = await requireLandAccess(targetId);
    actor = access?.user.email;
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    throw error;
  }

  if (!supportedActions.has(`land.${actionId}`)) {
    return NextResponse.json({ error: 'Unsupported land action' }, { status: 400 });
  }

  await appendLandAction(actionId, targetId, actor);
  return NextResponse.redirect(new URL(`/land/${viewId}?matterId=${targetId}`, request.url));
}
