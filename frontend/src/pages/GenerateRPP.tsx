import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowLeft, 
  AlertCircle, 
  Info, 
  Loader2,
  Mic,
  MicOff
} from 'lucide-react';
import { api } from '../services/api';

// 1. Zod Validation Schema
const rppSchema = z.object({
  jenjang: z.string().min(1, 'Pilih jenjang sekolah'),
  kelas: z.string().min(1, 'Pilih kelas'),
  mapel: z.string().min(1, 'Pilih mata pelajaran'),
  topik: z.string().min(3, 'Topik pembelajaran minimal berisi 3 karakter'),
  alokasiWaktu: z.string().min(1, 'Pilih alokasi waktu'),
  modelPembelajaran: z.string().min(1, 'Pilih model pembelajaran'),
  asesmen: z.array(z.string()).min(1, 'Pilih minimal satu jenis asesmen'),
});

type RPPFormValues = z.infer<typeof rppSchema>;

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

const alokasiWaktuOptions: Record<string, string[]> = {
  SD: ['2 JP (2 x 35 menit)', '4 JP (4 x 35 menit)', '6 JP (6 x 35 menit)'],
  SMP: ['2 JP (2 x 40 menit)', '4 JP (4 x 40 menit)', '6 JP (6 x 40 menit)'],
  SMA: ['2 JP (2 x 45 menit)', '4 JP (4 x 45 menit)', '6 JP (6 x 45 menit)']
};

const modelPembelajaranOptions = [
  'Problem Based Learning (PBL)',
  'Project Based Learning (PjBL)',
  'Discovery Learning',
  'Inquiry Learning',
  'Cooperative Learning',
  'Contextual Teaching & Learning (CTL)'
];

const asesmenOptions = [
  { id: 'Sikap', label: 'Asesmen Sikap (Afektif)' },
  { id: 'Pengetahuan', label: 'Asesmen Pengetahuan (Kognitif)' },
  { id: 'Keterampilan', label: 'Asesmen Keterampilan (Psikomotorik)' }
];

// Rotator text yang berganti setiap 4 detik untuk kenyamanan guru saat memuat AI
const loadingTexts = [
  'Menghubungi asisten AI GuruBantu...',
  'Menyusun Capaian Pembelajaran Kurikulum Merdeka...',
  'Merancang Alur Tujuan Pembelajaran (ATP) detail...',
  'Menyusun skenario kegiatan (Pendahuluan, Inti, Penutup)...',
  'Memformulasikan tabel instrumen penilaian asesmen...',
  'Menyusun tata letak dokumen Word (.docx) formal...',
  'Mengunggah berkas terkompilasi ke penyimpanan aman...',
  'Hampir selesai, menyinkronkan sisa kuota Anda...'
];

const popularTemplates = [
  {
    title: 'Penjumlahan SD',
    jenjang: 'SD',
    kelas: 'Kelas I',
    mapel: 'Matematika',
    topik: 'Penjumlahan Angka 1 sampai 10 dengan Gambar',
    alokasiWaktu: '2 JP (2 x 35 menit)',
    modelPembelajaran: 'Problem Based Learning (PBL)',
    asesmen: ['Pengetahuan', 'Sikap']
  },
  {
    title: 'Siklus Air SMP',
    jenjang: 'SMP',
    kelas: 'Kelas VII',
    mapel: 'IPA',
    topik: 'Siklus Hidrologi (Air) dan Dampaknya Bagi Kehidupan',
    alokasiWaktu: '2 JP (2 x 40 menit)',
    modelPembelajaran: 'Project Based Learning (PjBL)',
    asesmen: ['Pengetahuan', 'Keterampilan']
  },
  {
    title: 'Ekonomi SMA',
    jenjang: 'SMA',
    kelas: 'Kelas X',
    mapel: 'Ekonomi',
    topik: 'Konsep Dasar Ilmu Ekonomi dan Kebutuhan Manusia',
    alokasiWaktu: '2 JP (2 x 45 menit)',
    modelPembelajaran: 'Discovery Learning',
    asesmen: ['Pengetahuan']
  }
];

