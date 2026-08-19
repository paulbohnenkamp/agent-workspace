import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { signupSchema } from '../../../../lib/auth-input';
import { isRateLimited, parseJson, requestKey, requireSameOrigin } from '../../../../lib/api-security';
import { db } from '../../../../lib/db';
import { hashPassword } from '../../../../lib/password';
import { createSession } from '../../../../lib/session';

export async function POST(request: NextRequest) {
  if (!requireSameOrigin(request)) return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
  if (isRateLimited(requestKey(request, 'signup'), 8)) return NextResponse.json({ error: 'Too many attempts' }, { status: 429 });
  const parsed = await parseJson(request, signupSchema);
  if ('error' in parsed) return parsed.error;

  try {
    const user = await db.user.create({
      data: { email: parsed.data.email, passwordHash: await hashPassword(parsed.data.password) },
    });
    await createSession(user.id);
    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email } }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'An account already exists' }, { status: 409 });
    }
    throw error;
  }
}
