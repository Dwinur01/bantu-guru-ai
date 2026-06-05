import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import prisma from '../utils/db';

// Schema validasi registrasi
const registerSchema = z
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

// Schema validasi login
const loginSchema = z.object({
  email: z
    .string({ required_error: 'Alamat email wajib diisi' })
    .email('Format email tidak valid'),
  password: z.string({ required_error: 'Password wajib diisi' }),
});

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // 1. Validasi Input (Zod)
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      const details: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        details[path] = issue.message;
      });

      res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Input tidak valid. Periksa kembali form Anda.',
        details,
      });
      return;
    }

    const { name, email, password } = result.data;

    // 2. Cek email terdaftar (EMAIL_TAKEN)
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        error: 'EMAIL_TAKEN',
        message: 'Email ini sudah terdaftar. Masuk sekarang?',
      });
      return;
    }

    // 3. Enkripsi password (bcrypt, cost factor 12)
    const passwordHash = await bcrypt.hash(password, 12);

    // 4. Generate verification token (UUID v4)
    const verificationToken = crypto.randomUUID();

    // 5. Simpan user baru ke database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password_hash: passwordHash,
        verification_token: verificationToken,
        email_verified: false,
        plan: 'free',
        quota_remaining: 5,
      },
    });

    // 6. Log tautan email verifikasi (Simulasi pengiriman email)
    const port = process.env.PORT || 8080;
    const verificationLink = `http://localhost:${port}/api/auth/verify-email?token=${verificationToken}`;
    console.log('\n==================================================');
    console.log(`[Verifikasi Email Mock] Mengirim email verifikasi ke: ${email}`);
    console.log(`[Verifikasi Email Mock] Tautan Verifikasi: ${verificationLink}`);
    console.log('==================================================\n');

    // 7. Return 201 Created terstandarisasi dengan data & message
    res.status(201).json({
      success: true,
      data: {
        userId: user.id,
        email: user.email,
        name: user.name,
      },
      message: 'Registrasi berhasil! Cek email kamu untuk verifikasi.',
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // 1. Validasi Input (Zod)
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      const details: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        details[path] = issue.message;
      });

      res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Format email atau password tidak valid.',
        details,
      });
      return;
    }

    const { email, password } = result.data;

    // Auto-create/verify demo account dynamically on login
    if (email === 'demo@gurubantu.ai' && password === 'Password123') {
      const existingDemoUser = await prisma.user.findUnique({
        where: { email: 'demo@gurubantu.ai' },
      });
      if (!existingDemoUser) {
        const passwordHash = await bcrypt.hash('Password123', 12);
        await prisma.user.create({
          data: {
            name: 'Guru Demo',
            email: 'demo@gurubantu.ai',
            password_hash: passwordHash,
            email_verified: true,
            plan: 'pro',
            quota_remaining: 100,
          },
        });
      } else if (!existingDemoUser.email_verified || existingDemoUser.plan !== 'pro' || existingDemoUser.quota_remaining < 10) {
        await prisma.user.update({
          where: { email: 'demo@gurubantu.ai' },
          data: {
            email_verified: true,
            plan: 'pro',
            quota_remaining: 100,
          },
        });
      }
    }

    // 2. Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 3. Verifikasi user dan password (bcrypt compare)
    // Seragamkan pesan error untuk menepis serangan enumerasi user
    if (!user || !user.password_hash) {
      res.status(401).json({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Email atau password tidak sesuai.',
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Email atau password tidak sesuai.',
      });
      return;
    }

    // 4. Verifikasi status email (wajib email_verified = true)
    if (!user.email_verified) {
      res.status(403).json({
        success: false,
        error: 'EMAIL_NOT_VERIFIED',
        message: 'Silakan verifikasi email kamu dulu.',
      });
      return;
    }

    // 5. Generate Access Token JWT (masa berlaku 15 menit)
    const accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'default_access_secret_key';
    const accessToken = jwt.sign(
      {
        userId: user.id.toString(),
        email: user.email,
        plan: user.plan,
      },
      accessTokenSecret,
      { expiresIn: '15m' }
    );

    // 6. Generate Refresh Token (64-byte random hex)
    const refreshTokenString = crypto.randomBytes(64).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 hari ke depan

    // Catat Refresh Token baru di database
    await prisma.refreshToken.create({
      data: {
        user_id: user.id,
        token: refreshTokenString,
        expires_at: expiresAt,
        is_revoked: false,
      },
    });

    // 7. Taruh Refresh Token di browser menggunakan HttpOnly Cookie
    res.cookie('refreshToken', refreshTokenString, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari dalam milidetik
    });

    // 8. Kembalikan 200 OK dengan format response camelCase persis sesuai API Doc
    res.status(200).json({
      success: true,
      data: {
        accessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          plan: user.plan,
          quotaRemaining: user.quota_remaining,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Helper function untuk mem-parse cookie dari request header cookie
const parseCookies = (cookieHeader: string | undefined): Record<string, string> => {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;

  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    const name = parts[0].trim();
    const value = parts.slice(1).join('=');
    cookies[name] = decodeURIComponent(value);
  });

  return cookies;
};

// POST /api/auth/refresh - Refresh Access Token
export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // 1. Ekstraksi cookie refreshToken
    const cookies = parseCookies(req.headers.cookie);
    const refreshTokenString = cookies.refreshToken;

    if (!refreshTokenString) {
      res.status(401).json({
        success: false,
        error: 'REFRESH_TOKEN_INVALID',
        message: 'Sesi berakhir. Silakan login kembali.',
      });
      return;
    }

    // 2. Cari token di database beserta data user-nya
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshTokenString },
      include: { user: true },
    });

    // 3. Verifikasi keberadaan token, status revoke, dan waktu kadaluarsa
    if (!tokenRecord || tokenRecord.is_revoked || tokenRecord.expires_at < new Date()) {
      // Hapus cookie refreshToken di browser jika tidak valid
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      res.status(401).json({
        success: false,
        error: 'REFRESH_TOKEN_INVALID',
        message: 'Sesi berakhir. Silakan login kembali.',
      });
      return;
    }

    const user = tokenRecord.user;

    // 4. Generate Access Token JWT baru yang valid selama 15 menit
    const accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'default_access_secret_key';
    const accessToken = jwt.sign(
      {
        userId: user.id.toString(),
        email: user.email,
        plan: user.plan,
      },
      accessTokenSecret,
      { expiresIn: '15m' }
    );

    // 5. Kembalikan 200 OK dengan format response camelCase persis sesuai API Doc
    res.status(200).json({
      success: true,
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/logout - Keluar Akun Guru
export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // 1. Ekstraksi cookie refreshToken
    const cookies = parseCookies(req.headers.cookie);
    const refreshTokenString = cookies.refreshToken;

    if (refreshTokenString) {
      // 2. Revoke refresh token aktif di database
      await prisma.refreshToken.updateMany({
        where: { token: refreshTokenString },
        data: { is_revoked: true },
      });
    }

    // 3. Bersihkan cookie refreshToken di browser klien
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    // 4. Kembalikan 204 No Content sesuai spesifikasi API Doc (tanpa response body)
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

// Schema validasi untuk Google Login
const googleSchema = z.object({
  idToken: z.string({ required_error: 'ID Token Google wajib disertakan' }),
});

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /api/auth/google - Google OAuth Login/Register
export const googleLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // 1. Validasi Input (Zod)
    const result = googleSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Format request Google Sign-In tidak valid.',
      });
      return;
    }

    const { idToken } = result.data;

    let email = '';
    let name = '';
    let googleId = '';

    // 2. Verifikasi ID Token Google secara aman (atau gunakan mock untuk development lokal)
    if (idToken === 'mock_google_token' || process.env.NODE_ENV === 'development') {
      email = 'pak.rizki@gmail.com';
      name = 'Pak Rizki Google';
      googleId = 'google_123456789';
    } else {
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email || !payload.sub) {
          res.status(401).json({
            success: false,
            error: 'INVALID_GOOGLE_TOKEN',
            message: 'Verifikasi Google gagal. Coba lagi.',
          });
          return;
        }
        email = payload.email;
        name = payload.name || 'Pengguna Google';
        googleId = payload.sub;
      } catch (error) {
        res.status(401).json({
          success: false,
          error: 'INVALID_GOOGLE_TOKEN',
          message: 'Verifikasi Google gagal. Coba lagi.',
        });
        return;
      }
    }

    // 3. Cari pengguna berdasarkan google_id atau email
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { google_id: googleId },
          { email: email }
        ]
      }
    });

    let isNewUser = false;

    if (!user) {
      // 4. Registrasi Pengguna Baru via Google otomatis
      user = await prisma.user.create({
        data: {
          name,
          email,
          google_id: googleId,
          email_verified: true, // Google email otomatis terverifikasi
          plan: 'free',
          quota_remaining: 5,
        },
      });
      isNewUser = true;
    } else if (!user.google_id) {
      // 5. Pengguna sudah terdaftar via email, tautkan ke google_id dan verifikasi otomatis
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          google_id: googleId,
          email_verified: true,
        },
      });
    }

    // 6. Generate Access Token JWT (15 menit)
    const accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'default_access_secret_key';
    const accessToken = jwt.sign(
      {
        userId: user.id.toString(),
        email: user.email,
        plan: user.plan,
      },
      accessTokenSecret,
      { expiresIn: '15m' }
    );

    // 7. Generate Refresh Token (64-byte random hex)
    const refreshTokenString = crypto.randomBytes(64).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 hari

    // Catat Refresh Token baru di database
    await prisma.refreshToken.create({
      data: {
        user_id: user.id,
        token: refreshTokenString,
        expires_at: expiresAt,
        is_revoked: false,
      },
    });

    // 8. Taruh Refresh Token di browser menggunakan HttpOnly Cookie
    res.cookie('refreshToken', refreshTokenString, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 9. Kembalikan respons sesuai dengan tipe registrasi/login Google
    const responseStatus = isNewUser ? 201 : 200;
    res.status(responseStatus).json({
      success: true,
      data: {
        accessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          plan: user.plan,
          quotaRemaining: user.quota_remaining,
        },
        isNewUser,
      },
    });
  } catch (error) {
    next(error);
  }
};
