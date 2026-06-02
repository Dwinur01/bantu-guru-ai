import { Router, Request, Response } from 'express';
import authRouter from './auth.routes';
import userRouter from './user.routes';
import documentRouter from './document.routes';
import cronRouter from './cron.routes';
import paymentRouter from './payment.routes';
import prisma from '../utils/db';

const apiRouter = Router();

// Health Check Endpoint
apiRouter.get('/health', async (_req: Request, res: Response) => {
  try {
    // Ping database to ensure active connectivity
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ 
      status: 'ok', 
      db: 'connected',
      uptime: process.uptime(),
      version: '1.0.0'
    });
  } catch (error: any) {
    res.status(500).json({ 
      status: 'error', 
      db: 'disconnected',
      error: error.message || error,
      uptime: process.uptime(),
      version: '1.0.0'
    });
  }
});

// Auth Sub-router (/api/auth/*)
apiRouter.use('/auth', authRouter);

// User Sub-router (/api/user/*)
apiRouter.use('/user', userRouter);

// Documents Sub-router (/api/documents/*)
apiRouter.use('/documents', documentRouter);

// Cron Sub-router (/api/cron/*) — Endpoint tugas terjadwal, dilindungi X-Cron-Secret
apiRouter.use('/cron', cronRouter);

// Payment Sub-router (/api/payment/*) — Pembayaran Midtrans
apiRouter.use('/payment', paymentRouter);

// Error Handling Test Endpoint (Only in development/test)
apiRouter.get('/error-test', (_req: Request, _res: Response) => {
  throw new Error('Test global error handler: server intercepted error correctly!');
});

export default apiRouter;
