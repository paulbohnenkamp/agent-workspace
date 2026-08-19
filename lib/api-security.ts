import type { ZodType } from 'zod';
import { NextResponse } from 'next/server';

export async function parseJson<T>(request: Request, schema: ZodType<T>) {
  try {
    const result = schema.safeParse(await request.json());
    if (result.success) return { data: result.data } as const;
    return { error: NextResponse.json({ error: 'Invalid request', issues: result.error.issues }, { status: 400 }) } as const;
  } catch {
    return { error: NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }) } as const;
  }
}

export function requireSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(request.url).origin;
}

const windows = new Map<string, { count: number; resetAt: number }>();

export function isRateLimited(key: string, limit = 10, windowMs = 60_000): boolean {
  const now = Date.now();
  const current = windows.get(key);
  if (!current || current.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  current.count += 1;
  return current.count > limit;
}

export function requestKey(request: Request, action: string): string {
  return `${action}:${request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local'}`;
}
