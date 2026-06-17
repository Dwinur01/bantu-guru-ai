import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, CreditCard, Zap, Sparkles, Crown, Loader2, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../hooks/useTheme';

// ─── Plan Config ──────────────────────────────────────────────────────────────
const PLAN_CONFIG: Record<string, {
  name: string; price: string; period: string; quota: string;
  color: string; bg: string; border: string; icon: React.ElementType; features: string[];
}> = {
  saset: {
    name: 'Saset', price: 'Rp 15.000', period: '/ minggu', quota: '25 dokumen/minggu',
    color: 'text-amber-400', bg: 'bg-[#1E1B15]', border: 'border-amber-500/30',
    icon: Zap,
    features: ['25 dokumen per minggu', 'RPP Kurikulum Merdeka', 'Soal Ujian + Rubrik', 'Download .docx'],
  },
  basic: {
    name: 'Basic', price: 'Rp 29.000', period: '/ bulan', quota: 'Unlimited dokumen',
    color: 'text-blue-400', bg: 'bg-[#121217]', border: 'border-blue-500/30',
    icon: Sparkles,
    features: ['Dokumen unlimited', 'RPP Kurikulum Merdeka', 'Soal Ujian + Rubrik', 'Download .docx', 'Prioritas AI', 'Email support'],
  },
  pro: {
    name: 'Pro', price: 'Rp 49.000', period: '/ bulan', quota: 'Unlimited + Fitur Pro',
    color: 'text-purple-400', bg: 'bg-[#0B0B0F]', border: 'border-purple-500/30',
    icon: Crown,
    features: ['Semua fitur Basic', 'Template eksklusif KKG', 'Format Kemendikbud terbaru', 'Prioritas 24/7'],
  },
};

