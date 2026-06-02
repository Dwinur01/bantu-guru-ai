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
  HelpCircle 
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
    <div className="space-y-6">
      {/* Tombol Kembali */}
      <div className="flex items-center gap-3">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-1 text-sm font-bold text-brand-mid hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard</span>
        </Link>
      </div>

      {/* Judul Halaman */}
      <div className="space-y-1">
        <h2 className="font-display text-3xl font-black text-ink tracking-tight leading-tight">
          Pembuat Soal Ujian Cerdas
        </h2>
        <p className="text-sm text-muted">
          Rancang materi evaluasi, butir Pilihan Ganda, esai kontekstual, dan pedoman rubrik penilaian secara instan.
        </p>
      </div>

      {/* Error Server */}
      {serverError && (
        <div className="p-4 bg-error-bg border border-brand-red rounded-lg flex items-start gap-2.5 text-brand-red">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-sm font-semibold">{serverError}</div>
        </div>
      )}

      {/* Layar Loading/Generasi Progress */}
      {isGenerating && (
        <div className="bg-white border border-rule rounded-xl p-6 sm:p-10 text-center shadow-md space-y-6 animate-in fade-in duration-200">
          <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-brand-red animate-spin" />
            <Sparkles className="w-5 h-5 text-brand-mid absolute animate-bounce" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-ink transition-all">
              {loadingTexts[currentTextIndex]}
            </h3>
            <p className="text-xs text-muted">Asisten cerdas kami sedang menyusun lembar soal dan halaman kunci jawaban di lembar terpisah.</p>
          </div>

          {/* Progress Bar Visual */}
          <div className="max-w-md mx-auto space-y-2">
            <div className="w-full h-2 bg-[#F2F2F2] rounded-full overflow-hidden border border-rule/10">
              <div 
                className="h-full bg-brand-red rounded-full transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-[10px] text-muted">
              <span>EST. WAKTU: 30 DETIK</span>
              <span className="font-bold">{loadingProgress}% SELESAI</span>
            </div>
          </div>
        </div>
      )}

      {/* Formulir Utama */}
      {!isGenerating && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* Sisi Kiri: Formulir Input (50% Desktop) */}
          <div className="bg-white border border-rule rounded-xl p-5 sm:p-6 shadow-sm">
            {/* Soal Instan Templates - Beginner Friendly */}
            <div className="space-y-2.5 mb-6 border-b border-rule pb-5">
              <span className="text-xs text-brand-mid font-bold uppercase tracking-wider block">✨ Soal Instan (Pilih Template Pengisian Cepat)</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {popularTemplates.map((tpl) => (
                  <button
                    key={tpl.title}
                    type="button"
                    onClick={() => {
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
                    className="px-3 py-2.5 border border-brand-mid/10 hover:border-brand-mid/40 bg-brand-light/10 hover:bg-brand-light/30 rounded-lg text-left transition-all duration-150 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-brand-mid/20 w-full"
                  >
                    <span className="font-bold text-xs text-ink block group-hover:text-brand-mid">{tpl.title}</span>
                    <span className="text-[9px] text-muted block mt-0.5">{tpl.mapel} · {tpl.kelas}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Dropdown Jenjang Sekolah */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="jenjang" className="text-sm font-medium text-ink">
                    Jenjang Sekolah *
                  </label>
                  <select
                    id="jenjang"
                    className="w-full px-3 py-2.5 text-base text-ink bg-white border border-rule rounded-lg focus:outline-none focus:border-brand-mid focus:ring-2 focus:ring-brand-mid/20 cursor-pointer min-h-[44px]"
                    {...register('jenjang')}
                  >
                    {jenjangOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {/* 2. Dropdown Kelas (Cascade) */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="kelas" className="text-sm font-medium text-ink">
                    Kelas *
                  </label>
                  <select
                    id="kelas"
                    className="w-full px-3 py-2.5 text-base text-ink bg-white border border-rule rounded-lg focus:outline-none focus:border-brand-mid focus:ring-2 focus:ring-brand-mid/20 cursor-pointer min-h-[44px]"
                    {...register('kelas')}
                  >
                    {(kelasOptions[selectedJenjang] || []).map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3. Dropdown Mata Pelajaran (Cascade) */}
              <div className="flex flex-col gap-1">
                <label htmlFor="mapel" className="text-sm font-medium text-ink">
                  Mata Pelajaran *
                </label>
                <select
                  id="mapel"
                  className="w-full px-3 py-2.5 text-base text-ink bg-white border border-rule rounded-lg focus:outline-none focus:border-brand-mid focus:ring-2 focus:ring-brand-mid/20 cursor-pointer min-h-[44px]"
                  {...register('mapel')}
                >
                  {(mapelOptions[selectedJenjang] || []).map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* 4. Input Topik / Materi Pokok */}
              <div className="flex flex-col gap-1">
                <label htmlFor="topik" className="text-sm font-medium text-ink">
                  Materi Pokok / Topik Evaluasi *
                </label>
                <input
                  id="topik"
                  type="text"
                  placeholder="Misal: Aljabar Linear, Pencernaan Manusia, Newton"
                  className={`w-full px-4 py-2.5 text-base text-ink bg-white border rounded-lg min-h-[44px] transition-colors duration-150 placeholder:text-muted focus:outline-none ${
                    errors.topik
                      ? 'border-brand-red bg-error-bg focus:ring-2 focus:ring-[#C84B2F]/20'
                      : 'border-rule focus:border-brand-mid focus:ring-2 focus:ring-brand-mid/20'
                  }`}
                  {...register('topik')}
                />
                {errors.topik && (
                  <p className="flex items-center gap-1 mt-1 text-xs text-brand-red">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.topik.message}
                  </p>
                )}
              </div>

              {/* 5. Jumlah PG (Number Input / Slider) */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label htmlFor="jumlahPG" className="text-sm font-medium text-ink">
                    Jumlah Butir Soal PG *
                  </label>
                  <span className="text-sm font-bold text-brand-mid">{watch('jumlahPG')} Butir</span>
                </div>
                <input
                  id="jumlahPG"
                  type="range"
                  min="1"
                  max="40"
                  step="1"
                  className="w-full h-2 bg-[#F2F2F2] rounded-lg appearance-none cursor-pointer accent-[#2E75B6]"
                  {...register('jumlahPG', { valueAsNumber: true })}
                />
                <div className="flex justify-between text-[10px] text-muted font-bold mt-1">
                  <span>1 SOAL</span>
                  <span>40 SOAL</span>
                </div>
              </div>

              {/* 6. Jumlah Essay (Number Input / Slider) */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label htmlFor="jumlahEssay" className="text-sm font-medium text-ink">
                    Jumlah Butir Soal Esai *
                  </label>
                  <span className="text-sm font-bold text-brand-mid">{watch('jumlahEssay')} Butir</span>
                </div>
                <input
                  id="jumlahEssay"
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  className="w-full h-2 bg-[#F2F2F2] rounded-lg appearance-none cursor-pointer accent-[#2E75B6]"
                  {...register('jumlahEssay', { valueAsNumber: true })}
                />
                <div className="flex justify-between text-[10px] text-muted font-bold mt-1">
                  <span>0 SOAL (NO ESSAY)</span>
                  <span>10 SOAL</span>
                </div>
              </div>

              {/* 7. Dropdown Tingkat Kesulitan */}
              <div className="flex flex-col gap-1">
                <label htmlFor="tingkatKesulitan" className="text-sm font-medium text-ink">
                  Tingkat Kesulitan & Evaluasi Bloom *
                </label>
                <select
                  id="tingkatKesulitan"
                  className="w-full px-3 py-2.5 text-base text-ink bg-white border border-rule rounded-lg focus:outline-none focus:border-brand-mid focus:ring-2 focus:ring-brand-mid/20 cursor-pointer min-h-[44px]"
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
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#C84B2F] text-white font-semibold text-sm rounded-lg min-h-[44px] shadow-brand-red transition-all duration-150 hover:bg-[#a83d25] hover:shadow-md active:scale-95 text-center mt-4"
              >
                <Sparkles className="w-4.5 h-4.5" />
                <span>Generate Soal Ujian Cerdas</span>
              </button>

            </form>
          </div>

          {/* Sisi Kanan: Panel Edukasi (50% Desktop, Sticky) */}
          <div className="hidden lg:block lg:sticky lg:top-20 space-y-6">
            
            {/* Box 1: Panduan Evaluasi Kognitif */}
            <div className="bg-white border border-rule rounded-xl p-5 sm:p-6 space-y-4 shadow-sm text-left">
              <div className="flex items-center gap-2.5 text-brand-dark">
                <HelpCircle className="w-5 h-5" />
                <h3 className="font-bold text-base">Panduan Evaluasi Kognitif</h3>
              </div>
              
              <div className="space-y-3.5 text-sm leading-relaxed text-muted">
                <p>
                  Penyusunan evaluasi pembelajaran di Kurikulum Merdeka menganjurkan asesmen yang merefleksikan kecakapan literasi, numerasi, dan **High-Order Thinking Skills (HOTS)**.
                </p>
                
                <div className="border-l-2 border-[#1A7A4A] pl-3 space-y-2 mt-2">
                  <span className="font-bold text-ink text-xs block">Aturan Standar Soal GuruBantu AI:</span>
                  <p className="text-xs">
                    1. **Opsi Pilihan Ganda:** Wajib menyajikan 5 alternatif pilihan (A-E) untuk SMP & SMA guna membatasi faktor tebakan acak.<br />
                    2. **Lembar Kunci Terpisah:** Halaman kunci jawaban dicetak eksklusif di halaman paling akhir dengan page break otomatis.<br />
                    3. **Rubrik Esai:** Wajib menyajikan parameter penentuan skor terformat untuk memudahkan koreksi subjektif Guru.
                  </p>
                </div>
              </div>
            </div>

            {/* Box 2: Info Kuota */}
            <div className="bg-[#FAF7F2] border border-[#C8BFB0] rounded-xl p-5 flex items-start gap-3.5 shadow-sm text-left">
              <Sparkles className="w-6 h-6 text-brand-red flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-ink">Keandalan Transaksional</h4>
                <p className="text-xs text-muted leading-relaxed">
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
