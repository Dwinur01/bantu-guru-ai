import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { 
  Sparkles, 
  Layers, 
  LogIn, 
  UserPlus
} from 'lucide-react';
import { useAuthStore } from './store/authStore';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { GenerateRPP } from './pages/GenerateRPP';
import { GenerateSoal } from './pages/GenerateSoal';
import { GenerateSuccess } from './pages/GenerateSuccess';
import { Documents } from './pages/Documents';
import { Profile } from './pages/Profile';
import { Pricing } from './pages/Pricing';
import { PaymentConfirm, PaymentSuccess, PaymentFailed } from './pages/Payment';
import { Billing } from './pages/Billing';

// 1. Landing Page (showcasing visual elements and Tailwind styles from design.md)
const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F5F0E8] p-6 flex flex-col items-center justify-center font-sans text-ink">
      <div className="max-w-md w-full bg-[#FAF7F2] border border-[#C8BFB0] rounded-xl p-6 shadow-sm">
        {/* Logo & Heading */}
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-[#E8F5EE] text-[#1A7A4A] p-2 rounded-lg">
            <Sparkles className="w-6 h-6 text-success" />
          </div>
          <span className="font-bold text-lg text-[#1F4E79]">GuruBantu AI</span>
        </div>

        {/* Display Font (Playfair) */}
        <h1 className="font-display text-4xl font-black text-ink leading-tight mb-3">
          Satu Langkah Lebih Cepat!
        </h1>
        
        <p className="text-base text-muted leading-relaxed mb-6">
          Aplikasi pembantu guru honorer Indonesia mengurus administrasi RPP & Bank Soal bertenaga kecerdasan buatan (AI) instan.
        </p>

        {/* Metric Card Style */}
        <div className="bg-white border border-[#C8BFB0] rounded-lg p-4 mb-6 flex flex-col gap-1 shadow-sm">
          <span className="text-xs text-muted font-medium uppercase tracking-wider">Kuota Tersedia (Free)</span>
          <span className="text-3xl font-bold text-ink">5 / 5 Dokumen</span>
          <div className="w-full h-2 bg-[#F2F2F2] rounded-full overflow-hidden mt-2">
            <div className="h-full bg-[#1A7A4A] rounded-full w-full"></div>
          </div>
        </div>

        {/* Buttons Showcase */}
        <div className="flex flex-col gap-3">
          <Link to="/login" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#C84B2F] text-white font-semibold text-sm rounded-lg min-h-[44px] transition-all duration-150 hover:bg-[#a83d25] hover:shadow-md active:scale-95 text-center">
            <LogIn className="w-4 h-4" />
            Coba Masuk (Login)
          </Link>

          <Link to="/register" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent text-[#C84B2F] font-semibold text-sm border-[1.5px] border-[#C84B2F] rounded-lg min-h-[44px] transition-all duration-150 hover:bg-[#FCEAE6] active:scale-95 text-center">
            <UserPlus className="w-4 h-4" />
            Daftar Gratis
          </Link>

          <Link to="/about" className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-transparent text-muted font-medium text-sm rounded-lg min-h-[44px] transition-colors duration-150 hover:bg-[#F2F2F2] hover:text-ink active:scale-95 text-center">
            <Layers className="w-4 h-4" />
            Tentang GuruBantu AI
          </Link>
        </div>
      </div>
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