// ─── Payment Confirmation Page (/payment/:plan) ───────────────────────────────
export const PaymentConfirm: React.FC = () => {
  const { plan } = useParams<{ plan: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const config = plan ? PLAN_CONFIG[plan] : null;

  useEffect(() => {
    if (!config) navigate('/pricing');
  }, [config, navigate]);

  if (!config || !plan) return null;
  const Icon = config.icon;

  const headerBg = theme === 'light'
    ? (plan === 'pro' ? 'bg-purple-50 border-purple-200/60' : plan === 'basic' ? 'bg-blue-50 border-blue-200/60' : 'bg-orange-50 border-orange-200/60')
    : config.bg + ' border-b ' + config.border;
  
  const iconColor = theme === 'light'
    ? (plan === 'pro' ? 'text-purple-650' : plan === 'basic' ? 'text-blue-600' : 'text-orange-600')
    : config.color;

  const iconBg = theme === 'light'
    ? 'bg-white'
    : 'bg-[#0B0B0F]/70';

  const iconBorder = theme === 'light'
    ? (plan === 'pro' ? 'border-purple-200' : plan === 'basic' ? 'border-blue-200' : 'border-orange-200')
    : config.border;

  const handlePay = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await api.post<{ success: boolean; data: { snapToken: string; redirectUrl: string; orderId: string } }>(
        '/payment/create', { plan }
      );
      if (res.data.success) {
        const { redirectUrl, orderId } = res.data.data;
        // Simpan orderId ke sessionStorage untuk polling setelah redirect
        sessionStorage.setItem('pending_order_id', orderId);
        // Redirect ke Midtrans Snap (buka di tab yang sama agar bisa redirect balik)
        window.location.href = redirectUrl;
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message || 'Gagal memproses pembayaran. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-5">
        {/* Back */}
        <button
          onClick={() => navigate('/pricing')}
          className="flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Harga
        </button>

        {/* Card Konfirmasi */}
        <div className="bg-cream/95 rounded-2xl border border-rule shadow-sm overflow-hidden">
          {/* Header Plan */}
          <div className={`p-6 border-b ${headerBg}`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${iconBorder} ${iconBg}`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
              </div>
              <div>
                <p className="text-xs text-muted font-medium uppercase tracking-wider">Paket Dipilih</p>
                <h2 className={`font-display font-black text-xl ${theme === 'light' ? 'text-slate-900' : config.color}`}>GuruBantu {config.name}</h2>
              </div>
            </div>
          </div>

          {/* Detail */}
          <div className="p-6 space-y-5">
            {/* Harga */}
            <div className={`flex items-center justify-between py-3 border-b ${theme === 'light' ? 'border-slate-100' : 'border-white/5'}`}>
              <span className="text-sm text-muted font-medium">Total Pembayaran</span>
              <div className="text-right">
                <div className={`text-2xl font-black ${theme === 'light' ? 'text-slate-900' : config.color}`}>{config.price}</div>
                <div className="text-xs text-muted">{config.period}</div>
              </div>
            </div>

            {/* Fitur */}
            <div className="space-y-2">
              <p className="text-xs text-muted font-semibold uppercase tracking-wider">Yang Anda dapatkan:</p>
              <ul className="space-y-1.5">
                {config.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-ink">
                    <CheckCircle className="w-4 h-4 text-emerald-550 dark:text-emerald-400 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Info User */}
            <div className={`rounded-xl p-3 text-xs text-muted space-y-1 border ${
              theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#0B0B0F]/60 border-white/5'
            }`}>
              <div className="flex justify-between">
                <span>Akun</span>
                <span className="font-medium text-ink">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Kuota setelah bayar</span>
                <span className="font-medium text-ink">{config.quota}</span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* CTA */}
            <button
              id="payment-confirm-btn"
              onClick={handlePay}
              disabled={isLoading}
              className={`w-full py-3.5 rounded-xl font-extrabold text-sm transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                plan === 'pro' ? 'bg-[#6B21A8] hover:bg-[#581C87] text-white' :
                plan === 'basic' ? 'bg-brand-red hover:bg-blue-400 text-slate-950' :
                'bg-[#EA580C] hover:bg-[#D97706] text-white'
              }`}
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Memproses...</>
              ) : (
                <><CreditCard className="w-4 h-4" /> Bayar Sekarang — {config.price}</>
              )}
            </button>

            {/* Security note */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-muted">
              <ShieldCheck className="w-3.5 h-3.5 text-success" />
              Pembayaran aman via Midtrans. Data kartu tidak disimpan.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Payment Success Page (/payment/success) ──────────────────────────────────
export const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, setAuth, accessToken } = useAuthStore();
  const { theme } = useTheme();
  const orderId = searchParams.get('order_id') || sessionStorage.getItem('pending_order_id') || '';
  const [pollCount, setPollCount] = useState(0);
  const [status, setStatus] = useState<'polling' | 'active' | 'pending'>('polling');

  useEffect(() => {
    if (!orderId) { navigate('/dashboard'); return; }
    // Poll status pembayaran hingga active (max 10x, tiap 3 detik)
    if (pollCount >= 10) { setStatus('pending'); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await api.get<{ success: boolean; data: { status: string } }>(
          `/payment/status?order_id=${orderId}`
        );
        if (res.data.data.status === 'active') {
          setStatus('active');
          sessionStorage.removeItem('pending_order_id');
          // Refresh user data agar kuota update di sidebar
          const profileRes = await api.get<{ success: boolean; data: { plan: string; quotaRemaining: number; quotaPercentage: number } }>('/user/me');
          if (profileRes.data.success && user && accessToken) {
            setAuth({ ...user, plan: profileRes.data.data.plan as 'free' | 'saset' | 'basic' | 'pro' | 'kkg', quotaRemaining: profileRes.data.data.quotaRemaining, quotaPercentage: profileRes.data.data.quotaPercentage }, accessToken);
          }
        } else {
          setPollCount((c) => c + 1);
        }
      } catch {
        setPollCount((c) => c + 1);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [pollCount, orderId, navigate, user, accessToken, setAuth]);

  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-4 text-ink">
      <div className="w-full max-w-md text-center space-y-6">
        {status === 'active' ? (
          <>
            <div className="w-20 h-20 bg-emerald-500/15 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="space-y-2">
              <h1 className="font-display font-black text-2xl text-ink">Pembayaran Berhasil! 🎉</h1>
              <p className="text-muted text-sm">Paket langganan Anda telah aktif. Kuota telah diperbarui.</p>
            </div>
            <div className={`border rounded-2xl p-5 text-left space-y-2 ${
              theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#131318]/90 border-white/5'
            }`}>
              <p className="text-xs text-muted font-semibold uppercase tracking-wider">Order ID</p>
              <p className="font-mono text-sm text-ink font-bold">{orderId}</p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                id="payment-success-generate-btn"
                onClick={() => navigate('/rpp')}
                className="w-full py-3 bg-brand-red text-slate-950 rounded-xl font-bold text-sm hover:bg-blue-400 transition-all"
              >
                Mulai Buat Dokumen →
              </button>
              <button 
                onClick={() => navigate('/dashboard')} 
                className={`w-full py-2.5 border rounded-xl text-sm font-medium text-muted transition-colors ${
                  theme === 'light' ? 'border-slate-200 hover:bg-slate-55' : 'border-white/5 hover:bg-white/5'
                }`}
              >
                Kembali ke Dashboard
              </button>
            </div>
          </>
        ) : status === 'pending' ? (
          <>
            <div className="w-20 h-20 bg-amber-500/15 rounded-full flex items-center justify-center mx-auto">
              <Clock className="w-10 h-10 text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="font-display font-black text-2xl text-ink">Menunggu Konfirmasi</h1>
            <p className="text-muted text-sm max-w-sm mx-auto">Pembayaran Anda sedang diverifikasi. Biasanya selesai dalam 1-5 menit. Cek email Anda untuk konfirmasi.</p>
            <button onClick={() => navigate('/dashboard')} className="w-full py-3 bg-brand-red text-slate-950 rounded-xl font-bold text-sm hover:bg-blue-400 transition-all">
              Kembali ke Dashboard
            </button>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-glass-mid rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="w-10 h-10 text-muted animate-spin" />
            </div>
            <h1 className="font-display font-black text-2xl text-ink">Memverifikasi Pembayaran...</h1>
            <p className="text-muted text-sm">Mohon tunggu sebentar, kami sedang mengkonfirmasi pembayaran Anda.</p>
          </>
        )}
      </div>
    </div>
  );
};

// ─── Payment Failed Page (/payment/failed) ────────────────────────────────────
export const PaymentFailed: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { theme } = useTheme();
  const orderId = searchParams.get('order_id') || '';

  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-4 text-ink">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="w-20 h-20 bg-red-500/15 rounded-full flex items-center justify-center mx-auto">
          <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
        </div>
        <div className="space-y-2">
          <h1 className="font-display font-black text-2xl text-ink">Pembayaran Gagal</h1>
          <p className="text-muted text-sm">Transaksi tidak dapat diproses. Tidak ada biaya yang dikenakan.</p>
        </div>
        {orderId && (
          <div className={`border rounded-2xl p-4 text-left ${
            theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#131318]/90 border-white/5'
          }`}>
            <p className="text-xs text-muted font-semibold uppercase tracking-wider">Order ID</p>
            <p className="font-mono text-sm text-ink font-bold mt-1">{orderId}</p>
          </div>
        )}
        <div className="flex flex-col gap-3">
          <button
            id="payment-retry-btn"
            onClick={() => navigate('/pricing')}
            className="w-full py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all"
          >
            Coba Bayar Lagi
          </button>
          <button 
            onClick={() => navigate('/dashboard')} 
            className={`w-full py-2.5 border rounded-xl text-sm font-medium text-muted transition-colors ${
              theme === 'light' ? 'border-slate-200 hover:bg-slate-55' : 'border-white/5 hover:bg-white/5'
            }`}
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
