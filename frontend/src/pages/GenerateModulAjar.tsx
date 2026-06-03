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
import { api } from '../services/api';

// 1. Zod Validation Schema
const modulAjarSchema = z.object({
  jenjang: z.string().min(1, 'Pilih jenjang sekolah'),
  kelas: z.string().min(1, 'Pilih kelas'),
  mapel: z.string().min(1, 'Pilih mata pelajaran'),
  topik: z.string().min(3, 'Topik pembelajaran minimal berisi 3 karakter'),
  alokasiWaktu: z.string().min(1, 'Pilih alokasi waktu'),
  modelPembelajaran: z.string().min(1, 'Pilih model pembelajaran'),
  profilPelajarPancasila: z.array(z.string()).min(1, 'Pilih minimal satu profil pelajar Pancasila'),
});

type ModulAjarFormValues = z.infer<typeof modulAjarSchema>;

// 2. Cascading Data Options
const jenjangOptions = ['SD', 'SMP', 'SMA'];

const mapelOptions: Record<string, string[]> = {
  SD: ['Matematika', 'Bahasa Indonesia', 'IPA', 'IPS', 'Pendidikan Pancasila', 'PJOK', 'Seni Budaya'],
  SMP: ['Matematika', 'IPA', 'IPS', 'Bahasa Indonesia', 'Bahasa Inggris', 'Pendidikan Pancasila', 'PJOK', 'Seni Budaya', 'Informatika'],
  SMA: ['Matematika', 'Bahasa Indonesia', 'Bahasa Inggris', 'Fisika', 'Kimia', 'Biologi', 'Sejarah', 'Geografi', 'Ekonomi', 'Sosiologi', 'Pendidikan Pancasila', 'PJOK', 'Seni Budaya', 'Informatika'],
};

const kelasOptions: Record<string, string[]> = {
  SD: ['Kelas I', 'Kelas II', 'Kelas III', 'Kelas IV', 'Kelas V', 'Kelas VI'],
  SMP: ['Kelas VII', 'Kelas VIII', 'Kelas IX'],
  SMA: ['Kelas X', 'Kelas XI', 'Kelas XII'],
};

const alokasiWaktuOptions: Record<string, string[]> = {
  SD: ['2 JP (2 x 35 menit)', '4 JP (4 x 35 menit)', '6 JP (6 x 35 menit)'],
  SMP: ['2 JP (2 x 40 menit)', '4 JP (4 x 40 menit)', '6 JP (6 x 40 menit)'],
  SMA: ['2 JP (2 x 45 menit)', '4 JP (4 x 45 menit)', '6 JP (6 x 45 menit)'],
};

const modelPembelajaranOptions = [
  'Problem Based Learning (PBL)',
  'Project Based Learning (PjBL)',
  'Discovery Learning',
  'Inquiry Learning',
  'Cooperative Learning',
  'Contextual Teaching & Learning (CTL)',
];

