import { Router } from 'express';
import { getProfile, updateProfile, deleteAccount, cancelDeletion, postFeedback } from '../controllers/user.controller';
import { verifyAccessToken } from '../middleware/auth.middleware';

const userRouter = Router();

// GET /api/user/me - Ambil data profil pengguna yang sedang login (🔒 Terproteksi)
userRouter.get('/me', verifyAccessToken, getProfile);

// PATCH /api/user/me - Update nama profil (🔒 Terproteksi)
userRouter.patch('/me', verifyAccessToken, updateProfile);

// POST /api/user/feedback - Kirim masukan untuk developer (🔒 Terproteksi)
userRouter.post('/feedback', verifyAccessToken, postFeedback);

// DELETE /api/user/me - Jadwalkan penghapusan akun dalam 24 jam (🔒 Terproteksi)
userRouter.delete('/me', verifyAccessToken, deleteAccount);

// GET /api/user/cancel-deletion?token=xxx - Batalkan penghapusan akun (Public: via link email)
userRouter.get('/cancel-deletion', cancelDeletion);

export default userRouter;
