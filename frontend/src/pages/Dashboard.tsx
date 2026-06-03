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
  Plus
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { api } from '../services/api';

// 1. Loading Skeleton Component (Non-Flash, 300ms Delay)
const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2.5">
        <div className="h-8 bg-neutral-200 rounded w-1/3"></div>
        <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
      </div>

      {/* Metrics Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-rule rounded-xl p-4 sm:p-6 h-28 flex flex-col justify-between">
            <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
            <div className="h-6 bg-neutral-200 rounded w-3/4"></div>
            <div className="h-2 bg-neutral-200 rounded w-full"></div>
          </div>
        ))}
      </div>

      {/* Quota Metric Card Skeleton */}
      <div className="bg-white border border-rule rounded-xl p-5 sm:p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
          <div className="h-4 bg-neutral-200 rounded w-1/6"></div>
        </div>
        <div className="h-3 bg-neutral-200 rounded-full w-full"></div>
      </div>

      {/* Quick Generate Grid Skeleton */}
      <div className="space-y-3">
        <div className="h-5 bg-neutral-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-rule rounded-xl p-5 h-44 flex flex-col justify-between">
              <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-3 bg-neutral-200 rounded w-full"></div>
                <div className="h-3 bg-neutral-200 rounded w-5/6"></div>
              </div>
              <div className="h-8 bg-neutral-200 rounded w-1/3 mt-2"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Documents Empty State Skeleton */}
      <div className="bg-white border border-rule rounded-xl p-8 h-64 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 bg-neutral-200 rounded-full"></div>
        <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
        <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
        <div className="h-9 bg-neutral-200 rounded w-1/4"></div>
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { accessToken, setAuth } = useAuthStore();
  
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [onboardingStep, setOnboardingStep] = useState<number | null>(null);

  useEffect(() => {
    // Jalankan timer untuk menampilkan skeleton hanya jika fetch memakan waktu > 300ms
    const timer = setTimeout(() => {
      setShowSkeleton(true);
    }, 300);

    const loadUserProfile = async () => {
      try {
        const response = await api.get('/user/me');
        const data = response.data.data;
        setUserProfile(data);
        
        // Tampilkan Onboarding Tour interaktif jika pengguna pertama kali masuk Dashboard
        const hasOnboarded = localStorage.getItem('gurubantu_onboarded_v1');
        if (!hasOnboarded) {
          setOnboardingStep(1);
        }
        
        // Sinkronisasi data user terupdate ke Zustand authStore
        if (accessToken) {
          setAuth(data, accessToken);
        }
      } catch (err: any) {
        console.error('Fetch profile error:', err);
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

  // Handler jika tombol aksi pembuatan dokumen diklik
  const handleQuickAction = (path: string) => {
    navigate(path);
  };

  // Helper untuk memetakan detail bar kuota secara dinamis
  const getQuotaDetails = () => {
    const plan = userProfile?.plan || 'free';
    const percentage = userProfile?.quotaPercentage ?? 100;
    const remaining = userProfile?.quotaRemaining ?? 0;

    let maxQuota = 5;
    if (plan === 'saset') maxQuota = 25;

    if (plan === 'basic' || plan === 'pro') {
      return {
        color: 'bg-brand-mid',
        width: '100%',
        text: 'Tanpa Batas (Unlimited)',
        badgeClass: 'bg-brand-pale text-brand-mid border-brand-mid/20',
        label: 'UNLIMITED PRO',
      };
    }

    let color = 'bg-[#1A7A4A]'; // success green
    if (percentage <= 20) {
      color = 'bg-[#C84B2F]'; // error/danger red
    } else if (percentage <= 50) {
      color = 'bg-[#B8860B]'; // warning gold
    }

    return {
      color,
      width: `${percentage}%`,
      text: `${remaining} / ${maxQuota} Dokumen`,
      badgeClass: plan === 'saset' ? 'bg-warning-bg text-warning border border-warning/20' : 'bg-neutral-100 text-muted border border-neutral-200',
      label: plan.toUpperCase(),
    };
  };

  const quota = getQuotaDetails();

  if (isLoading && showSkeleton) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Peringatan Error API */}
      {errorMsg && (
        <div className="p-4 bg-error-bg border border-brand-red rounded-lg flex items-start gap-2.5 text-brand-red">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-sm font-semibold">{errorMsg}</div>
        </div>
      )}

      {/* 1. Header Sambutan Pengguna */}
      <div className="space-y-1">
        <h2 className="font-display text-3xl font-black text-ink tracking-tight leading-tight">
          Selamat Datang, Guru {userProfile?.name || 'Hebat'}!
        </h2>
        <p className="text-sm text-muted">
          Pilih jenis administrasi yang ingin Anda generate otomatis hari ini.
        </p>
      </div>

      {/* 2. Stat / Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Paket Langganan */}
        <div className="bg-white border border-rule rounded-xl p-4 sm:p-5 flex flex-col justify-between gap-1 shadow-sm transition-all duration-200 hover:shadow-md">
          <span className="text-xs text-muted font-bold uppercase tracking-wider">Tipe Paket Aktif</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold text-brand-dark">
              {userProfile?.plan === 'free' ? 'Gratis (Free)' : userProfile?.plan?.toUpperCase() || 'FREE'}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${quota.badgeClass}`}>
              {quota.label}
            </span>
          </div>
          <span className="text-xs text-muted mt-2 border-t border-rule/35 pt-2">Batas kuota diperbarui setiap bulan</span>
        </div>

        {/* Card 2: Dokumen Tergenerate */}
        <div className="bg-white border border-rule rounded-xl p-4 sm:p-5 flex flex-col justify-between gap-1 shadow-sm transition-all duration-200 hover:shadow-md">
          <span className="text-xs text-muted font-bold uppercase tracking-wider">Total Dokumen</span>
          <span className="text-2xl font-bold text-brand-dark mt-1 flex items-center gap-2">
            0 <span className="text-sm font-normal text-muted">dokumen selesai</span>
          </span>
          <span className="text-xs text-muted mt-2 border-t border-rule/35 pt-2 flex items-center gap-1 text-success">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Mulai hemat waktu hari ini</span>
          </span>
        </div>

        {/* Card 3: Status Verifikasi */}
        <div className="bg-white border border-rule rounded-xl p-4 sm:p-5 flex flex-col justify-between gap-1 shadow-sm transition-all duration-200 hover:shadow-md">
          <span className="text-xs text-muted font-bold uppercase tracking-wider">Status Akun</span>
          <span className="text-2xl font-bold text-brand-dark mt-1 flex items-center gap-2">
            {userProfile?.emailVerified ? (
              <span className="text-[#1A7A4A] flex items-center gap-1.5 text-xl font-bold">
                <Award className="w-5 h-5 text-success" /> Terverifikasi
              </span>
            ) : (
              <span className="text-muted flex items-center gap-1.5 text-xl font-bold">
                Aktif (Belum Verif)
              </span>
            )}
          </span>
          <span className="text-xs text-muted mt-2 border-t border-rule/35 pt-2">
            {userProfile?.emailVerified ? 'Sesi aman terintegrasi' : 'Silakan periksa email Anda'}
          </span>
        </div>
      </div>

      {/* 3. Kartu Metrik Kuota Real-Time */}
      <div className="bg-white border border-rule rounded-xl p-5 sm:p-6 shadow-sm flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-brand-mid" />
            <span className="text-sm font-bold text-ink">Batas Penggunaan Kuota</span>
          </div>
          <span className="text-sm font-bold text-[#1F4E79]">{quota.text}</span>
        </div>

        {/* Progress Bar Horizontal */}
        <div className="w-full">
          <div className="w-full h-3 bg-[#F2F2F2] rounded-full overflow-hidden border border-rule/20">
            <div 
              className={`h-full rounded-full transition-all duration-500 ease-out ${quota.color}`}
              style={{ width: quota.width }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-2.5">
            <span className="text-xs text-muted">
              {userProfile?.plan === 'basic' || userProfile?.plan === 'pro' 
                ? 'Sesi premium aktif tanpa batas dokumen' 
                : 'Kuota terpakai direset setiap 30 hari'}
            </span>
            <span className="text-xs font-bold text-ink">{quota.width} Tersedia</span>
          </div>
        </div>
      </div>

      {/* 4. Banner Penawaran Upgrade (Non-Intrusive, Premium) */}
      {(userProfile?.showUpgradeBanner || userProfile?.plan === 'free') && (
        <div className="relative overflow-hidden bg-brand-dark text-white rounded-xl p-6 sm:p-8 shadow-md border border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 transition-all duration-300 hover:shadow-lg">
          {/* Background Decorative Gradient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-red/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-mid/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

          <div className="space-y-2 z-10 max-w-2xl text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-red text-white text-[10px] font-bold shadow-sm tracking-wide">
              <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
              <span>KUOTA TERBATAS</span>
            </div>
            <h3 className="font-display text-2xl font-black tracking-tight text-white leading-tight">
              Tingkatkan Akses Mengajar Anda dengan Paket Pro!
            </h3>
            <p className="text-sm text-white/80 leading-relaxed max-w-prose">
              Butuh generate lebih dari 5 dokumen? Upgrade ke paket **Basic** (25 kuota) atau **Pro** (Tanpa Batas) untuk kecepatan prioritas, hasil dokumen super detail, dan templat KTSP / Kurikulum Merdeka terlengkap.
            </p>
          </div>

          <div className="z-10 flex-shrink-0 flex w-full lg:w-auto">
            <Link
              to="/profile"
              className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-red text-white font-bold text-sm rounded-lg min-h-[44px] shadow-brand-red transition-all duration-150 hover:bg-[#a83d25] hover:shadow-lg active:scale-95 text-center"
            >
              <span>Upgrade Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* 5. Quick Generate Cards Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-ink">Generate Administrasi Cepat</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Card 1: Buat RPP */}
          <div 
            onClick={() => handleQuickAction('/rpp')}
            className="bg-cream border border-rule rounded-xl p-5 sm:p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-brand-mid/50 hover:-translate-y-1 cursor-pointer flex flex-col justify-between min-h-[200px]"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#EBF3FB] text-brand-mid flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5 text-brand-mid" />
              </div>
              <h4 className="text-base font-bold text-ink">Buat RPP Baru</h4>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                Generate Rencana Pelaksanaan Pembelajaran (RPP) Kurikulum Merdeka atau K-13 lengkap dalam hitungan detik.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-bold text-brand-mid border-t border-rule/25 pt-4">
              <span>Mulai Buat RPP</span>
              <Plus className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: Buat Soal Ujian */}
          <div 
            onClick={() => handleQuickAction('/soal')}
            className="bg-cream border border-rule rounded-xl p-5 sm:p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-brand-mid/50 hover:-translate-y-1 cursor-pointer flex flex-col justify-between min-h-[200px]"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#E8F5EE] text-[#1A7A4A] flex items-center justify-center mb-4">
                <ClipboardList className="w-5 h-5 text-[#1A7A4A]" />
              </div>
              <h4 className="text-base font-bold text-ink">Buat Soal Ujian</h4>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                Rancang pilihan ganda & esai yang disesuaikan dengan kisi-kisi dan materi pembelajaran kelas Anda secara cepat.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-bold text-success border-t border-rule/25 pt-4">
              <span>Mulai Buat Soal</span>
              <Plus className="w-4 h-4" />
            </div>
          </div>

          {/* Card 3: Buat Modul Ajar */}
          <div
            onClick={() => handleQuickAction('/modul-ajar')}
            className="bg-cream border border-rule rounded-xl p-5 sm:p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#6A3EA1]/50 hover:-translate-y-1 cursor-pointer flex flex-col justify-between min-h-[200px]"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#F0EBFF] text-[#6A3EA1] flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5 text-[#6A3EA1]" />
              </div>
              <h4 className="text-base font-bold text-ink">Buat Modul Ajar</h4>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                Susun modul ajar digital Kurikulum Merdeka lengkap dengan CP, ATP, kegiatan pembelajaran, dan asesmen berbasis Profil Pelajar Pancasila.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs font-bold text-[#6A3EA1] border-t border-rule/25 pt-4">
              <span>Mulai Buat Modul Ajar</span>
              <Plus className="w-4 h-4" />
            </div>
          </div>

        </div>
      </div>

      {/* 6. Riwayat Dokumen Terakhir (Premium Empty State) */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-ink">Riwayat Dokumen Terbaru</h3>
          <span className="text-xs text-muted">Diperbarui real-time</span>
        </div>

        {/* Premium Empty State */}
        <div className="bg-white border border-rule rounded-xl p-8 sm:p-12 text-center shadow-sm flex flex-col items-center justify-center max-w-4xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#EBF3FB] text-brand-mid flex items-center justify-center mb-5 animate-pulse">
            <FolderOpen className="w-8 h-8 text-brand-mid" />
          </div>
          <h4 className="text-base font-bold text-ink mb-2">
            Belum Ada Dokumen Yang Dibuat
          </h4>
          <p className="text-sm text-muted max-w-md mx-auto mb-6 leading-relaxed">
            Mulai hemat waktu berharga Anda hari ini! Buat administrasi RPP atau bank soal ujian instan pertama Anda menggunakan mesin cerdas GuruBantu AI.
          </p>
          <button 
            onClick={() => handleQuickAction('/rpp')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#C84B2F] text-white font-semibold text-sm rounded-lg min-h-[44px] shadow-brand-red transition-all duration-150 hover:bg-[#a83d25] hover:shadow-md active:scale-95 text-center"
          >
            <span>Buat Dokumen Sekarang</span>
            <Plus className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Beginner Friendly Interactive Onboarding Tour Overlay */}
      {onboardingStep !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#FAF7F2] border border-[#C8BFB0] rounded-xl max-w-md w-full p-6 shadow-2xl relative space-y-6">
            
            {/* Indicator step */}
            <div className="flex justify-between items-center text-xs text-brand-mid font-bold">
              <span>📚 PANDUAN GURUBANTU AI</span>
              <span>Langkah {onboardingStep} dari 3</span>
            </div>

            {/* Steps Content */}
            {onboardingStep === 1 && (
              <div className="space-y-3 animate-in slide-in-from-right duration-250">
                <div className="w-12 h-12 bg-[#E8F5EE] text-[#1A7A4A] rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-[#1A7A4A]" />
                </div>
                <h3 className="text-lg font-bold text-ink leading-tight">Selamat Datang, Guru Hebat!</h3>
                <p className="text-sm text-muted leading-relaxed">
                  Kami merancang GuruBantu AI agar Anda bisa menghemat waktu berharga dalam membuat **RPP Kurikulum Merdeka** & **Soal Ujian** dalam hitungan menit saja. Mari ikuti tur singkat 1 menit ini untuk memahami cara menggunakannya!
                </p>
              </div>
            )}

            {onboardingStep === 2 && (
              <div className="space-y-3 animate-in slide-in-from-right duration-250">
                <div className="w-12 h-12 bg-warning-bg text-warning rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-warning" />
                </div>
                <h3 className="text-lg font-bold text-ink leading-tight">Sistem Kuota Transaksional Aman</h3>
                <p className="text-sm text-muted leading-relaxed">
                  Di Dashboard, Anda bisa melihat sisa kuota dokumen gratis Anda. Kuota Anda **HANYA** akan berkurang jika AI kami berhasil menyelesaikan berkas Word (.docx) Anda. Jika proses pembuatan gagal, kuota Anda tetap aman 100%!
                </p>
              </div>
            )}

            {onboardingStep === 3 && (
              <div className="space-y-3 animate-in slide-in-from-right duration-250">
                <div className="w-12 h-12 bg-[#EBF3FB] text-brand-mid rounded-lg flex items-center justify-center">
                  <ClipboardList className="w-6 h-6 text-brand-mid" />
                </div>
                <h3 className="text-lg font-bold text-ink leading-tight">Mulai Buat Dokumen AI Instan</h3>
                <p className="text-sm text-muted leading-relaxed">
                  Gunakan bagian **Quick Generate** di Dashboard untuk mulai membuat RPP atau Soal Ujian. Anda juga bisa memilih *"Isi Pakai Suara"* (Speech Input) di halaman form untuk mempermudah penulisan materi pokok!
                </p>
              </div>
            )}

            {/* Buttons bar */}
            <div className="flex items-center justify-between pt-2 border-t border-[#C8BFB0]/30">
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem('gurubantu_onboarded_v1', 'true');
                  setOnboardingStep(null);
                }}
                className="text-xs font-bold text-muted hover:text-ink min-h-[44px] px-3 active:scale-95"
              >
                Lewati Panduan
              </button>

              <div className="flex gap-2">
                {onboardingStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setOnboardingStep((prev) => (prev !== null ? prev - 1 : null))}
                    className="px-4 py-2 border border-[#C8BFB0] text-muted rounded-lg text-xs font-bold min-h-[44px] transition-colors hover:bg-neutral-100 active:scale-95"
                  >
                    Sebelumnya
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (onboardingStep === 3) {
                      localStorage.setItem('gurubantu_onboarded_v1', 'true');
                      setOnboardingStep(null);
                    } else {
                      setOnboardingStep((prev) => (prev !== null ? prev + 1 : null));
                    }
                  }}
                  className="px-5 py-2.5 bg-[#C84B2F] hover:bg-[#a83d25] text-white rounded-lg text-xs font-bold min-h-[44px] shadow-sm transition-all active:scale-95"
                >
                  {onboardingStep === 3 ? 'Selesai & Mulai!' : 'Lanjut'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