export const GenerateRPP: React.FC = () => {
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
  } = useForm<RPPFormValues>({
    resolver: zodResolver(rppSchema),
    defaultValues: {
      jenjang: 'SD',
      kelas: 'Kelas I',
      mapel: 'Matematika',
      topik: '',
      alokasiWaktu: '2 JP (2 x 35 menit)',
      modelPembelajaran: 'Problem Based Learning (PBL)',
      asesmen: ['Pengetahuan'],
    },
  });

  const selectedJenjang = watch('jenjang');
  const watchKelas = watch('kelas');
  const watchMapel = watch('mapel');
  const watchTopik = watch('topik');
  const watchAlokasiWaktu = watch('alokasiWaktu');
  const watchModelPembelajaran = watch('modelPembelajaran');
  const watchAsesmen = watch('asesmen') || [];

  // Trigger cascade update ketika Jenjang berubah
  useEffect(() => {
    if (selectedJenjang) {
      // Set default value pertama yang cocok dengan jenjang baru
      const mapels = mapelOptions[selectedJenjang];
      const kelas = kelasOptions[selectedJenjang];
      const alokasi = alokasiWaktuOptions[selectedJenjang];

      if (mapels && mapels.length > 0) setValue('mapel', mapels[0]);
      if (kelas && kelas.length > 0) setValue('kelas', kelas[0]);
      if (alokasi && alokasi.length > 0) setValue('alokasiWaktu', alokasi[0]);
    }
  }, [selectedJenjang, setValue]);

  // Rotator teks pemuatan
  useEffect(() => {
    let textInterval: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    if (isGenerating) {
      textInterval = setInterval(() => {
        setCurrentTextIndex((prev) => (prev + 1) % loadingTexts.length);
      }, 4000);

      // Simulasikan progress bar berjalan perlahan
      progressInterval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 98) {
            clearInterval(progressInterval);
            return 98;
          }
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

  const onSubmit = async (data: RPPFormValues) => {
    setIsGenerating(true);
    setServerError(null);

    try {
      // Panggil endpoint generasi dinamis Backend secara E2E
      const response = await api.post('/documents/generate', {
        type: 'rpp',
        inputData: {
          mapel: data.mapel,
          kelas: data.kelas,
          topik: data.topik,
          alokasiWaktu: data.alokasiWaktu,
          modelPembelajaran: data.modelPembelajaran,
          asesmen: data.asesmen,
        }
      });

      const result = response.data.data;
      setLoadingProgress(100);

      // Selesai, alihkan ke Halaman Hasil Generate membawa data berkas
      navigate('/generate/success', { 
        state: { 
          document: result.document, 
          signedUrl: result.signedUrl,
          type: 'rpp',
          params: data
        } 
      });
    } catch (error: any) {
      console.error('Error generating RPP:', error);
      if (error.response?.data?.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError('Server AI sibuk. Silakan coba kembali sesaat lagi.');
      }
      setIsGenerating(false);
    }
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    const currentAsesmen = watch('asesmen') || [];
    if (checked) {
      setValue('asesmen', [...currentAsesmen, id]);
    } else {
      setValue('asesmen', currentAsesmen.filter((a) => a !== id));
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

      {/* Detail Judul */}
      <div className="space-y-1">
        <h2 className="font-display text-3xl font-black text-ink tracking-tight leading-tight">
          Form Pembuat <span className="gradient-text-blue">RPP Otomatis</span>
        </h2>
        <p className="text-sm text-muted">
          Isi detail informasi di bawah ini untuk membuat Rencana Pelaksanaan Pembelajaran Kurikulum Merdeka instan.
        </p>
      </div>

      {/* Error Server */}
      {serverError && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-xl flex items-start gap-2.5 text-error animate-scale-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-sm font-semibold">{serverError}</div>
        </div>
      )}

      {/* Layar Loading/Generasi Progress (Overlay) */}
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
              Mesin AI kami sedang memproses data materi RPP Anda secara atomik. Dokumen Microsoft Word (.docx) sedang disusun secara real-time.
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

      {/* Formulir Utama (Hanya muncul jika tidak sedang loading) */}
      {!isGenerating && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Sisi Kiri: Formulir Input (50% Desktop) */}
          <div className="glass-card border border-white/50 rounded-2xl p-6 sm:p-8 shadow-premium space-y-6">
            
            {/* RPP Instan Templates - Beginner Friendly */}
            <div className="space-y-3 border-b border-rule/50 pb-5">
              <span className="text-xs text-blue-600 font-bold uppercase tracking-wider block">
                ✨ RPP Instan (Pilih Template Pengisian Cepat)
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
                        setValue('asesmen', tpl.asesmen);
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

              {/* 4. Input Topik / Materi Utama */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="topik" className="text-xs font-bold text-slate-700 uppercase tracking-wide flex justify-between items-center">
                  <span>Materi Pokok / Topik RPP *</span>
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
                  placeholder="Misal: Persamaan Linear, Siklus Air, Fotosintesis"
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

              {/* 5. Dropdown Alokasi Waktu (Cascade) */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="alokasiWaktu" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Alokasi Waktu *
                </label>
                <select
                  id="alokasiWaktu"
                  className="input-premium w-full px-3.5 py-2.5 text-sm text-ink cursor-pointer min-h-[44px]"
                  {...register('alokasiWaktu')}
                >
                  {(alokasiWaktuOptions[selectedJenjang] || []).map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* 6. Dropdown Model Pembelajaran */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="modelPembelajaran" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Model Pembelajaran *
                </label>
                <select
                  id="modelPembelajaran"
                  className="input-premium w-full px-3.5 py-2.5 text-sm text-ink cursor-pointer min-h-[44px]"
                  {...register('modelPembelajaran')}
                >
                  {modelPembelajaranOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* 7. Multi-select Asesmen */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Jenis Asesmen *</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-0.5">
                  {asesmenOptions.map((opt) => {
                    const currentValues = watch('asesmen') || [];
                    const isChecked = currentValues.includes(opt.id);
                    return (
                      <label 
                        key={opt.id} 
                        className={`flex items-center gap-2.5 cursor-pointer select-none px-3 py-2.5 rounded-xl border transition-all duration-150 text-xs font-semibold ${
                          isChecked 
                            ? 'border-blue-500 bg-blue-50/40 text-blue-700'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 border-slate-300 rounded cursor-pointer focus:ring-blue-500 accent-blue-600"
                          checked={isChecked}
                          onChange={(e) => handleCheckboxChange(opt.id, e.target.checked)}
                        />
                        <span>{opt.label.split(' ')[0]}</span>
                      </label>
                    );
                  })}
                </div>
                {errors.asesmen && (
                  <p className="flex items-center gap-1 mt-1 text-xs text-error animate-fade-in">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.asesmen.message}
                  </p>
                )}
              </div>

              {/* Tombol Generate */}
              <button
                type="submit"
                className="btn-primary w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-white font-bold text-sm rounded-xl min-h-[48px] shadow-lg shadow-blue-500/10 hover:shadow-xl mt-4"
              >
                <Sparkles className="w-4.5 h-4.5" />
                <span>Generate RPP Kurikulum Merdeka</span>
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
              <div className="p-8 bg-white min-h-[460px] flex flex-col justify-between relative shadow-inner text-slate-800 font-sans text-xs border-b border-rule/30">
                {/* Decorative page lines/watermark */}
                <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
                
                {/* RPP Header */}
                <div className="text-center space-y-1.5 border-b-2 border-slate-900 pb-4 relative">
                  <h4 className="font-extrabold text-[13px] tracking-wide text-slate-900 uppercase">
                    RENCANA PELAKSANAAN PEMBELAJARAN (RPP)
                  </h4>
                  <h5 className="font-bold text-[11px] text-slate-700 tracking-wider">
                    KURIKULUM MERDEKA
                  </h5>
                  <div className="absolute bottom-0.5 left-0 right-0 h-[1px] bg-slate-900" />
                </div>

                {/* Metadata Grid */}
                <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 border-b border-slate-200 pb-4 text-[11px]">
                  <div className="space-y-1">
                    <div className="flex justify-between border-b border-slate-100 pb-0.5">
                      <span className="text-slate-400 font-medium">Satuan Pendidikan</span>
                      <span className="font-bold text-slate-800">{selectedJenjang || 'SD/SMP/SMA'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-0.5">
                      <span className="text-slate-400 font-medium">Kelas / Semester</span>
                      <span className="font-bold text-slate-800">{watchKelas || 'Kelas I'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-0.5">
                      <span className="text-slate-400 font-medium">Mata Pelajaran</span>
                      <span className="font-bold text-blue-600 truncate max-w-[130px]" title={watchMapel}>{watchMapel || 'Matematika'}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between border-b border-slate-100 pb-0.5">
                      <span className="text-slate-400 font-medium">Alokasi Waktu</span>
                      <span className="font-bold text-slate-800 truncate max-w-[120px]">{watchAlokasiWaktu || '2 JP'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-0.5">
                      <span className="text-slate-400 font-medium">Model Belajar</span>
                      <span className="font-bold text-slate-800 truncate max-w-[120px]">{watchModelPembelajaran || 'PBL'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-0.5">
                      <span className="text-slate-400 font-medium">Topik / Materi</span>
                      <span className="font-bold text-emerald-600 truncate max-w-[120px]" title={watchTopik}>{watchTopik || '(Belum diisi)'}</span>
                    </div>
                  </div>
                </div>

                {/* RPP Core Sections */}
                <div className="mt-4 flex-1 space-y-3.5">
                  {/* Topik / Kompetensi */}
                  <div className="space-y-1">
                    <div className="font-extrabold text-[10px] text-slate-900 tracking-wider uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      A. Tujuan Pembelajaran (TP)
                    </div>
                    <div className="pl-3.5 space-y-1 text-slate-600 leading-relaxed text-[10.5px]">
                      {watchTopik ? (
                        <p>Melalui model <span className="font-semibold">{watchModelPembelajaran}</span>, peserta didik diharapkan mampu memahami konsep <span className="font-bold text-slate-800">{watchTopik}</span> secara kritis, mandiri, dan mampu memecahkan masalah terkait secara kontekstual.</p>
                      ) : (
                        <div className="space-y-1.5 pt-1 animate-pulse">
                          <div className="h-2.5 bg-slate-100 rounded w-11/12" />
                          <div className="h-2.5 bg-slate-100 rounded w-8/12" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Langkah Kegiatan */}
                  <div className="space-y-1">
                    <div className="font-extrabold text-[10px] text-slate-900 tracking-wider uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      B. Langkah-Langkah Pembelajaran
                    </div>
                    <div className="pl-3.5 space-y-1.5 text-slate-600 text-[10.5px]">
                      <div className="flex gap-2">
                        <span className="font-bold text-slate-700">1. Pendahuluan:</span>
                        <span className="leading-relaxed">Guru melakukan orientasi, apersepsi topik <span className="font-semibold">{watchTopik || 'pembelajaran'}</span>, dan menyampaikan tujuan belajar.</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-bold text-slate-700">2. Kegiatan Inti:</span>
                        <span className="leading-relaxed">Implementasi sintaks <span className="font-semibold">{watchModelPembelajaran}</span>: peserta didik melakukan penyelidikan, diskusi kelompok, dan analisis masalah.</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-bold text-slate-700">3. Penutup:</span>
                        <span className="leading-relaxed">Refleksi bersama, penarikan kesimpulan, serta tindak lanjut hasil belajar.</span>
                      </div>
                    </div>
                  </div>

                  {/* Asesmen */}
                  <div className="space-y-1">
                    <div className="font-extrabold text-[10px] text-slate-900 tracking-wider uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      C. Metode Penilaian (Asesmen)
                    </div>
                    <div className="pl-3.5 flex flex-wrap gap-2 text-[10px] pt-1">
                      {watchAsesmen.length > 0 ? (
                        watchAsesmen.map((as: string) => (
                          <span key={as} className="px-2.5 py-0.5 bg-slate-100 rounded-full text-slate-700 font-bold border border-slate-200">
                            {as === 'Pengetahuan' ? '📝 Kognitif' : as === 'Sikap' ? '🤝 Afektif' : '⚙️ Psikomotorik'}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 italic">Pilih jenis asesmen di formulir...</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Signature Mock */}
                <div className="mt-6 border-t border-slate-100 pt-3 flex justify-between items-center text-[9px] text-slate-400">
                  <div>
                    <p>Mengetahui,</p>
                    <p className="font-bold text-slate-700 mt-6">Kepala Sekolah</p>
                  </div>
                  <div className="text-right">
                    <p>Jakarta, ____________ 2026</p>
                    <p className="font-bold text-blue-600 mt-6">Guru Mata Pelajaran</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Box 1: Panduan Kurikulum Merdeka */}
            <div className="glass-card border border-white/50 rounded-2xl p-5 space-y-4 shadow-sm text-left hover-card-premium">
              <div className="flex items-center gap-2.5 text-blue-600">
                <Info className="w-5 h-5 animate-pulse" />
                <h3 className="font-bold text-base text-ink">Panduan RPP Kurikulum Merdeka</h3>
              </div>
              
              <div className="space-y-3.5 text-sm leading-relaxed text-muted">
                <p>
                  Penyusunan RPP di **Kurikulum Merdeka** (RPP Sederhana / Modul Ajar) disederhanakan menjadi 3 komponen esensial agar Guru memiliki waktu lebih banyak untuk mengamati tumbuh kembang siswa secara kualitatif.
                </p>
                
                <div className="border-l-2 border-blue-500 pl-3 space-y-2 mt-2 bg-blue-50/50 p-2.5 rounded-r-xl">
                  <span className="font-bold text-blue-900 text-xs block">3 Komponen Utama RPP Sederhana:</span>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    1. **Tujuan Pembelajaran:** Kompetensi akhir yang dicapai.<br />
                    2. **Langkah Kegiatan:** Proses eksplorasi dan diskusi berpusat pada siswa.<br />
                    3. **Asesmen:** Penilaian otentik (Formatif) yang berjalan saat belajar.
                  </p>
                </div>
              </div>
            </div>

            {/* Box 2: Info Batas Kuota */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-start gap-3.5 shadow-inner text-left">
              <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-xs text-ink">Keandalan Transaksional</h4>
                <p className="text-[11px] text-muted leading-relaxed">
                  Batas kuota bulanan Anda hanya akan terpotong setelah file bank soal/RPP Word berhasil dikompilasi dan disimpan di penyimpanan cloud kami. Transaksi Anda 100% aman dari hang/timeout.
                </p>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
};
