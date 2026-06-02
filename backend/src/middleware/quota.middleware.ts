import { Response, NextFunction } from 'express';
import prisma from '../utils/db';
import { AuthenticatedRequest } from './auth.middleware';

/**
 * Middleware checkQuota
 * Memeriksa sisa kuota user sebelum proses generate dokumen.
 * Jika kuota habis (quota_remaining <= 0) dan bukan plan premium → 429 QUOTA_EXCEEDED
 */
export const checkQuota = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userIdStr = req.user?.userId;

    if (!userIdStr) {
      res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Sesi tidak valid. Silakan login kembali.',
      });
      return;
    }

    const userId = parseInt(userIdStr, 10);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true, quota_remaining: true },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Data pengguna tidak ditemukan.',
      });
      return;
    }

    // Plan basic dan pro adalah unlimited — tidak perlu dicek kuota
    const isUnlimited = user.plan === 'basic' || user.plan === 'pro';
    if (!isUnlimited && user.quota_remaining <= 0) {
      res.status(429).json({
        success: false,
        error: 'QUOTA_EXCEEDED',
        message:
          'Batas kuota bulanan Anda telah habis. Silakan tingkatkan paket langganan untuk melanjutkan.',
        quotaRemaining: 0,
      });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};
