import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { Layers, Users, FileText, Award, Sparkles, ArrowRight } from 'lucide-react';
import { useAuthStore } from './store/authStore';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { GenerateRPP } from './pages/GenerateRPP';
import { GenerateSoal } from './pages/GenerateSoal';
import { GenerateModulAjar } from './pages/GenerateModulAjar';
import { GenerateSuccess } from './pages/GenerateSuccess';
import { Documents } from './pages/Documents';
import { Profile } from './pages/Profile';
import { Pricing } from './pages/Pricing';
import { PaymentConfirm, PaymentSuccess, PaymentFailed } from './pages/Payment';
import { Billing } from './pages/Billing';
import { Library } from './pages/Library';

// Helper: animated count-up
const AnimatedCounter: React.FC<{ target: number; duration?: number; suffix?: string }> = ({
  target,
  duration = 1500,
  suffix = '',
}) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setIsIntersecting(true); observer.disconnect(); }
      },
      { threshold: 0.1 }
    );
    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isIntersecting) return;
    let frame = 0;
    const totalFrames = 60;
    const increment = target / totalFrames;
    const timer = setInterval(() => {
      frame++;
      if (frame >= totalFrames) { setCount(target); clearInterval(timer); }
      else setCount(prev => prev + increment);
    }, duration / totalFrames);
    return () => clearInterval(timer);
  }, [isIntersecting, target, duration]);

  const format = (v: number) =>
    Math.floor(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return <span ref={elementRef}>{format(count)}{suffix}</span>;
};

