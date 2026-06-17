import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Receipt, ArrowRight, ChevronDown, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

interface Transaction {
  id: number;
  plan: string;
  status: string;
  amount: number;
  midtrans_order_id: string;
  started_at: string | null;
  expires_at: string | null;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  active:    { label: 'Sukses',       color: 'text-emerald-600 dark:text-emerald-400',   bg: 'bg-emerald-50 dark:bg-emerald-500/10',   icon: CheckCircle },
  pending:   { label: 'Menunggu',     color: 'text-amber-600 dark:text-amber-400',     bg: 'bg-amber-50 dark:bg-amber-500/10',     icon: Clock },
  settlement:{ label: 'Sukses',       color: 'text-emerald-600 dark:text-emerald-400',   bg: 'bg-emerald-50 dark:bg-emerald-500/10',   icon: CheckCircle },
  expire:    { label: 'Kedaluwarsa',  color: 'text-slate-500 dark:text-slate-400',     bg: 'bg-slate-100 dark:bg-white/5',          icon: XCircle },
  cancel:    { label: 'Dibatalkan',   color: 'text-slate-500 dark:text-slate-400',     bg: 'bg-slate-100 dark:bg-white/5',          icon: XCircle },
  deny:      { label: 'Ditolak',      color: 'text-red-650 dark:text-red-400',       bg: 'bg-red-50 dark:bg-red-500/10',       icon: AlertCircle },
};

const PLAN_LABELS: Record<string, string> = {
  free: 'Gratis', saset: 'Saset', basic: 'Basic', pro: 'Pro',
};

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const Billing: React.FC = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchHistory = async (cursor?: string) => {
    try {
      const params = new URLSearchParams({ take: '10' });
      if (cursor) params.append('cursor', cursor);

      const res = await api.get<{
        success: boolean;
        data: { items: Transaction[]; nextCursor: string | null; hasMore: boolean };
      }>(`/payment/history?${params}`);

      if (res.data.success) {
        setTransactions((prev) => cursor ? [...prev, ...res.data.data.items] : res.data.data.items);
        setNextCursor(res.data.data.nextCursor);
        setHasMore(res.data.data.hasMore);
      }
    } catch {
      setError('Gagal memuat riwayat transaksi.');
    }
  };

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await fetchHistory();
      setIsLoading(false);
    };
    load();
  }, []);

  const handleLoadMore = async () => {
    if (!nextCursor) return;
    setIsLoadingMore(true);
    await fetchHistory(nextCursor);
    setIsLoadingMore(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-2xl text-ink">Riwayat Transaksi</h1>
          <p className="text-sm text-muted mt-0.5">Semua pembayaran dan langganan Anda.</p>
        </div>
        <button
          id="billing-upgrade-btn"
          onClick={() => navigate('/pricing')}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-red text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all hover:scale-105 active:scale-95"
        >
          Upgrade <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-cream/90 border border-rule rounded-xl p-5 h-24" />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="bg-cream/90 border border-rule rounded-2xl p-12 text-center space-y-4">
          <div className="w-14 h-14 bg-glass/10 rounded-2xl flex items-center justify-center mx-auto">
            <Receipt className="w-7 h-7 text-muted" />
          </div>
          <div>
            <p className="font-bold text-ink">Belum ada transaksi</p>
            <p className="text-sm text-muted mt-1">Tingkatkan paket Anda untuk mengakses lebih banyak dokumen.</p>
          </div>
          <button
            onClick={() => navigate('/pricing')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-red text-slate-950 rounded-xl text-sm font-bold hover:bg-blue-400 transition-all"
          >
            Lihat Paket <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx, index) => {
            const statusCfg = STATUS_CONFIG[tx.status] || STATUS_CONFIG.pending;
            const StatusIcon = statusCfg.icon;
            const staggerClass = `animate-stagger-${(index % 4) + 1}`;
            return (
              <div key={tx.id} className={`bg-cream/90 border border-rule rounded-xl p-5 flex items-start justify-between gap-4 hover-card-premium ${staggerClass}`}>
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${statusCfg.bg}`}>
                    <StatusIcon className={`w-4.5 h-4.5 ${statusCfg.color}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-ink text-sm">Paket {PLAN_LABELS[tx.plan] || tx.plan}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${statusCfg.bg} ${statusCfg.color}`}>
                        {statusCfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted mt-0.5 font-mono truncate">{tx.midtrans_order_id}</p>
                    <div className="text-xs text-muted mt-1.5 space-y-0.5">
                      {tx.started_at && <p>Mulai: {formatDate(tx.started_at)}</p>}
                      {tx.expires_at && <p>Berakhir: {formatDate(tx.expires_at)}</p>}
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-black text-ink">{formatRupiah(tx.amount)}</p>
                </div>
              </div>
            );
          })}

          {hasMore && (
            <button
              id="billing-load-more-btn"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="w-full py-3 border border-rule rounded-xl text-sm font-semibold text-muted hover:bg-glass/10 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoadingMore ? 'Memuat...' : <><ChevronDown className="w-4 h-4" /> Muat Lebih Banyak</>}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Billing;
