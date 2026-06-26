import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { PaymentService } from '../services/payment.service';
import { sendSuccess, sendError } from '../utils/response';

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/payment/create — Buat transaksi pembayaran Midtrans Snap
// ─────────────────────────────────────────────────────────────────────────────
export const createPayment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      sendError(res, 401, 'UNAUTHORIZED', 'Sesi tidak valid.');
      return;
    }

    const { plan } = req.body as { plan?: string };
    if (!plan) {
      sendError(res, 400, 'INVALID_PLAN', 'Paket langganan wajib diisi.');
      return;
    }

    const result = await PaymentService.createPayment(userId, plan);
    sendSuccess(res, result, undefined, 201);
  } catch (error: any) {
    if (error.statusCode) {
      sendError(res, error.statusCode, error.error, error.message);
    } else {
      next(error);
    }
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/payment/webhook — Handler notifikasi pembayaran dari Midtrans
// ─────────────────────────────────────────────────────────────────────────────
export const paymentWebhook = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const notification = req.body;
    const result = await PaymentService.processWebhook(notification);
    sendSuccess(res, result);
  } catch (error: any) {
    if (error.statusCode) {
      sendError(res, error.statusCode, error.error, error.message);
    } else {
      next(error);
    }
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/payment/status?order_id=xxx — Cek status pembayaran (untuk polling FE)
// ─────────────────────────────────────────────────────────────────────────────
export const getPaymentStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { order_id } = req.query as { order_id?: string };

    if (!order_id) {
      sendError(res, 400, 'MISSING_ORDER_ID', 'Order ID wajib disertakan.');
      return;
    }

    if (!userId) {
      sendError(res, 401, 'UNAUTHORIZED', 'Sesi tidak valid.');
      return;
    }

    const status = await PaymentService.getPaymentStatus(userId, order_id);
    sendSuccess(res, status);
  } catch (error: any) {
    if (error.statusCode) {
      sendError(res, error.statusCode, error.error, error.message);
    } else {
      next(error);
    }
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/payment/history — Riwayat transaksi user (cursor pagination)
// ─────────────────────────────────────────────────────────────────────────────
export const getPaymentHistory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      sendError(res, 401, 'UNAUTHORIZED', 'Sesi tidak valid.');
      return;
    }

    const { cursor, take = '10' } = req.query as { cursor?: string; take?: string };
    const history = await PaymentService.getPaymentHistory(userId, cursor, take);
    sendSuccess(res, history);
  } catch (error: any) {
    if (error.statusCode) {
      sendError(res, error.statusCode, error.error, error.message);
    } else {
      next(error);
    }
  }
};
