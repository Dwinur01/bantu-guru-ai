import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
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
import { About } from './pages/About';
import { LearnMore } from './pages/LearnMore';
import { LandingPage } from './pages/LandingPage';

// ── 2. Protected Route ─────────────────────────────────────────────
interface ProtectedRouteProps { children: React.ReactElement; }

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

// ── 3. Page Loader ─────────────────────────────────────────────────
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
    <div className="fixed inset-0 z-[9999] bg-[#0a0a0f]/95 backdrop-blur-2xl flex flex-col items-center justify-center pointer-events-auto animate-page">
      <div className="flex flex-col items-center space-y-6 max-w-sm text-center">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-[#00f2ff]/10 animate-ping" />
          <div className="w-16 h-16 border-4 border-white/5 border-t-[#00f2ff] rounded-full animate-spin" />
          <div className="absolute w-8 h-8 bg-[#0a0a0f] text-[#00f2ff] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,242,255,0.35)] border border-[#00f2ff]/20 animate-bounce">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
        <div className="space-y-2">
          <p className="font-display font-black text-white text-lg tracking-wider">
            GuruBantu <span className="text-[#00f2ff]">AI</span>
          </p>
          <div className="h-0.5 w-12 bg-gradient-to-r from-[#00f2ff] to-[#6366f1] rounded-full mx-auto animate-pulse" />
          <p className="text-[10px] text-muted leading-relaxed font-bold uppercase tracking-widest px-4 pt-1">
            {loadingMessages[msgIndex]}
          </p>
        </div>
      </div>
    </div>
  );
};

// ── 4. App ─────────────────────────────────────────────────────────
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <GlobalPageLoader />
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/learn-more" element={<LearnMore />} />
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
