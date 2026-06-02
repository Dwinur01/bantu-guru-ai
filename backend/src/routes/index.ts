import { Router, Request, Response } from 'express';
import authRouter from './auth.routes';
import userRouter from './user.routes';
import documentRouter from './document.routes';
import cronRouter from './cron.routes';
import paymentRouter from './payment.routes';

const apiRouter = Router();

// Health Check Endpoint
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
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
