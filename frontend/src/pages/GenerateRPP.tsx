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
  Loader2 
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

      {/* Detail Judul */}
      <div className="space-y-1">
        <h2 className="font-display text-3xl font-black text-ink tracking-tight leading-tight">
          Form Pembuat RPP Otomatis
        </h2>
        <p className="text-sm text-muted">
          Isi detail informasi di bawah ini untuk membuat Rencana Pelaksanaan Pembelajaran Kurikulum Merdeka instan.
        </p>
      </div>

      {/* Error Server */}
      {serverError && (
        <div className="p-4 bg-error-bg border border-brand-red rounded-lg flex items-start gap-2.5 text-brand-red">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-sm font-semibold">{serverError}</div>
        </div>
      )}

      {/* Layar Loading/Generasi Progress (Overlay) */}
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
            <p className="text-xs text-muted">Mesin AI kami sedang memproses data materi Anda secara atomik. Mohon tunggu ~30 detik.</p>
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

      {/* Formulir Utama (Hanya muncul jika tidak sedang loading) */}
      {!isGenerating && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* Sisi Kiri: Formulir Input (50% Desktop) */}
          <div className="bg-white border border-rule rounded-xl p-5 sm:p-6 shadow-sm">
            {/* RPP Instan Templates - Beginner Friendly */}
            <div className="space-y-2.5 mb-6 border-b border-rule pb-5">
              <span className="text-xs text-brand-mid font-bold uppercase tracking-wider block">✨ RPP Instan (Pilih Template Pengisian Cepat)</span>
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
                        setValue('alokasiWaktu', tpl.alokasiWaktu);
                        setValue('modelPembelajaran', tpl.modelPembelajaran);
                        setValue('asesmen', tpl.asesmen);
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

              {/* 4. Input Topik / Materi Utama */}
              <div className="flex flex-col gap-1">
                <label htmlFor="topik" className="text-sm font-medium text-ink">
                  Materi Pokok / Topik RPP *
                </label>
                <input
                  id="topik"
                  type="text"
                  placeholder="Misal: Persamaan Linear, Siklus Air, Fotosintesis"
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

              {/* 5. Dropdown Alokasi Waktu (Cascade) */}
              <div className="flex flex-col gap-1">
                <label htmlFor="alokasiWaktu" className="text-sm font-medium text-ink">
                  Alokasi Waktu *
                </label>
                <select
                  id="alokasiWaktu"
                  className="w-full px-3 py-2.5 text-base text-ink bg-white border border-rule rounded-lg focus:outline-none focus:border-brand-mid focus:ring-2 focus:ring-brand-mid/20 cursor-pointer min-h-[44px]"
                  {...register('alokasiWaktu')}
                >
                  {(alokasiWaktuOptions[selectedJenjang] || []).map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* 6. Dropdown Model Pembelajaran */}
              <div className="flex flex-col gap-1">
                <label htmlFor="modelPembelajaran" className="text-sm font-medium text-ink">
                  Model Pembelajaran *
                </label>
                <select
                  id="modelPembelajaran"
                  className="w-full px-3 py-2.5 text-base text-ink bg-white border border-rule rounded-lg focus:outline-none focus:border-brand-mid focus:ring-2 focus:ring-brand-mid/20 cursor-pointer min-h-[44px]"
                  {...register('modelPembelajaran')}
                >
                  {modelPembelajaranOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* 7. Multi-select Asesmen */}
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-ink">Jenis Asesmen *</span>
                <div className="space-y-2 pt-1">
                  {asesmenOptions.map((opt) => {
                    const currentValues = watch('asesmen') || [];
                    const isChecked = currentValues.includes(opt.id);
                    return (
                      <label key={opt.id} className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-brand-mid border-rule rounded cursor-pointer"
                          checked={isChecked}
                          onChange={(e) => handleCheckboxChange(opt.id, e.target.checked)}
                        />
                        <span className="text-sm text-ink">{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
                {errors.asesmen && (
                  <p className="flex items-center gap-1 mt-1 text-xs text-brand-red">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.asesmen.message}
                  </p>
                )}
              </div>

              {/* Tombol Generate */}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#C84B2F] text-white font-semibold text-sm rounded-lg min-h-[44px] shadow-brand-red transition-all duration-150 hover:bg-[#a83d25] hover:shadow-md active:scale-95 text-center mt-4"
              >
                <Sparkles className="w-4.5 h-4.5" />
                <span>Generate RPP Kurikulum Merdeka</span>
              </button>

            </form>
          </div>

          {/* Sisi Kanan: Panel Edukasi & Suggestion (50% Desktop, Sticky) */}
          <div className="hidden lg:block lg:sticky lg:top-20 space-y-6">
            
            {/* Box 1: Tips Kurikulum Merdeka */}
            <div className="bg-white border border-rule rounded-xl p-5 sm:p-6 space-y-4 shadow-sm text-left">
              <div className="flex items-center gap-2.5 text-brand-dark">
                <Info className="w-5 h-5" />
                <h3 className="font-bold text-base">Panduan Kurikulum Merdeka</h3>
              </div>
              
              <div className="space-y-3.5 text-sm leading-relaxed text-muted">
                <p>
                  Penyusunan RPP di **Kurikulum Merdeka** (sering disebut *Modul Ajar*) memiliki prinsip menyederhanakan administrasi guru agar berfokus penuh pada esensi siswa.
                </p>
                
                <div className="border-l-2 border-brand-red pl-3 space-y-2 mt-2">
                  <span className="font-bold text-ink text-xs block">3 Komponen Inti RPP Sederhana:</span>
                  <p className="text-xs">
                    1. **Tujuan Pembelajaran (TP):** Wajib merefleksikan kompetensi konkret siswa.<br />
                    2. **Langkah Kegiatan:** Wajib berpusat pada siswa (student-centered).<br />
                    3. **Asesmen:** Asesmen formatif berjalan selama pembelajaran untuk refleksi berkala.
                  </p>
                </div>
              </div>
            </div>

            {/* Box 2: Info Batas Kuota */}
            <div className="bg-[#FAF7F2] border border-[#C8BFB0] rounded-xl p-5 flex items-start gap-3.5 shadow-sm text-left">
              <Sparkles className="w-6 h-6 text-brand-red flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-ink">Keandalan Transaksional</h4>
                <p className="text-xs text-muted leading-relaxed">
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
