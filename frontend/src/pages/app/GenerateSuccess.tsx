import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Download, 
  FileText, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  ArrowLeft, 
  Clock, 
  BookOpen,
  FileQuestion,
  Info
} from 'lucide-react';

export const GenerateSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as {
    document?: {
      id: number;
      type: 'rpp' | 'soal';
      title: string;
      gcsPath: string;
      createdAt: string;
    };
    signedUrl?: string;
    type?: 'rpp' | 'soal';
    params?: any;
  } | null;

  // Jika state kosong (misal karena refresh manual), redirect ke dashboard
  React.useEffect(() => {
    if (!state || !state.document) {
      navigate('/dashboard');
    }
  }, [state, navigate]);

  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);

  if (!state || !state.document) {
    return null;
  }

  const { document, signedUrl, type, params } = state;

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const formattedDate = new Date(document.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-page text-white">
      {/* Back Button */}
      <div className="flex items-center gap-3">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-brand-red transition-colors bg-white/5 hover:bg-white/10 border border-white/5 px-3 py-1.5 rounded-xl shadow-sm backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>Kembali ke Dashboard</span>
        </Link>
      </div>

      {/* Success Card Header */}
      <div className="glass-card border border-white/5 rounded-2xl p-6 sm:p-8 shadow-premium text-center relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-mid/5 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-glow-green/20 shadow-sm border border-emerald-500/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2 max-w-lg mx-auto">
          <h2 className="font-display text-3xl font-black text-white tracking-tight leading-tight">
            Dokumen Berhasil Digenerate!
          </h2>
          <p className="text-sm text-slate-400">
            Asisten AI GuruBantu telah sukses menyusun berkas Word berstandar nasional secara transaksional dan aman.
          </p>
        </div>
      </div>

      {/* File Action Card */}
      <div className="glass-card border border-white/5 rounded-2xl p-5 sm:p-6 shadow-premium flex flex-col md:flex-row items-start md:items-center justify-between gap-5 text-left">
        <div className="flex items-start gap-4">
          <div className={`p-3.5 rounded-xl flex-shrink-0 ${type === 'rpp' ? 'bg-brand-red/10 text-brand-red border border-brand-red/20' : 'bg-brand-mid/10 text-brand-mid border border-brand-mid/20'}`}>
            {type === 'rpp' ? (
              <FileText className="w-7 h-7" />
            ) : (
              <FileQuestion className="w-7 h-7" />
            )}
          </div>
          <div className="space-y-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-brand-red/10 text-brand-red border border-brand-red/20 uppercase tracking-wide">
              {type === 'rpp' ? 'RPP Kurikulum Merdeka' : 'Bank Soal Cerdas'}
            </span>
            <h3 className="text-lg font-bold text-white leading-snug">{document.title}</h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Dibuat pada {formattedDate}
              </span>
              <span>•</span>
              <span>Format: Word (.docx)</span>
            </div>
          </div>
        </div>

        {signedUrl && (
          <a
            href={signedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-brand-red to-brand-mid text-slate-950 font-bold text-sm rounded-xl min-h-[44px] shadow-lg hover:shadow-xl transition-all duration-150 active:scale-95 text-center"
          >
            <Download className="w-4.5 h-4.5" />
            <span>Unduh Berkas Word</span>
          </a>
        )}
      </div>

      {/* Accordion Preview (Visual Blueprint) */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 text-left">
          <Sparkles className="w-5 h-5 text-brand-red animate-pulse" />
          <span>Pratinjau Struktur Dokumen</span>
        </h3>

        <div className="glass-card border border-white/5 rounded-2xl overflow-hidden shadow-premium divide-y divide-white/5">
          {type === 'rpp' ? (
            <>
              {/* Accordion 1: Identitas Administrasi */}
              <div className="flex flex-col">
                <button
                  onClick={() => toggleAccordion(0)}
                  className="w-full px-5 py-4 flex items-center justify-between font-bold text-sm text-white hover:bg-white/5 transition-colors min-h-[44px]"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4.5 h-4.5 text-brand-mid" />
                    1. Detail Identitas Administrasi
                  </span>
                  {activeAccordion === 0 ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </button>
                {activeAccordion === 0 && (
                  <div className="px-5 pb-5 pt-2 text-sm text-slate-400 bg-white/[0.01] space-y-3 leading-relaxed border-t border-white/5 text-left">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="font-bold text-white block text-xs">Mata Pelajaran:</span>
                        <span>{params?.mapel || 'Matematika'}</span>
                      </div>
                      <div>
                        <span className="font-bold text-white block text-xs">Kelas & Jenjang:</span>
                        <span>{params?.kelas || 'Kelas I'} - {params?.jenjang || 'SD'}</span>
                      </div>
                      <div>
                        <span className="font-bold text-white block text-xs">Materi Utama / Topik:</span>
                        <span className="font-semibold text-slate-200">{params?.topik || 'Materi'}</span>
                      </div>
                      <div>
                        <span className="font-bold text-white block text-xs">Alokasi Waktu:</span>
                        <span>{params?.alokasiWaktu || '2 JP'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 2: Rencana Kegiatan */}
              <div className="flex flex-col">
                <button
                  onClick={() => toggleAccordion(1)}
                  className="w-full px-5 py-4 flex items-center justify-between font-bold text-sm text-white hover:bg-white/5 transition-colors min-h-[44px]"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4.5 h-4.5 text-brand-mid" />
                    2. Rencana Kegiatan & Metodologi
                  </span>
                  {activeAccordion === 1 ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </button>
                {activeAccordion === 1 && (
                  <div className="px-5 pb-5 pt-2 text-sm text-slate-400 bg-white/[0.01] space-y-4 leading-relaxed border-t border-white/5 text-left">
                    <div>
                      <span className="font-bold text-white block text-xs">Model Pembelajaran:</span>
                      <span className="px-2.5 py-1 rounded bg-brand-mid/10 text-brand-mid text-xs font-semibold inline-block mt-1 border border-brand-mid/20">
                        {params?.modelPembelajaran || 'Problem Based Learning (PBL)'}
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-white block text-xs mb-1.5">Skenario Pembelajaran Berbasis Siswa:</span>
                      <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300">
                        <li><strong>Pendahuluan (Apersepsi & Motivasi):</strong> Guru mengaitkan materi secara kontekstual dengan kehidupan nyata.</li>
                        <li><strong>Kegiatan Inti (Sintaks Model):</strong> Siswa berkolaborasi aktif merumuskan solusi atas studi kasus secara mandiri.</li>
                        <li><strong>Penutup (Refleksi & Evaluasi):</strong> Guru memfasilitasi kesimpulan dan membagikan umpan balik konstruktif.</li>
                      </ol>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 3: Kriteria Penilaian */}
              <div className="flex flex-col">
                <button
                  onClick={() => toggleAccordion(2)}
                  className="w-full px-5 py-4 flex items-center justify-between font-bold text-sm text-white hover:bg-white/5 transition-colors min-h-[44px]"
                >
                  <span className="flex items-center gap-2">
                    <Info className="w-4.5 h-4.5 text-brand-mid" />
                    3. Kriteria Penilaian & Asesmen
                  </span>
                  {activeAccordion === 2 ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </button>
                {activeAccordion === 2 && (
                  <div className="px-5 pb-5 pt-2 text-sm text-slate-400 bg-white/[0.01] space-y-3 leading-relaxed border-t border-white/5 text-left">
                    <div>
                      <span className="font-bold text-white block text-xs mb-1">Jenis Asesmen yang Diterapkan:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {(params?.asesmen || ['Pengetahuan']).map((ase: string) => (
                          <span key={ase} className="px-2 py-0.5 bg-[#00f2ff]/10 text-brand-red text-[11px] font-bold rounded border border-brand-red/20">
                            Asesmen {ase}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-350">
                      Dokumen Word ini menyematkan rubrik instrumen penilaian afektif (sikap), lembar penugasan kognitif, dan kriteria psikomotorik lengkap dengan bobot nilai kelulusan.
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Accordion 1: Identitas Evaluasi */}
              <div className="flex flex-col">
                <button
                  onClick={() => toggleAccordion(0)}
                  className="w-full px-5 py-4 flex items-center justify-between font-bold text-sm text-white hover:bg-white/5 transition-colors min-h-[44px]"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4.5 h-4.5 text-brand-mid" />
                    1. Identitas Evaluasi & Kisi-Kisi
                  </span>
                  {activeAccordion === 0 ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </button>
                {activeAccordion === 0 && (
                  <div className="px-5 pb-5 pt-2 text-sm text-slate-400 bg-white/[0.01] space-y-3 leading-relaxed border-t border-white/5 text-left">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="font-bold text-white block text-xs">Mata Pelajaran:</span>
                        <span>{params?.mapel || 'Matematika'}</span>
                      </div>
                      <div>
                        <span className="font-bold text-white block text-xs">Kelas & Jenjang:</span>
                        <span>{params?.kelas || 'Kelas I'} - {params?.jenjang || 'SD'}</span>
                      </div>
                      <div>
                        <span className="font-bold text-white block text-xs">Materi Utama / Topik:</span>
                        <span className="font-semibold text-slate-200">{params?.topik || 'Materi'}</span>
                      </div>
                      <div>
                        <span className="font-bold text-white block text-xs">Tingkat Kesulitan:</span>
                        <span className="font-semibold text-brand-red">{params?.tingkatKesulitan || 'Sedang'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 2: Butir Soal */}
              <div className="flex flex-col">
                <button
                  onClick={() => toggleAccordion(1)}
                  className="w-full px-5 py-4 flex items-center justify-between font-bold text-sm text-white hover:bg-white/5 transition-colors min-h-[44px]"
                >
                  <span className="flex items-center gap-2">
                    <FileQuestion className="w-4.5 h-4.5 text-brand-mid" />
                    2. Butir Soal & Pilihan Jawaban
                  </span>
                  {activeAccordion === 1 ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </button>
                {activeAccordion === 1 && (
                  <div className="px-5 pb-5 pt-2 text-sm text-slate-400 bg-white/[0.01] space-y-3 leading-relaxed border-t border-white/5 text-left">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 glass-card border border-white/5 bg-white/[0.01] rounded-lg">
                        <span className="font-bold text-white block">Pilihan Ganda (A-E):</span>
                        <span className="text-lg font-black text-brand-red">{params?.jumlahPG || 5} Butir Soal</span>
                        <p className="text-[10px] text-slate-400 mt-1">Dirancang khusus dengan stimulus kontekstual guna membatasi jawaban tebakan.</p>
                      </div>
                      <div className="p-3 glass-card border border-white/5 bg-white/[0.01] rounded-lg">
                        <span className="font-bold text-white block">Esai Kontekstual:</span>
                        <span className="text-lg font-black text-brand-red">{params?.jumlahEssay || 2} Butir Soal</span>
                        <p className="text-[10px] text-slate-400 mt-1">Dirancang berbasis High-Order Thinking Skills (HOTS) pemahaman mendalam.</p>
                      </div>
                    </div>
                    <div className="p-3 glass-card border border-white/5 bg-[#131318]/45 rounded-lg text-xs text-slate-300">
                      <strong>Fitur Halaman Akhir Terpisah:</strong> Kunci jawaban lengkap beserta pilihan jawaban yang benar ditempatkan pada halaman khusus paling akhir (setelah Page Break otomatis).
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 3: Kriteria Koreksi */}
              <div className="flex flex-col">
                <button
                  onClick={() => toggleAccordion(2)}
                  className="w-full px-5 py-4 flex items-center justify-between font-bold text-sm text-white hover:bg-white/5 transition-colors min-h-[44px]"
                >
                  <span className="flex items-center gap-2">
                    <Info className="w-4.5 h-4.5 text-brand-mid" />
                    3. Kriteria Koreksi & Rubrik Esai
                  </span>
                  {activeAccordion === 2 ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </button>
                {activeAccordion === 2 && (
                  <div className="px-5 pb-5 pt-2 text-sm text-slate-400 bg-white/[0.01] space-y-2 leading-relaxed border-t border-white/5 text-xs text-left">
                    <p>
                      Dokumen Word menyertakan pedoman penilaian mendalam:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      <li>Pedoman skor instan per nomor untuk butir Pilihan Ganda.</li>
                      <li>Rubrik analisis esai multiparameter (ide/gagasan, kebahasaan, ketepatan analisis).</li>
                      <li>Rumus perhitungan nilai akhir (Skor Perolehan / Skor Maksimum * 100).</li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Link 
          to="/dashboard" 
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 border border-white/5 text-slate-350 font-semibold text-sm bg-white/5 rounded-xl min-h-[44px] hover:bg-white/10 hover:text-white transition-all text-center"
        >
          <span>Kembali ke Dashboard</span>
        </Link>
        
        <Link 
          to={type === 'rpp' ? '/rpp' : '/soal'} 
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 bg-brand-navy text-white font-semibold text-sm rounded-xl min-h-[44px] hover:bg-brand-mid transition-all text-center"
        >
          <span>Buat Dokumen Baru</span>
        </Link>

        <Link 
          to="/riwayat" 
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 bg-white/5 border border-white/5 text-slate-350 font-semibold text-sm rounded-xl min-h-[44px] hover:bg-white/10 hover:text-white transition-all text-center"
        >
          <span>Lihat Semua Riwayat</span>
        </Link>
      </div>
    </div>
  );
};
