import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowLeft, 
  AlertCircle, 
  Loader2, 
  HelpCircle,
  Mic,
  MicOff
} from 'lucide-react';
import { api } from '../services/api';

// 1. Zod Validation Schema
const soalSchema = z.object({
  jenjang: z.string().min(1, 'Pilih jenjang sekolah'),
  kelas: z.string().min(1, 'Pilih kelas'),
  mapel: z.string().min(1, 'Pilih mata pelajaran'),
  topik: z.string().min(3, 'Topik soal minimal berisi 3 karakter'),
  jumlahPG: z.number().min(1, 'Jumlah PG minimal 1').max(50, 'Jumlah PG maksimal 50'),
  jumlahEssay: z.number().min(0, 'Jumlah Essay minimal 0').max(10, 'Jumlah Essay maksimal 10'),
  tingkatKesulitan: z.string().min(1, 'Pilih tingkat kesulitan'),
});

type SoalFormValues = z.infer<typeof soalSchema>;

// 2. Cascading Data Options
const jenjangOptions = ['SD', 'SMP', 'SMA'];

const mapelOptions: Record<string, string[]> = {
  SD: ['Matematika', 'Bahasa Indonesia', 'IPA', 'IPS', 'Pendidikan Pancasila', 'PJOK', 'Seni Budaya'],
  SMP: ['Matematika', 'IPA', 'IPS', 'Bahasa Indonesia', 'Bahasa Inggris', 'Pendidikan Pancasila', 'PJOK', 'Seni Budaya', 'Informatika'],
  SMA: ['Matematika', 'Bahasa Indonesia', 'Bahasa Inggris', 'Fisika', 'Kimia', 'Biologi', 'Sejarah', 'Geografi', 'Ekonomi', 'Sosiologi', 'Pendidikan Pancasila', 'PJOK', 'Seni Budaya', 'Informatika']
};

const kelasOptions: Record<string, string[]> = {
  SD: ['Kelas I', 'Kelas II', 'Kelas III', 'Kelas IV', 'Kelas V', 'Kelas VI'],
  SMP: ['Kelas VII', 'Kelas VIII', 'Kelas IX'],
  SMA: ['Kelas X', 'Kelas XI', 'Kelas XII']
};

const kesulitanOptions = [
  { id: 'Mudah', label: 'Mudah (Pemahaman C1-C2)' },
  { id: 'Sedang', label: 'Sedang (Penerapan C3)' },
  { id: 'Sulit', label: 'Sulit (Analisis C4)' },
  { id: 'HOTS', label: 'HOTS (Evaluasi & Kreasi C5-C6)' }
];

const loadingTexts = [
  'Menghubungi asisten AI GuruBantu...',
  'Merancang Butir Pertanyaan Pilihan Ganda (A-E)...',
  'Menyusun Pertanyaan Esai penalaran tingkat tinggi...',
  'Menyusun lembar kunci jawaban terpisah di halaman akhir...',
  'Memformulasikan rubrik kriteria penilaian esai...',
  'Merakit dokumen Word (.docx) formal berstandar Kemendikbud...',
  'Mengunggah berkas kompilasi ke penyimpanan aman...',
  'Hampir selesai, memotong kuota dan menyinkronkan profil...'
];

const popularTemplates = [
  {
    title: 'Matematika SD',
    jenjang: 'SD',
    kelas: 'Kelas I',
    mapel: 'Matematika',
    topik: 'Penjumlahan dan Pengurangan Dasar Angka 1-10',
    jumlahPG: 5,
    jumlahEssay: 2,
    tingkatKesulitan: 'Mudah'
  },
  {
    title: 'IPA SMP (Siklus Air)',
    jenjang: 'SMP',
    kelas: 'Kelas VII',
    mapel: 'IPA',
    topik: 'Siklus Air (Hidrologi) dan Pemanasan Global',
    jumlahPG: 10,
    jumlahEssay: 3,
    tingkatKesulitan: 'Sedang'
  },
  {
    title: 'Ekonomi SMA (Lembaga)',
    jenjang: 'SMA',
    kelas: 'Kelas X',
    mapel: 'Ekonomi',
    topik: 'Otoritas Jasa Keuangan (OJK) dan Lembaga Jasa Keuangan',
    jumlahPG: 15,
    jumlahEssay: 5,
    tingkatKesulitan: 'HOTS'
  }
];

