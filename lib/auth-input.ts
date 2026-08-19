import { z } from 'zod';

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const emailSchema = z.string().trim().email().max(320).transform(normalizeEmail);

export const passwordSchema = z
  .string()
  .min(12)
  .max(200)
  .regex(/[a-z]/)
  .regex(/[A-Z]/)
  .regex(/[0-9]/)
  .regex(/[^A-Za-z0-9]/);

export const loginSchema = z.object({ email: emailSchema, password: z.string().min(1).max(200) }).strict();
export const signupSchema = z.object({ email: emailSchema, password: passwordSchema }).strict();
