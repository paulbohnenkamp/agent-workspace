import { NextRequest, NextResponse } from 'next/server';

import { db } from '../../../../lib/db';
import { loginSchema } from '../../../../lib/auth-input';
import { isRateLimited, parseJson, requestKey, requireSameOrigin } from '../../../../lib/api-security';
import { verifyPassword } from '../../../../lib/password';
import { createSession } from '../../../../lib/session';

export async function POST(request: NextRequest) {
  if (!requireSameOrigin(request)) return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
  if (isRateLimited(requestKey(request, 'login'), 10)) return NextResponse.json({ error: 'Too many attempts' }, { status: 429 });
  const parsed = await parseJson(request, loginSchema);
  if ('error' in parsed) return parsed.error;

  const user = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return NextResponse.json({ error: 'Email or password is incorrect' }, { status: 401 });
  }

  await createSession(user.id);
  return NextResponse.json({ ok: true, user: { id: user.id, email: user.email } });
}
