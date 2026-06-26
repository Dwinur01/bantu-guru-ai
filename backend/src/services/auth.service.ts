import prisma from '../utils/db';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { RegisterInput, LoginInput } from '../validators/auth.validator';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthService {
  static async register(input: RegisterInput) {
    const { name, email, password } = input;

    // 1. Cek email terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw {
        statusCode: 400,
        error: 'EMAIL_TAKEN',
        message: 'Email ini sudah terdaftar. Masuk sekarang?',
      };
    }

    // 2. Enkripsi password
    const passwordHash = await bcrypt.hash(password, 12);

    // 3. Generate verification token
    const verificationToken = crypto.randomUUID();

    // 4. Simpan user baru
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

    // 5. Mock verification link in console
    const port = process.env.PORT || 8080;
    const verificationLink = `http://localhost:${port}/api/auth/verify-email?token=${verificationToken}`;
    console.log('\n==================================================');
    console.log(`[Verifikasi Email Mock] Mengirim email verifikasi ke: ${email}`);
    console.log(`[Verifikasi Email Mock] Tautan Verifikasi: ${verificationLink}`);
    console.log('==================================================\n');

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
    };
  }

  static async login(input: LoginInput) {
    const { email, password } = input;

    // Auto-create/verify demo account dynamically on login
    const isDemoEmail =
      email === 'demo@gurubantu.ai' ||
      email === 'guru.demo@gurubantu.ai' ||
      email === 'demo.guru@gurubantu.ai';

    if (isDemoEmail && password === 'Password123') {
      const existingDemoUser = await prisma.user.findUnique({
        where: { email },
      });
      if (!existingDemoUser) {
        const passwordHash = await bcrypt.hash('Password123', 12);
        await prisma.user.create({
          data: {
            name: 'Guru Demo',
            email,
            password_hash: passwordHash,
            email_verified: true,
            plan: 'pro',
            quota_remaining: 100,
          },
        });
      } else if (
        !existingDemoUser.email_verified ||
        existingDemoUser.plan !== 'pro' ||
        existingDemoUser.quota_remaining < 10
      ) {
        await prisma.user.update({
          where: { email },
          data: {
            email_verified: true,
            plan: 'pro',
            quota_remaining: 100,
          },
        });
      }
    }

    // 1. Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 2. Verifikasi user dan password
    if (!user || !user.password_hash) {
      throw {
        statusCode: 401,
        error: 'INVALID_CREDENTIALS',
        message: 'Email atau password tidak sesuai.',
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw {
        statusCode: 401,
        error: 'INVALID_CREDENTIALS',
        message: 'Email atau password tidak sesuai.',
      };
    }

    // 3. Verifikasi status email
    if (!user.email_verified) {
      throw {
        statusCode: 403,
        error: 'EMAIL_NOT_VERIFIED',
        message: 'Silakan verifikasi email kamu dulu.',
      };
    }

    // 4. Generate Access Token JWT
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

    // 5. Generate Refresh Token
    const refreshTokenString = crypto.randomBytes(64).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 hari

    await prisma.refreshToken.create({
      data: {
        user_id: user.id,
        token: refreshTokenString,
        expires_at: expiresAt,
        is_revoked: false,
      },
    });

    return {
      accessToken,
      refreshTokenString,
      expiresAt,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        quotaRemaining: user.quota_remaining,
      },
    };
  }

  static async refresh(refreshTokenString: string) {
    // 1. Cari token di database
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshTokenString },
      include: { user: true },
    });

    // 2. Verifikasi token
    if (!tokenRecord || tokenRecord.is_revoked || tokenRecord.expires_at < new Date()) {
      throw {
        statusCode: 401,
        error: 'REFRESH_TOKEN_INVALID',
        message: 'Sesi berakhir. Silakan login kembali.',
      };
    }

    const user = tokenRecord.user;

    // 3. Generate Access Token JWT baru
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

    return { accessToken };
  }

  static async logout(refreshTokenString: string) {
    if (refreshTokenString) {
      await prisma.refreshToken.updateMany({
        where: { token: refreshTokenString },
        data: { is_revoked: true },
      });
    }
  }

  static async googleLogin(idToken: string) {
    let email = '';
    let name = '';
    let googleId = '';

    // 1. Verifikasi ID Token Google secara aman (atau gunakan mock untuk development lokal)
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
          throw {
            statusCode: 401,
            error: 'INVALID_GOOGLE_TOKEN',
            message: 'Verifikasi Google gagal. Coba lagi.',
          };
        }
        email = payload.email;
        name = payload.name || 'Pengguna Google';
        googleId = payload.sub;
      } catch (error) {
        throw {
          statusCode: 401,
          error: 'INVALID_GOOGLE_TOKEN',
          message: 'Verifikasi Google gagal. Coba lagi.',
        };
      }
    }

    // 2. Cari pengguna berdasarkan google_id atau email
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
      // 3. Registrasi Pengguna Baru via Google otomatis
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
      // 4. Pengguna sudah terdaftar via email, tautkan ke google_id dan verifikasi otomatis
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          google_id: googleId,
          email_verified: true,
        },
      });
    }

    // 5. Generate Access Token JWT (15 menit)
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
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 hari

    await prisma.refreshToken.create({
      data: {
        user_id: user.id,
        token: refreshTokenString,
        expires_at: expiresAt,
        is_revoked: false,
      },
    });

    return {
      accessToken,
      refreshTokenString,
      expiresAt,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        quotaRemaining: user.quota_remaining,
      },
      isNewUser,
    };
  }
}
