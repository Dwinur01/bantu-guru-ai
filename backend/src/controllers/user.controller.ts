import { Response, NextFunction } from 'express';
import prisma from '../utils/db';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import crypto from 'crypto';

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/user/me - Ambil data profil user yang sedang login
// ─────────────────────────────────────────────────────────────────────────────
export const getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ success: false, error: 'UNAUTHORIZED', message: 'Sesi tidak valid. Silakan login kembali.' });
      return;
    }

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
      res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Profil pengguna tidak ditemukan.' });
      return;
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

    res.status(200).json({
      success: true,
      data: {
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
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/user/me - Update nama profil user (nama saja)
// ─────────────────────────────────────────────────────────────────────────────
export const updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'UNAUTHORIZED', message: 'Sesi tidak valid.' });
      return;
    }

    const { name } = req.body as { name?: string };
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      res.status(400).json({ success: false, error: 'VALIDATION_ERROR', message: 'Nama minimal 2 karakter.' });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId, 10) },
      data: { name: name.trim() },
      select: { id: true, name: true, email: true, plan: true },
    });

    res.status(200).json({ success: true, data: updatedUser, message: 'Profil berhasil diperbarui.' });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/user/me - Tandai akun untuk dihapus dalam 24 jam (soft-delete)
// ─────────────────────────────────────────────────────────────────────────────
export const deleteAccount = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'UNAUTHORIZED', message: 'Sesi tidak valid.' });
      return;
    }

    const scheduledDeletion = new Date(Date.now() + 24 * 60 * 60 * 1000); // +24 jam
    const deletionToken = crypto.randomBytes(32).toString('hex');

    await prisma.user.update({
      where: { id: parseInt(userId, 10) },
      data: { scheduled_deletion: scheduledDeletion, deletion_token: deletionToken },
    });

    // Dalam produksi: kirim email dengan link cancel berisi deletionToken
    // Sementara: log ke console untuk pengujian lokal
    console.log(`[AccountDeletion] User ${userId} dijadwalkan dihapus pada ${scheduledDeletion.toISOString()}`);
    console.log(`[AccountDeletion] Cancel token: ${deletionToken}`);

    res.status(200).json({
      success: true,
      message: 'Permintaan penghapusan akun diterima. Akun akan dihapus dalam 24 jam. Cek email Anda untuk membatalkan proses ini.',
      scheduledAt: scheduledDeletion,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/user/cancel-deletion?token=xxx - Batalkan penghapusan akun
// ─────────────────────────────────────────────────────────────────────────────
export const cancelDeletion = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token } = req.query as { token?: string };
    if (!token) {
      res.status(400).json({ success: false, error: 'MISSING_TOKEN', message: 'Token pembatalan tidak ditemukan.' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { deletion_token: token } });
    if (!user) {
      res.status(404).json({ success: false, error: 'INVALID_TOKEN', message: 'Token tidak valid atau sudah digunakan.' });
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { scheduled_deletion: null, deletion_token: null },
    });

    res.status(200).json({ success: true, message: 'Penghapusan akun berhasil dibatalkan. Akun Anda aman.' });
  } catch (error) {
    next(error);
  }
};
