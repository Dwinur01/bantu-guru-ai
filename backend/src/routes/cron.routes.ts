import { Router, Request, Response } from 'express';
import prisma from '../utils/db';

const cronRouter = Router();

// Middleware keamanan: verifikasi X-Cron-Secret header
const verifyCronSecret = (req: Request, res: Response, next: () => void): void => {
  const secret = req.headers['x-cron-secret'];
  const expectedSecret = process.env.CRON_SECRET || 'gurubantu-cron-secret-dev';

  if (!secret || secret !== expectedSecret) {
    res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Header X-Cron-Secret tidak valid.',
    });
    return;
  }
  next();
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/cron/reset-saset-quota
// Mereset kuota mingguan untuk semua user dengan plan 'saset' menjadi 25.
// Dijadwalkan setiap Senin 00:00 WIB via Google Cloud Scheduler.
// ─────────────────────────────────────────────────────────────────────────────
cronRouter.post('/reset-saset-quota', verifyCronSecret, async (_req: Request, res: Response) => {
  try {
    const result = await prisma.user.updateMany({
      where: { plan: 'saset' },
      data: {
        quota_remaining: 25,
        quota_reset_at: new Date(),
      },
    });

    console.log(`[CronJob] reset-saset-quota: ${result.count} user berhasil direset ke kuota 25.`);

    res.status(200).json({
      success: true,
      message: `Kuota ${result.count} user Saset berhasil direset ke 25.`,
      usersReset: result.count,
      resetAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[CronJob] reset-saset-quota gagal:', error);
    res.status(500).json({ success: false, error: 'INTERNAL_ERROR', message: 'Gagal mereset kuota Saset.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/cron/notify-expiring
// Mencari subscription yang akan expired besok dan mengirim notifikasi email.
// Dijadwalkan setiap hari pukul 09:00 WIB via Google Cloud Scheduler.
// Catatan: Dalam mode lokal, email di-log ke console (tidak dikirim via Resend).
// ─────────────────────────────────────────────────────────────────────────────
cronRouter.post('/notify-expiring', verifyCronSecret, async (_req: Request, res: Response) => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    // Cari subscription yang expires_at = besok (antara 00:00 dan 23:59 besok)
    const expiringSubscriptions = await prisma.subscription.findMany({
      where: {
        status: 'active',
        expires_at: {
          gte: tomorrow,
          lt: dayAfterTomorrow,
        },
      },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    let notified = 0;
    for (const sub of expiringSubscriptions) {
      // TODO Produksi: Kirim email via Resend
      // await resend.emails.send({ to: sub.user.email, subject: '...', ... })
      console.log(
        `[CronJob] notify-expiring: Email notifikasi ke ${sub.user.email} (${sub.user.name}) — Plan ${sub.plan} expired ${sub.expires_at?.toISOString()}`
      );
      notified++;
    }

    res.status(200).json({
      success: true,
      message: `${notified} notifikasi expired berhasil dikirim.`,
      notified,
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[CronJob] notify-expiring gagal:', error);
    res.status(500).json({ success: false, error: 'INTERNAL_ERROR', message: 'Gagal mengirim notifikasi expired.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/cron/cleanup-deleted-accounts
// Menghapus akun yang sudah melewati jadwal scheduled_deletion (> 24 jam lalu).
// Dijadwalkan setiap jam via Google Cloud Scheduler.
// ─────────────────────────────────────────────────────────────────────────────
cronRouter.post('/cleanup-deleted-accounts', verifyCronSecret, async (_req: Request, res: Response) => {
  try {
    const now = new Date();
    const usersToDelete = await prisma.user.findMany({
      where: {
        scheduled_deletion: { lte: now },
        deletion_token: { not: null },
      },
      select: { id: true, email: true, name: true },
    });

    let deleted = 0;
    for (const user of usersToDelete) {
      // Hapus user (cascade ke dokumen dan refresh token)
      await prisma.user.delete({ where: { id: user.id } });
      console.log(`[CronJob] cleanup-deleted-accounts: Akun ${user.email} (ID: ${user.id}) berhasil dihapus.`);
      deleted++;
    }

    res.status(200).json({
      success: true,
      message: `${deleted} akun berhasil dihapus permanen.`,
      deleted,
      cleanedAt: now.toISOString(),
    });
  } catch (error) {
    console.error('[CronJob] cleanup-deleted-accounts gagal:', error);
    res.status(500).json({ success: false, error: 'INTERNAL_ERROR', message: 'Gagal membersihkan akun terjadwal.' });
  }
});

export default cronRouter;
