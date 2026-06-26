import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Layers, 
  Users, 
  FileText, 
  Award, 
  Sparkles, 
  ArrowRight, 
  Phone, 
  Mail, 
  Clock, 
  MapPin, 
  Send, 
  Check,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { AnimatedCounter } from '../../components/AnimatedCounter';
import { useTheme } from '../../hooks/useTheme';

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Nama lengkap minimal 2 karakter' }),
  email: z.string().email({ message: 'Alamat email tidak valid' }),
  subject: z.enum(['umum', 'kemitraan', 'fitur', 'kendala']),
  message: z.string().min(10, { message: 'Isi pesan minimal 10 karakter' }),
});

type ContactInput = z.infer<typeof contactSchema>;

export const LandingPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: 'umum',
      message: '',
    },
  });

  const onSubmit = async (data: ContactInput) => {
    // Simulasi submit data kontak
    console.log('Form data submitted:', data);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitted(true);
    reset();
  };

  return (
    <div className="min-h-screen font-sans overflow-x-hidden animate-page" style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}>

      {/* NAVBAR */}
      <header className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 py-4 ${
        isScrolled 
          ? 'glass-dark border-b border-white/10 shadow-lg' 
          : 'bg-transparent border-b border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-5 md:px-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-glow-sm">
              <img 
                src="/logo-gurubantu.png" 
                alt="GuruBantu AI" 
                className="w-7 h-7 object-contain rounded-lg" 
                onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} 
              />
            </div>
            <span className={`font-display font-bold text-lg transition-colors duration-300 hidden sm:block ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
              GuruBantu <span className="gradient-text-blue">AI</span>
            </span>
          </Link>

          <nav className={`hidden lg:flex items-center gap-7 text-sm font-semibold transition-colors duration-300 ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
            {([['#fitur','Fitur'],['#harga','Harga'],['#kontak','Hubungi']] as [string,string][]).map(([href, label]) => (
              <a 
                key={href} 
                href={href} 
                className="transition-colors hover:text-brand-red"
              >
                {label}
              </a>
            ))}
            <Link 
              to="/about" 
              className="transition-colors hover:text-brand-red"
            >
              Tentang Kami
            </Link>
          </nav>

          <div className="flex items-center gap-2.5">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors hover:bg-white/5 flex items-center justify-center"
              title={theme === 'light' ? 'Aktifkan Mode Gelap' : 'Aktifkan Mode Terang'}
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
            <Link 
              to="/login" 
              className={`hidden sm:inline-block px-4 py-2 font-semibold border rounded-full transition-all text-sm shadow-sm ${
                theme === 'light'
                  ? 'text-slate-700 border-slate-300 bg-white hover:border-blue-400 hover:text-blue-600'
                  : 'text-white border-white/10 hover:border-brand-red/35 bg-white/5 hover:bg-white/10'
              }`}
            >
              Masuk
            </Link>
            <Link to="/register" className="hidden sm:inline-block btn-primary px-5 py-2 rounded-full text-sm font-bold text-white">
              Daftar Gratis
            </Link>
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className={`lg:hidden p-2 rounded-xl border transition-colors ${theme === 'light' ? 'text-slate-700 border-slate-300 hover:bg-slate-100' : 'text-white border-white/10 hover:bg-white/10'}`}
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden animate-glass-fade" onClick={() => setMobileMenuOpen(false)} />
      )}
      <div className={`fixed top-0 right-0 bottom-0 z-50 w-72 border-l backdrop-blur-xl p-6 shadow-2xl lg:hidden flex flex-col transition-transform duration-300 transform ${
        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      } ${theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#131318]/95 border-white/10'}`}>
        <div className="flex items-center justify-between mb-8">
          <span className={`font-display font-bold text-lg ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
            GuruBantu <span className="gradient-text-blue">AI</span>
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${theme === 'light' ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-100' : 'text-slate-400 hover:text-white'}`}
              title={theme === 'light' ? 'Aktifkan Mode Gelap' : 'Aktifkan Mode Terang'}
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
            <button onClick={() => setMobileMenuOpen(false)} className={`p-2 rounded-lg transition-colors ${theme === 'light' ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-white'}`} aria-label="Tutup Menu">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <nav className={`flex flex-col gap-5 text-base font-semibold text-left ${theme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
          {([['#fitur','Fitur'],['#harga','Harga'],['#kontak','Hubungi']] as [string,string][]).map(([href, label]) => (
            <a key={href} href={href} onClick={() => setMobileMenuOpen(false)} className="hover:text-brand-red transition-colors">{label}</a>
          ))}
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand-red transition-colors">Tentang Kami</Link>
          <div className={`h-px my-2 ${theme === 'light' ? 'bg-slate-200' : 'bg-white/10'}`} />
          <Link to="/login" onClick={() => setMobileMenuOpen(false)} className={`w-full py-3 text-center border rounded-xl transition-all text-sm ${
            theme === 'light' ? 'border-slate-300 text-slate-700 bg-slate-50 hover:bg-slate-100' : 'border-white/10 hover:border-brand-red/35 bg-white/5 hover:bg-white/10 text-white'
          }`}>
            Masuk
          </Link>
          <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full btn-primary py-3 text-center rounded-xl text-sm font-bold shadow-md">
            Daftar Gratis
          </Link>
        </nav>
      </div>

      {/* HERO */}
      <section className={`relative min-h-[92vh] flex items-center overflow-hidden ${theme === 'light' ? 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100' : 'bg-gradient-to-br from-[#020617] via-[#0F172A] to-[#1E1B4B]'}`}>
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-blob pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-600/20 rounded-full blur-[100px] animate-blob-delay pointer-events-none" />
        <div className="absolute top-3/4 left-1/2 w-[300px] h-[300px] bg-cyan-500/15 rounded-full blur-[80px] animate-blob-delay2 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-20 text-center w-full">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-mid border text-xs font-bold mb-8 animate-fade-up ${theme === 'light' ? 'border-blue-200 text-blue-700' : 'border-white/20 text-blue-300'}`}>
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Teman Cerdas Guru Indonesia
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
          </div>

          <h1 className={`font-display font-extrabold text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight mb-6 animate-fade-up-1 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
            Hemat Waktu Guru<br />
            dengan <span className="gradient-text-hero">Kecerdasan AI</span>
          </h1>

          <p className={`text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up-2 ${theme === 'light' ? 'text-slate-600' : 'text-white/60'}`}>
            Buat <strong className={`font-semibold ${theme === 'light' ? 'text-slate-800' : 'text-white/95'}`}>RPP Kurikulum Merdeka</strong>, <strong className={`font-semibold ${theme === 'light' ? 'text-slate-800' : 'text-white/95'}`}>Soal Ujian HOTS</strong>, dan <strong className={`font-semibold ${theme === 'light' ? 'text-slate-800' : 'text-white/95'}`}>Modul Ajar</strong> berkualitas tinggi dalam hitungan detik — bukan jam.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-up-3">
            <Link to="/register" className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base text-white shadow-glow-blue">
              <Sparkles className="w-5 h-5" />
              Coba Gratis Sekarang
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/learn-more" className="btn-glow-white inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base text-slate-800 border border-slate-200 bg-white/95 shadow-sm">
              Pelajari Lebih Lanjut
            </Link>
          </div>

          <div className="hidden lg:flex items-center justify-center gap-4 mt-14 animate-fade-up-4">
            {[
              { emoji: '⚡', label: 'RPP dalam 30 detik' },
              { emoji: '🎯', label: 'Soal HOTS otomatis' },
              { emoji: '📚', label: 'Format Kemendikbud' },
              { emoji: '🔒', label: 'Kuota transaksional' },
            ].map(({ emoji, label }) => (
              <div key={label} className={`glass-mid rounded-xl px-4 py-2.5 flex items-center gap-2 border text-sm font-medium ${theme === 'light' ? 'border-slate-200 text-slate-700' : 'border-white/10 text-white/80'}`}>
                <span>{emoji}</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 border-b" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { icon: Users,    value: 2400,  suffix: '+', label: 'Guru Terbantu',   gradient: 'from-blue-500 to-indigo-600' },
            { icon: FileText, value: 38000, suffix: '+', label: 'Dokumen Dibuat',  gradient: 'from-emerald-500 to-teal-600' },
            { icon: Award,    value: 98,    suffix: '%', label: 'Guru Puas',        gradient: 'from-violet-500 to-purple-600' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex flex-col items-center gap-3">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg shadow-indigo-500/10`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-4xl font-extrabold tracking-tight gradient-text-hero">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{stat.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURES */}
      <section id="fitur" className="py-24 px-6 md:px-12 border-b" style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-brand-red text-xs font-bold border border-brand-red/20 mb-4 shadow-sm">
              <Layers className="w-3.5 h-3.5" /> FITUR UNGGULAN
            </span>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Semua yang Guru <span className="gradient-text-hero">Butuhkan</span>
            </h2>
            <p className="mt-4 max-w-xl mx-auto font-medium" style={{ color: 'var(--text-secondary)' }}>Dirancang khusus untuk guru honorer Indonesia agar bisa fokus mengajar, bukan mengurus administrasi.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { gradient: 'from-amber-400 to-orange-500',  emoji: '📄', title: 'RPP & Modul Ajar',   desc: 'Generate Rencana Pelaksanaan Pembelajaran Kurikulum Merdeka lengkap dalam detik.' },
              { gradient: 'from-violet-500 to-purple-600', emoji: '✍️', title: 'Soal Ujian AI',       desc: 'Buat soal HOTS pilihan ganda & esai dengan kunci jawaban otomatis berbasis Taksonomi Bloom.' },
              { gradient: 'from-emerald-500 to-teal-600',  emoji: '📚', title: 'Perpustakaan Guru', desc: 'Akses sumber daya, berbagi materi, dan berkolaborasi dengan ribuan guru di seluruh Indonesia.' },
              { gradient: 'from-blue-500 to-indigo-600',   emoji: '🎙️', title: 'Input Suara (AI)',   desc: 'Isi topik materi dengan suara. Speech recognition berbahasa Indonesia untuk guru yang aktif.' },
            ].map((f, i) => (
              <div key={i} className={`group relative overflow-hidden rounded-3xl p-7 border hover:border-brand-red/40 hover:shadow-glow-blue backdrop-blur-md transition-all duration-300 hover:-translate-y-1 ${
                theme === 'light' ? 'border-slate-200 shadow-sm' : 'border-white/5'
              }`} style={{ backgroundColor: 'var(--bg-card)' }}>
                <div className={`absolute -top-8 -right-8 w-28 h-28 rounded-full bg-gradient-to-br ${f.gradient} opacity-5 blur-2xl group-hover:opacity-15 transition-opacity`} />
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                  {f.emoji}
                </div>
                <h3 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="harga" className="py-24 px-6 md:px-12 border-b" style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 mb-4 shadow-sm">
              💰 HARGA TRANSPARAN
            </span>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Pilih Paket <span className="gradient-text-hero">Terbaik</span>
            </h2>
            <p className="mt-3 max-w-lg mx-auto font-medium" style={{ color: 'var(--text-secondary)' }}>Mulai gratis, upgrade kapan saja. Tidak ada biaya tersembunyi.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free */}
            <div className={`rounded-3xl border p-8 flex flex-col hover-card-premium backdrop-blur-md ${
              theme === 'light' ? 'border-slate-200 shadow-sm' : 'border-white/5'
            }`} style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>
              <div className="text-3xl mb-2">🎁</div>
              <h3 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Gratis</h3>
              <p className="text-sm mb-5 font-medium" style={{ color: 'var(--text-secondary)' }}>Untuk mencoba</p>
              <div className="text-4xl font-extrabold mb-1" style={{ color: 'var(--text-primary)' }}>Rp 0</div>
              <p className="text-xs text-slate-500 mb-6 font-semibold">/ bulan</p>
              <ul className={`space-y-2.5 text-sm flex-1 mb-7 ${
                theme === 'light' ? 'text-slate-600' : 'text-slate-300'
              }`}>
                {['5 dokumen/bulan','RPP & Soal Ujian','Download DOCX'].map(f => (
                  <li key={f} className="flex items-center gap-2 font-medium">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      theme === 'light' ? 'bg-slate-100 text-slate-600' : 'bg-white/5 text-slate-400'
                    }`}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className={`w-full py-3.5 text-center rounded-2xl font-bold text-sm border transition-colors ${
                theme === 'light'
                  ? 'border-slate-300 text-slate-700 bg-slate-50 hover:bg-slate-100'
                  : 'border-white/10 text-white bg-white/5 hover:bg-white/10'
              }`}>
                Daftar Gratis
              </Link>
            </div>

            {/* Basic - Popular */}
            <div className={`relative rounded-3xl p-8 flex flex-col hover-card-premium scale-[1.03] backdrop-blur-md border transition-all duration-300 ${
              theme === 'light'
                ? 'bg-gradient-to-br from-blue-50/95 via-indigo-50/90 to-white/95 border-indigo-300/80 shadow-lg shadow-indigo-100/40 text-slate-800'
                : 'bg-gradient-to-br from-blue-900/40 via-indigo-950/40 to-slate-950/40 border-brand-red/30 shadow-glow-blue text-white'
            }`}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-[10px] font-bold px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                ⭐ PALING POPULER
              </div>
              <div className="text-3xl mb-2">⚡</div>
              <h3 className={`text-2xl font-bold mb-1 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Basic</h3>
              <p className={`text-sm mb-5 font-medium ${theme === 'light' ? 'text-blue-600 font-bold' : 'text-blue-300'}`}>Untuk guru aktif</p>
              <div className={`text-4xl font-extrabold mb-1 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Rp 29.000</div>
              <p className={`text-xs mb-6 font-semibold ${theme === 'light' ? 'text-slate-500' : 'text-blue-400'}`}>/ bulan</p>
              <ul className={`space-y-2.5 text-sm flex-1 mb-7 ${theme === 'light' ? 'text-slate-600' : 'text-blue-100'}`}>
                {['Dokumen Unlimited','RPP & Soal Ujian','Download DOCX','Prioritas AI','Email Support'].map(f => (
                  <li key={f} className="flex items-center gap-2 font-medium">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      theme === 'light' ? 'bg-blue-100 text-blue-600' : 'bg-blue-500/20 text-blue-300'
                    }`}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="btn-primary w-full py-3.5 text-center rounded-2xl font-bold text-white text-sm">
                Pilih Basic
              </Link>
            </div>

            {/* Pro */}
            <div className={`rounded-3xl p-8 flex flex-col hover-card-premium backdrop-blur-md border transition-all duration-300 ${
              theme === 'light'
                ? 'bg-gradient-to-br from-purple-50/95 via-violet-50/90 to-white/95 border-violet-300/80 shadow-lg shadow-violet-100/40 text-slate-800'
                : 'bg-gradient-to-br from-violet-950/30 to-purple-950/30 border-violet-500/20 text-white'
            }`}>
              <div className="text-3xl mb-2">👑</div>
              <h3 className={`text-2xl font-bold mb-1 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Pro</h3>
              <p className={`text-sm mb-5 font-medium ${theme === 'light' ? 'text-violet-600 font-bold' : 'text-violet-400'}`}>Untuk profesional</p>
              <div className={`text-4xl font-extrabold mb-1 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Rp 49.000</div>
              <p className={`text-xs mb-6 font-semibold ${theme === 'light' ? 'text-slate-500' : 'text-violet-500'}`}>/ bulan</p>
              <ul className={`space-y-2.5 text-sm flex-1 mb-7 ${theme === 'light' ? 'text-slate-600' : 'text-violet-300'}`}>
                {['Semua fitur Basic','Template eksklusif KKG','Format Kemendikbud otomatis','Dukungan prioritas 24/7','Early access fitur baru'].map(f => (
                  <li key={f} className="flex items-center gap-2 font-medium">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      theme === 'light' ? 'bg-violet-100 text-violet-600' : 'bg-violet-500/20 text-violet-300'
                    }`}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="w-full py-3.5 text-center rounded-2xl bg-gradient-to-r from-violet-600 to-purple-700 text-white font-bold text-sm hover:opacity-90 transition-all shadow-md">
                Pilih Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HUBUNGI KAMI */}
      <section id="kontak" className="py-24 px-6 md:px-12 border-t relative overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        {/* Blobs background */}
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-brand-red text-xs font-bold border border-brand-red/20 mb-4 shadow-sm">
              💬 HUBUNGI KAMI
            </span>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Ada Pertanyaan? <span className="gradient-text-hero">Hubungi Kami</span>
            </h2>
            <p className="mt-3 max-w-lg mx-auto font-medium" style={{ color: 'var(--text-secondary)' }}>Kami siap membantu menjawab pertanyaan atau kendala Anda seputar platform GuruBantu AI.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Info kontak */}
            <div className="lg:col-span-5 space-y-8 text-left">
              <div className="space-y-6">
                <h3 className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>Saluran Kontak Resmi</h3>
                <p className="text-sm leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Jangan ragu untuk mengirimkan pesan melalui form di samping, atau hubungi kami secara langsung melalui kontak di bawah ini. Tim support kami akan merespons dalam waktu 1x24 jam.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { icon: Phone, title: 'WhatsApp Support', detail: '+62 821-3277-5342', link: 'https://wa.me/6282132775342', cClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                  { icon: Mail, title: 'Email Support', detail: 'support@gurubantu.ai', link: 'mailto:support@gurubantu.ai', cClass: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
                  { icon: Clock, title: 'Jam Layanan', detail: 'Senin - Jumat, 08:00 - 17:00 WIB', link: null, cClass: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                  { icon: MapPin, title: 'Lokasi Kantor', detail: 'Jakarta, Indonesia', link: null, cClass: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  const Content = () => (
                    <div className="flex items-center gap-4 p-4 border rounded-2xl transition-colors" style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-color)' }}>
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${item.cClass} flex-shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">{item.title}</p>
                        <p className="text-xs sm:text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{item.detail}</p>
                      </div>
                    </div>
                  );

                  return item.link ? (
                    <a key={idx} href={item.link} target="_blank" rel="noopener noreferrer" className="block transition-transform hover:-translate-y-0.5">
                      <Content />
                    </a>
                  ) : (
                    <div key={idx}>
                      <Content />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form kontak */}
            <div className="lg:col-span-7 border rounded-3xl p-6 sm:p-8 shadow-xl hover-card-premium backdrop-blur-md" style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-color)' }}>
              {isSubmitted ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-page">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-500 shadow-lg animate-bounce">
                    <Check className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>Pesan Terkirim!</h3>
                    <p className="text-xs sm:text-sm max-w-sm mx-auto leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>
                      Terima kasih atas pesan Anda. Tim dukungan GuruBantu AI akan segera menanggapi melalui email yang telah didaftarkan.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className={`px-5 py-2.5 border rounded-xl text-xs font-bold transition-colors shadow-sm ${
                      theme === 'light'
                        ? 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                    }`}
                  >
                    Kirim Pesan Baru
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Nama Lengkap</label>
                      <input
                        type="text"
                        {...register('name')}
                        placeholder="Nama Anda..."
                        className={`w-full border rounded-xl p-3 text-xs sm:text-sm focus:border-brand-red focus:ring-1 focus:ring-brand-red/20 outline-none transition-all placeholder:text-slate-500 ${
                          errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : (theme === 'light' ? 'border-slate-300' : 'border-white/10')
                        }`}
                        style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
                      />
                      {errors.name && <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Alamat Email</label>
                      <input
                        type="email"
                        {...register('email')}
                        placeholder="name@example.com"
                        className={`w-full border rounded-xl p-3 text-xs sm:text-sm focus:border-brand-red focus:ring-1 focus:ring-brand-red/20 outline-none transition-all placeholder:text-slate-500 ${
                          errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : (theme === 'light' ? 'border-slate-300' : 'border-white/10')
                        }`}
                        style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
                      />
                      {errors.email && <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Subjek Pesan</label>
                    <select
                      {...register('subject')}
                      className={`w-full border rounded-xl p-3 text-xs sm:text-sm focus:border-brand-red focus:ring-1 focus:ring-brand-red/20 outline-none transition-all ${theme === 'light' ? 'border-slate-300' : 'border-white/10'}`}
                      style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
                    >
                      <option value="umum" className={theme === 'light' ? 'bg-white text-slate-800' : 'bg-[#131318] text-white'}>Pertanyaan Umum</option>
                      <option value="kemitraan" className={theme === 'light' ? 'bg-white text-slate-800' : 'bg-[#131318] text-white'}>Kemitraan Sekolah / KKG</option>
                      <option value="fitur" className={theme === 'light' ? 'bg-white text-slate-800' : 'bg-[#131318] text-white'}>Saran Fitur Baru</option>
                      <option value="kendala" className={theme === 'light' ? 'bg-white text-slate-800' : 'bg-[#131318] text-white'}>Kendala Akun & Pembayaran</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Isi Pesan</label>
                    <textarea
                      {...register('message')}
                      rows={4}
                      placeholder="Tuliskan detail pertanyaan atau masukan Anda di sini..."
                      className={`w-full border rounded-xl p-3 text-xs sm:text-sm focus:border-brand-red focus:ring-1 focus:ring-brand-red/20 outline-none transition-all resize-none placeholder:text-slate-500 ${
                        errors.message ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : (theme === 'light' ? 'border-slate-300' : 'border-white/10')
                      }`}
                      style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
                    />
                    {errors.message && <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary py-3.5 rounded-xl text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Mengirimkan Pesan...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Kirim Pesan</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-6 border-t" style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold" style={{ color: 'var(--text-primary)' }}>GuruBantu <span className="gradient-text-blue">AI</span></span>
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
              theme === 'light'
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-indigo-950 border-indigo-500/20 text-indigo-300'
            }`}>v3.0</span>
          </div>
          <p className="text-xs text-center font-medium" style={{ color: 'var(--text-muted)' }}>© 2024 GuruBantu AI · Memberdayakan Guru Indonesia dengan Kecerdasan Buatan</p>
          <div className="flex items-center gap-5 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
            {([
              ['/privacy','Privasi'],
              ['/terms','Syarat'],
              ['/about','Tentang'],
            ] as [string,string][]).map(([to, label]) => (
              <Link key={to} to={to} className="hover:text-brand-red transition-colors">{label}</Link>
            ))}
            <a href="https://wa.me/6282132775342" target="_blank" rel="noopener noreferrer" className="hover:text-brand-red transition-colors">WhatsApp</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
