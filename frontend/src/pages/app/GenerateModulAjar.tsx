import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  ArrowLeft,
  AlertCircle,
  Info,
  Loader2,
  Mic,
  MicOff,
  Sparkles,
} from 'lucide-react';
import { api } from '../../services/api';
import {
  jenjangOptions,
  mapelOptions,
  kelasOptions,
  alokasiWaktuOptions,
  modelPembelajaranOptions,
  profilPelajarPancasilaOptions,
} from '../../constants/mapel';

// 1. Zod Validation Schema
const modulAjarSchema = z.object({
  jenjang: z.string().min(1, 'Pilih jenjang sekolah'),
  kelas: z.string().min(1, 'Pilih kelas'),
  mapel: z.string().min(1, 'Pilih mata pelajaran'),
  customMapel: z.string().optional(),
  topik: z.string().min(3, 'Topik pembelajaran minimal berisi 3 karakter'),
  alokasiWaktu: z.string().min(1, 'Pilih alokasi waktu'),
  modelPembelajaran: z.string().min(1, 'Pilih model pembelajaran'),
  profilPelajarPancasila: z.array(z.string()).min(1, 'Pilih minimal satu profil pelajar Pancasila'),
}).refine((data) => {
  if (data.mapel === 'Lainnya (Tulis Sendiri)' && (!data.customMapel || data.customMapel.trim().length === 0)) {
    return false;
  }
  return true;
}, {
  message: 'Nama mata pelajaran kustom wajib diisi',
  path: ['customMapel'],
});

type ModulAjarFormValues = z.infer<typeof modulAjarSchema>;

// Cascading Data Options — diambil dari constants/mapel.ts (terpusat & lengkap)


// Loading text rotator
const loadingTexts = [
  'Menghubungi asisten AI GuruBantu...',
  'Menyusun Capaian Pembelajaran Kurikulum Merdeka...',
  'Merancang Profil Pelajar Pancasila yang relevan...',
  'Menyusun pertanyaan pemantik kontekstual...',
  'Merancang kegiatan pembelajaran 3 fase (Pendahuluan, Inti, Penutup)...',
  'Menyusun asesmen diagnostik, formatif, dan sumatif...',
  'Membuat program remedi dan pengayaan yang tepat...',
  'Mengkompilasi dokumen Modul Ajar (.docx) formal...',
  'Hampir selesai, menyinkronkan data akun Anda...',
];

// Template Modul Ajar Populer
const popularTemplates = [
  {
    title: 'Penjumlahan SD',
    jenjang: 'SD',
    kelas: 'Kelas I',
    mapel: 'Matematika',
    topik: 'Penjumlahan Angka 1 sampai 10 dengan Benda Nyata',
    alokasiWaktu: '2 JP (2 x 35 menit)',
    modelPembelajaran: 'Problem Based Learning (PBL)',
    profilPelajarPancasila: ['Bernalar Kritis', 'Mandiri'],
  },
  {
    title: 'Siklus Air SMP',
    jenjang: 'SMP',
    kelas: 'Kelas VII',
    mapel: 'IPA',
    topik: 'Siklus Hidrologi dan Dampaknya terhadap Kehidupan Makhluk Hidup',
    alokasiWaktu: '2 JP (2 x 40 menit)',
    modelPembelajaran: 'Project Based Learning (PjBL)',
    profilPelajarPancasila: ['Bergotong Royong', 'Kreatif', 'Bernalar Kritis'],
  },
  {
    title: 'Ekonomi SMA',
    jenjang: 'SMA',
    kelas: 'Kelas X',
    mapel: 'Ekonomi',
    topik: 'Konsep Dasar Ilmu Ekonomi dan Kebutuhan Manusia',
    alokasiWaktu: '2 JP (2 x 45 menit)',
    modelPembelajaran: 'Discovery Learning',
    profilPelajarPancasila: ['Mandiri', 'Bernalar Kritis'],
  },
];

