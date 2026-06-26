import prisma from '../utils/db';
import crypto from 'crypto';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const midtransClient = require('midtrans-client');

const getSnapClient = () => {
  return new midtransClient.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY || 'mock-server-key',
    clientKey: process.env.MIDTRANS_CLIENT_KEY || 'mock-client-key',
  });
};

export const PLAN_CONFIG: Record<string, { price: number; quotaAmount: number; durationDays: number; label: string }> = {
  saset: { price: 15000,  quotaAmount: 25,     durationDays: 7,   label: 'GuruBantu Saset' },
  basic: { price: 29000,  quotaAmount: 999999, durationDays: 30,  label: 'GuruBantu Basic' },
  pro:   { price: 49000,  quotaAmount: 999999, durationDays: 30,  label: 'GuruBantu Pro' },
};

export class PaymentService {
  static async createPayment(userId: string, plan: string) {
    const config = PLAN_CONFIG[plan];
    if (!config) {
      throw {
        statusCode: 400,
        error: 'INVALID_PLAN',
        message: `Paket tidak valid. Pilih salah satu: ${Object.keys(PLAN_CONFIG).join(', ')}.`,
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId, 10) },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      throw { statusCode: 404, error: 'USER_NOT_FOUND', message: 'Pengguna tidak ditemukan.' };
    }

    const orderId = `GURUB-${userId}-${Date.now()}`;

    // Simpan record subscription dengan status pending
    const subscription = await prisma.subscription.create({
      data: {
        user_id: user.id,
        plan,
        midtrans_order_id: orderId,
        status: 'pending',
        amount: config.price,
      },
    });

    // Buat transaksi di Midtrans Snap
    let snapToken: string;
    let redirectUrl: string;

    try {
      const snap = getSnapClient();
      const transaction = await snap.createTransaction({
        transaction_details: {
          order_id: orderId,
          gross_amount: config.price,
        },
        item_details: [
          {
            id: plan,
            price: config.price,
            quantity: 1,
            name: config.label,
          },
        ],
        customer_details: {
          first_name: user.name,
          email: user.email,
        },
        callbacks: {
          finish: `${process.env.FRONTEND_URL}/payment/success?order_id=${orderId}`,
          error: `${process.env.FRONTEND_URL}/payment/failed?order_id=${orderId}`,
          pending: `${process.env.FRONTEND_URL}/payment/pending?order_id=${orderId}`,
        },
      });
      snapToken = transaction.token;
      redirectUrl = transaction.redirect_url;
    } catch (midtransError) {
      // Jika Midtrans gagal (misal mock key), gunakan fallback untuk development
      console.warn('[Payment] Midtrans API error (menggunakan mock):', midtransError);
      snapToken = `mock-snap-token-${orderId}`;
      redirectUrl = `${process.env.FRONTEND_URL}/payment/pending?order_id=${orderId}&mock=true`;
    }

    return {
      orderId,
      snapToken,
      redirectUrl,
      plan,
      amount: config.price,
      subscriptionId: subscription.id,
    };
  }

  static async processWebhook(notification: {
    order_id: string;
    transaction_status: string;
    fraud_status?: string;
    signature_key?: string;
    gross_amount: string;
    status_code: string;
  }) {
    const { order_id, transaction_status, fraud_status, gross_amount, status_code } = notification;

    // 1. Verifikasi signature Midtrans
    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    const expectedSignature = crypto
      .createHash('sha512')
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest('hex');

    if (notification.signature_key && notification.signature_key !== expectedSignature) {
      console.warn(`[Webhook] Signature tidak valid untuk order ${order_id}`);
      throw { statusCode: 401, error: 'INVALID_SIGNATURE', message: 'Signature webhook tidak valid.' };
    }

    // 2. Cek idempotency
    const subscription = await prisma.subscription.findUnique({
      where: { midtrans_order_id: order_id },
      include: { user: { select: { id: true, plan: true } } },
    });

    if (!subscription) {
      throw { statusCode: 404, error: 'ORDER_NOT_FOUND', message: 'Transaksi order tidak ditemukan.' };
    }

    // Jika sudah active, abaikan
    if (subscription.status === 'active') {
      return { success: true, message: 'Sudah diproses sebelumnya.' };
    }

    const planConfig = PLAN_CONFIG[subscription.plan];
    const isSettled =
      (transaction_status === 'capture' && fraud_status === 'accept') ||
      transaction_status === 'settlement';
    const isFailed = ['deny', 'expire', 'cancel'].includes(transaction_status);
    const isPending = transaction_status === 'pending';

    if (isSettled && planConfig) {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + planConfig.durationDays * 24 * 60 * 60 * 1000);

      // 3. Atomic: update subscription + user plan + kuota dalam satu transaksi
      await prisma.$transaction([
        prisma.subscription.update({
          where: { id: subscription.id },
          data: { status: 'active', started_at: now, expires_at: expiresAt },
        }),
        prisma.user.update({
          where: { id: subscription.user_id },
          data: {
            plan: subscription.plan,
            quota_remaining: planConfig.quotaAmount,
            quota_reset_at: expiresAt,
          },
        }),
      ]);

      console.log(`[Webhook] Pembayaran ${order_id} berhasil — User ${subscription.user_id} upgrade ke ${subscription.plan}`);
    } else if (isFailed) {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: transaction_status },
      });
      console.log(`[Webhook] Pembayaran ${order_id} gagal/expired/dibatalkan`);
    } else if (isPending) {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: 'pending' },
      });
    }

    return { success: true };
  }

  static async getPaymentStatus(userId: string, orderId: string) {
    if (!orderId) {
      throw { statusCode: 400, error: 'MISSING_ORDER_ID', message: 'Order ID wajib disertakan.' };
    }

    const subscription = await prisma.subscription.findUnique({
      where: { midtrans_order_id: orderId },
      select: {
        id: true,
        plan: true,
        status: true,
        amount: true,
        started_at: true,
        expires_at: true,
        user_id: true,
      },
    });

    if (!subscription || subscription.user_id !== parseInt(userId, 10)) {
      throw { statusCode: 404, error: 'ORDER_NOT_FOUND', message: 'Status order tidak ditemukan.' };
    }

    return subscription;
  }

  static async getPaymentHistory(userId: string, cursor?: string, take?: string) {
    const takeNum = Math.min(parseInt(take || '10', 10) || 10, 20);

    const subscriptions = await prisma.subscription.findMany({
      where: { user_id: parseInt(userId, 10) },
      orderBy: { id: 'desc' },
      take: takeNum + 1,
      ...(cursor ? { cursor: { id: parseInt(cursor, 10) }, skip: 1 } : {}),
      select: {
        id: true,
        plan: true,
        status: true,
        amount: true,
        midtrans_order_id: true,
        started_at: true,
        expires_at: true,
      },
    });

    const hasMore = subscriptions.length > takeNum;
    const items = hasMore ? subscriptions.slice(0, takeNum) : subscriptions;
    const nextCursor = hasMore ? items[items.length - 1].id.toString() : null;

    return { items, nextCursor, hasMore };
  }
}
