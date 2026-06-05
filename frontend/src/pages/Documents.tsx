import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Trash2, 
  Download, 
  FileText, 
  FileQuestion, 
  Loader2, 
  AlertTriangle,
  Search,
  Calendar,
  ArrowLeft,
  FolderOpen,
  Share2,
  Globe
} from 'lucide-react';
import { api } from '../services/api';

interface Document {
  id: number;
  type: 'rpp' | 'soal';
  title: string;
  gcsPath: string;
  createdAt: string;
  isPublic?: boolean;
  sharedAt?: string | null;
}

export const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Loading & Error States
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modal Hapus State
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Share state
  const [sharingId, setSharingId] = useState<number | null>(null);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    rpp: 0,
    soal: 0
  });

  const fetchDocuments = async (cursorVal?: number, append = false) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    setErrorMsg(null);

    try {
      const params: any = {
        limit: 8
      };

      if (filterType !== 'all') {
        params.type = filterType;
      }

      if (cursorVal) {
        params.cursor = cursorVal;
      }

      const response = await api.get('/documents', { params });
      const { documents: fetchedDocs, nextCursor: newCursor } = response.data.data;

      if (append) {
        setDocuments(prev => [...prev, ...fetchedDocs]);
      } else {
        setDocuments(fetchedDocs);
      }
      setNextCursor(newCursor);

      // Hitung stats sederhana dari seluruh dokumen terambil jika loading pertama
      if (!append) {
        // Karena cursor paginasi membatasi total data, stats riil sebaiknya didapat dari profil user,
        // namun untuk display lokal, kita bisa update berbasis apa yang ada, atau fetch stats terpisah.
        // Di sini kita hitung dari initial fetch dan setup info interaktif.
        const totalDocs = fetchedDocs.length;
        const totalRPP = fetchedDocs.filter((d: any) => d.type === 'rpp').length;
        const totalSoal = fetchedDocs.filter((d: any) => d.type === 'soal').length;
        setStats({
          total: totalDocs,
          rpp: totalRPP,
          soal: totalSoal
        });
      }

    } catch (err: any) {
      console.error('Fetch documents error:', err);
      setErrorMsg(err.response?.data?.message || 'Gagal mengambil riwayat dokumen Anda.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [filterType]);

  const handleLoadMore = () => {
    if (nextCursor && !isLoadingMore) {
      fetchDocuments(nextCursor, true);
    }
  };

  const handleDownload = async (id: number) => {
    try {
      const response = await api.get(`/documents/${id}/download`);
      const signedUrl = response.data.data.signedUrl;
      window.open(signedUrl, '_blank');
    } catch (err) {
      console.error('Error getting download link:', err);
      alert('Gagal membuat tautan unduh. Silakan coba kembali.');
    }
  };

  const handleToggleShare = async (doc: Document) => {
    const actionWord = doc.isPublic ? 'menyembunyikan' : 'membagikan';
    const confirmed = window.confirm(
      doc.isPublic
        ? `Apakah Anda yakin ingin menyembunyikan "${doc.title}" dari Perpustakaan Guru?`
        : `Apakah Anda yakin ingin membagikan "${doc.title}" ke Perpustakaan Guru? Dokumen akan dapat dilihat dan diunduh oleh guru lain.`
    );
    if (!confirmed) return;

    setSharingId(doc.id);
    try {
      const response = await api.patch(`/documents/${doc.id}/share`);
      const { isPublic: newIsPublic, sharedAt, message } = response.data.data;

      // Update dokumen di state lokal secara optimistik
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === doc.id ? { ...d, isPublic: newIsPublic, sharedAt } : d
        )
      );

      alert(message);
    } catch (err: any) {
      console.error(`Error ${actionWord} dokumen:`, err);
      alert(err.response?.data?.message || `Gagal ${actionWord} dokumen. Silakan coba kembali.`);
    } finally {
      setSharingId(null);
    }
  };

  // Optimistic Deletion
  const handleDeleteConfirm = async () => {
    if (!documentToDelete) return;
    setIsDeleting(true);

    try {
      await api.delete(`/documents/${documentToDelete.id}`);
      
      // Hapus optimistik dari state lokal
      setDocuments(prev => prev.filter(doc => doc.id !== documentToDelete.id));
      
      // Update stats
      setStats(prev => {
        const isRPP = documentToDelete.type === 'rpp';
        return {
          total: Math.max(0, prev.total - 1),
          rpp: isRPP ? Math.max(0, prev.rpp - 1) : prev.rpp,
          soal: !isRPP ? Math.max(0, prev.soal - 1) : prev.soal
        };
      });

      setDocumentToDelete(null);
    } catch (err: any) {
      console.error('Delete error:', err);
      alert(err.response?.data?.message || 'Gagal menghapus dokumen dari server.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredDocs = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1 text-left">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-1 text-sm font-bold text-brand-mid hover:underline mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard</span>
          </Link>
          <h2 className="font-display text-3xl font-black text-ink tracking-tight leading-tight">
            Riwayat Administrasi Guru
          </h2>
          <p className="text-sm text-muted">
            Kelola, unduh ulang, dan hapus berkas bank soal atau RPP yang telah Anda generate sebelumnya.
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 bg-error-bg border border-error rounded-xl flex items-start gap-2.5 text-error">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-sm font-semibold">{errorMsg}</div>
        </div>
      )}

      {/* Stats Summary Cards (Only visible if loading succeeds) */}
      {!isLoading && documents.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-rule rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-xs text-muted font-bold uppercase tracking-wide">Total Riwayat Terload</span>
              <h4 className="text-2xl font-black text-ink mt-0.5">{stats.total} Dokumen</h4>
            </div>
            <div className="p-2.5 bg-neutral-50 border border-rule/50 text-muted rounded-lg">
              <FolderOpen className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-rule rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-xs text-muted font-bold uppercase tracking-wide">Total RPP Terload</span>
              <h4 className="text-2xl font-black text-brand-mid mt-0.5">{stats.rpp} Modul</h4>
            </div>
            <div className="p-2.5 bg-[#EBF3FB] text-brand-mid rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-rule rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-xs text-muted font-bold uppercase tracking-wide">Total Soal Terload</span>
              <h4 className="text-2xl font-black text-[#1A7A4A] mt-0.5">{stats.soal} Ujian</h4>
            </div>
            <div className="p-2.5 bg-[#E8F5EE] text-[#1A7A4A] rounded-lg">
              <FileQuestion className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white border border-rule rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Cari judul berkas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm text-ink bg-white border border-rule rounded-lg focus:outline-none focus:border-brand-mid focus:ring-2 focus:ring-brand-mid/20 min-h-[44px]"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 text-xs font-bold rounded-lg border min-h-[44px] transition-all whitespace-nowrap ${
              filterType === 'all'
                ? 'bg-brand-dark text-white border-brand-dark'
                : 'bg-white text-muted border-rule hover:bg-neutral-50'
            }`}
          >
            Semua Dokumen
          </button>
          
          <button
            onClick={() => setFilterType('rpp')}
            className={`px-4 py-2 text-xs font-bold rounded-lg border min-h-[44px] transition-all whitespace-nowrap ${
              filterType === 'rpp'
                ? 'bg-brand-mid text-white border-brand-mid'
                : 'bg-white text-muted border-rule hover:bg-neutral-50'
            }`}
          >
            Rencana Pelaksanaan Pembelajaran (RPP)
          </button>

          <button
            onClick={() => setFilterType('soal')}
            className={`px-4 py-2 text-xs font-bold rounded-lg border min-h-[44px] transition-all whitespace-nowrap ${
              filterType === 'soal'
                ? 'bg-[#1A7A4A] text-white border-[#1A7A4A]'
                : 'bg-white text-muted border-rule hover:bg-neutral-50'
            }`}
          >
            Bank Soal Ujian
          </button>
        </div>
      </div>

      {/* Main Grid / List */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-sm font-semibold text-muted">Menyinkronkan riwayat dokumen...</p>
        </div>
      ) : filteredDocs.length === 0 ? (
        /* Empty State */
        <div className="bg-white border border-rule rounded-xl p-8 sm:p-14 text-center shadow-sm flex flex-col items-center justify-center max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-50 text-blue-600 flex items-center justify-center mb-5 border border-slate-200">
            <FolderOpen className="w-8 h-8" />
          </div>
          <h4 className="text-base font-bold text-ink mb-2">
            Tidak Ada Dokumen
          </h4>
          <p className="text-sm text-muted max-w-sm mx-auto mb-6 leading-relaxed">
            {searchQuery 
              ? 'Tidak ada dokumen yang cocok dengan kata kunci pencarian Anda.' 
              : 'Mulai buat berkas kurikulum baru dan hemat ribuan jam kerja administrasi Anda sekarang!'}
          </p>
          {!searchQuery && (
            <div className="flex flex-wrap items-center gap-3 justify-center">
              <Link 
                to="/rpp"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl min-h-[44px] shadow-lg shadow-blue-500/10 hover:bg-blue-700 hover:shadow-xl transition-all"
              >
                <span>Generate RPP</span>
              </Link>
              <Link 
                to="/soal"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-brand-dark text-white font-semibold text-sm rounded-lg min-h-[44px] hover:bg-[#153857] transition-all"
              >
                <span>Generate Soal</span>
              </Link>
            </div>
          )}
        </div>
      ) : (
        /* Document Cards Grid */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocs.map((doc, index) => {
              const dateObj = new Date(doc.createdAt);
              const dateFormatted = dateObj.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              });

              const staggerClass = `animate-stagger-${(index % 4) + 1}`;

              return (
                <div 
                  key={doc.id}
                  className={`bg-white border border-rule rounded-xl p-4 flex flex-col justify-between gap-4 hover-card-premium ${staggerClass}`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`p-2.5 rounded-lg flex-shrink-0 ${
                      doc.type === 'rpp' ? 'bg-[#EBF3FB] text-brand-mid' : 'bg-[#E8F5EE] text-[#1A7A4A]'
                    }`}>
                      {doc.type === 'rpp' ? (
                        <FileText className="w-5 h-5" />
                      ) : (
                        <FileQuestion className="w-5 h-5" />
                      )}
                    </div>
                    
                    <div className="space-y-1 text-left flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          doc.type === 'rpp' 
                            ? 'bg-[#EBF3FB] text-brand-mid border border-brand-mid/10' 
                            : 'bg-[#E8F5EE] text-[#1A7A4A] border border-[#1A7A4A]/10'
                        }`}>
                          {doc.type === 'rpp' ? 'RPP' : 'SOAL'}
                        </span>
                        
                        <span className="text-[10px] text-muted flex items-center gap-1 font-semibold">
                          <Calendar className="w-3 h-3" />
                          {dateFormatted}
                        </span>
                      </div>
                      
                      <h4 className="text-sm font-bold text-ink truncate" title={doc.title}>
                        {doc.title}
                      </h4>
                    </div>
                  </div>

                  {/* Actions footer inside card */}
                  <div className="flex items-center justify-between pt-3 border-t border-rule/35">
                    <button
                      onClick={() => setDocumentToDelete(doc)}
                      className="inline-flex items-center justify-center p-2 text-neutral-400 hover:text-red-500 hover:bg-error-bg rounded-lg transition-colors min-h-[44px] min-w-[44px]"
                      title="Hapus Dokumen"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>

                    <div className="flex items-center gap-2">
                      {/* Share Toggle Button */}
                      <button
                        onClick={() => handleToggleShare(doc)}
                        disabled={sharingId === doc.id}
                        title={doc.isPublic ? 'Sembunyikan dari Perpustakaan' : 'Bagikan ke Perpustakaan Guru'}
                        className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 border rounded-lg text-xs font-bold min-h-[44px] transition-colors disabled:opacity-50 ${
                          doc.isPublic
                            ? 'border-[#1A7A4A]/30 text-[#1A7A4A] bg-[#E8F5EE]/60 hover:bg-[#E8F5EE]'
                            : 'border-rule text-muted hover:bg-neutral-50 hover:text-ink'
                        }`}
                      >
                        {sharingId === doc.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : doc.isPublic ? (
                          <Globe className="w-3.5 h-3.5" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                        <span className="hidden sm:inline">
                          {sharingId === doc.id ? 'Menyimpan...' : doc.isPublic ? 'Dibagikan' : 'Bagikan'}
                        </span>
                      </button>

                      {/* Download Button */}
                      <button
                        onClick={() => handleDownload(doc.id)}
                        className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 border rounded-lg text-xs font-bold min-h-[44px] transition-colors ${
                          doc.type === 'rpp' 
                            ? 'border-brand-mid/30 text-brand-mid hover:bg-[#EBF3FB]/50'
                            : 'border-[#1A7A4A]/30 text-[#1A7A4A] hover:bg-[#E8F5EE]/50'
                        }`}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh Word</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Load More Button */}
          {nextCursor && (
            <div className="flex justify-center pt-2">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-rule text-ink font-bold text-xs rounded-lg min-h-[44px] shadow-sm hover:bg-neutral-50 transition-colors disabled:opacity-50"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                    <span>Memuat berkas selanjutnya...</span>
                  </>
                ) : (
                  <span>Muat Lebih Banyak</span>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Dangerous Confirmation Modal Hapus */}
      {documentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white border border-rule rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl text-center transform animate-in scale-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto shadow-sm">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-ink">Hapus Dokumen Permanen?</h4>
              <p className="text-xs text-muted leading-relaxed">
                Anda akan menghapus berkas <strong className="text-ink">"{documentToDelete.title}"</strong> secara permanen dari server database dan cloud storage. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDocumentToDelete(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 border border-rule text-ink font-semibold text-sm rounded-lg min-h-[44px] hover:bg-neutral-50 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white font-bold text-sm rounded-xl min-h-[44px] shadow-md hover:bg-red-700 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <span>Ya, Hapus</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
