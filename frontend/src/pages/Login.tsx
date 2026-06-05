import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { api } from '../services/api';
import demoAccounts from '../demo-accounts.json';

const loginSchema = z.object({
  email: z.string().min(1, 'Alamat email wajib diisi').email('Format alamat email tidak valid'),
  password: z.string().min(1, 'Kata sandi wajib diisi'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

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

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setServerError(null);

    // Cek kecocokan akun demo dari file JSON
    const matchingDemo = demoAccounts.find(
      (acc) => acc.email.toLowerCase() === data.email.toLowerCase() && acc.password === data.password
    );

    if (matchingDemo) {
      setTimeout(() => {
        setAuth(
          {
            id: 999,
            name: matchingDemo.name,
            email: matchingDemo.email,
            plan: matchingDemo.plan as any,
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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 animate-page"
      style={{background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 40%, #F0F9FF 100%)'}}>

      {/* Background animated blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-[80px] animate-blob pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-300/20 rounded-full blur-[60px] animate-blob-delay pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-violet-300/10 rounded-full blur-[80px] animate-blob-delay2 pointer-events-none" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo Header */}
        <div className="text-center mb-8 animate-fade-up">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-glow-blue group-hover:scale-110 transition-transform">
              <img src="/logo-gurubantu.png" alt="GuruBantu AI" className="w-8 h-8 object-contain rounded-xl" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
            </div>
            <span className="font-display font-black text-xl text-slate-900">
              GuruBantu <span className="gradient-text-blue">AI</span>
            </span>
          </Link>
          <h1 className="font-display font-black text-3xl text-slate-900 mb-2">Masuk ke Akun</h1>
          <p className="text-slate-500 text-sm">Selamat kembali, Guru Hebat! 👋</p>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-3xl p-7 shadow-2xl animate-fade-up-1">
          {/* Server Error */}
          {serverError && (
            <div className="flex items-start gap-3 p-3.5 mb-5 bg-red-50 border border-red-200/80 rounded-2xl text-red-700 animate-scale-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="text-sm font-semibold leading-relaxed">{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="block text-sm font-bold text-slate-700">
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
                  className={`input-premium w-full pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 ${errors.email ? 'error' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 font-semibold flex items-center gap-1 pt-0.5">
                  <AlertCircle className="w-3 h-3" />{errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="login-password" className="block text-sm font-bold text-slate-700">
                  Kata Sandi
                </label>
                <Link to="/forgot-password" className="text-xs text-blue-600 font-semibold hover:text-blue-700 transition-colors">
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
                  className={`input-premium w-full pl-10 pr-11 py-3 text-sm text-slate-900 placeholder-slate-400 ${errors.password ? 'error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 font-semibold flex items-center gap-1 pt-0.5">
                  <AlertCircle className="w-3 h-3" />{errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="login-submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-sm text-white disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-semibold">atau</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-slate-500">
            Belum punya akun?{' '}
            <Link to="/register" className="text-blue-600 font-black hover:text-blue-700 transition-colors">
              Daftar Gratis
            </Link>
          </p>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-5 mt-6 text-[10px] text-slate-400 font-semibold animate-fade-up-2">
          <span className="flex items-center gap-1">🔒 SSL Encrypted</span>
          <span className="flex items-center gap-1">🇮🇩 Server Indonesia</span>
          <span className="flex items-center gap-1">✅ Data Aman</span>
        </div>
      </div>
    </div>
  );
};
