import { Router } from 'express';
import { register, login, refresh, logout, googleLogin } from '../controllers/auth.controller';
import { verifyAccessToken } from '../middleware/auth.middleware';

const authRouter = Router();

// POST /api/auth/register - Registrasi Akun Guru Baru
authRouter.post('/register', register);

// POST /api/auth/login - Masuk Akun Guru
authRouter.post('/login', login);

// POST /api/auth/refresh - Segarkan Access Token
authRouter.post('/refresh', refresh);

// POST /api/auth/logout - Keluar Akun Guru (🔒 Terproteksi)
authRouter.post('/logout', verifyAccessToken, logout);

// POST /api/auth/google - Masuk/Daftar dengan Google OAuth
authRouter.post('/google', googleLogin);

export default authRouter;
