import React, { useState } from 'react';
import { AlertTriangle, X, Zap, Sparkles, Crown } from 'lucide-react';

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

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      id="quota-warning-banner"
      className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
        isExhausted
          ? 'bg-brand-red text-white'
          : 'bg-[#FFF8E7] text-[#92400E] border-b border-[#FDE68A]'
      }`}
      role="alert"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <AlertTriangle className={`w-4 h-4 flex-shrink-0 ${isExhausted ? 'text-white' : 'text-[#D97706]'}`} />
        <span className="truncate">
          {isExhausted ? (
            <>Kuota paket <strong>{planLabel}</strong> Anda habis — tidak dapat membuat dokumen baru.</>
          ) : (
            <>Sisa kuota Anda: <strong>{quotaRemaining} dokumen ({quotaPercentage}%)</strong>. Segera tingkatkan paket agar tidak terhenti.</>
          )}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          id="quota-banner-upgrade-btn"
          onClick={onUpgradeClick}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all hover:scale-105 active:scale-95 ${
            isExhausted
              ? 'bg-white text-brand-red hover:bg-neutral-100'
              : 'bg-[#D97706] text-white hover:bg-[#B45309]'
          }`}
        >
          <Zap className="w-3 h-3" />
          Upgrade Sekarang
        </button>
        <button
          onClick={handleDismiss}
          className={`p-1 rounded transition-colors ${
            isExhausted ? 'hover:bg-white/20 text-white' : 'hover:bg-black/10 text-[#92400E]'
          }`}
          aria-label="Tutup notifikasi"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// UpgradeModal
// Modal yang muncul saat user mencoba generate dengan kuota = 0
// ─────────────────────────────────────────────────────────────────────────────
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
    quota: '25 dokumen',
    icon: Zap,
    color: 'text-[#D97706]',
    bgColor: 'bg-[#FFF8E7]',
    borderColor: 'border-[#FDE68A]',
    ctaColor: 'bg-[#D97706] hover:bg-[#B45309] text-white',
    features: ['25 dokumen / minggu', 'RPP & Soal Ujian', 'Download DOCX', 'Tanpa iklan'],
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 'Rp 29.000',
    period: '/ bulan',
    quota: 'Unlimited',
    icon: Sparkles,
    color: 'text-brand-red',
    bgColor: 'bg-brand-pale',
    borderColor: 'border-brand-red',
    ctaColor: 'bg-brand-red hover:bg-blue-700 text-white',
    popular: true,
    features: ['Dokumen unlimited', 'RPP & Soal Ujian', 'Download DOCX', 'Prioritas AI', 'Email support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'Rp 49.000',
    period: '/ bulan',
    quota: 'Unlimited + Fitur Pro',
    icon: Crown,
    color: 'text-[#7C3AED]',
    bgColor: 'bg-[#F5F3FF]',
    borderColor: 'border-[#DDD6FE]',
    ctaColor: 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white',
    features: ['Semua fitur Basic', 'Template KKG eksklusif', 'Format Kemendikbud terbaru', 'Dukungan prioritas 24/7'],
  },
];

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onNavigatePricing }) => {
  if (!isOpen) return null;

  return (
    <div
      id="upgrade-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop glassmorphism */}
      <div className="absolute inset-0 bg-brand-dark/70 backdrop-blur-sm" />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-bounce-in">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-rule px-6 py-4 flex items-start justify-between z-10">
          <div>
            <h2 className="text-xl font-display font-black text-ink">Kuota Habis 😔</h2>
            <p className="text-sm text-muted mt-0.5">Tingkatkan paket untuk melanjutkan membuat dokumen.</p>
          </div>
          <button
            id="upgrade-modal-close-btn"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors text-muted hover:text-ink mt-0.5"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className={`relative rounded-xl border-2 p-4 flex flex-col gap-3 transition-all hover:shadow-lg hover:-translate-y-0.5 ${plan.borderColor} ${plan.bgColor}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-red text-white text-[10px] font-black px-3 py-0.5 rounded-full tracking-wide shadow">
                    PALING POPULER
                  </div>
                )}
                <div className={`w-9 h-9 rounded-lg ${plan.bgColor} flex items-center justify-center border ${plan.borderColor}`}>
                  <Icon className={`w-5 h-5 ${plan.color}`} />
                </div>
                <div>
                  <div className="font-display font-black text-ink text-lg">{plan.name}</div>
                  <div className={`text-xl font-black ${plan.color}`}>
                    {plan.price}
                    <span className="text-xs text-muted font-normal">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-1.5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-1.5 text-xs text-ink">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${plan.color.replace('text-', 'bg-')}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  id={`upgrade-modal-${plan.id}-btn`}
                  onClick={onNavigatePricing}
                  className={`w-full py-2.5 rounded-lg text-sm font-bold transition-all hover:scale-[1.02] active:scale-95 ${plan.ctaColor}`}
                >
                  Pilih {plan.name}
                </button>
              </div>
            );
          })}
        </div>

        <div className="px-6 pb-5 text-center">
          <button onClick={onClose} className="text-xs text-muted hover:text-ink transition-colors underline">
            Batal, lanjutkan dengan paket Gratis
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuotaBanner;
