import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { useTheme } from '../hooks/useTheme';

const registerSchema = z
  .object({
    name: z.string().min(1, 'Nama wajib diisi').min(2, 'Nama minimal 2 karakter').max(100).regex(/^[a-zA-Z\s]+$/, 'Nama hanya huruf dan spasi'),
    email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid').max(255),
    password: z.string().min(8, 'Minimal 8 karakter').regex(/[A-Z]/, 'Minimal 1 huruf kapital').regex(/[0-9]/, 'Minimal 1 angka'),
    confirmPassword: z.string().min(1, 'Konfirmasi kata sandi wajib diisi'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi kata sandi tidak sama',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successEmail, setSuccessEmail] = useState<string | null>(null);
  const { theme } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setServerError(null);
    try {
      await api.post('/auth/register', data);
      setSuccessEmail(data.email);
    } catch (error: any) {
      setServerError(error.response?.data?.message || 'Terjadi kesalahan. Silakan coba kembali.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 animate-page bg-auth-gradient">

      {/* Animated blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[80px] animate-blob pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[60px] animate-blob-delay pointer-events-none" />
      <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-violet-600/5 rounded-full blur-[80px] animate-blob-delay2 pointer-events-none" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-7 animate-fade-up">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-glow-blue group-hover:scale-110 transition-transform">
              <img src="/logo-gurubantu.png" alt="GuruBantu AI" className="w-8 h-8 object-contain rounded-xl" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
            </div>
            <span className={`font-display font-black text-xl ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
              GuruBantu <span className="gradient-text-blue">AI</span>
            </span>
          </Link>
          <h1 className={`font-display font-black text-3xl mb-2 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Daftar Akun Guru</h1>
          <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Gratis selamanya untuk plan dasar 🎓</p>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-3xl p-7 shadow-2xl animate-fade-up-1">

          {/* Success State */}
          {successEmail ? (
            <div className="space-y-5 text-center animate-scale-in">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto shadow-glow-green">
                <CheckCircle className="w-8 h-8 text-slate-950" />
              </div>
              <div>
                <h2 className={`font-display font-black text-xl mb-2 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Registrasi Berhasil! 🎉</h2>
                <p className="text-sm text-slate-400 mb-4">Tautan verifikasi telah dikirim ke:</p>
                <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/35 rounded-2xl p-3">
                  <span className="text-sm font-black text-blue-700 dark:text-brand-red select-all">{successEmail}</span>
                </div>
              </div>
              <p className="text-xs text-slate-500">Periksa folder inbox atau spam email Anda.</p>
              <Link to="/login" className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-sm text-slate-950">
                <Sparkles className="w-4 h-4" />
                Masuk Sekarang
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            /* Form State */
            <div className="space-y-4">
              {/* Server Error */}
              {serverError && (
                <div className="flex items-start gap-3 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/30 rounded-2xl text-red-600 dark:text-red-400 animate-scale-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold leading-relaxed">{serverError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="reg-name" className={`block text-sm font-bold ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Nama Lengkap</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <User className="w-4 h-4" />
                    </div>
                    <input id="reg-name" type="text" placeholder="John Doe" {...register('name')} disabled={isLoading}
                      className={`input-premium w-full pl-10 pr-4 py-3 text-sm placeholder-slate-500 ${errors.name ? 'error' : ''}`} />
                  </div>
                  {errors.name && <p className="text-xs text-red-600 dark:text-red-400 font-semibold flex items-center gap-1 pt-0.5"><AlertCircle className="w-3 h-3" />{errors.name.message}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="reg-email" className={`block text-sm font-bold ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Email Guru</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input id="reg-email" type="email" placeholder="email@sekolah.com" {...register('email')} disabled={isLoading}
                      className={`input-premium w-full pl-10 pr-4 py-3 text-sm placeholder-slate-500 ${errors.email ? 'error' : ''}`} />
                  </div>
                  {errors.email && <p className="text-xs text-red-600 dark:text-red-400 font-semibold flex items-center gap-1 pt-0.5"><AlertCircle className="w-3 h-3" />{errors.email.message}</p>}
                </div>

                {/* Password & Confirm */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Password */}
                  <div className="space-y-1.5">
                    <label htmlFor="reg-password" className={`block text-xs font-bold ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Password</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><Lock className="w-3.5 h-3.5" /></div>
                      <input id="reg-password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" {...register('password')} disabled={isLoading}
                        className={`input-premium w-full pl-9 pr-9 py-2.5 text-sm placeholder-slate-500 ${errors.password ? 'error' : ''}`} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-red transition-colors" tabIndex={-1}>
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-[10px] text-red-600 dark:text-red-400 font-semibold flex items-start gap-1 leading-tight"><AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />{errors.password.message}</p>}
                  </div>

                  {/* Confirm */}
                  <div className="space-y-1.5">
                    <label htmlFor="reg-confirm" className={`block text-xs font-bold ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Konfirmasi</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><Lock className="w-3.5 h-3.5" /></div>
                      <input id="reg-confirm" type={showConfirmPassword ? 'text' : 'password'} placeholder="••••••••" {...register('confirmPassword')} disabled={isLoading}
                        className={`input-premium w-full pl-9 pr-9 py-2.5 text-sm placeholder-slate-500 ${errors.confirmPassword ? 'error' : ''}`} />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-red transition-colors" tabIndex={-1}>
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-[10px] text-red-600 dark:text-red-400 font-semibold flex items-start gap-1 leading-tight"><AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />{errors.confirmPassword.message}</p>}
                  </div>
                </div>

                {/* Terms checkbox */}
                <div className="flex items-start gap-2 pt-1 text-left">
                  <input id="reg-agree" type="checkbox" required className="w-4 h-4 text-brand-red border-slate-300 rounded focus:ring-brand-red mt-0.5" style={{ backgroundColor: 'var(--input-bg)' }} />
                  <label htmlFor="reg-agree" className={`text-[11px] leading-normal ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                    Saya setuju dengan{' '}
                    <Link to="/privacy" className="text-brand-red font-bold hover:underline">Kebijakan Privasi</Link>
                    {' '}dan{' '}
                    <Link to="/terms" className="text-brand-red font-bold hover:underline">Syarat & Ketentuan</Link>.
                  </label>
                </div>

                {/* Submit */}
                <button id="register-submit" type="submit" disabled={isLoading}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-sm text-slate-950 disabled:opacity-60 disabled:cursor-not-allowed mt-1">
                  {isLoading ? (
                    <><div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />Memproses...</>
                  ) : (
                    <><Sparkles className="w-4 h-4" />Daftar Sekarang<ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>

              {/* Login link */}
              <div className="flex items-center gap-3 my-1">
                <div className={`flex-1 h-px ${theme === 'light' ? 'bg-slate-200' : 'bg-white/10'}`} />
                <span className={`text-xs font-semibold ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>atau</span>
                <div className={`flex-1 h-px ${theme === 'light' ? 'bg-slate-200' : 'bg-white/10'}`} />
              </div>
              <p className={`text-center text-sm ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
                Sudah punya akun?{' '}
                <Link to="/login" className="text-brand-red font-black hover:text-cyan-400 transition-colors">Masuk di sini</Link>
              </p>
            </div>
          )}
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-5 mt-6 text-[10px] text-slate-500 font-semibold animate-fade-up-2">
          <span className="flex items-center gap-1">🔒 SSL Encrypted</span>
          <span className="flex items-center gap-1">🇮🇩 Server Indonesia</span>
          <span className="flex items-center gap-1">✅ Gratis Selamanya</span>
        </div>
      </div>
    </div>
  );
};
