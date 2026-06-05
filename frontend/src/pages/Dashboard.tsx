import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ClipboardList,
  BookOpen,
  FolderOpen,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Award,
  Plus,
  Zap,
  BarChart2,
  CheckCircle
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { api } from '../services/api';

/* ── Animated Skeleton ─────────────────────────── */
const Pulse: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse rounded-xl bg-slate-200/80 ${className}`} />
);

const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="space-y-2"><Pulse className="h-9 w-56" /><Pulse className="h-4 w-80" /></div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[1,2,3].map(i => <Pulse key={i} className="h-28" />)}
    </div>
    <Pulse className="h-24" />
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[1,2,3].map(i => <Pulse key={i} className="h-48" />)}
    </div>
  </div>
);

/* ── Metric Card ───────────────────────────────── */
interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  sub: React.ReactNode;
  icon: React.ReactNode;
  gradient: string;
  glowClass: string;
  delay?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, sub, icon, gradient, glowClass, delay = '' }) => (
  <div
    className={`relative group overflow-hidden rounded-2xl p-5 border border-white/60 bg-white/90 hover-card-premium animate-fade-up ${glowClass}`}
    style={{ animationDelay: delay }}
  >
    {/* Gradient top bar */}
    <div className={`absolute top-0 left-0 right-0 h-0.5 ${gradient}`} />
    {/* Background glow */}
    <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-10 blur-2xl ${gradient}`} />

    <div className="relative z-10 flex items-start justify-between gap-2">
      <div>
        <span className="text-[10px] text-muted font-black uppercase tracking-widest block mb-2">{label}</span>
        <div className="text-2xl font-black text-ink leading-none mb-2">{value}</div>
        <div className="text-xs text-muted">{sub}</div>
      </div>
      <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${gradient} bg-opacity-10 flex items-center justify-center`}>
        {icon}
      </div>
    </div>
  </div>
);

/* ── Quick Action Card ─────────────────────────── */
interface QuickCardProps {
  title: string;
  desc: string;
  path: string;
  icon: React.ReactNode;
  gradient: string;
  accentColor: string;
  badge: string;
  delay?: string;
}

const QuickCard: React.FC<QuickCardProps & { onClick: () => void }> = ({
  title, desc, icon, gradient, accentColor, badge, delay = '', onClick
}) => (
  <div
    onClick={onClick}
    className={`relative group overflow-hidden rounded-2xl p-5 bg-white border border-slate-200/80 cursor-pointer hover-card-premium animate-fade-up`}
    style={{ animationDelay: delay }}
  >
    {/* Top gradient line */}
    <div className={`absolute top-0 left-0 right-0 h-[3px] ${gradient} transition-all duration-300`} />
    {/* Background decoration */}
    <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full ${gradient} opacity-[0.06] blur-2xl group-hover:opacity-[0.12] transition-opacity`} />

    <div className="relative z-10">
      {/* Icon */}
      <div className={`w-12 h-12 rounded-2xl ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
        {icon}
      </div>
      {/* Badge */}
      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black mb-3 ${accentColor}`}>{badge}</span>
      {/* Title */}
      <h4 className="text-sm font-black text-ink mb-1.5">{title}</h4>
      {/* Desc */}
      <p className="text-xs text-muted leading-relaxed mb-4">{desc}</p>
      {/* CTA */}
      <div className={`flex items-center gap-1.5 text-xs font-black ${accentColor} group-hover:gap-2.5 transition-all duration-200`}>
        <span>Mulai Sekarang</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </div>
  </div>
);

