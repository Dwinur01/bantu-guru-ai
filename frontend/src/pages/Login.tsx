import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { api } from '../services/api';
import { useTheme } from '../hooks/useTheme';
const DEMO_ACCOUNTS = [
  {
    email: "guru.demo@gurubantu.ai",
    password: "Password123",
    name: "Guru Honor Demo",
    plan: "pro" as const,
    quotaRemaining: 100
  },
  {
    email: "demo.guru@gurubantu.ai",
    password: "Password123",
    name: "Guru Honor Demo",
    plan: "pro" as const,
    quotaRemaining: 100
  }
];

const loginSchema = z.object({
  email: z.string().min(1, 'Alamat email wajib diisi').email('Format alamat email tidak valid'),
  password: z.string().min(1, 'Kata sandi wajib diisi'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { theme } = useTheme();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleQuickDemo = () => {
    setIsLoading(true);
    setServerError(null);
    console.log("Membypass login dengan Akun Demo Instan...");
    setTimeout(() => {
      setAuth(
        {
          id: 999,
          name: "Guru Honor Demo",
          email: "demo.guru@gurubantu.ai",
          plan: "pro",
          quotaRemaining: 100,
        },
        'mock-demo-jwt-token-from-json'
      );
      setIsLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setServerError(null);

    console.log("Mencoba login dengan:", data.email);

    // Cek kecocokan akun demo dari array lokal (dengan trim spasi bawaan copy-paste)
    const matchingDemo = DEMO_ACCOUNTS.find(
      (acc) => acc.email.toLowerCase() === data.email.trim().toLowerCase() && acc.password === data.password.trim()
    );

    if (matchingDemo) {
      console.log("Akun demo cocok! Mem-bypass login...");
      setTimeout(() => {
        setAuth(
          {
            id: 999,
            name: matchingDemo.name,
            email: matchingDemo.email,
            plan: matchingDemo.plan,
            quotaRemaining: matchingDemo.quotaRemaining,
          },
          'mock-demo-jwt-token-from-json'
        );
        setIsLoading(false);
        navigate('/dashboard');
      }, 1000);
      return;
    }

    try {
      const response = await api.post('/auth/login', data);
      const { accessToken, user } = response.data.data;
      setAuth(user, accessToken);
      navigate('/dashboard');
    } catch (error: any) {
      setServerError(
        error.response?.data?.message || 'Terjadi kesalahan sistem. Silakan coba kembali.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 animate-page bg-auth-gradient">

      {/* Background animated blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[80px] animate-blob pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[60px] animate-blob-delay pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-violet-600/5 rounded-full blur-[80px] animate-blob-delay2 pointer-events-none" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo Header */}
        <div className="text-center mb-8 animate-fade-up">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-glow-blue group-hover:scale-110 transition-transform">
              <img src="/logo-gurubantu.png" alt="GuruBantu AI" className="w-8 h-8 object-contain rounded-xl" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
            </div>
            <span className={`font-display font-black text-xl ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
              GuruBantu <span className="gradient-text-blue">AI</span>
            </span>
          </Link>
          <h1 className={`font-display font-black text-3xl mb-2 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Masuk ke Akun</h1>
          <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Selamat kembali, Guru Hebat! 👋</p>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-3xl p-7 shadow-2xl animate-fade-up-1">
          {/* Server Error */}
          {serverError && (
            <div className="flex items-start gap-3 p-3.5 mb-5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/30 rounded-2xl text-red-600 dark:text-red-400 animate-scale-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="text-sm font-semibold leading-relaxed">{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="login-email" className={`block text-sm font-bold ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                Email Guru
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  placeholder="email@sekolah.com"
                  autoComplete="email"
                  {...register('email')}
                  className={`input-premium w-full pl-10 pr-4 py-3 text-sm placeholder-slate-500 ${errors.email ? 'error' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 dark:text-red-400 font-semibold flex items-center gap-1 pt-0.5">
                  <AlertCircle className="w-3 h-3" />{errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="login-password" className={`block text-sm font-bold ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                  Kata Sandi
                </label>
                <Link to="/forgot-password" className="text-xs text-brand-red font-semibold hover:text-cyan-400 transition-colors">
                  Lupa Sandi?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register('password')}
                  className={`input-premium w-full pl-10 pr-11 py-3 text-sm placeholder-slate-500 ${errors.password ? 'error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-red transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 dark:text-red-400 font-semibold flex items-center gap-1 pt-0.5">
                  <AlertCircle className="w-3 h-3" />{errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="login-submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-sm text-slate-950 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Masuk Sekarang
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Quick Demo Login Button */}
            <button
              type="button"
              onClick={handleQuickDemo}
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-black text-xs border transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60 mt-2.5 shadow-sm ${
                theme === 'light'
                  ? 'border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
                  : 'border-indigo-500/20 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300'
              }`}
            >
              🔑 Masuk Instan Akun Demo (Bypass)
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className={`flex-1 h-px ${theme === 'light' ? 'bg-slate-200' : 'bg-white/10'}`} />
            <span className={`text-xs font-semibold ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>atau</span>
            <div className={`flex-1 h-px ${theme === 'light' ? 'bg-slate-200' : 'bg-white/10'}`} />
          </div>

          {/* Register Link */}
          <p className={`text-center text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
            Belum punya akun?{' '}
            <Link to="/register" className="text-brand-red font-black hover:text-cyan-400 transition-colors">
              Daftar Gratis
            </Link>
          </p>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-5 mt-6 text-[10px] text-slate-500 font-semibold animate-fade-up-2">
          <span className="flex items-center gap-1">🔒 SSL Encrypted</span>
          <span className="flex items-center gap-1">🇮🇩 Server Indonesia</span>
          <span className="flex items-center gap-1">✅ Data Aman</span>
        </div>
      </div>
    </div>
  );
};
