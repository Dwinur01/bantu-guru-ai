import { Router } from 'express';
import { createPayment, paymentWebhook, getPaymentStatus, getPaymentHistory } from '../controllers/payment.controller';
import { verifyAccessToken } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { createPaymentSchema } from '../validators/payment.validator';

const paymentRouter = Router();

// POST /api/payment/create — Buat transaksi Midtrans Snap (🔒 Terproteksi)
paymentRouter.post('/create', verifyAccessToken, validateBody(createPaymentSchema), createPayment);

// GET /api/payment/status?order_id=xxx — Cek status pembayaran (🔒 Terproteksi, untuk polling)
paymentRouter.get('/status', verifyAccessToken, getPaymentStatus);

// GET /api/payment/history — Riwayat transaksi user (🔒 Terproteksi)
paymentRouter.get('/history', verifyAccessToken, getPaymentHistory);

// POST /api/payment/webhook — Notifikasi pembayaran dari Midtrans (Public — diakses Midtrans server)
// CATATAN: Tidak pakai verifyAccessToken karena Midtrans tidak mengirim JWT
paymentRouter.post('/webhook', paymentWebhook);

export default paymentRouter;
