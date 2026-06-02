import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Interface untuk data payload di dalam JWT
export interface UserPayload {
  userId: string;
  email: string;
  plan: string;
}

// Ekstensi lokal untuk Express Request agar menyertakan data user
export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

// Middleware untuk memverifikasi JWT Access Token
export const verifyAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Periksa keberadaan header dan format Bearer
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Tidak ada atau token tidak valid',
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    const accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'default_access_secret_key';

    // 2. Verifikasi token secara kriptografi
    try {
      const decoded = jwt.verify(token, accessTokenSecret) as UserPayload;

      // Sematkan data user yang terdekode ke request
      (req as AuthenticatedRequest).user = decoded;
      next();
    } catch (err: any) {
      // 3. Tangani token kedaluwarsa secara spesifik sesuai API Doc
      if (err.name === 'TokenExpiredError') {
        res.status(401).json({
          success: false,
          error: 'TOKEN_EXPIRED',
          message: 'Access token expired — gunakan refresh token',
        });
        return;
      }

      // 4. Tangani token tidak valid secara umum
      res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Tidak ada atau token tidak valid',
      });
    }
  } catch (error) {
    next(error);
  }
};
