import { NextResponse } from 'next/server';

import { AuthorizationError, requireLandAccess } from '../../../../lib/authorization';
import { answerLandQuestion } from '../../../../lib/land-assistant';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const viewId = typeof body.viewId === 'string' ? body.viewId : 'land-portfolio';
  const matterId = typeof body.matterId === 'string' ? body.matterId : 'portfolio-001';
  const query = typeof body.query === 'string' ? body.query.trim() : '';

  if (!query) return NextResponse.json({ error: 'query is required' }, { status: 400 });
  if (query.length > 2000) return NextResponse.json({ error: 'query is too long' }, { status: 400 });

  try {
    await requireLandAccess(matterId);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    throw error;
  }

  return NextResponse.json(await answerLandQuestion(viewId, matterId, query));
}
