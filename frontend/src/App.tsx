import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { Layers, Users, FileText, Award } from 'lucide-react';
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

// Helper component for count-up animation
const AnimatedCounter: React.FC<{ target: number; duration?: number; suffix?: string }> = ({ 
  target, 
  duration = 1500, 
  suffix = '' 
}) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isIntersecting) return;

    let start = 0;
    const end = target;
    const totalFrames = 60; // 60 updates
    const increment = end / totalFrames;
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      start += increment;
      if (frame >= totalFrames) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, duration / totalFrames);

    return () => clearInterval(timer);
  }, [isIntersecting, target, duration]);

  const formatNumber = (val: number) => {
    return Math.floor(val).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return <span ref={elementRef}>{formatNumber(count)}{suffix}</span>;
};

// 1. Landing Page - Rich Marketing Page
const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen font-sans bg-white overflow-x-hidden text-slate-900 animate-page">

      {/* ===== HEADER / NAVBAR ===== */}
      <header className="w-full bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12H12V15H19C18.15 17.39 15.65 19 12.5 19C8.36 19 5 15.64 5 11.5C5 7.36 8.36 4 12.5 4C14.7 4 16.65 4.95 18 6.5L20.5 4C18.3 1.8 15.3 0.5 12.5 0.5" fill="#2563EB"/>
              <circle cx="16" cy="11.5" r="3" fill="#22D3EE" />
            </svg>
            <span className="font-bold text-xl text-slate-900 tracking-tight">
              GuruBantu AI
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 font-medium text-slate-600">
            <a href="#fitur" className="hover:text-blue-600 transition-colors">Fitur</a>
            <a href="#harga" className="hover:text-blue-600 transition-colors">Harga</a>
            <Link to="/about" className="hover:text-blue-600 transition-colors">Tentang Kami</Link>
            <a href="#kontak" className="hover:text-blue-600 transition-colors">Hubungi Kami</a>
          </nav>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2 text-slate-800 hover:text-blue-600 font-semibold border border-slate-200 hover:border-slate-300 rounded-full transition-all text-sm bg-white shadow-sm"
            >
              Masuk
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-all text-sm shadow-md shadow-blue-500/10"
            >
              Daftar
            </Link>
          </div>
        </div>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className="relative bg-[#F8FAFC] pt-12 pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side Content */}
        <div className="space-y-8 text-left z-10">
          <h1 className="font-extrabold text-4xl md:text-5xl lg:text-6xl text-slate-950 leading-[1.15] tracking-tight">
            <span className="text-blue-600">GuruBantu AI:</span>
            <br />
            Teman Cerdas Guru Indonesia!
          </h1>

          <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl">
            Buat RPP, Modul Ajar, dan Soal Ujian dalam hitungan detik. Hemat waktu, fokus mengajar, biarkan AI membantu!
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-full shadow-lg shadow-blue-500/25 transition-all duration-150 hover:-translate-y-0.5 active:scale-95"
            >
              Coba Sekarang, Gratis!
            </Link>
            <a
              href="#fitur"
              className="px-8 py-4 bg-white border border-slate-200 hover:border-blue-300 text-slate-800 font-bold text-base rounded-full shadow-sm hover:bg-slate-50 transition-all duration-150"
            >
              Pelajari Lebih Lanjut
            </a>
          </div>
        </div>

        {/* Right Side Image */}
        <div className="relative flex items-center justify-center lg:justify-end">
          {/* Subtle colorful glows in background */}
          <div className="absolute w-80 h-80 bg-green-200/40 rounded-full blur-3xl -top-10 -right-10 pointer-events-none" />
          <div className="absolute w-80 h-80 bg-blue-200/40 rounded-full blur-3xl -bottom-10 -left-10 pointer-events-none" />
          
          <img
            src="/hero-illustration.png"
            alt="GuruBantu AI Illustration"
            className="w-full max-w-[500px] object-contain relative z-10 transition-transform duration-500 hover:scale-102"
          />
        </div>
      </div>
    </section>

      {/* ===== STATS BAR ===== */}
      <section className="bg-[#F8FAFC] py-12 border-t border-slate-100/80">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { icon: Users, value: 2400, suffix: '+', label: 'Guru Terbantu' },
            { icon: FileText, value: 38000, suffix: '+', label: 'Dokumen Dibuat' },
            { icon: Award, value: 98, suffix: '%', label: 'Guru Puas' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </span>
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== WAVE DIVIDER TOP ===== */}
      <div className="w-full overflow-hidden leading-[0] bg-[#F8FAFC] pointer-events-none">
        <svg className="relative block w-full h-[60px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 C300,90 900,90 1200,0 L1200,120 L0,120 Z" fill="#FFFFFF"></path>
        </svg>
      </div>

      {/* ===== FEATURES SECTION ===== */}
      <section id="fitur" className="bg-white py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-slate-950 mb-16 tracking-tight">
            Fitur Utama
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1: Orange */}
            <div className="bg-[#FFEADA] border border-[#FFD0B0] rounded-[2rem] p-8 shadow-sm flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-inner mb-6">
                <svg className="w-10 h-10 text-[#E28743]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">RPP & Modul Ajar Otomatis</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Hasilkan dokumen kurikulum merdeka lengkap dalam hitungan detik.
              </p>
            </div>

            {/* Card 2: Purple */}
            <div className="bg-[#F3E8FF] border border-[#E9D5FF] rounded-[2rem] p-8 shadow-sm flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-inner mb-6">
                <svg className="w-10 h-10 text-[#9333EA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-4.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2z" />
                  <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-4.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Soal Ujian & Kuis AI</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Buat soal HOTS dan beragam jenis soal dengan kunci jawaban otomatis.
              </p>
            </div>

            {/* Card 3: Green */}
            <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-[2rem] p-8 shadow-sm flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-inner mb-6">
                <svg className="w-10 h-10 text-[#059669]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5v-15z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Perpustakaan Guru & Diskusi</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Akses sumber daya, berbagi materi, dan kolaborasi dengan sesama guru.
              </p>
            </div>

            {/* Card 4: Blue */}
            <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-[2rem] p-8 shadow-sm flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-inner mb-6">
                <svg className="w-10 h-10 text-[#2563EB]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Masukan Suara & 3D Tour</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Gunakan fitur canggih untuk efisiensi maksimal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WAVE DIVIDER BOTTOM ===== */}
      <div className="w-full overflow-hidden leading-[0] bg-white pointer-events-none">
        <svg className="relative block w-full h-[60px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 C300,90 900,90 1200,0 L1200,120 L0,120 Z" fill="#F8FAFC"></path>
        </svg>
      </div>

      {/* ===== PRICING SECTION ===== */}
      <section id="harga" className="bg-[#F8FAFC] py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-950 mb-16 tracking-tight">
            Paket Berlangganan
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
            {/* Gratis Card */}
            <div className="bg-gradient-to-b from-slate-50 to-slate-100/70 border border-slate-200 rounded-[2.5rem] p-10 shadow-sm flex flex-col justify-between items-center text-center transition-all duration-300 hover:shadow-md relative overflow-hidden">
              <div className="space-y-6 w-full">
                <h3 className="text-3xl font-extrabold text-slate-950">Gratis</h3>
                <p className="text-base font-bold text-slate-600">Akses Dasar</p>
                <div className="w-full border-b border-slate-200/60 my-2" />
                <ul className="space-y-4 text-slate-600 text-sm font-medium">
                  <li>Buat 5 dokumen/bulan</li>
                  <li>Akses terbatas perpustakaan</li>
                </ul>
              </div>
              <Link
                to="/register"
                className="w-full mt-10 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-full border border-slate-200 shadow-inner shadow-slate-100 transition-all text-sm"
              >
                Daftar Gratis
              </Link>
            </div>

            {/* Basic Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border border-blue-500 rounded-[2.5rem] p-10 shadow-xl flex flex-col justify-between items-center text-center transition-all duration-300 hover:shadow-2xl hover:scale-102 relative overflow-hidden">
              {/* Popular Diagonal Ribbon */}
              <div className="absolute top-0 right-0 w-36 h-36 pointer-events-none overflow-hidden">
                <div className="absolute transform rotate-45 bg-[#E2B93B] text-slate-950 text-center font-bold text-xs py-1.5 w-52 -right-12 top-10 shadow-md tracking-wider uppercase">
                  Populer
                </div>
              </div>

              <div className="space-y-6 w-full z-10">
                <h3 className="text-3xl font-extrabold">Basic</h3>
                <div>
                  <p className="text-2xl font-extrabold">Rp 25.000/bulan</p>
                </div>
                <div className="w-full border-b border-white/20 my-2" />
                <ul className="space-y-4 text-blue-50 text-sm font-medium">
                  <li>Buat 15 dokumen/bulan</li>
                  <li>Akses perpustakaan lengkap</li>
                  <li>Simpan sebagai DOCX</li>
                </ul>
              </div>
              <Link
                to="/register"
                className="w-full mt-10 py-3.5 bg-white hover:bg-slate-50 text-blue-700 font-bold rounded-full shadow-lg transition-all text-sm z-10"
              >
                Pilih Basic
              </Link>
            </div>

            {/* Pro Card */}
            <div className="bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 text-white border border-teal-500 rounded-[2.5rem] p-10 shadow-xl flex flex-col justify-between items-center text-center transition-all duration-300 hover:shadow-2xl relative overflow-hidden">
              <div className="space-y-6 w-full z-10">
                <h3 className="text-3xl font-extrabold">Pro</h3>
                <div>
                  <p className="text-2xl font-extrabold">Rp 49.000/bulan</p>
                </div>
                <div className="w-full border-b border-white/20 my-2" />
                <ul className="space-y-4 text-emerald-50 text-sm font-medium">
                  <li>Buat 45 dokumen/bulan</li>
                  <li>Akses penuh + fitur eksklusif</li>
                  <li>Prioritas support</li>
                </ul>
              </div>
              <Link
                to="/register"
                className="w-full mt-10 py-3.5 bg-[#D9F99D] hover:bg-[#cbf28a] text-[#3F6212] font-extrabold rounded-full shadow-lg transition-all text-sm z-10"
              >
                Pilih Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer id="kontak" className="bg-white border-t border-slate-100 py-8 px-6">
        <div className="max-w-7xl mx-auto flex justify-center items-center gap-8 text-sm font-semibold text-slate-600">
          <Link to="/privacy" className="hover:text-blue-600 transition-colors">Kebijakan Privasi</Link>
          <Link to="/terms" className="hover:text-blue-600 transition-colors">Syarat dan Ketentuan</Link>
          <Link to="/about" className="hover:text-blue-600 transition-colors">Tentang Kami</Link>
          <a href="https://wa.me/6282132775342" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">Hubungi Kami</a>
        </div>
      </footer>

    </div>
  );
};

