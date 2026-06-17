import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  Cpu, 
  Download, 
  CheckCircle2, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Settings, 
  Tv 
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface Step {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<any>;
  colorClass: string;
  mockVisual: React.ReactNode;
}

export const LearnMore: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { theme } = useTheme();

  const steps: Step[] = [
    {
      number: '01',
      title: 'Isi Parameter Pembelajaran',
      subtitle: 'Sesuaikan dengan Kelas & Topik Anda',
      description: 'Cukup masukkan mata pelajaran, fase/kelas, kurikulum yang digunakan (Kurikulum Merdeka atau K13), dan topik bahasan. Anda juga dapat menggunakan input suara pintar untuk mendiktekan topik ajar secara langsung tanpa mengetik.',
      icon: Settings,
      colorClass: 'from-amber-400 to-orange-500',
      mockVisual: (
        <div className={`border rounded-2xl p-6 text-left font-sans text-xs space-y-4 shadow-2xl relative overflow-hidden ${
          theme === 'light' ? 'bg-white border-slate-200 text-slate-805' : 'bg-slate-900/90 border-white/10 text-slate-300'
        }`}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl" />
          <div className={`flex items-center justify-between border-b pb-3 ${theme === 'light' ? 'border-slate-100' : 'border-white/5'}`}>
            <span className={`font-bold text-sm ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Form Asisten RPP AI</span>
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-600 dark:text-amber-300 rounded-full text-[10px] font-semibold">Langkah 1</span>
          </div>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase">Mata Pelajaran</label>
              <div className={`border rounded-lg p-2 ${theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-white/5 border-white/10 text-white'}`}>Bahasa Indonesia</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Fase / Kelas</label>
                <div className={`border rounded-lg p-2 ${theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-white/5 border-white/10 text-white'}`}>Fase D / Kelas VII</div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Alokasi Waktu</label>
                <div className={`border rounded-lg p-2 ${theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-white/5 border-white/10 text-white'}`}>2 x 40 Menit</div>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase">Topik Utama (Dikte AI)</label>
              <div className={`border rounded-lg p-2.5 flex items-center justify-between ${theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-white/5 border-white/10 text-white'}`}>
                <span>Menulis Teks Prosedur Membuat Kue Nusantara</span>
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              </div>
            </div>
          </div>
          <div className="pt-2 flex justify-end">
            <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-1 shadow-lg shadow-orange-500/20">
              <span>Selanjutnya</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )
    },
    {
      number: '02',
      title: 'Pemrosesan Cerdas AI',
      subtitle: 'Analisis Kurikulum & Taksonomi Bloom',
      description: 'Mesin AI GuruBantu menganalisis topik dan mencocokkannya dengan struktur Kurikulum Merdeka Kemendikbud. AI menyusun Tujuan Pembelajaran, Alur Pembelajaran, Langkah Kegiatan (Pendahuluan, Inti, Penutup), hingga rubrik Asesmen secara otomatis.',
      icon: Cpu,
      colorClass: 'from-blue-500 to-indigo-600',
      mockVisual: (
        <div className={`border rounded-2xl p-6 text-left font-sans text-xs space-y-4 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[250px] ${
          theme === 'light' ? 'bg-white border-slate-200 text-slate-805' : 'bg-slate-900/90 border-white/10 text-slate-300'
        }`}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl" />
          <div className={`flex items-center justify-between border-b pb-3 ${theme === 'light' ? 'border-slate-100' : 'border-white/5'}`}>
            <span className={`font-bold text-sm ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Mesin AI GuruBantu</span>
            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-600 dark:text-blue-300 rounded-full text-[10px] font-semibold">Langkah 2</span>
          </div>
          <div className="flex flex-col items-center justify-center py-4 space-y-3 flex-grow">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-blue-500/30 animate-ping" />
              <div className="absolute w-12 h-12 border-2 border-dashed border-blue-400 rounded-full animate-spin" />
              <Cpu className="w-6 h-6 text-blue-500 dark:text-blue-400 relative z-10" />
            </div>
            <div className="text-center space-y-1">
              <p className={`font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Menganalisis Kompetensi Inti...</p>
              <p className="text-[10px] text-slate-400">Menyusun Rubrik Asesmen & Profil Pelajar Pancasila</p>
            </div>
            <div className={`w-full rounded-full h-1.5 overflow-hidden border ${theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/5'}`}>
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full w-[75%] rounded-full animate-pulse" />
            </div>
          </div>
          <div className="text-[10px] text-slate-500 text-center italic">
            Menggunakan model Google Gemini Pro termutakhir
          </div>
        </div>
      )
    },
    {
      number: '03',
      title: 'Review A4 & Unduh DOCX',
      subtitle: 'Dokumen Siap Pakai & Edit Bebas',
      description: 'Lihat lembar dokumen Anda secara real-time melalui editor dokumen A4 interaktif. Jika sudah sesuai, unduh dokumen dalam format Microsoft Word (.docx) resmi yang siap dicetak dan ditandatangani kepala sekolah.',
      icon: Download,
      colorClass: 'from-emerald-500 to-teal-600',
      mockVisual: (
        <div className={`border rounded-2xl p-6 text-left font-sans text-xs space-y-4 shadow-2xl relative overflow-hidden ${
          theme === 'light' ? 'bg-white border-slate-200 text-slate-805' : 'bg-slate-900/90 border-white/10 text-slate-300'
        }`}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl" />
          <div className={`flex items-center justify-between border-b pb-3 ${theme === 'light' ? 'border-slate-100' : 'border-white/5'}`}>
            <span className={`font-bold text-sm ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Dokumen Siap Diunduh</span>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 rounded-full text-[10px] font-semibold">Langkah 3</span>
          </div>
          <div className={`flex gap-4 items-center p-4 rounded-xl border ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
            <div className="w-12 h-16 bg-white/95 rounded shadow flex items-center justify-center text-slate-800 font-bold border-t-4 border-blue-600 relative overflow-hidden">
               <FileText className="w-7 h-7 text-blue-600" />
               <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[7px] text-slate-400">DOCX</div>
            </div>
            <div className="flex-1 space-y-1">
              <h4 className={`font-bold text-xs ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>RPP_Bahasa_Indonesia_FaseD.docx</h4>
              <p className="text-[10px] text-slate-400">Ukuran: 45 KB · Berisi RPP Lengkap</p>
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Format Standar Kemendikbud</span>
              </div>
            </div>
          </div>
          <div className="pt-2 flex justify-end">
            <button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 w-full shadow-lg shadow-emerald-500/20">
              <Download className="w-4 h-4" />
              <span>Unduh File Word (.docx)</span>
            </button>
          </div>
        </div>
      )
    }
  ];

  const faqs = [
    {
      q: 'Apakah RPP dan Modul Ajar yang dihasilkan sesuai standar Kemendikbud?',
      a: 'Ya, seluruh draf dokumen administrasi (RPP, Modul Ajar, Soal Evaluasi) yang dibuat oleh GuruBantu AI sepenuhnya disesuaikan dengan regulasi kurikulum terbaru dari Kemendikbudristek RI, mengadopsi elemen Profil Pelajar Pancasila, pemetaan Alur Tujuan Pembelajaran (ATP), dan Taksonomi Bloom.'
    },
    {
      q: 'Bagaimana cara mendapatkan kuota gratis di GuruBantu AI?',
      a: 'Setiap guru baru yang mendaftar akan langsung mendapatkan kuota gratis 5 dokumen setiap bulannya secara otomatis. Kuota ini akan diperbarui (reset) secara berkala di awal bulan tanpa dipungut biaya apapun.'
    },
    {
      q: 'Mengapa format file yang diunduh adalah Microsoft Word (.docx)?',
      a: 'Kami memahami bahwa dokumen administrasi sering kali membutuhkan penyesuaian akhir (seperti tanda tangan kepala sekolah, stempel, atau penyesuaian nama sekolah lokal). Format Word (.docx) memberikan fleksibilitas penuh kepada guru untuk mengedit kembali isi dokumen di laptop/komputer masing-masing.'
    },
    {
      q: 'Apakah saya bisa menggunakan input suara (Speech-to-Text)?',
      a: 'Tentu! GuruBantu AI dilengkapi teknologi kecerdasan suara berbahasa Indonesia. Cukup klik ikon mikrofon saat mengisi topik pembelajaran, bicaralah secara alami, dan asisten AI akan menyalin ucapan Anda menjadi teks siap proses.'
    },
    {
      q: 'Apakah platform ini aman dan data guru terlindungi?',
      a: 'Keamanan data Anda adalah prioritas utama kami. Seluruh data akun, riwayat unduhan dokumen, dan aktivitas transaksi kuota disimpan dengan enkripsi standar industri dan tidak akan dibagikan ke pihak ketiga.'
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen font-sans animate-page" style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-secondary)' }}>
      {/* Header / Hero */}
      <header className="w-full py-20 px-6 text-center relative overflow-hidden border-b" style={{ backgroundColor: 'var(--bg-sidebar)', borderColor: 'var(--border-color)' }}>
        {/* Background Blobs */}
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[90px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[90px]" />
        
        <div className="max-w-4xl mx-auto space-y-5 relative z-10 flex flex-col items-center">
          <Link 
            to="/" 
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl border transition-all mb-4 ${
              theme === 'light' ? 'text-blue-600 bg-blue-50/50 hover:bg-blue-50 border-blue-200' : 'text-blue-400 bg-white/5 hover:bg-white/10 border-white/10'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
            theme === 'light' ? 'bg-blue-50 border border-blue-200 text-blue-600' : 'bg-blue-500/15 border border-blue-500/30 text-blue-300'
          }`}>
            <Sparkles className="w-3.5 h-3.5" />
            PANDUAN LENGKAP PLATFORM
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            Bagaimana <span className="gradient-text-blue">GuruBantu AI</span> Bekerja
          </h1>
          <p className="text-sm sm:text-base text-muted max-w-xl mx-auto leading-relaxed">
            Hanya butuh 3 langkah mudah untuk mengotomatiskan seluruh pembuatan dokumen rencana mengajar Anda. Pelajari alur kerja cerdasnya berikut ini.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-16 space-y-24">
        
        {/* Interactive Steps Section */}
        <section className="space-y-10">
          <div className="text-center space-y-3">
            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
              theme === 'light' ? 'bg-blue-50 border border-blue-200 text-blue-600' : 'text-blue-400 bg-blue-500/10 border border-blue-500/20'
            }`}>
              🛠️ ALUR GENERATOR DOKUMEN
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-ink tracking-tight">
              3 Langkah Praktis Pembuatan RPP & Soal
            </h2>
            <p className="text-xs sm:text-sm text-muted max-w-md mx-auto">
              Klik pada setiap langkah di bawah untuk melihat simulasi visual proses kecerdasan buatan kami bekerja.
            </p>
          </div>

          {/* Desktop & Mobile Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6">
            
            {/* Step Selectors */}
            <div className="lg:col-span-5 space-y-4">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isActive = activeStep === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-start gap-4 hover-card-premium ${
                      isActive 
                        ? (theme === 'light'
                            ? 'border-blue-500 shadow-lg shadow-blue-100/50 ring-1 ring-blue-500/15 bg-blue-50/30'
                            : 'border-blue-500/50 shadow-lg shadow-blue-500/5 ring-1 ring-blue-500/10 bg-slate-900/40')
                        : (theme === 'light'
                            ? 'border-slate-200 hover:border-blue-300 bg-white text-slate-800'
                            : 'border-white/[0.08] hover:border-blue-500/30 text-white')
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.colorClass} flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-md`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-blue-500 tracking-wider">Langkah {step.number}</span>
                        {isActive && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />}
                      </div>
                      <h3 className={`font-black text-sm ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{step.title}</h3>
                      <p className="text-xs text-muted">{step.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Interactive Visual Display */}
            <div className="lg:col-span-7 border border-rule rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between min-h-[380px] relative hover-card-premium" style={{ backgroundColor: 'var(--bg-card)' }}>
              <div className="absolute top-4 left-4 flex gap-1.5">
                <span className="w-3 h-3 bg-red-400 rounded-full opacity-60" />
                <span className="w-3 h-3 bg-amber-400 rounded-full opacity-60" />
                <span className="w-3 h-3 bg-green-400 rounded-full opacity-60" />
              </div>
              <div className="mb-4 text-right">
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
                  theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-white/5 border-white/10 text-slate-400'
                }`}>
                  Interactive Simulator
                </span>
              </div>

              {/* Dynamic Content (Mock Visual & Description) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center flex-grow">
                <div className="order-2 md:order-1 space-y-3">
                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                    theme === 'light' ? 'bg-blue-50 text-blue-600' : 'bg-blue-500/10 text-blue-400'
                  }`}>
                    INFO LANGKAH
                  </div>
                  <h4 className="font-black text-sm text-ink leading-snug">
                    {steps[activeStep].title}
                  </h4>
                  <p className="text-xs text-muted leading-relaxed">
                    {steps[activeStep].description}
                  </p>
                </div>
                <div className="order-1 md:order-2">
                  {steps[activeStep].mockVisual}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Video Tutorial / Visual Flow Section */}
        <section className={`border rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-premium ${
          theme === 'light'
            ? 'bg-gradient-to-br from-slate-900 to-indigo-955 border-indigo-950/40'
            : 'bg-gradient-to-br from-[#0F172A] to-[#1E1B4B] border-white/10'
        }`}>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 to-purple-600/10 blur-xl" />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            <div className="md:col-span-6 space-y-4 text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                <Tv className="w-3.5 h-3.5" />
                <span>DOKUMENTASI VISUAL</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-black tracking-tight leading-snug">
                Lihat Kecepatan Pembuatan Berkas
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Tonton ilustrasi generator dokumen RPP kami. Dalam 30 detik, draf lengkap sesuai format standar Kemendikbud langsung siap dicetak. Hemat jam kerja administratif Anda sekarang juga.
              </p>
              <div className="pt-2">
                <Link to="/register" className="btn-primary px-6 py-3 rounded-xl text-xs font-bold text-white shadow-lg shadow-blue-500/20 inline-flex items-center gap-2">
                  <span>Coba Generator Sekarang</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
            <div className="md:col-span-6 bg-slate-950/80 border border-white/10 rounded-2xl p-4 flex items-center justify-center min-h-[220px] shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15),transparent_60%)]" />
              {/* Media Mockup */}
              <div className="text-center space-y-3 z-10 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer shadow-lg backdrop-blur">
                  <div className="w-0 h-0 border-y-8 border-y-transparent border-l-[12px] border-l-white ml-1" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-black text-white">Video Panduan Kilat</p>
                  <p className="text-[10px] text-slate-400">Durasi: 1 Menit 15 Detik</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Accordion Section */}
        <section className="space-y-10">
          <div className="text-center space-y-3">
            <div className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${
              theme === 'light' ? 'text-purple-700 bg-purple-50 border border-purple-200' : 'text-purple-400 bg-purple-500/10 border border-purple-500/20'
            }`}>
              💡 PERTANYAAN UMUM
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-ink tracking-tight">
              Tanya Jawab Terpopuler
            </h2>
            <p className="text-xs sm:text-sm text-muted max-w-md mx-auto">
              Temukan jawaban cepat atas pertanyaan Anda tentang platform kecerdasan buatan asisten guru kami.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className={`border rounded-2xl overflow-hidden shadow-sm transition-all duration-300 ${
                    theme === 'light' ? 'border-slate-200/80 bg-white hover:bg-slate-50/80' : 'border-white/[0.08] bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-bold text-ink text-sm transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-4.5 h-4.5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                      <span>{faq.q}</span>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className={`px-6 pb-6 pt-1 text-xs sm:text-sm leading-relaxed border-t animate-fade-in ${
                      theme === 'light' ? 'text-slate-600 border-slate-100 bg-slate-50/20' : 'text-slate-400 border-white/[0.05] bg-white/[0.02]'
                    }`}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Call to Action */}
        <section className={`border text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-premium ${
          theme === 'light'
            ? 'bg-gradient-to-br from-blue-600 to-indigo-700 border-blue-500'
            : 'bg-gradient-to-br from-[#131318] to-[#0d0d12] border-white/[0.08]'
        }`}>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 to-purple-600/10 blur-xl" />
          <div className="space-y-6 relative z-10">
            <h3 className="font-display text-2xl sm:text-3xl font-black tracking-tight">Sudah Siap Memulai?</h3>
            <p className="text-blue-100 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              Bergabunglah bersama ribuan guru honorer dan guru PNS Indonesia lainnya yang telah menghemat ribuan jam kerja administrasi mereka.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link to="/register" className="btn-primary px-8 py-3.5 rounded-xl text-xs font-bold text-white shadow-lg shadow-blue-500/10 hover:shadow-xl">
                Daftar Akun Gratis
              </Link>
              <Link to="/about" className="px-6 py-3.5 rounded-xl text-xs font-bold text-white border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                Tentang Kami
              </Link>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default LearnMore;
