import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { UserService } from '../services/user.service';
import { sendSuccess, sendError } from '../utils/response';
import fs from 'fs';
import path from 'path';

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/user/me - Ambil data profil user yang sedang login
// ─────────────────────────────────────────────────────────────────────────────
export const getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      sendError(res, 401, 'UNAUTHORIZED', 'Sesi tidak valid. Silakan login kembali.');
      return;
    }

    const profile = await UserService.getProfile(userId);
    sendSuccess(res, profile);
  } catch (error: any) {
    if (error.statusCode) {
      sendError(res, error.statusCode, error.error, error.message);
    } else {
      next(error);
    }
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/user/me - Update nama profil user (nama saja)
// ─────────────────────────────────────────────────────────────────────────────
export const updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      sendError(res, 401, 'UNAUTHORIZED', 'Sesi tidak valid.');
      return;
    }

    const { name } = req.body as { name?: string };
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      sendError(res, 400, 'VALIDATION_ERROR', 'Nama minimal 2 karakter.');
      return;
    }

    const updatedUser = await UserService.updateProfile(userId, name);
    sendSuccess(res, updatedUser, 'Profil berhasil diperbarui.');
  } catch (error: any) {
    if (error.statusCode) {
      sendError(res, error.statusCode, error.error, error.message);
    } else {
      next(error);
    }
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/user/me - Tandai akun untuk dihapus dalam 24 jam (soft-delete)
// ─────────────────────────────────────────────────────────────────────────────
export const deleteAccount = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      sendError(res, 401, 'UNAUTHORIZED', 'Sesi tidak valid.');
      return;
    }

    const result = await UserService.deleteAccount(userId);
    sendSuccess(
      res,
      result,
      'Permintaan penghapusan akun diterima. Akun akan dihapus dalam 24 jam. Cek email Anda untuk membatalkan proses ini.'
    );
  } catch (error: any) {
    if (error.statusCode) {
      sendError(res, error.statusCode, error.error, error.message);
    } else {
      next(error);
    }
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/user/cancel-deletion?token=xxx - Batalkan penghapusan akun
// ─────────────────────────────────────────────────────────────────────────────
export const cancelDeletion = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token } = req.query as { token?: string };
    if (!token) {
      sendError(res, 400, 'MISSING_TOKEN', 'Token pembatalan tidak ditemukan.');
      return;
    }

    const result = await UserService.cancelDeletion(token);
    sendSuccess(res, result, 'Penghapusan akun berhasil dibatalkan. Akun Anda aman.');
  } catch (error: any) {
    if (error.statusCode) {
      sendError(res, error.statusCode, error.error, error.message);
    } else {
      next(error);
    }
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/user/feedback - Kirim masukan untuk developer
// ─────────────────────────────────────────────────────────────────────────────
export const postFeedback = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      sendError(res, 401, 'UNAUTHORIZED', 'Sesi tidak valid.');
      return;
    }

    const { message, category } = req.body as { message?: string; category?: string };
    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      sendError(res, 400, 'VALIDATION_ERROR', 'Pesan masukan minimal 5 karakter.');
      return;
    }

    const userProfile = await UserService.getProfile(userId);
    const feedbackItem = {
      id: Date.now(),
      userId,
      userEmail: userProfile.email,
      userName: userProfile.name,
      message,
      category: category || 'general',
      createdAt: new Date().toISOString(),
    };

    const filePath = path.join(__dirname, '../../feedbacks.json');
    let feedbacks: any[] = [];
    try {
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        feedbacks = JSON.parse(fileContent);
      }
    } catch (e) {
      // ignore
    }

    feedbacks.push(feedbackItem);
    fs.writeFileSync(filePath, JSON.stringify(feedbacks, null, 2), 'utf-8');

    sendSuccess(res, null, 'Masukan Anda berhasil dikirim. Terima kasih!');
  } catch (error: any) {
    next(error);
  }
};