export const GenerateModulAjar: React.FC = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);

  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Browser Anda belum mendukung fitur pengenalan suara. Silakan gunakan Google Chrome atau Microsoft Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setValue('topik', text);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ModulAjarFormValues>({
    resolver: zodResolver(modulAjarSchema),
    defaultValues: {
      jenjang: 'SD',
      kelas: 'Kelas I',
      mapel: 'Matematika',
      topik: '',
      alokasiWaktu: '2 JP (2 x 35 menit)',
      modelPembelajaran: 'Problem Based Learning (PBL)',
      profilPelajarPancasila: ['Bernalar Kritis', 'Mandiri'],
    },
  });

  const selectedJenjang = watch('jenjang');
  const watchKelas = watch('kelas');
  const watchMapel = watch('mapel');
  const watchTopik = watch('topik');
  const watchAlokasiWaktu = watch('alokasiWaktu');
  const watchModelPembelajaran = watch('modelPembelajaran');
  const watchProfilPelajarPancasila = watch('profilPelajarPancasila') || [];

  // Cascade update ketika Jenjang berubah
  useEffect(() => {
    if (selectedJenjang) {
      const mapels = mapelOptions[selectedJenjang];
      const kelas = kelasOptions[selectedJenjang];
      const alokasi = alokasiWaktuOptions[selectedJenjang];

      if (mapels && mapels.length > 0) setValue('mapel', mapels[0]);
      if (kelas && kelas.length > 0) setValue('kelas', kelas[0]);
      if (alokasi && alokasi.length > 0) setValue('alokasiWaktu', alokasi[0]);
    }
  }, [selectedJenjang, setValue]);

  // Rotator teks loading
  useEffect(() => {
    let textInterval: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    if (isGenerating) {
      textInterval = setInterval(() => {
        setCurrentTextIndex((prev) => (prev + 1) % loadingTexts.length);
      }, 4000);

      progressInterval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 98) { clearInterval(progressInterval); return 98; }
          return prev + 1;
        });
      }, 250);
    } else {
      setLoadingProgress(0);
      setCurrentTextIndex(0);
    }

    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
    };
  }, [isGenerating]);

  const onSubmit = async (data: ModulAjarFormValues) => {
    setIsGenerating(true);
    setServerError(null);

    try {
      const response = await api.post('/documents/generate', {
        type: 'modul_ajar',
        inputData: {
          mapel: data.mapel === 'Lainnya (Tulis Sendiri)' ? data.customMapel : data.mapel,
          kelas: data.kelas,
          topik: data.topik,
          alokasiWaktu: data.alokasiWaktu,
          modelPembelajaran: data.modelPembelajaran,
          profilPelajarPancasila: data.profilPelajarPancasila,
        },
      });

      const result = response.data.data;
      setLoadingProgress(100);

      navigate('/generate/success', {
        state: {
          document: result.document,
          signedUrl: result.signedUrl,
          type: 'modul_ajar',
          params: data,
        },
      });
    } catch (error: any) {
      console.error('Error generating Modul Ajar:', error);
      if (error.response?.data?.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError('Server AI sibuk. Silakan coba kembali sesaat lagi.');
      }
      setIsGenerating(false);
    }
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    const current = watch('profilPelajarPancasila') || [];
    if (checked) {
      setValue('profilPelajarPancasila', [...current, id]);
    } else {
      setValue('profilPelajarPancasila', current.filter((v) => v !== id));
    }
  };

  return (
    <div className="space-y-6 animate-page text-white">
      {/* Tombol Kembali */}
      <div className="flex items-center gap-3">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-brand-red transition-colors bg-white/5 hover:bg-white/10 border border-white/5 px-3 py-1.5 rounded-xl shadow-sm backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>Kembali ke Dashboard</span>
        </Link>
      </div>

      {/* Judul */}
      <div className="space-y-1">
        <h2 className="font-display text-3xl font-black text-white tracking-tight leading-tight">
          Form Pembuat <span className="gradient-text-hero">Modul Ajar Otomatis</span>
        </h2>
        <p className="text-sm text-slate-400">
          Isi detail informasi di bawah ini untuk membuat Modul Ajar Kurikulum Merdeka lengkap dalam hitungan detik.
        </p>
      </div>

      {/* Error Server */}
      {serverError && (
        <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-xl flex items-start gap-2.5 text-red-400 animate-scale-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-sm font-semibold">{serverError}</div>
        </div>
      )}

      {/* Loading Overlay */}
      {isGenerating && (
        <div className="glass-card border border-white/5 rounded-2xl p-6 sm:p-12 text-center shadow-premium space-y-8 max-w-2xl mx-auto py-16 animate-fade-up">
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            {/* Ambient Pulsing Aura */}
            <div className="absolute inset-0 bg-brand-mid/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute -inset-2 rounded-full border border-brand-mid/30 animate-spin-slow" />
            
            <Loader2 className="w-14 h-14 text-brand-red animate-spin relative z-10" />
            <BookOpen className="w-6 h-6 text-brand-mid absolute animate-bounce-soft z-20" />
          </div>

          <div className="space-y-3 max-w-md mx-auto">
            <h3 className="text-xl font-display font-black text-white tracking-tight transition-all">
              {loadingTexts[currentTextIndex]}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Mesin AI kami sedang memproses data materi Modul Ajar Anda secara atomik. Modul Ajar lengkap dengan format Kemendikbud sedang dibuat.
            </p>
          </div>

          <div className="max-w-md mx-auto space-y-2.5">
            <div className="w-full h-3 bg-[#0a0a0f] rounded-full overflow-hidden border border-white/5 relative">
              <div
                className="h-full bg-gradient-to-r from-brand-mid to-brand-navy rounded-full transition-all duration-300 ease-out animate-progress-shimmer"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 tracking-wider">
              <span>ESTIMASI WAKTU: ~30 DETIK</span>
              <span className="text-brand-red">{loadingProgress}% SELESAI</span>
            </div>
          </div>
        </div>
      )}

      {/* Form Utama */}
      {!isGenerating && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Sisi Kiri: Form Input */}
          <div className="glass-card border border-white/5 rounded-2xl p-6 sm:p-8 shadow-premium space-y-6">
            {/* Template Modul Ajar Instan */}
            <div className="space-y-3 border-b border-white/5 pb-5">
              <span className="text-xs text-brand-red font-bold uppercase tracking-wider block">
                📚 Modul Ajar Instan (Pilih Template Pengisian Cepat)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {popularTemplates.map((tpl) => (
                  <button
                    key={tpl.title}
                    type="button"
                    onClick={() => {
                      setActiveTemplate(tpl.title);
                      setValue('jenjang', tpl.jenjang);
                      setTimeout(() => {
                        setValue('kelas', tpl.kelas);
                        setValue('mapel', tpl.mapel);
                        setValue('topik', tpl.topik);
                        setValue('alokasiWaktu', tpl.alokasiWaktu);
                        setValue('modelPembelajaran', tpl.modelPembelajaran);
                        setValue('profilPelajarPancasila', tpl.profilPelajarPancasila);
                      }, 50);
                    }}
                    className={`p-3 border rounded-xl text-left transition-all duration-200 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-brand-red/10 w-full flex items-center justify-between hover-card-premium ${
                      activeTemplate === tpl.title
                        ? 'border-brand-red bg-[#00f2ff]/10 shadow-glow-blue/20 border-2'
                        : 'border-white/5 hover:border-brand-red/30 bg-[#131318]/40 hover:bg-[#131318]'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <span className={`font-bold text-xs block truncate ${activeTemplate === tpl.title ? 'text-brand-red' : 'text-white group-hover:text-brand-red'}`}>{tpl.title}</span>
                      <span className="text-[9px] text-slate-400 block mt-1">{tpl.mapel} · {tpl.kelas}</span>
                    </div>
                    {activeTemplate === tpl.title && (
                      <span className="w-4 h-4 bg-brand-red text-slate-950 rounded-full flex items-center justify-center text-[10px] font-bold animate-scale-check flex-shrink-0 ml-2 shadow-sm shadow-brand-red/30">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Jenjang */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label htmlFor="jenjang" className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                    Jenjang Sekolah *
                  </label>
                  <select
                    id="jenjang"
                    className="input-premium w-full px-3.5 py-2.5 text-sm text-white cursor-pointer min-h-[44px] bg-[#131318]"
                    {...register('jenjang')}
                  >
                    {jenjangOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#131318] text-white">{opt}</option>
                    ))}
                  </select>
                </div>

                {/* 2. Kelas (Cascade) */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label htmlFor="kelas" className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                    Kelas *
                  </label>
                  <select
                    id="kelas"
                    className="input-premium w-full px-3.5 py-2.5 text-sm text-white cursor-pointer min-h-[44px] bg-[#131318]"
                    {...register('kelas')}
                  >
                    {(kelasOptions[selectedJenjang] || []).map((opt) => (
                      <option key={opt} value={opt} className="bg-[#131318] text-white">{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3. Mata Pelajaran */}
              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="mapel" className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                  Mata Pelajaran *
                </label>
                <select
                  id="mapel"
                  className="input-premium w-full px-3.5 py-2.5 text-sm text-white cursor-pointer min-h-[44px] bg-[#131318]"
                  {...register('mapel')}
                >
                  {(mapelOptions[selectedJenjang] || []).map((opt) => (
                    <option key={opt} value={opt} className="bg-[#131318] text-white">{opt}</option>
                  ))}
                </select>
              </div>

              {watchMapel === 'Lainnya (Tulis Sendiri)' && (
                <div className="flex flex-col gap-1.5 text-left animate-fade-in">
                  <label htmlFor="customMapel" className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                    Tulis Mata Pelajaran Kustom *
                  </label>
                  <textarea
                    id="customMapel"
                    rows={2}
                    className="input-premium w-full px-3.5 py-2.5 text-sm text-white min-h-[80px] bg-[#131318] resize-none"
                    placeholder="Masukkan nama mata pelajaran di sini (misal: Bahasa Jerman, Astronomi, dll)..."
                    {...register('customMapel')}
                  />
                  {errors.customMapel && (
                    <span className="text-xs text-red-500 font-medium">
                      {errors.customMapel.message}
                    </span>
                  )}
                </div>
              )}

              {/* 4. Topik dengan Speech-to-Text */}
              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="topik" className="text-xs font-bold text-slate-300 uppercase tracking-wide flex justify-between items-center">
                  <span>Topik Utama Modul Ajar *</span>
                  <button
                    type="button"
                    onClick={startSpeechRecognition}
                    className={`relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition-all duration-200 active:scale-95 ${
                      isListening
                        ? 'bg-red-500 text-white shadow-sm shadow-red-500/20'
                        : 'bg-white/5 border border-white/10 text-brand-red hover:bg-white/10'
                    }`}
                  >
                    {isListening && (
                      <>
                        <span className="absolute inset-0 rounded-full bg-red-500 animate-ripple pointer-events-none" />
                        <span className="absolute inset-0 rounded-full bg-red-500 animate-ripple-delay pointer-events-none" />
                      </>
                    )}
                    {isListening ? (
                      <>
                        <MicOff className="w-3 h-3 animate-spin relative z-10" />
                        <span className="relative z-10">Mendengarkan...</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3 h-3" />
                        <span>Isi Pakai Suara</span>
                      </>
                    )}
                  </button>
                </label>
                <input
                  id="topik"
                  type="text"
                  placeholder="Misal: Fotosintesis, Sistem Persamaan Linear, Siklus Air"
                  className={`input-premium w-full px-4 py-2.5 text-sm text-white placeholder-slate-500 min-h-[44px] ${
                    errors.topik ? 'error' : ''
                  }`}
                  {...register('topik')}
                />
                {errors.topik && (
                  <p className="flex items-center gap-1 mt-1 text-xs text-red-400 animate-fade-in">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.topik.message}
                  </p>
                )}
              </div>

              {/* 5. Alokasi Waktu */}
              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="alokasiWaktu" className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                  Alokasi Waktu *
                </label>
                <select
                  id="alokasiWaktu"
                  className="input-premium w-full px-3.5 py-2.5 text-sm text-white cursor-pointer min-h-[44px] bg-[#131318]"
                  {...register('alokasiWaktu')}
                >
                  {(alokasiWaktuOptions[selectedJenjang] || []).map((opt) => (
                    <option key={opt} value={opt} className="bg-[#131318] text-white">{opt}</option>
                  ))}
                </select>
              </div>

              {/* 6. Model Pembelajaran */}
              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="modelPembelajaran" className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                  Model Pembelajaran *
                </label>
                <select
                  id="modelPembelajaran"
                  className="input-premium w-full px-3.5 py-2.5 text-sm text-white cursor-pointer min-h-[44px] bg-[#131318]"
                  {...register('modelPembelajaran')}
                >
                  {modelPembelajaranOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#131318] text-white">{opt}</option>
                  ))}
                </select>
              </div>

              {/* 7. Profil Pelajar Pancasila (Multi-checkbox) */}
              <div className="flex flex-col gap-2 text-left">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">Profil Pelajar Pancasila *</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
                  {profilPelajarPancasilaOptions.map((opt) => {
                    const currentValues = watch('profilPelajarPancasila') || [];
                    const isChecked = currentValues.includes(opt.id);
                    return (
                      <label
                        key={opt.id}
                        className={`flex items-center gap-2.5 cursor-pointer select-none px-3 py-2.5 rounded-xl border transition-all duration-150 text-xs font-semibold ${
                          isChecked
                            ? 'border-brand-red bg-[#00f2ff]/10 text-brand-red'
                            : 'border-white/5 hover:border-brand-red/30 bg-[#131318]/40 hover:bg-[#131318] text-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-brand-red border-white/10 bg-[#0a0a0f] rounded cursor-pointer focus:ring-brand-red accent-brand-red"
                          checked={isChecked}
                          onChange={(e) => handleCheckboxChange(opt.id, e.target.checked)}
                        />
                        <span className="truncate">{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
                {errors.profilPelajarPancasila && (
                  <p className="flex items-center gap-1 mt-1 text-xs text-red-400 animate-fade-in">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.profilPelajarPancasila.message}
                  </p>
                )}
              </div>

              {/* Tombol Generate */}
              <button
                type="submit"
                className="btn-primary w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-slate-950 font-bold text-sm rounded-xl min-h-[48px] shadow-lg hover:shadow-xl mt-4"
              >
                <BookOpen className="w-4.5 h-4.5" />
                <span>Generate Modul Ajar Kurikulum Merdeka</span>
              </button>
            </form>
          </div>

          {/* Sisi Kanan: Panel Info (Sticky Desktop) */}
          <div className="hidden lg:flex flex-col gap-6 lg:sticky lg:top-20">
            {/* A4 Paper Live Preview */}
            <div className="glass-card rounded-2xl border border-white/10 shadow-premium overflow-hidden transition-all duration-300 hover:shadow-card-hover text-left flex flex-col">
              {/* Header of paper preview */}
              <div className="bg-gradient-to-r from-brand-red/10 to-brand-mid/5 px-5 py-3.5 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-red animate-pulse" />
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">Live Draft Preview</span>
                </div>
                <span className="text-[10px] font-bold text-brand-red bg-brand-red/10 px-2 py-0.5 rounded-full border border-brand-red/20">
                  UKURAN A4
                </span>
              </div>
              
              {/* A4 Paper Sheet Body */}
              <div className="p-8 bg-white text-slate-800 min-h-[480px] flex flex-col justify-between relative shadow-lg font-sans text-xs border border-slate-200 rounded-xl">
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
                
                {/* Modul Ajar Header */}
                <div className="text-center space-y-1.5 border-b-2 border-slate-300 pb-4 relative">
                  <h4 className="font-extrabold text-[13px] tracking-wide text-slate-900 uppercase">
                    MODUL AJAR KURIKULUM MERDEKA
                  </h4>
                  <h5 className="font-bold text-[11px] text-slate-500 tracking-wider uppercase">
                    Mata Pelajaran: {watchMapel || 'Matematika'}
                  </h5>
                  <div className="absolute bottom-0.5 left-0 right-0 h-[1px] bg-slate-200" />
                </div>

                {/* Metadata Grid */}
                <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 border-b border-slate-200 pb-4 text-[11px]">
                  <div className="space-y-1">
                    <div className="flex justify-between border-b border-slate-100 pb-0.5">
                      <span className="text-slate-500 font-medium">Jenjang Sekolah</span>
                      <span className="font-bold text-slate-950">{selectedJenjang || 'SD/SMP/SMA'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-0.5">
                      <span className="text-slate-500 font-medium">Kelas / Fase</span>
                      <span className="font-bold text-slate-950">{watchKelas || 'Kelas I'}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between border-b border-slate-100 pb-0.5">
                      <span className="text-slate-500 font-medium">Alokasi Waktu</span>
                      <span className="font-bold text-slate-950">{watchAlokasiWaktu || '2 JP'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-0.5">
                      <span className="text-slate-500 font-medium">Model Belajar</span>
                      <span className="font-bold text-slate-950">{watchModelPembelajaran || 'PBL'}</span>
                    </div>
                  </div>
                </div>

                {/* Core Sections */}
                <div className="mt-4 flex-1 space-y-4">
                  {/* Topik / Kompetensi */}
                  <div className="space-y-1">
                    <div className="font-extrabold text-[10px] text-slate-900 tracking-wider uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                      1. Tujuan Pembelajaran (TP)
                    </div>
                    <div className="pl-3.5 text-slate-600 leading-relaxed text-[10.5px] text-left">
                      {watchTopik ? (
                        <p>Siswa mampu memahami, menganalisis, serta menerapkan pengetahuan teoritis mengenai <span className="font-bold text-slate-950">{watchTopik}</span> dalam pemecahan masalah kehidupan sehari-hari.</p>
                      ) : (
                        <div className="space-y-1.5 pt-1 animate-pulse">
                          <div className="h-2.5 bg-slate-100 rounded w-10/12" />
                          <div className="h-2.5 bg-slate-100 rounded w-6/12" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Profil Pelajar Pancasila */}
                  <div className="space-y-1">
                    <div className="font-extrabold text-[10px] text-slate-900 tracking-wider uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                      2. Profil Pelajar Pancasila
                    </div>
                    <div className="pl-3.5 flex flex-wrap gap-1.5 pt-1">
                      {watchProfilPelajarPancasila.length > 0 ? (
                        watchProfilPelajarPancasila.map((p: string) => {
                          const label = p.split(',')[0];
                          return (
                            <span key={p} className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold border border-slate-200 rounded-full text-[9px]">
                              🌱 {label}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-slate-400 italic">Belum ada profil terpilih...</span>
                      )}
                    </div>
                  </div>

                  {/* Pertanyaan Pemantik */}
                  <div className="space-y-1">
                    <div className="font-extrabold text-[10px] text-slate-900 tracking-wider uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                      3. Pertanyaan Pemantik
                    </div>
                    <div className="pl-3.5 text-slate-600 leading-relaxed text-[10.5px] italic text-left">
                      {watchTopik ? (
                        <p>"Bagaimana peranan penting dari konsep {watchTopik} dalam ekosistem / aktivitas keseharian kita?"</p>
                      ) : (
                        <div className="h-3.5 bg-slate-100 rounded w-9/12 pt-1 animate-pulse" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Signature Mock */}
                <div className="mt-6 border-t border-slate-200 pt-3 flex justify-between items-center text-[9px] text-slate-500">
                  <div>
                    <p>Mengetahui,</p>
                    <p className="font-bold text-slate-700 mt-5">Kepala Sekolah</p>
                  </div>
                  <div className="text-right">
                    <p>Jakarta, ____________ 2026</p>
                    <p className="font-bold text-slate-700 mt-5">Guru Mata Pelajaran</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Box 1: Panduan Modul Ajar */}
            <div className="glass-card border border-white/10 rounded-2xl p-5 space-y-4 shadow-sm text-left hover-card-premium">
              <div className="flex items-center gap-2.5 text-brand-red">
                <Info className="w-5 h-5 animate-pulse" />
                <h3 className="font-bold text-base text-white font-display">Panduan Modul Ajar</h3>
              </div>

              <div className="space-y-3.5 text-sm leading-relaxed text-slate-350">
                <p>
                  Modul Ajar merupakan perluasan RPP Kurikulum Merdeka yang memuat **komponen inti & lampiran** secara lengkap.
                </p>

                <div className="border-l-2 border-brand-red pl-3 space-y-2 mt-2 bg-brand-red/5 p-2.5 rounded-r-xl">
                  <span className="font-bold text-brand-red text-xs block">Elemen Kunci Modul Ajar:</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    - **Pemahaman Bermakna:** Konten manfaat esensial setelah belajar.<br />
                    - **Asesmen Diagnostik:** Mengukur kesiapan kognitif awal siswa.<br />
                    - **Langkah Remedial:** Bantuan belajar diferensiasi siswa tertinggal.
                  </p>
                </div>
              </div>
            </div>

            {/* Box 2: Info Keandalan */}
            <div className="glass-card border border-white/5 bg-[#131318]/40 rounded-xl p-5 flex items-start gap-3.5 shadow-inner text-left">
              <Sparkles className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-xs text-white">Keandalan Transaksional</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Batas kuota bulanan Anda hanya akan terpotong setelah file Modul Ajar Word berhasil dikompilasi
                  dan disimpan di cloud. Transaksi Anda 100% aman dari hang/timeout.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