export const GenerateSoal: React.FC = () => {
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

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setValue('topik', text);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SoalFormValues>({
    resolver: zodResolver(soalSchema),
    defaultValues: {
      jenjang: 'SD',
      kelas: 'Kelas I',
      mapel: 'Matematika',
      topik: '',
      jumlahPG: 5,
      jumlahEssay: 2,
      tingkatKesulitan: 'Sedang',
    },
  });

  const selectedJenjang = watch('jenjang');
  const watchKelas = watch('kelas');
  const watchMapel = watch('mapel');
  const watchTopik = watch('topik');
  const watchJumlahPG = watch('jumlahPG');
  const watchJumlahEssay = watch('jumlahEssay');
  const watchTingkatKesulitan = watch('tingkatKesulitan');

  // Trigger cascade update ketika Jenjang berubah
  useEffect(() => {
    if (selectedJenjang) {
      const mapels = mapelOptions[selectedJenjang];
      const kelas = kelasOptions[selectedJenjang];

      if (mapels && mapels.length > 0) setValue('mapel', mapels[0]);
      if (kelas && kelas.length > 0) setValue('kelas', kelas[0]);
    }
  }, [selectedJenjang, setValue]);

  // Rotator teks pemuatan AI & progress bar
  useEffect(() => {
    let textInterval: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    if (isGenerating) {
      textInterval = setInterval(() => {
        setCurrentTextIndex((prev) => (prev + 1) % loadingTexts.length);
      }, 4000);

      progressInterval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 98) {
            clearInterval(progressInterval);
            return 98;
          }
          return prev + 1;
        });
      }, 300);
    } else {
      setLoadingProgress(0);
      setCurrentTextIndex(0);
    }

    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
    };
  }, [isGenerating]);

  const onSubmit = async (data: SoalFormValues) => {
    setIsGenerating(true);
    setServerError(null);

    try {
      // Panggil endpoint generasi dinamis Backend secara E2E
      const response = await api.post('/documents/generate', {
        type: 'soal',
        inputData: {
          mapel: data.mapel,
          kelas: data.kelas,
          topik: data.topik,
          jumlahPG: data.jumlahPG,
          jumlahEssay: data.jumlahEssay,
          tingkatKesulitan: data.tingkatKesulitan,
        }
      });

      const result = response.data.data;
      setLoadingProgress(100);

      // Selesai, alihkan ke Halaman Hasil Generate (T-025) membawa data berkas
      navigate('/generate/success', { 
        state: { 
          document: result.document, 
          signedUrl: result.signedUrl,
          type: 'soal',
          params: data
        } 
      });
    } catch (error: any) {
      console.error('Error generating Soal:', error);
      if (error.response?.data?.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError('Server AI sibuk. Silakan coba kembali sesaat lagi.');
      }
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-page">
      {/* Tombol Kembali */}
      <div className="flex items-center gap-3">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors bg-white hover:bg-slate-50 border border-rule/50 px-3 py-1.5 rounded-xl shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400" />
          <span>Kembali ke Dashboard</span>
        </Link>
      </div>

      {/* Judul Halaman */}
      <div className="space-y-1">
        <h2 className="font-display text-3xl font-black text-ink tracking-tight leading-tight">
          Form Pembuat <span className="gradient-text-blue">Soal Ujian Cerdas</span>
        </h2>
        <p className="text-sm text-muted">
          Rancang materi evaluasi, butir Pilihan Ganda, esai kontekstual, dan pedoman rubrik penilaian secara instan.
        </p>
      </div>

      {/* Error Server */}
      {serverError && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-xl flex items-start gap-2.5 text-error animate-scale-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-sm font-semibold">{serverError}</div>
        </div>
      )}

      {/* Layar Loading/Generasi Progress */}
      {isGenerating && (
        <div className="glass-card border border-white/50 rounded-2xl p-6 sm:p-12 text-center shadow-premium space-y-8 max-w-2xl mx-auto py-16 animate-fade-up">
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            {/* Ambient Pulsing Aura */}
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute -inset-2 rounded-full border border-blue-500/30 animate-spin-slow" />
            
            <Loader2 className="w-14 h-14 text-blue-600 animate-spin relative z-10" />
            <Sparkles className="w-6 h-6 text-indigo-500 absolute animate-bounce-soft z-20" />
          </div>

          <div className="space-y-3 max-w-md mx-auto">
            <h3 className="text-xl font-display font-black text-ink tracking-tight transition-all">
              {loadingTexts[currentTextIndex]}
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              Asisten cerdas kami sedang menyusun lembar soal dan halaman kunci jawaban di lembar terpisah.
            </p>
          </div>

          {/* Progress Bar Visual */}
          <div className="max-w-md mx-auto space-y-2.5">
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-rule/35 relative">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300 ease-out animate-progress-shimmer"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold text-muted tracking-wider">
              <span>ESTIMASI WAKTU: ~30 DETIK</span>
              <span className="text-blue-600">{loadingProgress}% SELESAI</span>
            </div>
          </div>
        </div>
      )}

      {/* Formulir Utama */}
      {!isGenerating && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Sisi Kiri: Formulir Input (50% Desktop) */}
          <div className="glass-card border border-white/50 rounded-2xl p-6 sm:p-8 shadow-premium space-y-6">
            {/* Soal Instan Templates - Beginner Friendly */}
            <div className="space-y-3 border-b border-rule/50 pb-5">
              <span className="text-xs text-blue-600 font-bold uppercase tracking-wider block">✨ Soal Instan (Pilih Template Pengisian Cepat)</span>
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
                        setValue('jumlahPG', tpl.jumlahPG);
                        setValue('jumlahEssay', tpl.jumlahEssay);
                        setValue('tingkatKesulitan', tpl.tingkatKesulitan);
                      }, 50);
                    }}
                    className={`p-3 border rounded-xl text-left transition-all duration-200 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-blue-500/10 w-full flex items-center justify-between hover-card-premium ${
                      activeTemplate === tpl.title
                        ? 'border-blue-500 bg-blue-50/50 shadow-glow-sm border-2'
                        : 'border-slate-200 hover:border-blue-300 bg-white/60 hover:bg-blue-50/10'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <span className={`font-bold text-xs block truncate ${activeTemplate === tpl.title ? 'text-blue-600' : 'text-slate-800 group-hover:text-blue-600'}`}>{tpl.title}</span>
                      <span className="text-[9px] text-muted block mt-1">{tpl.mapel} · {tpl.kelas}</span>
                    </div>
                    {activeTemplate === tpl.title && (
                      <span className="w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold animate-scale-check flex-shrink-0 ml-2 shadow-sm shadow-blue-500/30">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Dropdown Jenjang Sekolah */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="jenjang" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Jenjang Sekolah *
                  </label>
                  <select
                    id="jenjang"
                    className="input-premium w-full px-3.5 py-2.5 text-sm text-ink cursor-pointer min-h-[44px]"
                    {...register('jenjang')}
                  >
                    {jenjangOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {/* 2. Dropdown Kelas (Cascade) */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="kelas" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Kelas *
                  </label>
                  <select
                    id="kelas"
                    className="input-premium w-full px-3.5 py-2.5 text-sm text-ink cursor-pointer min-h-[44px]"
                    {...register('kelas')}
                  >
                    {(kelasOptions[selectedJenjang] || []).map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3. Dropdown Mata Pelajaran (Cascade) */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="mapel" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Mata Pelajaran *
                </label>
                <select
                  id="mapel"
                  className="input-premium w-full px-3.5 py-2.5 text-sm text-ink cursor-pointer min-h-[44px]"
                  {...register('mapel')}
                >
                  {(mapelOptions[selectedJenjang] || []).map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* 4. Input Topik / Materi Pokok */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="topik" className="text-xs font-bold text-slate-700 uppercase tracking-wide flex justify-between items-center">
                  <span>Materi Pokok / Topik Evaluasi *</span>
                  <button
                    type="button"
                    onClick={startSpeechRecognition}
                    className={`relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition-all duration-200 active:scale-95 ${
                      isListening
                        ? 'bg-red-500 text-white shadow-sm'
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
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
                  placeholder="Misal: Aljabar Linear, Pencernaan Manusia, Newton"
                  className={`input-premium w-full px-4 py-2.5 text-sm text-slate-900 min-h-[44px] ${
                    errors.topik ? 'error' : ''
                  }`}
                  {...register('topik')}
                />
                {errors.topik && (
                  <p className="flex items-center gap-1 mt-1 text-xs text-error animate-fade-in">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.topik.message}
                  </p>
                )}
              </div>

              {/* 5. Jumlah PG (Number Input / Slider) */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="jumlahPG" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Jumlah Butir Soal PG *
                  </label>
                  <span className="text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">{watchJumlahPG} Butir</span>
                </div>
                <input
                  id="jumlahPG"
                  type="range"
                  min="1"
                  max="40"
                  step="1"
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
                  {...register('jumlahPG', { valueAsNumber: true })}
                />
                <div className="flex justify-between text-[9px] text-muted font-bold mt-1.5 tracking-wider">
                  <span>1 SOAL</span>
                  <span>40 SOAL</span>
                </div>
              </div>

              {/* 6. Jumlah Essay (Number Input / Slider) */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="jumlahEssay" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Jumlah Butir Soal Esai *
                  </label>
                  <span className="text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">{watchJumlahEssay} Uraian</span>
                </div>
                <input
                  id="jumlahEssay"
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
                  {...register('jumlahEssay', { valueAsNumber: true })}
                />
                <div className="flex justify-between text-[9px] text-muted font-bold mt-1.5 tracking-wider">
                  <span>0 SOAL (NO ESSAY)</span>
                  <span>10 SOAL</span>
                </div>
              </div>

              {/* 7. Dropdown Tingkat Kesulitan */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="tingkatKesulitan" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Tingkat Kesulitan & Evaluasi Bloom *
                </label>
                <select
                  id="tingkatKesulitan"
                  className="input-premium w-full px-3.5 py-2.5 text-sm text-ink cursor-pointer min-h-[44px]"
                  {...register('tingkatKesulitan')}
                >
                  {kesulitanOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Tombol Generate */}
              <button
                type="submit"
                className="btn-primary w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-white font-bold text-sm rounded-xl min-h-[48px] shadow-lg shadow-blue-500/10 hover:shadow-xl mt-4"
              >
                <Sparkles className="w-4.5 h-4.5" />
                <span>Generate Soal Ujian Cerdas</span>
              </button>

            </form>
          </div>

          {/* Sisi Kanan: Live Preview & Panduan (Sticky Desktop) */}
          <div className="hidden lg:flex flex-col gap-6 lg:sticky lg:top-20">
            {/* A4 Paper Live Preview */}
            <div className="glass-card rounded-2xl border border-white/50 shadow-premium overflow-hidden transition-all duration-300 hover:shadow-card-hover text-left flex flex-col">
              {/* Header of paper preview */}
              <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/5 px-5 py-3.5 border-b border-rule/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Live Draft Preview</span>
                </div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                  UKURAN A4
                </span>
              </div>
              
              {/* A4 Paper Sheet Body */}
              <div className="p-8 bg-white min-h-[480px] flex flex-col justify-between relative shadow-inner text-slate-800 font-sans text-xs border-b border-rule/30">
                <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
                
                {/* Exam Header */}
                <div className="text-center space-y-1.5 border-b-2 border-slate-900 pb-3.5 relative">
                  <h4 className="font-extrabold text-[12px] tracking-wide text-slate-900 uppercase leading-snug">
                    PENILAIAN AKHIR SEMESTER / ULANGAN HARIAN
                  </h4>
                  <h5 className="font-bold text-[10px] text-slate-700 tracking-wider">
                    TAHUN PELAJARAN 2026/2027
                  </h5>
                  <div className="absolute bottom-0.5 left-0 right-0 h-[1px] bg-slate-900" />
                </div>

                {/* Metadata Grid */}
                <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1.5 border-b border-slate-200 pb-3 text-[10px]">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Mata Pelajaran:</span>
                      <span className="font-bold text-slate-800 truncate max-w-[120px]">{watchMapel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Kelas:</span>
                      <span className="font-bold text-slate-800">{watchKelas} ({selectedJenjang})</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Kesulitan:</span>
                      <span className="font-bold text-emerald-600">{watchTingkatKesulitan}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Topik/Materi:</span>
                      <span className="font-bold text-blue-600 truncate max-w-[120px]">{watchTopik || '(Belum diisi)'}</span>
                    </div>
                  </div>
                </div>

                {/* Core Questions Preview */}
                <div className="mt-4 flex-grow space-y-4 text-[10px] leading-relaxed text-slate-700">
                  {/* Pilihan Ganda */}
                  <div className="space-y-2.5">
                    <p className="font-bold text-[10.5px]">I. Pilihlah salah satu jawaban yang paling tepat!</p>
                    {watchJumlahPG > 0 ? (
                      Array.from({ length: Math.min(watchJumlahPG, 2) }).map((_, idx) => (
                        <div key={idx} className="pl-2 space-y-1">
                          <p className="font-medium">{idx + 1}. Bagaimana pengaplikasian konsep <span className="font-bold text-slate-900">{watchTopik || 'materi ini'}</span> yang paling efektif menurut standar Kemendikbud?</p>
                          <div className="pl-3.5 grid grid-cols-2 gap-1 text-[9px] text-slate-500">
                            <span>A. Jawaban teoretis kesatu</span>
                            <span>B. Jawaban teoretis kedua</span>
                            <span>C. Jawaban teoretis ketiga</span>
                            <span>D. Jawaban teoretis keempat</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 italic">Jumlah PG diatur ke 0...</p>
                    )}
                    {watchJumlahPG > 2 && (
                      <p className="text-[9px] text-blue-600 font-bold pl-2 italic animate-pulse">
                        + {watchJumlahPG - 2} soal pilihan ganda lainnya sedang disusun...
                      </p>
                    )}
                  </div>

                  {/* Essay */}
                  <div className="space-y-2.5 pt-2.5 border-t border-slate-100">
                    <p className="font-bold text-[10.5px]">II. Jawablah pertanyaan di bawah ini dengan uraian yang jelas!</p>
                    {watchJumlahEssay > 0 ? (
                      Array.from({ length: Math.min(watchJumlahEssay, 1) }).map((_, idx) => (
                        <div key={idx} className="pl-2 space-y-1">
                          <p className="font-medium">{idx + 1}. Jelaskan secara rinci dan berikan contoh konkret penerapan <span className="font-bold text-slate-900">{watchTopik || 'materi ini'}</span>!</p>
                          <div className="h-6 border-b border-dashed border-slate-200 w-11/12 mt-1" />
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 italic">Jumlah Esai diatur ke 0...</p>
                    )}
                    {watchJumlahEssay > 1 && (
                      <p className="text-[9px] text-blue-600 font-bold pl-2 italic animate-pulse">
                        + {watchJumlahEssay - 1} soal esai lainnya sedang disusun...
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Signature */}
                <div className="mt-5 border-t border-slate-100 pt-3 flex justify-between items-center text-[9px] text-slate-400">
                  <div className="h-4 bg-slate-50 w-24 rounded" />
                  <div className="h-4 bg-slate-50 w-32 rounded text-right" />
                </div>
              </div>
            </div>

            {/* Box 1: Panduan Evaluasi Kognitif */}
            <div className="glass-card border border-white/50 rounded-2xl p-5 space-y-4 shadow-sm text-left hover-card-premium">
              <div className="flex items-center gap-2.5 text-blue-600">
                <HelpCircle className="w-5 h-5 animate-pulse" />
                <h3 className="font-bold text-base text-ink">Panduan Evaluasi Kognitif</h3>
              </div>
              
              <div className="space-y-3.5 text-sm leading-relaxed text-muted">
                <p>
                  Penyusunan evaluasi pembelajaran di Kurikulum Merdeka menganjurkan asesmen yang merefleksikan kecakapan literasi, numerasi, dan **High-Order Thinking Skills (HOTS)**.
                </p>
                
                <div className="border-l-2 border-green-500 pl-3 space-y-2 mt-2 bg-green-50/50 p-2.5 rounded-r-xl">
                  <span className="font-bold text-green-950 text-xs block">Aturan Standar Soal GuruBantu AI:</span>
                  <p className="text-xs text-green-800 leading-relaxed">
                    1. **Opsi Pilihan Ganda:** Wajib menyajikan 5 alternatif pilihan (A-E) untuk SMP & SMA guna membatasi faktor tebakan acak.<br />
                    2. **Lembar Kunci Terpisah:** Kunci jawaban dicetak eksklusif di halaman paling akhir dengan page break otomatis.<br />
                    3. **Rubrik Esai:** Menyajikan parameter penentuan skor terformat untuk memudahkan koreksi.
                  </p>
                </div>
              </div>
            </div>

            {/* Box 2: Info Kuota */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-start gap-3.5 shadow-inner text-left">
              <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-xs text-ink">Keandalan Transaksional</h4>
                <p className="text-[11px] text-muted leading-relaxed">
                  Batas kuota bulanan Anda hanya akan terpotong setelah file bank soal Word berhasil dikompilasi dan disimpan di penyimpanan cloud kami. Transaksi Anda 100% aman dari hang/timeout.
                </p>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
};
