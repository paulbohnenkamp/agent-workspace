import { describe, expect, it } from '@jest/globals';

import { hashPassword, verifyPassword } from '../lib/password';
import { normalizeEmail, passwordSchema } from '../lib/auth-input';

describe('workspace authentication primitives', () => {
  it('verifies a generated password hash and rejects a different password', async () => {
    const encoded = await hashPassword('correct horse battery staple');

    await expect(verifyPassword('correct horse battery staple', encoded)).resolves.toBe(true);
    await expect(verifyPassword('wrong password', encoded)).resolves.toBe(false);
  });

  it('rejects malformed password encodings', async () => {
    await expect(verifyPassword('anything', 'not-a-password-hash')).resolves.toBe(false);
  });

  it('normalizes emails and applies the reference password policy', () => {
    expect(normalizeEmail(' Person@Example.COM ')).toBe('person@example.com');
    expect(passwordSchema.safeParse('StrongPassword1!').success).toBe(true);
    expect(passwordSchema.safeParse('weak-password')).toBeTruthy();
    expect(passwordSchema.safeParse('weak-password').success).toBe(false);
  });
});
