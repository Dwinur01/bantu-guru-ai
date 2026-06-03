import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, GraduationCap } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-slate-100 flex flex-col justify-between animate-page font-sans text-slate-900">
      {/* 1. HEADER / NAVBAR */}
      <header className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between z-10">
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
        
        {/* Navigation & Masuk */}
        <div className="flex items-center gap-6">
          <a href="/#fitur" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Fitur</a>
          <a href="https://wa.me/6282132775342" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Bantuan</a>
          <Link
            to="/login"
            className="px-5 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold rounded-full transition-all text-sm shadow-sm"
          >
            Masuk
          </Link>
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <main className="w-full max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center flex-grow">
        {/* LEFT SIDE: ILLUSTRATION & TEXT */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 max-w-lg mx-auto lg:mx-0 relative">
          {/* Watermark background icon */}
          <GraduationCap className="absolute -top-14 -left-12 w-28 h-28 text-slate-200/40 -z-10 rotate-12 pointer-events-none" />
          
          <div className="relative bg-white/40 backdrop-blur-sm border border-white/60 p-4 rounded-[2rem] shadow-xl">
            <img
              src="/hero-illustration.png"
              alt="Mari Berkembang Bersama"
              className="w-full max-w-[380px] md:max-w-[420px] object-contain rounded-[1.5rem]"
            />
          </div>
          <div className="space-y-3 w-full">
            <h2 className="text-3xl font-extrabold text-blue-600">
              Mari Berkembang Bersama!
            </h2>
            <div className="flex items-start gap-3 justify-center lg:justify-start">
              {/* Lightbulb Icon in outline circle */}
              <div className="w-10 h-10 rounded-full border border-slate-300/80 flex items-center justify-center flex-shrink-0 mt-0.5 bg-white/30">
                <svg className="w-5 h-5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .5 2.2 1.5 3 .7.7 1.3 1.5 1.5 2.5" />
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                </svg>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
                Gabung dengan ribuan guru hebat lainnya untuk menciptakan pembelajaran yang lebih kreatif dan efisien.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: REGISTRATION CARD */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 space-y-6">
            
            {successEmail ? (
              /* SCREEN 1: Success State */
              <div className="animate-in fade-in duration-300">
                <div className="text-center mb-6">
                  <div className="inline-flex p-3 bg-emerald-50 text-[#10B981] rounded-full mb-4">
                    <CheckCircle className="w-12 h-12" />
                  </div>
                  <h2 className="font-extrabold text-2xl text-slate-900 leading-tight mb-2">
                    Registrasi Berhasil!
                  </h2>
                  <p className="text-sm text-slate-500">
                    Satu langkah lagi untuk mengaktifkan akun GuruBantu AI Anda.
                  </p>
                </div>

                <div className="bg-[#ECFDF5] border border-emerald-100 rounded-2xl p-5 mb-6 space-y-3">
                  <p className="text-sm text-slate-800 leading-relaxed">
                    Kami telah mengirimkan tautan verifikasi ke email Anda:{' '}
                    <strong className="text-blue-600 select-all font-bold">{successEmail}</strong>
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Silakan periksa kotak masuk atau spam email Anda dan klik tautan verifikasi di dalamnya.
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
                  <p className="text-xs text-amber-800 font-bold uppercase tracking-wider mb-1">
                    💡 Tips Pengembangan Lokal
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Tautan verifikasi fisik tercetak pada **log konsol terminal backend** Anda untuk melakukan verifikasi akun.
                  </p>
                </div>

                <Link
                  to="/login"
                  className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  Masuk Ke Akun Sekarang
                </Link>
              </div>
            ) : (
              /* SCREEN 2: Form State */
              <div className="animate-in fade-in duration-300 space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    Mulai Perjalananmu
                  </h2>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Daftar sekarang dan berdayakan pengajaranmu dengan AI.
                  </p>
                </div>

                {/* Alert Server Error */}
                {serverError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-red-700">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
                    <div className="text-xs font-semibold">{serverError}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Input Google */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-xs rounded-xl transition-all duration-150 hover:bg-slate-50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
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
                    <span>Daftar dengan Google</span>
                  </button>

                  {/* Divider */}
                  <div className="relative my-4 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-100"></div>
                    </div>
                    <span className="relative px-3 bg-white text-[9px] text-slate-400 uppercase font-bold tracking-wider">
                      ATAU PAKAI EMAIL
                    </span>
                  </div>

                  {/* Nama Lengkap */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="name" className="text-xs font-bold text-slate-600">
                      Nama Lengkap
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4.5 h-4.5" />
                      </div>
                      <input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        disabled={isLoading}
                        className={`w-full pl-10 pr-4 py-2.5 text-sm text-slate-900 bg-slate-50/60 border rounded-xl transition-all placeholder:text-slate-400 focus:outline-none focus:bg-white disabled:bg-slate-100 disabled:cursor-not-allowed ${
                          errors.name
                            ? 'border-red-300 focus:ring-2 focus:ring-red-100'
                            : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                        }`}
                        {...register('name')}
                      />
                    </div>
                    {errors.name && (
                      <p className="flex items-center gap-1 mt-0.5 text-[10px] text-red-600">
                        <AlertCircle className="w-3 h-3" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="email" className="text-xs font-bold text-slate-600">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4.5 h-4.5" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        placeholder="contoh@guru.com"
                        disabled={isLoading}
                        className={`w-full pl-10 pr-4 py-2.5 text-sm text-slate-900 bg-slate-50/60 border rounded-xl transition-all placeholder:text-slate-400 focus:outline-none focus:bg-white disabled:bg-slate-100 disabled:cursor-not-allowed ${
                          errors.email
                            ? 'border-red-300 focus:ring-2 focus:ring-red-100'
                            : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                        }`}
                        {...register('email')}
                      />
                    </div>
                    {errors.email && (
                      <p className="flex items-center gap-1 mt-0.5 text-[10px] text-red-600">
                        <AlertCircle className="w-3 h-3" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password & Confirm Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Password */}
                    <div className="flex flex-col gap-1">
                      <label htmlFor="password" className="text-xs font-bold text-slate-600">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Lock className="w-4.5 h-4.5" />
                        </div>
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          disabled={isLoading}
                          className={`w-full pl-10 pr-10 py-2.5 text-sm text-slate-900 bg-slate-50/60 border rounded-xl transition-all placeholder:text-slate-400 focus:outline-none focus:bg-white disabled:bg-slate-100 disabled:cursor-not-allowed ${
                            errors.password
                              ? 'border-red-300 focus:ring-2 focus:ring-red-100'
                              : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                          }`}
                          {...register('password')}
                        />
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="flex items-center gap-1 mt-0.5 text-[10px] text-red-600 leading-tight">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    {/* Confirm */}
                    <div className="flex flex-col gap-1">
                      <label htmlFor="confirmPassword" className="text-xs font-bold text-slate-600">
                        Konfirmasi
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Lock className="w-4.5 h-4.5" />
                        </div>
                        <input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          disabled={isLoading}
                          className={`w-full pl-10 pr-10 py-2.5 text-sm text-slate-900 bg-slate-50/60 border rounded-xl transition-all placeholder:text-slate-400 focus:outline-none focus:bg-white disabled:bg-slate-100 disabled:cursor-not-allowed ${
                            errors.confirmPassword
                              ? 'border-red-300 focus:ring-2 focus:ring-red-100'
                              : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                          }`}
                          {...register('confirmPassword')}
                        />
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="flex items-center gap-1 mt-0.5 text-[10px] text-red-600 leading-tight">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Agree Checkbox */}
                  <div className="flex items-start gap-2 pt-2">
                    <input
                      id="agree"
                      type="checkbox"
                      required
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 mt-0.5"
                    />
                    <label htmlFor="agree" className="text-[11px] text-slate-500 leading-normal">
                      Saya setuju dengan{' '}
                      <Link to="/privacy" className="text-blue-600 font-bold hover:underline">Kebijakan Privasi</Link>
                      {' '}dan{' '}
                      <Link to="/terms" className="text-blue-600 font-bold hover:underline">Syarat & Ketentuan</Link>.
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Memproses...</span>
                      </>
                    ) : (
                      <span>Daftar Sekarang</span>
                    )}
                  </button>
                </form>

                {/* Footer link */}
                <div className="text-center text-xs text-slate-500">
                  Sudah punya akun?{' '}
                  <Link to="/login" className="text-blue-600 font-bold hover:underline">
                    Masuk di sini
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* 3. FOOTER */}
      <footer className="w-full bg-white border-t border-slate-100 py-6 mt-12 z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12H12V15H19C18.15 17.39 15.65 19 12.5 19C8.36 19 5 15.64 5 11.5C5 7.36 8.36 4 12.5 4C14.7 4 16.65 4.95 18 6.5L20.5 4C18.3 1.8 15.3 0.5 12.5 0.5" fill="#2563EB"/>
              <circle cx="16" cy="11.5" r="3" fill="#22D3EE" />
            </svg>
            <span className="font-bold text-sm text-slate-800">GuruBantu AI</span>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full">v2.0</span>
          </div>
          
          <p className="text-xs text-slate-400">
            © 2024 GuruBantu AI. Memberdayakan Guru Indonesia dengan AI.
          </p>
          
          <div className="flex items-center gap-6 text-xs text-slate-400 font-medium">
            <Link to="/privacy" className="hover:text-blue-600 transition-colors">Privasi</Link>
            <Link to="/terms" className="hover:text-blue-600 transition-colors">Syarat</Link>
            <Link to="/about" className="hover:text-blue-600 transition-colors">Kontak</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
