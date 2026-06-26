import { z } from 'zod';

// ─── Register ────────────────────────────────────────────────────────────────
export const registerSchema = z
  .object({
    name: z
      .string({ required_error: 'Nama lengkap wajib diisi' })
      .min(2, 'Nama minimal 2 karakter')
      .max(100, 'Nama maksimal 100 karakter')
      .regex(/^[a-zA-Z\s]+$/, 'Nama hanya boleh berisi huruf dan spasi'),
    email: z
      .string({ required_error: 'Alamat email wajib diisi' })
      .email('Format email tidak valid')
      .max(255, 'Email maksimal 255 karakter'),
    password: z
      .string({ required_error: 'Password wajib diisi' })
      .min(8, 'Password minimal 8 karakter')
      .regex(/[A-Z]/, 'Password wajib mengandung minimal 1 huruf kapital')
      .regex(/[0-9]/, 'Password wajib mengandung minimal 1 angka'),
    confirmPassword: z.string({ required_error: 'Konfirmasi password wajib diisi' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi password harus sama dengan password',
    path: ['confirmPassword'],
  });

// ─── Login ───────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Alamat email wajib diisi' })
    .email('Format email tidak valid'),
  password: z.string({ required_error: 'Password wajib diisi' }),
});

// ─── Google OAuth ─────────────────────────────────────────────────────────────
export const googleSchema = z.object({
  idToken: z.string({ required_error: 'ID Token Google wajib disertakan' }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type GoogleInput = z.infer<typeof googleSchema>;