// 2. About Page
const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center text-slate-900 animate-page">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
        <Layers className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-950 mb-2 font-display">Tentang GuruBantu AI</h2>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Platform SaaS yang dirancang khusus untuk membebaskan waktu berharga para guru honorer di Indonesia dari beban administrasi sekolah yang rumit.
        </p>
        <Link to="/" className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold text-sm rounded-full min-h-[40px] hover:bg-blue-700 w-full shadow-md transition-all">
          Kembali ke Home
        </Link>
      </div>
    </div>
  );
};

// 3. Protected Route Wrapper Component
interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    // Redirect ke halaman login jika tidak diautentikasi
    return <Navigate to="/login" replace />;
  }
  
  return children;
};


// Top progress bar page transition loader
const GlobalPageLoader: React.FC = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-blue-100 z-[9999] overflow-hidden pointer-events-none">
      <div className="h-full bg-blue-600 animate-loading-bar" />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <GlobalPageLoader />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/rpp"
          element={
            <ProtectedRoute>
              <Layout>
                <GenerateRPP />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/soal"
          element={
            <ProtectedRoute>
              <Layout>
                <GenerateSoal />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/modul-ajar"
          element={
            <ProtectedRoute>
              <Layout>
                <GenerateModulAjar />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/riwayat"
          element={
            <ProtectedRoute>
              <Layout>
                <Documents />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/generate/success"
          element={
            <ProtectedRoute>
              <Layout>
                <GenerateSuccess />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/pricing"
          element={
            <ProtectedRoute>
              <Layout>
                <Pricing />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing"
          element={
            <ProtectedRoute>
              <Layout>
                <Billing />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/perpustakaan"
          element={
            <ProtectedRoute>
              <Layout>
                <Library />
              </Layout>
            </ProtectedRoute>
          }
        />
        {/* Payment Flow — tanpa Layout (full-screen) */}
        <Route path="/payment/:plan" element={<ProtectedRoute><PaymentConfirm /></ProtectedRoute>} />
        <Route path="/payment/success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
        <Route path="/payment/failed" element={<ProtectedRoute><PaymentFailed /></ProtectedRoute>} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
