import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';

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

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await AuthService.register(req.body);
    sendSuccess(res, result, 'Registrasi berhasil! Cek email kamu untuk verifikasi.', 201);
  } catch (error: any) {
    if (error.statusCode) {
      sendError(res, error.statusCode, error.error, error.message);
    } else {
      next(error);
    }
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { accessToken, refreshTokenString, user } = await AuthService.login(req.body);

    // Taruh Refresh Token di browser menggunakan HttpOnly Cookie
    res.cookie('refreshToken', refreshTokenString, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari dalam milidetik
    });

    sendSuccess(res, { accessToken, user });
  } catch (error: any) {
    if (error.statusCode) {
      sendError(res, error.statusCode, error.error, error.message);
    } else {
      next(error);
    }
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cookies = parseCookies(req.headers.cookie);
    const refreshTokenString = cookies.refreshToken;

    if (!refreshTokenString) {
      sendError(res, 401, 'REFRESH_TOKEN_INVALID', 'Sesi berakhir. Silakan login kembali.');
      return;
    }

    const { accessToken } = await AuthService.refresh(refreshTokenString);
    sendSuccess(res, { accessToken });
  } catch (error: any) {
    // Hapus cookie refreshToken di browser jika tidak valid
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    if (error.statusCode) {
      sendError(res, error.statusCode, error.error, error.message);
    } else {
      next(error);
    }
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cookies = parseCookies(req.headers.cookie);
    const refreshTokenString = cookies.refreshToken;

    if (refreshTokenString) {
      await AuthService.logout(refreshTokenString);
    }

    // Bersihkan cookie refreshToken di browser klien
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const googleLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { idToken } = req.body;
    const { accessToken, refreshTokenString, user, isNewUser } = await AuthService.googleLogin(idToken);

    // Taruh Refresh Token di browser menggunakan HttpOnly Cookie
    res.cookie('refreshToken', refreshTokenString, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const responseStatus = isNewUser ? 201 : 200;
    sendSuccess(res, { accessToken, user, isNewUser }, undefined, responseStatus);
  } catch (error: any) {
    if (error.statusCode) {
      sendError(res, error.statusCode, error.error, error.message);
    } else {
      next(error);
    }
  }
};
