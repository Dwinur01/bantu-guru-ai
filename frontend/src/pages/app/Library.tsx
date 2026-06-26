import React, { useState, useEffect, useCallback } from 'react';
import {
  BookOpen,
  Download,
  FileText,
  FileQuestion,
  BookMarked,
  Loader2,
  AlertTriangle,
  Search,
  ChevronLeft,
  ChevronRight,
  Users,
} from 'lucide-react';
import { api } from '../../services/api';

// ─── Types ───────────────────────────────────────────────────────────────────
interface LibraryDocument {
  id: number;
  type: string;
  title: string;
  authorName: string;
  sharedAt: string | null;
  gcsPath: string | null;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

type FilterType = 'all' | 'rpp' | 'soal' | 'modul_ajar';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (iso: string | null): string => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const TYPE_CONFIG: Record<
  string,
  { label: string; badgeCls: string; iconBg: string; iconColor: string; Icon: React.FC<{ className?: string }> }
> = {
  rpp: {
    label: 'RPP',
    badgeCls: 'bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/20',
    iconBg: 'bg-[#00f2ff]/10',
    iconColor: 'text-[#00f2ff]',
    Icon: FileText,
  },
  soal: {
    label: 'Soal Ujian',
    badgeCls: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-400',
    Icon: FileQuestion,
  },
  modul_ajar: {
    label: 'Modul Ajar',
    badgeCls: 'bg-[#6366f1]/10 text-[#6366f1] border border-[#6366f1]/20',
    iconBg: 'bg-[#6366f1]/10',
    iconColor: 'text-[#6366f1]',
    Icon: BookMarked,
  },
};

const getTypeConfig = (type: string) =>
  TYPE_CONFIG[type] ?? {
    label: type.toUpperCase(),
    badgeCls: 'bg-white/5 text-slate-350 border border-white/10',
    iconBg: 'bg-white/5',
    iconColor: 'text-slate-350',
    Icon: BookOpen,
  };

// ─── Skeleton Card ─────────────────────────────────────────────────────────────
const SkeletonCard: React.FC = () => (
  <div className="glass-card border border-white/5 rounded-xl p-4 shadow-premium flex flex-col gap-4 animate-pulse">
    <div className="flex items-start gap-3.5">
      <div className="w-10 h-10 bg-white/5 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-white/5 rounded w-1/4" />
        <div className="h-4 bg-white/5 rounded w-3/4" />
        <div className="h-3 bg-white/5 rounded w-1/2" />
      </div>
    </div>
    <div className="flex items-center justify-between pt-3 border-t border-white/5">
      <div className="h-3 bg-white/5 rounded w-24" />
      <div className="h-8 bg-white/5 rounded-lg w-28" />
    </div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
export const Library: React.FC = () => {
  const [documents, setDocuments] = useState<LibraryDocument[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Download state per-doc
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const fetchLibrary = useCallback(async (page: number, type: FilterType) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const params: Record<string, string | number> = { page, limit: 12 };
      if (type !== 'all') params.type = type;

      const response = await api.get('/library', { params });
      const { documents: docs, pagination: pg } = response.data.data;
      setDocuments(docs);
      setPagination(pg);
    } catch (err: any) {
      console.error('Fetch library error:', err);
      setErrorMsg(err.response?.data?.message || 'Gagal memuat perpustakaan. Silakan coba kembali.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    fetchLibrary(1, filterType);
  }, [filterType, fetchLibrary]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchLibrary(newPage, filterType);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownload = async (id: number) => {
    setDownloadingId(id);
    try {
      const response = await api.get(`/documents/${id}/download`);
      const signedUrl = response.data.data.signedUrl;
      window.open(signedUrl, '_blank');
    } catch (err: any) {
      console.error('Download error:', err);
      const msg =
        err.response?.status === 401
          ? 'Silakan masuk ke akun Anda terlebih dahulu untuk mengunduh dokumen.'
          : 'Gagal mengunduh dokumen. Silakan coba kembali.';
      alert(msg);
    } finally {
      setDownloadingId(null);
    }
  };

  const filterTabs: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'Semua' },
    { value: 'rpp', label: 'RPP' },
    { value: 'soal', label: 'Soal Ujian' },
    { value: 'modul_ajar', label: 'Modul Ajar' },
  ];

  const filteredDocs = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.authorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-page text-white">
      {/* ── Header ── */}
      <div className="space-y-1 text-left">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 bg-brand-red/10 text-brand-red rounded-lg">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="font-display text-3xl font-black text-white tracking-tight leading-tight">
            Perpustakaan Guru
          </h2>
        </div>
        <p className="text-sm text-slate-400">
          Jelajahi dan unduh dokumen yang dibagikan oleh sesama guru Indonesia. Temukan inspirasi untuk RPP, Soal Ujian, dan Modul Ajar.
        </p>
      </div>

      {/* ── Error Alert ── */}
      {errorMsg && (
        <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-xl flex items-start gap-2.5 text-red-400 animate-scale-in">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-sm font-semibold">{errorMsg}</div>
        </div>
      )}

      {/* ── Filter Bar ── */}
      <div className="glass-card border border-white/5 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-premium">
        {/* Search */}
        <div className="relative w-full md:max-w-xs text-left">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 z-10" />
          <input
            type="text"
            placeholder="Cari judul atau nama guru..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm text-white input-premium min-h-[44px]"
          />
        </div>

        {/* Type Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilterType(tab.value)}
              className={`px-4 py-2 text-xs font-bold rounded-lg border min-h-[44px] transition-all whitespace-nowrap ${
                filterType === tab.value
                  ? 'bg-brand-red text-slate-950 border-brand-red shadow-glow-blue/20'
                  : 'bg-white/5 text-slate-400 border-white/5 hover:bg-[#131318] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Count & Stats ── */}
      {!isLoading && pagination && (
        <div className="flex items-center gap-2 text-sm text-slate-450 font-medium">
          <Users className="w-4 h-4 text-slate-500" />
          <span>
            Menampilkan <span className="font-bold text-white">{filteredDocs.length}</span> dari{' '}
            <span className="font-bold text-white">{pagination.total}</span> dokumen publik
          </span>
        </div>
      )}

      {/* ── Loading Skeletons ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredDocs.length === 0 ? (
        /* ── Empty State ── */
        <div className="glass-card border border-white/5 rounded-xl p-8 sm:p-14 text-center shadow-premium flex flex-col items-center justify-center max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center mb-5 border border-brand-red/20">
            <BookOpen className="w-8 h-8" />
          </div>
          <h4 className="text-base font-bold text-white mb-2">
            {searchQuery ? 'Tidak Ada Hasil Pencarian' : 'Perpustakaan Guru Masih Kosong'}
          </h4>
          <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
            {searchQuery
              ? `Tidak ada dokumen yang cocok dengan kata kunci "${searchQuery}". Coba kata kunci lain.`
              : 'Belum ada guru yang membagikan dokumen ke perpustakaan ini. Jadilah yang pertama berbagi!'}
          </p>
        </div>
      ) : (
        /* ── Document Cards Grid ── */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocs.map((doc, index) => {
              const cfg = getTypeConfig(doc.type);
              const Icon = cfg.Icon;
              const staggerClass = `animate-stagger-${(index % 4) + 1}`;
              return (
                <div
                  key={doc.id}
                  className={`glass-card border border-white/5 rounded-xl p-4 flex flex-col justify-between gap-4 hover-card-premium ${staggerClass}`}
                >
                  {/* Card Top */}
                  <div className="flex items-start gap-3.5 text-left">
                    <div
                      className={`p-2.5 rounded-lg flex-shrink-0 ${cfg.iconBg} ${cfg.iconColor}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="space-y-1 text-left flex-1 min-w-0">
                      {/* Badge */}
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${cfg.badgeCls}`}
                      >
                        {cfg.label}
                      </span>

                      {/* Title */}
                      <h4
                        className="text-sm font-bold text-white line-clamp-2 leading-snug"
                        title={doc.title}
                      >
                        {doc.title}
                      </h4>

                      {/* Author & Date */}
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] text-slate-400 font-medium">
                          oleh <span className="text-white font-semibold">{doc.authorName}</span>
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Dibagikan: {formatDate(doc.sharedAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer – Download Button */}
                  <div className="pt-3 border-t border-white/5 flex justify-end">
                    <button
                      onClick={() => handleDownload(doc.id)}
                      disabled={downloadingId === doc.id}
                      className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 border rounded-lg text-xs font-bold min-h-[40px] transition-colors disabled:opacity-50 hover-bounce-down ${
                        doc.type === 'rpp'
                          ? 'border-[#00f2ff]/30 text-[#00f2ff] hover:bg-[#00f2ff]/10'
                          : doc.type === 'soal'
                          ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                          : 'border-[#6366f1]/30 text-[#6366f1] hover:bg-[#6366f1]/10'
                      }`}
                    >
                      {downloadingId === doc.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Memuat...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Unduh Dokumen</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Pagination ── */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-white/5 text-slate-400 hover:bg-white/5 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  // Show at most 5 page buttons around current page
                  return Math.abs(p - currentPage) <= 2 || p === 1 || p === pagination.totalPages;
                })
                .reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('ellipsis');
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === 'ellipsis' ? (
                    <span key={`ellipsis-${idx}`} className="px-1 text-slate-500 text-sm">
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => handlePageChange(item as number)}
                      className={`inline-flex items-center justify-center w-10 h-10 rounded-lg border text-sm font-bold transition-colors ${
                        currentPage === item
                          ? 'bg-brand-red text-slate-950 border-brand-red shadow-[0_0_12px_rgba(0,242,255,0.35)]'
                          : 'border-white/5 text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-white/5 text-slate-400 hover:bg-white/5 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
