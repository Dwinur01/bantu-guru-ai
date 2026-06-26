import prisma from '../utils/db';
import crypto from 'crypto';

export class UserService {
  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId, 10) },
      include: {
        subscriptions: {
          where: { status: 'active' },
          orderBy: { expires_at: 'desc' },
          take: 1,
        },
      },
    });

    if (!user) {
      throw { statusCode: 404, error: 'NOT_FOUND', message: 'Profil pengguna tidak ditemukan.' };
    }

    let maxQuota = 5;
    if (user.plan === 'saset') maxQuota = 25;
    else if (user.plan === 'basic' || user.plan === 'pro') maxQuota = 999999;

    const quotaPercentage =
      user.plan === 'basic' || user.plan === 'pro'
        ? 100
        : Math.max(0, Math.round((user.quota_remaining / maxQuota) * 100));

    const showUpgradeBanner = (user.plan === 'free' || user.plan === 'saset') && quotaPercentage <= 20;

    const activeSub = user.subscriptions[0] || null;
    const activeSubscription = activeSub
      ? { plan: activeSub.plan, status: activeSub.status, expiresAt: activeSub.expires_at }
      : null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      plan: user.plan,
      quotaRemaining: user.quota_remaining,
      quotaPercentage,
      showUpgradeBanner,
      emailVerified: user.email_verified,
      createdAt: user.created_at,
      activeSubscription,
    };
  }

  static async updateProfile(userId: string, name: string) {
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      throw { statusCode: 400, error: 'VALIDATION_ERROR', message: 'Nama minimal 2 karakter.' };
    }

    return await prisma.user.update({
      where: { id: parseInt(userId, 10) },
      data: { name: name.trim() },
      select: { id: true, name: true, email: true, plan: true },
    });
  }

  static async deleteAccount(userId: string) {
    const scheduledDeletion = new Date(Date.now() + 24 * 60 * 60 * 1000); // +24 jam
    const deletionToken = crypto.randomBytes(32).toString('hex');

    await prisma.user.update({
      where: { id: parseInt(userId, 10) },
      data: { scheduled_deletion: scheduledDeletion, deletion_token: deletionToken },
    });

    console.log(`[AccountDeletion] User ${userId} dijadwalkan dihapus pada ${scheduledDeletion.toISOString()}`);
    console.log(`[AccountDeletion] Cancel token: ${deletionToken}`);

    return { scheduledAt: scheduledDeletion };
  }

  static async cancelDeletion(token: string) {
    if (!token) {
      throw { statusCode: 400, error: 'MISSING_TOKEN', message: 'Token pembatalan tidak ditemukan.' };
    }

    const user = await prisma.user.findUnique({ where: { deletion_token: token } });
    if (!user) {
      throw { statusCode: 404, error: 'INVALID_TOKEN', message: 'Token tidak valid atau sudah digunakan.' };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { scheduled_deletion: null, deletion_token: null },
    });

    return { success: true };
  }
}
