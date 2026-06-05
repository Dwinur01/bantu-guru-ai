import React, { useState } from 'react';
import { AlertTriangle, X, Zap, Sparkles, ArrowRight } from 'lucide-react';

interface QuotaBannerProps {
  quotaRemaining: number;
  quotaPercentage: number;
  plan: string;
  onDismiss?: () => void;
  onUpgradeClick?: () => void;
}

const QuotaBanner: React.FC<QuotaBannerProps> = ({
  quotaRemaining,
  quotaPercentage,
  plan,
  onDismiss,
  onUpgradeClick,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  if (isDismissed) return null;

  const isExhausted = quotaRemaining <= 0;
  const planLabel = plan === 'free' ? 'Gratis' : plan === 'saset' ? 'Saset' : plan.toUpperCase();

  const handleDismiss = () => { setIsDismissed(true); onDismiss?.(); };

  return (
    <div
      id="quota-warning-banner"
      className={`relative w-full flex items-center justify-between gap-3 px-5 py-3 text-sm font-medium transition-all overflow-hidden ${
        isExhausted
          ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white'
          : 'bg-gradient-to-r from-amber-400 to-orange-500 text-white'
      }`}
      role="alert"
    >
      {/* Shimmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent bg-[length:200%_100%] animate-shimmer pointer-events-none" />

      <div className="relative z-10 flex items-center gap-2.5 min-w-0">
        <AlertTriangle className="w-4 h-4 flex-shrink-0 animate-bounce-soft" />
        <span className="truncate text-sm font-bold">
          {isExhausted ? (
            <>Kuota paket <strong className="font-black">{planLabel}</strong> habis — tidak dapat membuat dokumen baru.</>
          ) : (
            <>Sisa kuota: <strong className="font-black">{quotaRemaining} dokumen ({quotaPercentage}%)</strong> — segera tingkatkan agar tidak terhenti!</>
          )}
        </span>
      </div>

      <div className="relative z-10 flex items-center gap-2 flex-shrink-0">
        <button
          id="quota-banner-upgrade-btn"
          onClick={onUpgradeClick}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white transition-all active:scale-95 whitespace-nowrap"
        >
          <Zap className="w-3 h-3" />
          Upgrade
          <ArrowRight className="w-3 h-3" />
        </button>
        <button
          onClick={handleDismiss}
          className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
          aria-label="Tutup notifikasi"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

// ── UpgradeModal ────────────────────────────────────────────────────
interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigatePricing: () => void;
}

const plans = [
  {
    id: 'saset',
    name: 'Saset',
    price: 'Rp 15.000',
    period: '/ minggu',
    emoji: '⚡',
    gradient: 'from-amber-400 to-orange-500',
    textColor: 'text-amber-600',
    features: ['25 dokumen / minggu', 'RPP & Soal Ujian', 'Download DOCX', 'Tanpa iklan'],
    ctaGradient: 'from-amber-400 to-orange-500',
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 'Rp 29.000',
    period: '/ bulan',
    emoji: '🚀',
    gradient: 'from-blue-500 to-indigo-600',
    textColor: 'text-blue-600',
    popular: true,
    features: ['Dokumen unlimited', 'RPP & Soal Ujian', 'Download DOCX', 'Prioritas AI', 'Email support'],
    ctaGradient: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'Rp 49.000',
    period: '/ bulan',
    emoji: '👑',
    gradient: 'from-violet-500 to-purple-600',
    textColor: 'text-violet-600',
    features: ['Semua fitur Basic', 'Template KKG eksklusif', 'Format Kemendikbud terbaru', 'Dukungan prioritas 24/7'],
    ctaGradient: 'from-violet-500 to-purple-600',
  },
];

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onNavigatePricing }) => {
  if (!isOpen) return null;

  return (
    <div
      id="upgrade-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-glass-fade"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in border border-slate-100">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-slate-100 px-7 py-5 flex items-start justify-between z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-display font-black text-slate-900">Kuota Habis 😔</h2>
            </div>
            <p className="text-sm text-slate-500">Tingkatkan paket untuk melanjutkan membuat dokumen.</p>
          </div>
          <button
            id="upgrade-modal-close-btn"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600 mt-0.5"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border overflow-hidden flex flex-col gap-3 transition-all hover-card-premium ${
                plan.popular ? 'border-blue-300 shadow-glow-blue' : 'border-slate-200'
              }`}
            >
              {/* Gradient top bar */}
              <div className={`h-1 bg-gradient-to-r ${plan.gradient}`} />
              <div className="p-4 flex flex-col gap-3 flex-1">
                {plan.popular && (
                  <div className="absolute -top-0 right-0 bg-amber-400 text-slate-900 text-[9px] font-black px-3 py-0.5 rounded-bl-xl tracking-wide">
                    POPULER
                  </div>
                )}
                <div className="text-2xl">{plan.emoji}</div>
                <div>
                  <div className="font-display font-black text-slate-900 text-lg">{plan.name}</div>
                  <div className={`text-xl font-black ${plan.textColor}`}>
                    {plan.price}
                    <span className="text-xs text-slate-400 font-normal ml-1">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-1.5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-slate-600">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 bg-gradient-to-br ${plan.gradient}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  id={`upgrade-modal-${plan.id}-btn`}
                  onClick={onNavigatePricing}
                  className={`w-full py-2.5 rounded-xl text-sm font-black text-white bg-gradient-to-r ${plan.ctaGradient} hover:opacity-90 transition-all active:scale-95 shadow-md`}
                >
                  Pilih {plan.name}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="px-7 pb-6 text-center">
          <button onClick={onClose} className="text-xs text-slate-400 hover:text-slate-600 transition-colors underline underline-offset-2">
            Tutup, lanjutkan dengan paket Gratis
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuotaBanner;
