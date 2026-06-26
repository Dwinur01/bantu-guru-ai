import { Router } from 'express';
import { register, login, refresh, logout, googleLogin } from '../controllers/auth.controller';
import { verifyAccessToken } from '../middleware/auth.middleware';
import { loginLimiter, registerLimiter } from '../middleware/rate-limit.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { registerSchema, loginSchema, googleSchema } from '../validators/auth.validator';

const authRouter = Router();

// POST /api/auth/register - Registrasi Akun Guru Baru
authRouter.post('/register', registerLimiter, validateBody(registerSchema), register);

// POST /api/auth/login - Masuk Akun Guru
authRouter.post('/login', loginLimiter, validateBody(loginSchema), login);

// POST /api/auth/refresh - Segarkan Access Token
authRouter.post('/refresh', refresh);

// POST /api/auth/logout - Keluar Akun Guru (🔒 Terproteksi)
authRouter.post('/logout', verifyAccessToken, logout);

// POST /api/auth/google - Masuk/Daftar dengan Google OAuth
authRouter.post('/google', validateBody(googleSchema), googleLogin);

export default authRouter;
