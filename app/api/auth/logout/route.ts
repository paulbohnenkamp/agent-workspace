import { NextRequest, NextResponse } from 'next/server';

import { requireSameOrigin } from '../../../../lib/api-security';
import { revokeSession } from '../../../../lib/session';

export async function POST(request: NextRequest) {
  if (!requireSameOrigin(request)) return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
  await revokeSession();
  return NextResponse.json({ ok: true });
}
