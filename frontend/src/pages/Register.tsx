import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { UserPlus, Eye, EyeOff, AlertCircle, Sparkles, CheckCircle } from 'lucide-react';
import { api } from '../services/api';

// Schema validasi registrasi dengan Zod
const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Nama lengkap wajib diisi')
      .min(2, 'Nama minimal terdiri dari 2 karakter')
      .max(100, 'Nama maksimal 100 karakter')
      .regex(/^[a-zA-Z\s]+$/, 'Nama hanya boleh berisi huruf alfabet dan spasi'),
    email: z
      .string()
      .min(1, 'Alamat email wajib diisi')
      .email('Format alamat email tidak valid')
      .max(255, 'Email maksimal 255 karakter'),
    password: z
      .string()
      .min(1, 'Kata sandi wajib diisi')
      .min(8, 'Kata sandi minimal terdiri dari 8 karakter')
      .regex(/[A-Z]/, 'Kata sandi wajib mengandung minimal 1 huruf kapital')
      .regex(/[0-9]/, 'Kata sandi wajib mengandung minimal 1 angka'),
    confirmPassword: z.string().min(1, 'Konfirmasi kata sandi wajib diisi'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi kata sandi harus sama dengan kata sandi di atas',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  
  // State untuk menyimpan data email terdaftar saat sukses agar dapat ditampilkan di visual success screen
  const [successEmail, setSuccessEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setServerError(null);
    try {
      await api.post('/auth/register', data);
      
      // Simpan email terdaftar untuk ditampilkan di layar sukses
      setSuccessEmail(data.email);
    } catch (error: any) {
      if (error.response?.data?.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError('Terjadi kesalahan sistem. Silakan coba kembali.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Simulasi Login Google
    alert('Fitur daftar dengan Google sedang dalam proses integrasi OAuth2.');
  };

  return (
    <div className="min-h-screen flex bg-page">
      {/* 1. SISI KIRI: Formulir Daftar / Tampilan Sukses (40% pada Desktop, 100% pada Mobile) */}
      <div className="w-full lg:w-2/5 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 bg-white shadow-lg z-10">
        <div className="max-w-md w-full mx-auto">
          {/* Logo & Branding */}
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-[#E8F5EE] text-[#1A7A4A] p-2 rounded-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="font-bold text-lg text-brand-dark">GuruBantu AI</span>
          </div>

          {/* SCREEN 1: Jika Registrasi Sukses, Tampilkan Layar Verifikasi Email */}
          {successEmail ? (
            <div className="animate-in fade-in duration-300">
              <div className="text-center mb-8">
                <div className="inline-flex p-4 bg-success-bg text-success rounded-full mb-6">
                  <CheckCircle className="w-14 h-14" />
                </div>
                <h2 className="font-display text-3xl font-black text-ink leading-tight mb-3">
                  Registrasi Berhasil!
                </h2>
                <p className="text-sm text-muted">
                  Satu langkah lagi untuk mengaktifkan akun GuruBantu AI Anda.
                </p>
              </div>

              {/* Info Box Sukses */}
              <div className="bg-success-bg border border-success/30 rounded-xl p-5 mb-8">
                <p className="text-sm text-ink leading-relaxed mb-3">
                  Kami telah mengirimkan tautan verifikasi ke email Anda:{' '}
                  <strong className="text-brand-dark select-all">{successEmail}</strong>
                </p>
                <p className="text-xs text-muted leading-relaxed">
                  Silakan periksa kotak masuk (inbox) atau folder spam email Anda. Klik tautan verifikasi di dalamnya untuk menyelesaikan proses pendaftaran.
                </p>
              </div>

              {/* Petunjuk Tambahan untuk Pengembangan Lokal */}
              <div className="bg-warning-bg border border-warning/30 rounded-xl p-4 mb-8">
                <p className="text-xs text-warning font-semibold uppercase tracking-wider mb-1">
                  💡 Tips Pengembangan Lokal (Mock Email)
                </p>
                <p className="text-xs text-ink leading-relaxed">
                  Karena kami menggunakan pengiriman email simulasi di mode lokal, Anda dapat melihat tautan verifikasi fisik yang tercetak pada **log konsol terminal backend** Anda untuk melakukan verifikasi akun.
                </p>
              </div>

              {/* Tombol Menuju Login */}
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#C84B2F] text-white font-semibold text-sm rounded-lg min-h-[44px] transition-all duration-150 hover:bg-[#a83d25] hover:shadow-md active:scale-95 text-center"
                >
                  Masuk Ke Akun Sekarang
                </Link>
              </div>
            </div>
          ) : (
            /* SCREEN 2: Formulir Registrasi Utama */
            <div className="animate-in fade-in duration-300">
              {/* Heading */}
              <div className="mb-6">
                <h2 className="font-display text-3xl font-black text-ink leading-tight mb-2">
                  Daftar Akun Baru
                </h2>
                <p className="text-sm text-muted">
                  Mulai otomatisasi administrasi RPP & Soal mengajar Anda hari ini gratis.
                </p>
              </div>

              {/* Alert Server Error */}
              {serverError && (
                <div className="mb-6 p-4 bg-error-bg border border-brand-red rounded-lg flex items-start gap-2 text-brand-red">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="text-sm font-medium">{serverError}</div>
                </div>
              )}

              {/* Form Input */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Input Nama Lengkap */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="name" className="text-sm font-medium text-ink">
                    Nama Lengkap *
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Contoh: Ibu Sari Rahayu"
                    disabled={isLoading}
                    className={`w-full px-4 py-3 text-base text-ink bg-white border rounded-lg min-h-[44px] transition-colors duration-150 placeholder:text-muted focus:outline-none disabled:bg-[#F2F2F2] disabled:cursor-not-allowed ${
                      errors.name
                        ? 'border-brand-red bg-error-bg focus:ring-2 focus:ring-[#C84B2F]/20'
                        : 'border-rule focus:border-brand-mid focus:ring-2 focus:ring-brand-mid/20'
                    }`}
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="flex items-center gap-1 mt-1 text-xs text-brand-red">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Input Email */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="email" className="text-sm font-medium text-ink">
                    Alamat Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="nama@guru.id"
                    disabled={isLoading}
                    className={`w-full px-4 py-3 text-base text-ink bg-white border rounded-lg min-h-[44px] transition-colors duration-150 placeholder:text-muted focus:outline-none disabled:bg-[#F2F2F2] disabled:cursor-not-allowed ${
                      errors.email
                        ? 'border-brand-red bg-error-bg focus:ring-2 focus:ring-[#C84B2F]/20'
                        : 'border-rule focus:border-brand-mid focus:ring-2 focus:ring-brand-mid/20'
                    }`}
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="flex items-center gap-1 mt-1 text-xs text-brand-red">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Input Password */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="password" className="text-sm font-medium text-ink">
                    Kata Sandi *
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Minimal 8 karakter (Huruf besar & angka)"
                      disabled={isLoading}
                      className={`w-full px-4 py-3 pr-10 text-base text-ink bg-white border rounded-lg min-h-[44px] transition-colors duration-150 placeholder:text-muted focus:outline-none disabled:bg-[#F2F2F2] disabled:cursor-not-allowed ${
                        errors.password
                          ? 'border-brand-red bg-error-bg focus:ring-2 focus:ring-[#C84B2F]/20'
                          : 'border-rule focus:border-brand-mid focus:ring-2 focus:ring-brand-mid/20'
                      }`}
                      {...register('password')}
                    />
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-ink rounded transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="flex items-center gap-1 mt-1 text-xs text-brand-red">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Input Confirm Password */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-ink">
                    Konfirmasi Kata Sandi *
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Masukkan ulang kata sandi Anda"
                      disabled={isLoading}
                      className={`w-full px-4 py-3 pr-10 text-base text-ink bg-white border rounded-lg min-h-[44px] transition-colors duration-150 placeholder:text-muted focus:outline-none disabled:bg-[#F2F2F2] disabled:cursor-not-allowed ${
                        errors.confirmPassword
                          ? 'border-brand-red bg-error-bg focus:ring-2 focus:ring-[#C84B2F]/20'
                          : 'border-rule focus:border-brand-mid focus:ring-2 focus:ring-brand-mid/20'
                      }`}
                      {...register('confirmPassword')}
                    />
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-ink rounded transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="flex items-center gap-1 mt-1 text-xs text-brand-red">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Tombol Register */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#C84B2F] text-white font-semibold text-sm rounded-lg min-h-[44px] transition-all duration-150 hover:bg-[#a83d25] hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C84B2F] focus-visible:ring-offset-2 mt-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Daftar Akun Gratis</span>
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-6 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-rule"></div>
                  </div>
                  <span className="relative px-3 bg-white text-xs text-muted uppercase font-medium tracking-wider">
                    Atau daftar dengan
                  </span>
                </div>

                {/* Google Sign-up Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-white border-[1.5px] border-rule hover:border-brand-mid text-ink font-semibold text-sm rounded-lg min-h-[44px] transition-all duration-150 hover:bg-[#FAF7F2] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {/* Google SVG Icon */}
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.9h6.69c-.29 1.5-.1.14-.14 2.87c.83.55 1.56 1.25 2.19 2.04 3.7-3.4 5.9-8.4 5.9-14.3z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-6.19-4.8c-1.72 1.15-3.92 1.83-6.19 1.83-4.76 0-8.8-3.21-10.23-7.53H.28v4.95C2.26 20.35 6.78 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M1.77 13.06A7.18 7.18 0 0 1 1.77 11v-4.9H.28C-.1 7.2-.1 16.8.28 17.9l6.09-4.74c-.38-1.12-.38-2.38 0-3.52z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.22 0 12 0 6.78 0 2.26 3.65.28 8.16l6.09 4.74c1.43-4.32 5.47-7.53 10.23-7.53z"
                    />
                  </svg>
                  <span>Google</span>
                </button>
              </form>

              {/* Footer Link */}
              <p className="mt-6 text-sm text-center text-muted">
                Sudah punya akun?{' '}
                <Link to="/login" className="font-semibold text-brand-mid hover:underline">
                  Masuk Sekarang
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 2. SISI KANAN: Ilustrasi Inspiratif (Hanya muncul pada Desktop) */}
      <div className="hidden lg:flex lg:w-3/5 bg-brand-dark flex-col justify-center items-center p-16 text-white relative overflow-hidden">
        {/* Background Decorative Circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-mid/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-red/5 rounded-full blur-3xl -ml-16 -mb-16"></div>

        <div className="max-w-md text-center z-10">
          {/* Logo Icon Sparkle */}
          <div className="inline-flex p-4 bg-white/10 rounded-2xl mb-8">
            <Sparkles className="w-10 h-10 text-brand-red animate-pulse" />
          </div>

          <h3 className="font-display text-4xl font-black leading-tight mb-6">
            "Guru mulia karena karya, terbantu karena teknologi."
          </h3>
          <p className="text-base text-white/70 italic mb-10">— GuruBantu AI</p>

          {/* List Fitur Unggulan */}
          <div className="space-y-4 text-left border-t border-white/10 pt-8">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-red"></div>
              <span className="text-sm font-medium text-white/95">
                Proses registrasi instan hanya 1 menit.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-red"></div>
              <span className="text-sm font-medium text-white/95">
                Dapatkan 5 kuota dokumen RPP & Soal gratis langsung setelah verifikasi email!
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-red"></div>
              <span className="text-sm font-medium text-white/95">
                Aman, kredensial terenkripsi penuh, mematuhi standar privasi data.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
