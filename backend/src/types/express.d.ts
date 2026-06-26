import { Request } from 'express';

// Augment Express Request agar TypeScript tahu req.user ada
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        plan: string;
      };
    }
  }
}

export {};
