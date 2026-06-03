import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { 
  Sparkles, 
  Layers, 
  Zap,
  ClipboardList,
  BookOpen,
  Star,
  CheckCircle,
  ArrowRight,
  Users,
  FileText,
  Award
} from 'lucide-react';
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

// 1. Landing Page - Rich Marketing Page
const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen font-sans bg-white overflow-x-hidden">

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #0F2942 0%, #1A5276 60%, #0F2942 100%)' }}>
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

        {/* Navbar */}
        <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
          <div className="flex items-center gap-2.5">
            <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg border border-white/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white tracking-wide">
              GuruBantu <span className="text-[#E84B2F]">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-white/80 hover:text-white text-sm font-semibold transition-colors"
            >
              Masuk
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 bg-[#C84B2F] hover:bg-[#a83d25] text-white text-sm font-bold rounded-lg transition-all duration-150 hover:shadow-lg active:scale-95"
            >
              Daftar Gratis
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 md:px-12 py-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-semibold mb-8 shadow-lg">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>✓ Gratis untuk 5 Dokumen Pertama</span>
          </div>

          <h1 className="font-black text-4xl md:text-6xl lg:text-7xl text-white leading-tight tracking-tight max-w-5xl mb-6">
            Buat RPP &amp; Soal Ujian
            <br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #E84B2F, #FF8C69)' }}>
              dalam 60 Detik
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/75 max-w-2xl mx-auto mb-10 leading-relaxed">
            Asisten AI pertama untuk guru Indonesia. Buat Rencana Pelaksanaan Pembelajaran,
            Soal Ujian, dan Modul Ajar Kurikulum Merdeka secara instan — bebas repot, bebas stres.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#C84B2F] hover:bg-[#a83d25] text-white font-bold text-base rounded-xl shadow-2xl transition-all duration-150 hover:shadow-red-900/40 hover:-translate-y-0.5 active:scale-95"
            >
              <Sparkles className="w-5 h-5" />
              Daftar Gratis Sekarang
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-transparent hover:bg-white/10 text-white font-bold text-base rounded-xl border-2 border-white/40 hover:border-white/70 transition-all duration-150"
            >
              Sudah Punya Akun? Masuk
            </Link>
          </div>

          <p className="text-white/50 text-xs">Tanpa kartu kredit · Tanpa ikatan kontrak · Mulai gratis</p>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="bg-[#0F2942] border-t border-white/10 py-8">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { icon: Users, value: '2.400+', label: 'Guru Terbantu' },
            { icon: FileText, value: '38.000+', label: 'Dokumen Dibuat' },
            { icon: Award, value: '98%', label: 'Guru Puas' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-2">
              <stat.icon className="w-6 h-6 text-[#C84B2F]" />
              <span className="text-3xl font-black text-white">{stat.value}</span>
              <span className="text-white/60 text-sm font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-[#1F4E79] text-xs font-bold uppercase tracking-wider mb-4">Fitur Unggulan</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#1A1A2E] tracking-tight mb-4">
              Semua yang Anda Butuhkan,<br />
              <span className="text-[#1F4E79]">Tersedia dalam Satu Platform</span>
            </h2>
            <p className="text-muted text-base max-w-xl mx-auto">Dibangun khusus untuk guru honorer Indonesia yang ingin mengajar lebih efektif dan profesional.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                iconBg: 'bg-blue-50',
                iconColor: 'text-[#1F4E79]',
                title: 'RPP Instan AI',
                desc: 'Dari input sederhana ke RPP lengkap dalam hitungan detik. Lengkap dengan Capaian Pembelajaran, ATP, Kegiatan, dan Asesmen Kurikulum Merdeka.',
              },
              {
                icon: ClipboardList,
                iconBg: 'bg-green-50',
                iconColor: 'text-[#1A7A4A]',
                title: 'Bank Soal Otomatis',
                desc: 'Soal PG & esai berkualitas sesuai Kurikulum Merdeka. Pilih tingkat kesulitan, jumlah soal, dan dapatkan kunci jawaban + rubrik lengkap.',
              },
              {
                icon: BookOpen,
                iconBg: 'bg-purple-50',
                iconColor: 'text-[#6A3EA1]',
                title: 'Modul Ajar Kurikulum Merdeka',
                desc: 'Modul ajar lengkap sesuai standar Kemendikbudristek. Termasuk profil pelajar Pancasila, pertanyaan pemantik, dan program remedi & pengayaan.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200`}>
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-[#1A1A2E] mb-3">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING SECTION ===== */}
      <section className="py-20 px-6 md:px-12 bg-[#F8F9FA]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-red-50 text-[#C84B2F] text-xs font-bold uppercase tracking-wider mb-4">Harga Terjangkau</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#1A1A2E] tracking-tight mb-4">Pilih Paket Terbaik untuk Anda</h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">Mulai gratis, bayar hanya saat butuh lebih. Tidak ada biaya tersembunyi.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Free */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Paket Gratis</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-[#1A1A2E]">Rp 0</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Selamanya gratis</p>
              </div>
              <ul className="space-y-3 mb-8">
                {['5 dokumen gratis', 'RPP Kurikulum Merdeka', 'Soal Ujian PG & Esai', 'Unduh .docx', 'Dukungan via WA'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="block text-center py-3 rounded-xl border-2 border-[#1F4E79] text-[#1F4E79] font-bold text-sm hover:bg-[#1F4E79] hover:text-white transition-all duration-150">
                Mulai Gratis
              </Link>
            </div>

            {/* Saset */}
            <div className="bg-white rounded-2xl p-8 border-2 border-[#C84B2F] shadow-xl relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-[#C84B2F] text-white text-[10px] font-black rounded-full uppercase tracking-wide">Terlaris</span>
              </div>
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C84B2F] block mb-2">Paket Saset</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-[#1A1A2E]">Rp 7.500</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">per 30 hari</p>
              </div>
              <ul className="space-y-3 mb-8">
                {['25 dokumen / 30 hari', 'RPP + Soal + Modul Ajar', 'Unduh .docx', 'Prioritas antrian AI', 'Dukungan via WA'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="block text-center py-3 rounded-xl bg-[#C84B2F] text-white font-bold text-sm hover:bg-[#a83d25] transition-all duration-150 shadow-lg hover:shadow-xl">
                Beli Sekarang
              </Link>
            </div>

            {/* Basic */}
            <div className="bg-[#0F2942] rounded-2xl p-8 border border-white/10 shadow-sm">
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-300 block mb-2">Paket Basic</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">Rp 35.000</span>
                </div>
                <p className="text-xs text-blue-300/60 mt-1">per bulan</p>
              </div>
              <ul className="space-y-3 mb-8">
                {['Dokumen tanpa batas', 'RPP + Soal + Modul Ajar', 'Unduh .docx', 'Antrian AI prioritas tinggi', 'Dukungan prioritas WA'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-white/70">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="block text-center py-3 rounded-xl bg-white text-[#0F2942] font-bold text-sm hover:bg-gray-100 transition-all duration-150">
                Pilih Paket Basic
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-yellow-50 text-yellow-700 text-xs font-bold uppercase tracking-wider mb-4">Testimoni Guru</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#1A1A2E] tracking-tight">Dipercaya Ribuan Guru Indonesia</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Ibu Sari Dewi, S.Pd.',
                school: 'SDN 04 Palembang',
                text: 'GuruBantu AI benar-benar mengubah cara saya bekerja. Yang dulu butuh 3 jam untuk RPP, sekarang hanya 1 menit! Formatnya sudah sesuai Kurikulum Merdeka dan langsung bisa diprint.',
                stars: 5,
              },
              {
                name: 'Pak Ahmad Fauzi, M.Pd.',
                school: 'SMPN 7 Surabaya',
                text: 'Fitur bank soal otomatisnya luar biasa. Soal yang dihasilkan sudah HOTS dan ada kunci jawaban plus rubrik penilaian. Saya bisa fokus mengajar, bukan administrasi.',
                stars: 5,
              },
              {
                name: 'Ibu Rahayu Ningsih',
                school: 'SMAN 2 Bandung',
                text: 'Sebagai guru honorer yang mengajar di 2 sekolah, GuruBantu AI sangat membantu. Harganya terjangkau dan hasilnya profesional. Sangat merekomendasikan!',
                stars: 5,
              },
            ].map((t) => (
              <div key={t.name} className="bg-[#F8F9FA] rounded-2xl p-6 border border-gray-100">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-5 italic">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="font-bold text-sm text-[#1A1A2E]">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.school}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-20 px-6 md:px-12" style={{ background: 'linear-gradient(135deg, #0F2942 0%, #1A5276 100%)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
            Mulai Hemat Waktu Anda<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #E84B2F, #FF8C69)' }}>Hari Ini Juga!</span>
          </h2>
          <p className="text-white/70 text-base md:text-lg mb-10 leading-relaxed">
            Bergabung bersama 2.400+ guru Indonesia yang sudah merasakan manfaat GuruBantu AI.
            Daftar gratis, tidak perlu kartu kredit.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-3 px-10 py-5 bg-[#C84B2F] hover:bg-[#a83d25] text-white font-black text-lg rounded-2xl shadow-2xl transition-all duration-150 hover:shadow-red-900/40 hover:-translate-y-1 active:scale-95"
          >
            <Sparkles className="w-6 h-6" />
            Daftar Gratis — Mulai Sekarang
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#0A1E30] border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-white/10 p-1.5 rounded-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-sm">GuruBantu <span className="text-[#E84B2F]">AI</span></span>
          </div>
          <p className="text-white/40 text-xs text-center">
            © 2026 GuruBantu AI · Dibuat dengan ❤️ untuk Guru Indonesia
          </p>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <Link to="/about" className="hover:text-white/70 transition-colors">Tentang</Link>
            <Link to="/login" className="hover:text-white/70 transition-colors">Masuk</Link>
            <Link to="/register" className="hover:text-white/70 transition-colors">Daftar</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};

// 2. About Page
const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F5F0E8] p-6 flex flex-col items-center justify-center text-ink">
      <div className="max-w-md w-full bg-[#FAF7F2] border border-[#C8BFB0] rounded-xl p-6 shadow-sm text-center">
        <Layers className="w-12 h-12 text-[#2E75B6] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#1F4E79] mb-2 font-display">Tentang GuruBantu AI</h2>
        <p className="text-sm text-muted mb-6 leading-relaxed">
          Platform SaaS yang dirancang khusus untuk membebaskan waktu berharga para guru honorer di Indonesia dari beban administrasi sekolah yang rumit.
        </p>
        <Link to="/" className="inline-flex items-center justify-center px-4 py-2 bg-[#2E75B6] text-white font-semibold text-sm rounded-lg min-h-[40px] hover:bg-[#1e5891] w-full">
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


const App: React.FC = () => {
  return (
    <BrowserRouter>
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