const profilPelajarPancasilaOptions = [
  { id: 'Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', label: 'Beriman & Berakhlak Mulia' },
  { id: 'Berkebhinekaan Global', label: 'Berkebhinekaan Global' },
  { id: 'Bergotong Royong', label: 'Bergotong Royong' },
  { id: 'Mandiri', label: 'Mandiri' },
  { id: 'Bernalar Kritis', label: 'Bernalar Kritis' },
  { id: 'Kreatif', label: 'Kreatif' },
];

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
          mapel: data.mapel,
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

      {/* Judul */}
      <div className="space-y-1">
        <h2 className="font-display text-3xl font-black text-ink tracking-tight leading-tight">
          Form Pembuat Modul Ajar Otomatis
        </h2>
        <p className="text-sm text-muted">
          Isi detail informasi di bawah ini untuk membuat Modul Ajar Kurikulum Merdeka lengkap dalam hitungan detik.
        </p>
      </div>

      {/* Error Server */}
      {serverError && (
        <div className="p-4 bg-error-bg border border-error rounded-xl flex items-start gap-2.5 text-error">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-sm font-semibold">{serverError}</div>
        </div>
      )}

      {/* Loading Overlay */}
      {isGenerating && (
        <div className="bg-white border border-rule rounded-xl p-6 sm:p-10 text-center shadow-md space-y-6 animate-in fade-in duration-200">
          <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-[#6A3EA1] animate-spin" />
            <BookOpen className="w-5 h-5 text-brand-mid absolute animate-bounce" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-ink transition-all">
              {loadingTexts[currentTextIndex]}
            </h3>
            <p className="text-xs text-muted">Mesin AI kami sedang memproses data materi Anda secara atomik. Mohon tunggu ~30 detik.</p>
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <div className="w-full h-2 bg-[#F2F2F2] rounded-full overflow-hidden border border-rule/10">
              <div
                className="h-full bg-[#6A3EA1] rounded-full transition-all duration-300 ease-out"
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

      {/* Form Utama */}
      {!isGenerating && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Sisi Kiri: Form Input */}
          <div className="bg-white border border-rule rounded-xl p-5 sm:p-6 shadow-sm">
            {/* Template Modul Ajar Instan */}
            <div className="space-y-2.5 mb-6 border-b border-rule pb-5">
              <span className="text-xs text-[#6A3EA1] font-bold uppercase tracking-wider block">
                📚 Modul Ajar Instan (Pilih Template Pengisian Cepat)
              </span>
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
                        setValue('profilPelajarPancasila', tpl.profilPelajarPancasila);
                      }, 50);
                    }}
                    className="px-3 py-2.5 border border-[#6A3EA1]/10 hover:border-[#6A3EA1]/40 bg-[#F0EBFF]/30 hover:bg-[#F0EBFF]/60 rounded-lg text-left transition-all duration-150 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-[#6A3EA1]/20 w-full"
                  >
                    <span className="font-bold text-xs text-ink block group-hover:text-[#6A3EA1]">{tpl.title}</span>
                    <span className="text-[9px] text-muted block mt-0.5">{tpl.mapel} · {tpl.kelas}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Jenjang */}
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

                {/* 2. Kelas (Cascade) */}
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

              {/* 3. Mata Pelajaran */}
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

              {/* 4. Topik dengan Speech-to-Text */}
              <div className="flex flex-col gap-1">
                <label htmlFor="topik" className="text-sm font-medium text-ink flex justify-between items-center">
                  <span>Topik Utama Modul Ajar *</span>
                  <button
                    type="button"
                    onClick={startSpeechRecognition}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all duration-150 active:scale-95 ${
                      isListening
                        ? 'bg-[#6A3EA1] text-white animate-pulse'
                        : 'bg-[#F0EBFF] text-[#6A3EA1] hover:bg-[#E8E0FF]'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-3.5 h-3.5 animate-spin" />
                        <span>Mendengarkan...</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5" />
                        <span>Isi Pakai Suara</span>
                      </>
                    )}
                  </button>
                </label>
                <input
                  id="topik"
                  type="text"
                  placeholder="Misal: Fotosintesis, Sistem Persamaan Linear, Siklus Air"
                  className={`w-full px-4 py-2.5 text-base text-slate-900 bg-white border rounded-xl min-h-[44px] transition-all placeholder:text-slate-400 focus:outline-none ${
                    errors.topik
                      ? 'border-error bg-[#FFF2F2] focus:ring-2 focus:ring-error/20'
                      : 'border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20'
                  }`}
                  {...register('topik')}
                />
                {errors.topik && (
                  <p className="flex items-center gap-1 mt-1 text-xs text-error">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.topik.message}
                  </p>
                )}
              </div>

              {/* 5. Alokasi Waktu */}
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

              {/* 6. Model Pembelajaran */}
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

              {/* 7. Profil Pelajar Pancasila (Multi-checkbox) */}
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-ink">Profil Pelajar Pancasila *</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {profilPelajarPancasilaOptions.map((opt) => {
                    const currentValues = watch('profilPelajarPancasila') || [];
                    const isChecked = currentValues.includes(opt.id);
                    return (
                      <label
                        key={opt.id}
                        className={`flex items-center gap-3 cursor-pointer select-none px-3 py-2.5 rounded-lg border transition-all duration-150 ${
                          isChecked
                            ? 'border-[#6A3EA1]/30 bg-[#F0EBFF]'
                            : 'border-rule hover:border-[#6A3EA1]/20 hover:bg-[#F0EBFF]/30'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-[#6A3EA1] border-rule rounded cursor-pointer accent-[#6A3EA1]"
                          checked={isChecked}
                          onChange={(e) => handleCheckboxChange(opt.id, e.target.checked)}
                        />
                        <span className="text-sm text-ink font-medium">{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
                {errors.profilPelajarPancasila && (
                  <p className="flex items-center gap-1 mt-1 text-xs text-error">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.profilPelajarPancasila.message}
                  </p>
                )}
              </div>

              {/* Tombol Generate */}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#6A3EA1] text-white font-bold text-sm rounded-xl min-h-[44px] shadow-lg shadow-purple-500/10 transition-all duration-150 hover:bg-[#5a3390] hover:shadow-xl active:scale-95 text-center mt-4"
              >
                <BookOpen className="w-4 h-4" />
                <span>Generate Modul Ajar Kurikulum Merdeka</span>
              </button>
            </form>
          </div>

          {/* Sisi Kanan: Panel Info (Sticky Desktop) */}
          <div className="hidden lg:block lg:sticky lg:top-20 space-y-6">
            {/* Box 1: Panduan Modul Ajar */}
            <div className="bg-white border border-rule rounded-xl p-5 sm:p-6 space-y-4 shadow-sm text-left">
              <div className="flex items-center gap-2.5 text-[#6A3EA1]">
                <Info className="w-5 h-5" />
                <h3 className="font-bold text-base">Panduan Modul Ajar Kurikulum Merdeka</h3>
              </div>

              <div className="space-y-3.5 text-sm leading-relaxed text-muted">
                <p>
                  Modul Ajar dalam Kurikulum Merdeka adalah pengembangan dari RPP yang lebih komprehensif.
                  Dirancang untuk memberikan fleksibilitas bagi guru dalam proses pembelajaran.
                </p>

                <div className="border-l-2 border-[#6A3EA1] pl-3 space-y-2 mt-2">
                  <span className="font-bold text-ink text-xs block">Komponen Wajib Modul Ajar:</span>
                  <p className="text-xs">
                    1. <strong>Identitas & Profil Pelajar Pancasila:</strong> Konteks dan karakter yang dikembangkan.<br />
                    2. <strong>Capaian & Tujuan Pembelajaran:</strong> Kompetensi spesifik yang akan dicapai.<br />
                    3. <strong>Pemahaman Bermakna:</strong> Relevansi materi dalam kehidupan nyata.<br />
                    4. <strong>Pertanyaan Pemantik:</strong> Mendorong rasa ingin tahu siswa.<br />
                    5. <strong>Kegiatan 3 Fase:</strong> Pendahuluan, Inti, dan Penutup terstruktur.<br />
                    6. <strong>Asesmen 3 Jenis:</strong> Diagnostik, Formatif, dan Sumatif.<br />
                    7. <strong>Remedi & Pengayaan:</strong> Dukungan diferensiasi pembelajaran.
                  </p>
                </div>
              </div>
            </div>

            {/* Box 2: Info Keandalan */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-start gap-3.5 shadow-sm text-left">
              <Sparkles className="w-6 h-6 text-[#6A3EA1] flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-ink">Keandalan Transaksional</h4>
                <p className="text-xs text-muted leading-relaxed">
                  Batas kuota bulanan Anda hanya akan terpotong setelah file Modul Ajar Word berhasil dikompilasi
                  dan disimpan di penyimpanan cloud kami. Transaksi Anda 100% aman dari hang/timeout.
                </p>
              </div>
            </div>

            {/* Box 3: Profil Pelajar Pancasila info */}
            <div className="bg-[#F0EBFF] border border-[#6A3EA1]/20 rounded-xl p-5 shadow-sm text-left">
              <h4 className="font-bold text-sm text-[#6A3EA1] mb-2">6 Dimensi Profil Pelajar Pancasila</h4>
              <div className="space-y-1.5 text-xs text-[#4A2E7A]">
                {profilPelajarPancasilaOptions.map((p) => (
                  <p key={p.id} className="flex items-start gap-1.5">
                    <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#6A3EA1] flex-shrink-0 inline-block" />
                    <span>{p.id}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