// ── 1. Landing Page ────────────────────────────────────────────────
const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen font-sans overflow-x-hidden text-slate-900 animate-page">

      {/* NAVBAR */}
      <header className="w-full sticky top-0 z-50 glass-light border-b border-white/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-3.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-glow-sm">
              <img src="/logo-gurubantu.png" alt="GuruBantu AI" className="w-7 h-7 object-contain rounded-lg" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
            </div>
            <span className="font-display font-black text-lg text-slate-900">
              GuruBantu <span className="gradient-text-blue">AI</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600">
            {([['#fitur','Fitur'],['#harga','Harga'],['#kontak','Hubungi']] as [string,string][]).map(([href, label]) => (
              <a key={href} href={href} className="hover:text-blue-600 transition-colors">{label}</a>
            ))}
            <Link to="/about" className="hover:text-blue-600 transition-colors">Tentang Kami</Link>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link to="/login" className="px-4 py-2 text-slate-700 font-semibold border border-slate-200 hover:border-blue-300 rounded-full transition-all text-sm bg-white/80 hover:bg-white shadow-sm">
              Masuk
            </Link>
            <Link to="/register" className="btn-primary px-5 py-2 rounded-full text-sm font-bold text-white">
              Daftar Gratis
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-gradient-to-br from-[#020617] via-[#0F172A] to-[#1E1B4B]">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-blob pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-600/20 rounded-full blur-[100px] animate-blob-delay pointer-events-none" />
        <div className="absolute top-3/4 left-1/2 w-[300px] h-[300px] bg-cyan-500/15 rounded-full blur-[80px] animate-blob-delay2 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20 text-center w-full">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-mid border border-white/20 text-xs font-black text-blue-300 mb-8 animate-fade-up">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Teman Cerdas Guru Indonesia
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
          </div>

          <h1 className="font-display font-black text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight mb-6 animate-fade-up-1">
            Hemat Waktu Guru<br />
            dengan <span className="gradient-text-hero">Kecerdasan AI</span>
          </h1>

          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up-2">
            Buat <strong className="text-white/90">RPP Kurikulum Merdeka</strong>, <strong className="text-white/90">Soal Ujian HOTS</strong>, dan <strong className="text-white/90">Modul Ajar</strong> berkualitas tinggi dalam hitungan detik — bukan jam.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-up-3">
            <Link to="/register" className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-base text-white shadow-glow-blue">
              <Sparkles className="w-5 h-5" />
              Coba Gratis Sekarang
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#fitur" className="btn-glow-white inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base text-slate-800 border border-slate-200">
              Pelajari Lebih Lanjut
            </a>
          </div>

          <div className="hidden lg:flex items-center justify-center gap-4 mt-14 animate-fade-up-4">
            {[
              { emoji: '⚡', label: 'RPP dalam 30 detik' },
              { emoji: '🎯', label: 'Soal HOTS otomatis' },
              { emoji: '📚', label: 'Format Kemendikbud' },
              { emoji: '🔒', label: 'Kuota transaksional' },
            ].map(({ emoji, label }) => (
              <div key={label} className="glass-mid rounded-xl px-4 py-2.5 flex items-center gap-2 border border-white/10 text-white/80 text-sm font-medium">
                <span>{emoji}</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-white py-16 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { icon: Users,    value: 2400,  suffix: '+', label: 'Guru Terbantu',   gradient: 'from-blue-500 to-indigo-600' },
            { icon: FileText, value: 38000, suffix: '+', label: 'Dokumen Dibuat',  gradient: 'from-emerald-500 to-teal-600' },
            { icon: Award,    value: 98,    suffix: '%', label: 'Guru Puas',        gradient: 'from-violet-500 to-purple-600' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex flex-col items-center gap-3">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-4xl font-black text-slate-900 tracking-tight gradient-text-blue">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </span>
                <span className="text-slate-500 text-xs font-black uppercase tracking-widest">{stat.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURES */}
      <section id="fitur" className="bg-[#F8FAFC] py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-black border border-blue-100 mb-4">
              <Layers className="w-3.5 h-3.5" /> FITUR UNGGULAN
            </span>
            <h2 className="font-display font-black text-4xl md:text-5xl text-slate-900 tracking-tight">
              Semua yang Guru <span className="gradient-text-blue">Butuhkan</span>
            </h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto">Dirancang khusus untuk guru honorer Indonesia agar bisa fokus mengajar, bukan mengurus administrasi.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { gradient: 'from-amber-400 to-orange-500',  bg: 'bg-amber-50',  border: 'border-amber-100',  emoji: '📄', title: 'RPP & Modul Ajar',   desc: 'Generate Rencana Pelaksanaan Pembelajaran Kurikulum Merdeka lengkap dalam detik.' },
              { gradient: 'from-violet-500 to-purple-600', bg: 'bg-violet-50', border: 'border-violet-100', emoji: '✍️', title: 'Soal Ujian AI',       desc: 'Buat soal HOTS pilihan ganda & esai dengan kunci jawaban otomatis berbasis Taksonomi Bloom.' },
              { gradient: 'from-emerald-500 to-teal-600',  bg: 'bg-emerald-50',border: 'border-emerald-100',emoji: '📚', title: 'Perpustakaan Guru', desc: 'Akses sumber daya, berbagi materi, dan berkolaborasi dengan ribuan guru di seluruh Indonesia.' },
              { gradient: 'from-blue-500 to-indigo-600',   bg: 'bg-blue-50',   border: 'border-blue-100',   emoji: '🎙️', title: 'Input Suara (AI)',   desc: 'Isi topik materi dengan suara. Speech recognition berbahasa Indonesia untuk guru yang aktif.' },
            ].map((f, i) => (
              <div key={i} className={`group relative overflow-hidden rounded-3xl p-7 ${f.bg} border ${f.border} hover-card-premium`}>
                <div className={`absolute -top-8 -right-8 w-28 h-28 rounded-full bg-gradient-to-br ${f.gradient} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                  {f.emoji}
                </div>
                <h3 className="text-base font-black text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="harga" className="bg-white py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 text-green-600 text-xs font-black border border-green-100 mb-4">
              💰 HARGA TRANSPARAN
            </span>
            <h2 className="font-display font-black text-4xl md:text-5xl text-slate-900 tracking-tight">
              Pilih Paket <span className="gradient-text-blue">Terbaik</span>
            </h2>
            <p className="text-slate-500 mt-3 max-w-lg mx-auto">Mulai gratis, upgrade kapan saja. Tidak ada biaya tersembunyi.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
            {/* Free */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 flex flex-col hover-card-premium">
              <div className="text-3xl mb-2">🎁</div>
              <h3 className="text-2xl font-black text-slate-900 mb-1">Gratis</h3>
              <p className="text-slate-500 text-sm mb-5">Untuk mencoba</p>
              <div className="text-4xl font-black text-slate-900 mb-1">Rp 0</div>
              <p className="text-xs text-slate-400 mb-6">/ bulan</p>
              <ul className="space-y-2.5 text-sm text-slate-600 flex-1 mb-7">
                {['5 dokumen/bulan','RPP & Soal Ujian','Download DOCX'].map(f => (
                  <li key={f} className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-[10px]">✓</span>{f}</li>
                ))}
              </ul>
              <Link to="/register" className="w-full py-3.5 text-center rounded-2xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors">
                Daftar Gratis
              </Link>
            </div>

            {/* Basic - Popular */}
            <div className="relative rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 flex flex-col shadow-glow-blue hover-card-premium scale-[1.03]">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                ⭐ PALING POPULER
              </div>
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="text-2xl font-black text-white mb-1">Basic</h3>
              <p className="text-blue-200 text-sm mb-5">Untuk guru aktif</p>
              <div className="text-4xl font-black text-white mb-1">Rp 29.000</div>
              <p className="text-xs text-blue-300 mb-6">/ bulan</p>
              <ul className="space-y-2.5 text-sm text-blue-100 flex-1 mb-7">
                {['Dokumen Unlimited','RPP & Soal Ujian','Download DOCX','Prioritas AI','Email Support'].map(f => (
                  <li key={f} className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px]">✓</span>{f}</li>
                ))}
              </ul>
              <Link to="/register" className="btn-glow-white w-full py-3.5 text-center rounded-2xl font-black text-blue-700 text-sm">
                Pilih Basic
              </Link>
            </div>

            {/* Pro */}
            <div className="rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 p-8 flex flex-col hover-card-premium">
              <div className="text-3xl mb-2">👑</div>
              <h3 className="text-2xl font-black text-violet-900 mb-1">Pro</h3>
              <p className="text-violet-500 text-sm mb-5">Untuk profesional</p>
              <div className="text-4xl font-black text-violet-900 mb-1">Rp 49.000</div>
              <p className="text-xs text-violet-400 mb-6">/ bulan</p>
              <ul className="space-y-2.5 text-sm text-violet-700 flex-1 mb-7">
                {['Semua fitur Basic','Template eksklusif KKG','Format Kemendikbud otomatis','Dukungan prioritas 24/7','Early access fitur baru'].map(f => (
                  <li key={f} className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-[10px]">✓</span>{f}</li>
                ))}
              </ul>
              <Link to="/register" className="w-full py-3.5 text-center rounded-2xl bg-gradient-to-r from-violet-600 to-purple-700 text-white font-black text-sm hover:opacity-90 transition-all">
                Pilih Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="kontak" className="bg-slate-900 text-white py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-black text-white">GuruBantu <span className="gradient-text-blue">AI</span></span>
            <span className="px-2 py-0.5 bg-blue-900 text-blue-300 text-[10px] font-black rounded-full">v2.0</span>
          </div>
          <p className="text-slate-500 text-xs text-center">© 2024 GuruBantu AI · Memberdayakan Guru Indonesia dengan Kecerdasan Buatan</p>
          <div className="flex items-center gap-5 text-xs font-semibold text-slate-400">
            {([
              ['/privacy','Privasi'],
              ['/terms','Syarat'],
              ['/about','Tentang'],
            ] as [string,string][]).map(([to, label]) => (
              <Link key={to} to={to} className="hover:text-white transition-colors">{label}</Link>
            ))}
            <a href="https://wa.me/6282132775342" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// ── 2. About Page ──────────────────────────────────────────────────
const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-page"
      style={{background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF, #F0F9FF)'}}>
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 shadow-2xl p-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-glow-blue">
          <Layers className="w-8 h-8 text-white" />
        </div>
        <h2 className="font-display text-2xl font-black text-slate-900 mb-3">Tentang GuruBantu AI</h2>
        <p className="text-sm text-slate-600 mb-8 leading-relaxed">
          Platform SaaS yang dirancang khusus untuk membebaskan waktu berharga para guru honorer di Indonesia dari beban administrasi sekolah yang rumit.
        </p>
        <Link to="/" className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-black text-white w-full">
          ← Kembali ke Home
        </Link>
      </div>
    </div>
  );
};

// ── 3. Protected Route ─────────────────────────────────────────────
interface ProtectedRouteProps { children: React.ReactElement; }

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

// ── 4. Page Loader ─────────────────────────────────────────────────
const GlobalPageLoader: React.FC = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);

  const loadingMessages = [
    'Mempersiapkan lembar kerja Guru...',
    'Mengoptimalkan asisten cerdas GuruBantu AI...',
    'Menyelaraskan kurikulum nasional...',
    'Membuat administrasi mengajar terasa menyenangkan...',
    'Menghubungkan ke cloud storage aman...',
    'Menyinkronkan profil Guru honorer...',
  ];

  useEffect(() => {
    setIsLoading(true);
    setMsgIndex(Math.floor(Math.random() * loadingMessages.length));
    const timer = setTimeout(() => setIsLoading(false), 450);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#F8FAFC]/90 backdrop-blur-xl flex flex-col items-center justify-center pointer-events-auto animate-page">
      <div className="flex flex-col items-center space-y-6 max-w-sm text-center">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-blue-500/10 animate-ping" />
          <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
          <div className="absolute w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-md animate-bounce">
            <Sparkles className="w-4 h-4 text-blue-500" />
          </div>
        </div>
        <div className="space-y-2">
          <p className="font-display font-black text-ink text-lg tracking-wider">GuruBantu AI</p>
          <div className="h-0.5 w-12 bg-blue-500 rounded-full mx-auto animate-pulse" />
          <p className="text-[10px] text-muted leading-relaxed font-bold uppercase tracking-widest px-4 pt-1">
            {loadingMessages[msgIndex]}
          </p>
        </div>
      </div>
    </div>
  );
};

// ── 5. App ─────────────────────────────────────────────────────────
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <GlobalPageLoader />
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/rpp"       element={<ProtectedRoute><Layout><GenerateRPP /></Layout></ProtectedRoute>} />
        <Route path="/soal"      element={<ProtectedRoute><Layout><GenerateSoal /></Layout></ProtectedRoute>} />
        <Route path="/modul-ajar" element={<ProtectedRoute><Layout><GenerateModulAjar /></Layout></ProtectedRoute>} />
        <Route path="/riwayat"   element={<ProtectedRoute><Layout><Documents /></Layout></ProtectedRoute>} />
        <Route path="/generate/success" element={<ProtectedRoute><Layout><GenerateSuccess /></Layout></ProtectedRoute>} />
        <Route path="/profile"   element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
        <Route path="/pricing"   element={<ProtectedRoute><Layout><Pricing /></Layout></ProtectedRoute>} />
        <Route path="/billing"   element={<ProtectedRoute><Layout><Billing /></Layout></ProtectedRoute>} />
        <Route path="/perpustakaan" element={<ProtectedRoute><Layout><Library /></Layout></ProtectedRoute>} />

        {/* Payment — full-screen */}
        <Route path="/payment/:plan" element={<ProtectedRoute><PaymentConfirm /></ProtectedRoute>} />
        <Route path="/payment/success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
        <Route path="/payment/failed"  element={<ProtectedRoute><PaymentFailed /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