/* ── Main Dashboard ────────────────────────────── */
export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { accessToken, setAuth } = useAuthStore();

  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [onboardingStep, setOnboardingStep] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(true), 300);

    const loadUserProfile = async () => {
      try {
        const response = await api.get('/user/me');
        const data = response.data.data;
        setUserProfile(data);
        const hasOnboarded = localStorage.getItem('gurubantu_onboarded_v1');
        if (!hasOnboarded) setOnboardingStep(1);
        if (accessToken) setAuth(data, accessToken);
      } catch (err: any) {
        setErrorMsg(err.response?.data?.message || 'Gagal menyinkronkan profil pengguna.');
      } finally {
        clearTimeout(timer);
        setIsLoading(false);
        setShowSkeleton(false);
      }
    };

    loadUserProfile();
    return () => clearTimeout(timer);
  }, [accessToken, setAuth]);

  const getQuotaDetails = () => {
    const plan = userProfile?.plan || 'free';
    const percentage = userProfile?.quotaPercentage ?? 100;
    const remaining = userProfile?.quotaRemaining ?? 0;
    const maxQuota = plan === 'saset' ? 25 : 5;

    if (plan === 'basic' || plan === 'pro') {
      return { colorClass: 'progress-gradient-blue', width: '100%', text: 'Unlimited', isUnlimited: true };
    }
    if (percentage <= 20) return { colorClass: 'progress-gradient-red', width: `${percentage}%`, text: `${remaining} / ${maxQuota}`, isUnlimited: false };
    if (percentage <= 50) return { colorClass: 'progress-gradient-yellow', width: `${percentage}%`, text: `${remaining} / ${maxQuota}`, isUnlimited: false };
    return { colorClass: 'progress-gradient-green', width: `${percentage}%`, text: `${remaining} / ${maxQuota}`, isUnlimited: false };
  };

  const quota = getQuotaDetails();
  const plan = userProfile?.plan || 'free';

  if (isLoading && showSkeleton) return <DashboardSkeleton />;

  return (
    <div className="space-y-6 animate-page">

      {/* ── Error ── */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-700 animate-fade-up">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span className="text-sm font-semibold">{errorMsg}</span>
        </div>
      )}

      {/* ── Welcome Header ── */}
      <div className="animate-fade-up">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">👋</span>
          <h2 className="font-display text-2xl lg:text-3xl font-black text-ink tracking-tight">
            Selamat Datang,{' '}
            <span className="gradient-text-blue">Guru {userProfile?.name?.split(' ')[0] || 'Hebat'}!</span>
          </h2>
        </div>
        <p className="text-sm text-muted pl-9">
          Pilih jenis dokumen yang ingin kamu buat hari ini — RPP, Soal Ujian, atau Modul Ajar siap dalam hitungan detik.
        </p>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          label="Tipe Paket Aktif"
          value={
            <span className="capitalize">
              {plan === 'free' ? 'Gratis (Free)' : plan.toUpperCase()}
            </span>
          }
          sub="Batas kuota direset tiap 30 hari"
          icon={<Zap className="w-5 h-5 text-white" />}
          gradient="bg-gradient-to-r from-blue-500 to-indigo-600"
          glowClass="card-glow-blue"
          delay="0.05s"
        />
        <MetricCard
          label="Total Dokumen"
          value={<span className="flex items-baseline gap-1.5">0 <span className="text-sm font-medium text-muted">dokumen</span></span>}
          sub={<span className="flex items-center gap-1 text-emerald-600"><TrendingUp className="w-3 h-3" /> Mulai hemat waktu hari ini</span>}
          icon={<BarChart2 className="w-5 h-5 text-white" />}
          gradient="bg-gradient-to-r from-emerald-500 to-teal-600"
          glowClass="card-glow-green"
          delay="0.10s"
        />
        <MetricCard
          label="Status Akun"
          value={
            userProfile?.emailVerified
              ? <span className="text-emerald-600 flex items-center gap-1.5"><CheckCircle className="w-5 h-5" />Terverifikasi</span>
              : <span className="text-muted">Belum Verif</span>
          }
          sub={userProfile?.emailVerified ? 'Sesi aman terintegrasi' : 'Cek email untuk verifikasi'}
          icon={<Award className="w-5 h-5 text-white" />}
          gradient="bg-gradient-to-r from-violet-500 to-purple-600"
          glowClass="card-glow-purple"
          delay="0.15s"
        />
      </div>

      {/* ── Quota Meter ── */}
      <div className="animate-fade-up-3 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <ShieldAlert className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-black text-ink">Kuota Penggunaan</span>
              {/* Pulse dot */}
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
            </div>
            <span className="text-xs text-muted">Sinkron real-time</span>
          </div>
          <div className="text-right">
            <span className="text-lg font-black text-ink">{quota.text}</span>
            {!quota.isUnlimited && <span className="text-xs text-muted block">dokumen tersisa</span>}
            {quota.isUnlimited && <span className="text-xs text-emerald-600 font-bold block">Unlimited ✨</span>}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
          <div
            className={`h-full rounded-full ${quota.colorClass} animate-progress-shimmer transition-all duration-700 ease-out`}
            style={{ width: quota.width }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted mt-2">
          <span>{plan === 'basic' || plan === 'pro' ? '∞ Tanpa batas dokumen' : 'Kuota direset tiap 30 hari'}</span>
          <span className="font-bold">{quota.width} Tersedia</span>
        </div>
      </div>

      {/* ── Upgrade Banner (if free) ── */}
      {(userProfile?.showUpgradeBanner || plan === 'free') && (
        <div className="animate-fade-up-4 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#020617] via-[#0F172A] to-[#1E1B4B] text-white p-6 shadow-xl">
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl pointer-events-none animate-blob" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl pointer-events-none animate-blob-delay" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-[10px] font-black tracking-wider mb-3">
                <ShieldAlert className="w-3 h-3 animate-glow-pulse-fast" />
                UPGRADE & UNLOCK FULL ACCESS
              </div>
              <h3 className="font-display text-xl lg:text-2xl font-black mb-1.5">
                Tingkatkan ke Paket <span className="gradient-text-hero">Pro</span> — Unlimited!
              </h3>
              <p className="text-sm text-white/70 max-w-md leading-relaxed">
                Buat RPP, Soal Ujian & Modul Ajar tanpa batas. Prioritas AI, template eksklusif KKG, dan dukungan langsung.
              </p>
            </div>
            <Link
              to="/pricing"
              className="btn-primary flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm text-white whitespace-nowrap"
            >
              <Zap className="w-4 h-4" />
              Upgrade Sekarang
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* ── Quick Generate Cards ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 animate-fade-up-4">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <h3 className="text-base font-black text-ink">Generate Administrasi Cepat</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <QuickCard
            title="Buat RPP Baru"
            desc="RPP Kurikulum Merdeka atau K-13 lengkap dengan CP, ATP, kegiatan & asesmen."
            path="/rpp"
            icon={<Sparkles className="w-6 h-6 text-white" />}
            gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
            accentColor="text-blue-600 bg-blue-50/60 rounded-full"
            badge="🎓 RPP Otomatis"
            delay="0.1s"
            onClick={() => navigate('/rpp')}
          />
          <QuickCard
            title="Buat Soal Ujian"
            desc="Soal HOTS pilihan ganda & esai otomatis sesuai kisi-kisi dan Taksonomi Bloom."
            path="/soal"
            icon={<ClipboardList className="w-6 h-6 text-white" />}
            gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
            accentColor="text-emerald-600 bg-emerald-50/60 rounded-full"
            badge="✍️ Soal AI"
            delay="0.15s"
            onClick={() => navigate('/soal')}
          />
          <QuickCard
            title="Buat Modul Ajar"
            desc="Modul Ajar digital Kurikulum Merdeka dengan Profil Pelajar Pancasila lengkap."
            path="/modul-ajar"
            icon={<BookOpen className="w-6 h-6 text-white" />}
            gradient="bg-gradient-to-br from-violet-500 to-purple-600"
            accentColor="text-violet-600 bg-violet-50/60 rounded-full"
            badge="📚 Modul Ajar"
            delay="0.20s"
            onClick={() => navigate('/modul-ajar')}
          />
        </div>
      </div>

      {/* ── Recent Documents (Empty State) ── */}
      <div className="space-y-3 animate-fade-up-5">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-black text-ink">Riwayat Dokumen Terbaru</h3>
          <span className="text-xs text-muted flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Real-time
          </span>
        </div>

        {/* Empty State - Premium */}
        <div className="relative overflow-hidden bg-white rounded-2xl border border-dashed border-slate-200 p-10 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/20 pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-4 animate-float">
              <FolderOpen className="w-8 h-8 text-blue-400" />
            </div>
            <h4 className="text-base font-black text-ink mb-2">Belum Ada Dokumen</h4>
            <p className="text-sm text-muted max-w-sm mx-auto mb-6 leading-relaxed">
              Mulai hemat waktu berharga Anda! Buat RPP, Soal Ujian, atau Modul Ajar AI pertama Anda sekarang.
            </p>
            <button
              onClick={() => navigate('/rpp')}
              className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black text-white"
            >
              <Plus className="w-4 h-4" />
              Buat Dokumen Pertama
            </button>
          </div>
        </div>
      </div>

      {/* ── Onboarding Overlay ── */}
      {onboardingStep !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-glass-fade">
          <div className="relative bg-white rounded-3xl max-w-md w-full p-7 shadow-2xl border border-slate-100 animate-scale-in">
            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-6">
              {[1,2,3].map(i => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === onboardingStep ? 'w-8 bg-blue-500' : i < onboardingStep ? 'w-4 bg-blue-300' : 'w-4 bg-slate-200'}`} />
              ))}
            </div>

            {/* Step content */}
            {onboardingStep === 1 && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto text-3xl shadow-glow-green">
                  🎓
                </div>
                <h3 className="text-xl font-black text-ink">Selamat Datang, Guru Hebat!</h3>
                <p className="text-sm text-muted leading-relaxed">
                  GuruBantu AI hadir untuk membebaskan waktu Anda dari beban administrasi.
                  Buat RPP Kurikulum Merdeka & Soal Ujian dalam hitungan menit!
                </p>
              </div>
            )}
            {onboardingStep === 2 && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto text-3xl shadow-glow-blue">
                  🛡️
                </div>
                <h3 className="text-xl font-black text-ink">Kuota Transaksional Aman</h3>
                <p className="text-sm text-muted leading-relaxed">
                  Kuota Anda <strong>hanya berkurang</strong> jika file Word berhasil dibuat.
                  Jika proses gagal, kuota Anda tetap aman 100%.
                </p>
              </div>
            )}
            {onboardingStep === 3 && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto text-3xl">
                  ✨
                </div>
                <h3 className="text-xl font-black text-ink">Mulai Generate Sekarang!</h3>
                <p className="text-sm text-muted leading-relaxed">
                  Gunakan kartu <strong>Quick Generate</strong> di Dashboard.
                  Anda bisa mengisi materi pokok menggunakan <strong>suara</strong> (Speech Input) untuk kecepatan maksimal!
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-100">
              <button
                onClick={() => { localStorage.setItem('gurubantu_onboarded_v1', 'true'); setOnboardingStep(null); }}
                className="text-xs font-bold text-muted hover:text-ink transition-colors px-3 py-2"
              >
                Lewati
              </button>
              <div className="flex gap-2">
                {onboardingStep > 1 && (
                  <button
                    onClick={() => setOnboardingStep(p => p !== null ? p - 1 : null)}
                    className="px-4 py-2 border border-slate-200 text-muted rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
                  >
                    Kembali
                  </button>
                )}
                <button
                  onClick={() => {
                    if (onboardingStep === 3) { localStorage.setItem('gurubantu_onboarded_v1', 'true'); setOnboardingStep(null); }
                    else setOnboardingStep(p => p !== null ? p + 1 : null);
                  }}
                  className="btn-primary px-6 py-2 rounded-xl text-xs font-black text-white"
                >
                  {onboardingStep === 3 ? 'Mulai! 🚀' : 'Lanjut →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
