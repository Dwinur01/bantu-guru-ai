import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, Sparkles, Crown, Users, Star, ChevronDown, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../hooks/useTheme';

// ─── FAQ Data ────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: 'Apakah ada masa uji coba gratis?',
    a: 'Ya! Paket Gratis memberikan 5 dokumen per bulan tanpa batas waktu. Tidak perlu kartu kredit untuk mulai.',
  },
  {
    q: 'Bagaimana cara pembayaran?',
    a: 'Kami menerima QRIS, transfer bank (BCA, Mandiri, BNI, BRI), kartu kredit, dan berbagai dompet digital (GoPay, OVO, Dana) via Midtrans.',
  },
  {
    q: 'Apakah dokumen yang dihasilkan sesuai Kurikulum Merdeka?',
    a: 'Ya, seluruh RPP mengikuti format Kemendikbud terbaru dengan komponen CP, TP, ATP, dan Asesmen. Soal ujian menggunakan taksonomi Bloom.',
  },
  {
    q: 'Bisakah saya downgrade atau cancel langganan?',
    a: 'Anda bebas tidak memperpanjang langganan kapan saja. Saat ini belum ada fitur refund untuk periode yang sudah berjalan.',
  },
  {
    q: 'Apa perbedaan paket Basic dan Pro?',
    a: 'Keduanya menawarkan dokumen unlimited. Paket Pro menambahkan template eksklusif KKG, format Kemendikbud terbaru otomatis, dan dukungan prioritas 24/7.',
  },
];

// ─── Plan Data ────────────────────────────────────────────────────────────────
const plans = [
  {
    id: 'free',
    name: 'Gratis',
    price: 0,
    priceLabel: 'Rp 0',
    period: 'bulan',
    quota: '5 DOKUMEN',
    icon: Users,
    features: [
      '5 dokumen per bulan',
      'Generate RPP Kurikulum Merdeka',
      'Generate Soal Ujian (PG + Essay)',
      'Download format .docx',
      'Riwayat dokumen 30 hari',
    ],
    notIncluded: ['Unlimited dokumen', 'Template eksklusif KKG', 'Prioritas AI'],
    
    // UI Theme properties
    bg: 'bg-[#131318]/90',
    border: 'border-[#272730]',
    textColor: 'text-white',
    subtitleColor: 'text-slate-400',
    priceColor: 'text-white',
    periodColor: 'text-slate-400',
    featureColor: 'text-slate-300',
    disabledColor: 'text-slate-600/70',
    dividerColor: 'border-slate-800',
    btnClass: 'bg-slate-800 text-slate-500 cursor-not-allowed hover:bg-slate-800 hover:scale-100',
    iconBg: 'bg-[#1C1C24]',
    iconColor: 'text-slate-400',
  },
  {
    id: 'saset',
    name: 'Saset',
    price: 15000,
    priceLabel: 'Rp 15.000',
    period: 'minggu',
    quota: '25 DOKUMEN',
    icon: Zap,
    features: [
      '25 dokumen per minggu',
      'Generate RPP Kurikulum Merdeka',
      'Generate Soal Ujian (PG + Essay)',
      'Download format .docx',
      'Riwayat dokumen unlimited',
      'Tanpa iklan',
    ],
    notIncluded: ['Dokumen unlimited', 'Template eksklusif KKG'],
    
    // UI Theme properties
    bg: 'bg-[#131318]/90',
    border: 'border-[#272730]',
    textColor: 'text-white',
    subtitleColor: 'text-slate-400',
    priceColor: 'text-white',
    periodColor: 'text-slate-400',
    featureColor: 'text-slate-300',
    disabledColor: 'text-slate-600/70',
    dividerColor: 'border-slate-800',
    btnClass: 'bg-[#EA580C] hover:bg-[#D97706] text-white hover:shadow-lg hover:shadow-orange-500/20',
    iconBg: 'bg-[#1E1B15]',
    iconColor: 'text-amber-500',
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 29000,
    priceLabel: 'Rp 29.000',
    period: 'bulan',
    quota: 'UNLIMITED',
    icon: Sparkles,
    popular: true,
    features: [
      'Dokumen unlimited',
      'Generate RPP Kurikulum Merdeka',
      'Generate Soal Ujian (PG + Essay)',
      'Download format .docx',
      'Riwayat dokumen unlimited',
      'Tanpa iklan',
      'Prioritas pemrosesan AI',
      'Email support',
    ],
    notIncluded: ['Template eksklusif KKG'],
    
    // UI Theme properties
    bg: 'bg-[#131318]/90',
    border: 'border-[#272730]',
    textColor: 'text-white',
    subtitleColor: 'text-slate-400',
    priceColor: 'text-white',
    periodColor: 'text-slate-400',
    featureColor: 'text-slate-300',
    disabledColor: 'text-slate-600/70',
    dividerColor: 'border-slate-800',
    btnClass: 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white hover:shadow-lg hover:shadow-blue-500/20',
    iconBg: 'bg-[#1D1D24]',
    iconColor: 'text-blue-400',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 49000,
    priceLabel: 'Rp 49.000',
    period: 'bulan',
    quota: 'UNLIMITED + PRO',
    icon: Crown,
    badge: '⭐ Terlengkap',
    features: [
      'Semua fitur Basic',
      'Template eksklusif KKG',
      'Format Kemendikbud terbaru otomatis',
      'Dukungan prioritas 24/7',
      'Early access fitur baru',
    ],
    notIncluded: [],
    
    // UI Theme properties
    bg: 'bg-[#0B0B0F]',
    border: 'border-[#2E2E3A]',
    textColor: 'text-white',
    subtitleColor: 'text-slate-400',
    priceColor: 'text-white',
    periodColor: 'text-slate-400',
    featureColor: 'text-slate-300',
    disabledColor: 'text-slate-600/70',
    dividerColor: 'border-slate-800',
    btnClass: 'bg-[#6B21A8] hover:bg-[#581C87] text-white hover:shadow-lg hover:shadow-purple-500/20',
    iconBg: 'bg-[#1E1B29]',
    iconColor: 'text-purple-400',
  },
];


// ─── FAQ Accordion Item ───────────────────────────────────────────────────────
const FaqItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();
  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-300 shadow-sm ${
      theme === 'light' 
        ? 'border-slate-200/80 bg-white hover:bg-slate-50/80' 
        : 'border-white/5 bg-white/5 hover:bg-white/10'
    }`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
      >
        <span className={`font-bold text-sm pr-4 ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>{q}</span>
        <div className={`transition-transform duration-300 ${open ? 'rotate-180 text-blue-500' : (theme === 'light' ? 'text-slate-400' : 'text-slate-400')}`}>
          <ChevronDown className="w-4 h-4 flex-shrink-0" />
        </div>
      </button>
      <div 
        className="transition-all duration-300 ease-in-out overflow-hidden"
        style={{ 
          maxHeight: open ? '200px' : '0px', 
          opacity: open ? 1 : 0 
        }}
      >
        <div className={`px-5 pb-4 text-xs leading-relaxed border-t pt-3 ${
          theme === 'light' 
            ? 'text-slate-600 border-slate-100 bg-slate-50/30' 
            : 'text-slate-400 border-white/5 bg-white/[0.02]'
        }`}>
          {a}
        </div>
      </div>
    </div>
  );
};

// ─── Main Pricing Page ────────────────────────────────────────────────────────
export const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { theme } = useTheme();
  const currentPlan = user?.plan || 'free';

  const handleSelectPlan = (planId: string) => {
    if (planId === 'free' || planId === currentPlan) return;
    navigate(`/payment/${planId}`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-4 animate-page">
      {/* Header */}
      <div className="text-center space-y-3.5">
        <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border animate-float ${
          theme === 'light'
            ? 'bg-blue-50 text-blue-600 border-blue-200'
            : 'bg-blue-900/40 text-blue-400 border-blue-500/20'
        }`}>
          <Star className="w-3.5 h-3.5 fill-current" /> Pilih Paket Terbaik untuk Anda
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-ink">
          Harga yang <span className="gradient-text-blue">Transparan & Terjangkau</span>
        </h1>
        <p className="text-muted text-sm max-w-lg mx-auto leading-relaxed">
          Mulai gratis, tingkatkan kapan saja. Tidak ada biaya tersembunyi, tidak ada kontrak jangka panjang.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isActive = currentPlan === plan.id;
          const isFree = plan.id === 'free';

          // Dynamic class calculation based on theme
          const cardBgClass = theme === 'light'
            ? (plan.id === 'basic'
                ? 'bg-gradient-to-br from-blue-50/95 via-indigo-50/90 to-white/95 text-slate-800'
                : plan.id === 'pro'
                  ? 'bg-gradient-to-br from-purple-50/95 via-violet-50/90 to-white/95 text-slate-800'
                  : 'bg-white text-slate-800')
            : `${plan.bg} ${plan.textColor}`;

          const cardBorderClass = theme === 'light'
            ? (isActive
                ? 'border-indigo-600 shadow-lg shadow-indigo-100/50 scale-[1.01]'
                : (plan.id === 'basic' ? 'border-indigo-200/80 hover:scale-[1.02] hover:-translate-y-1 hover:border-indigo-400 shadow-sm'
                   : plan.id === 'pro' ? 'border-violet-200/80 hover:scale-[1.02] hover:-translate-y-1 hover:border-violet-400 shadow-sm'
                   : plan.id === 'saset' ? 'border-orange-200/80 hover:scale-[1.02] hover:-translate-y-1 hover:border-orange-400 shadow-sm'
                   : 'border-slate-200 hover:scale-[1.02] hover:-translate-y-1 hover:border-slate-300 shadow-sm'))
            : (isActive
                ? 'border-white shadow-[0_0_25px_rgba(255,255,255,0.08)] scale-[1.01]'
                : `${plan.border} hover:scale-[1.02] hover:-translate-y-1 shadow-sm`);

          const cardTitleColor = theme === 'light' ? 'text-slate-900' : plan.textColor;
          const cardPriceColor = theme === 'light' ? 'text-slate-900' : plan.priceColor;
          
          const cardSubtitleColor = theme === 'light'
            ? (plan.id === 'basic' ? 'text-blue-600'
               : plan.id === 'pro' ? 'text-violet-600'
               : plan.id === 'saset' ? 'text-orange-600'
               : 'text-slate-500')
            : plan.subtitleColor;

          const cardPeriodColor = theme === 'light' ? 'text-slate-500' : plan.periodColor;
          const cardFeatureColor = theme === 'light' ? 'text-slate-600 font-medium' : plan.featureColor;
          const cardDisabledColor = theme === 'light' ? 'text-slate-400' : plan.disabledColor;

          const cardDividerColor = theme === 'light'
            ? (plan.id === 'basic' ? 'border-indigo-100' : plan.id === 'pro' ? 'border-violet-100' : 'border-slate-100')
            : plan.dividerColor;

          const cardIconBg = theme === 'light'
            ? (plan.id === 'basic' ? 'bg-blue-100/50'
               : plan.id === 'pro' ? 'bg-purple-100/50'
               : plan.id === 'saset' ? 'bg-orange-100/50'
               : 'bg-slate-100/80')
            : plan.iconBg;

          const cardIconColor = theme === 'light'
            ? (plan.id === 'basic' ? 'text-blue-600'
               : plan.id === 'pro' ? 'text-purple-600'
               : plan.id === 'saset' ? 'text-orange-600'
               : 'text-slate-500')
            : plan.iconColor;

          const cardBtnClass = isFree
            ? (theme === 'light' ? 'bg-slate-100 text-slate-400 cursor-not-allowed hover:bg-slate-100' : 'bg-slate-800 text-slate-500 cursor-not-allowed')
            : (isActive
                ? 'bg-[#10B981] text-white'
                : plan.btnClass);

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 p-6 flex flex-col justify-between transition-all duration-300 ${cardBgClass} ${cardBorderClass}`}
            >
              {/* Badges */}
              {plan.popular && !isActive && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap animate-pulse flex items-center gap-1">
                  ⚡ PALING POPULER
                </div>
              )}
              {plan.badge && !isActive && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-purple-650 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                  {plan.badge}
                </div>
              )}
              {isActive && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#10B981] text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap flex items-center gap-1">
                  ✓ PAKET AKTIF ANDA
                </div>
              )}

              <div className="space-y-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Icon & Name */}
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${cardDividerColor} ${cardIconBg} shadow-sm`}>
                      <Icon className={`w-5 h-5 ${cardIconColor}`} />
                    </div>
                    <div>
                      <div className={`font-display font-black text-base leading-tight ${cardTitleColor}`}>{plan.name}</div>
                      <div className={`text-[10px] font-bold uppercase mt-0.5 ${cardSubtitleColor}`}>{plan.quota}</div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mt-5">
                    <div className="flex items-center gap-1">
                      <span className={`text-3xl font-black tracking-tight ${cardPriceColor}`}>{plan.priceLabel}</span>
                      <div className={`flex flex-col text-[10px] font-bold leading-none ml-1 ${cardPeriodColor}`}>
                        <span>/</span>
                        <span>{plan.period}</span>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className={`space-y-2.5 mt-6 border-t pt-5 ${cardDividerColor}`}>
                    {plan.features.map((f) => (
                      <li key={f} className={`flex items-start gap-2.5 text-xs font-semibold leading-tight ${cardFeatureColor}`}>
                        <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                    {plan.notIncluded?.map((f) => (
                      <li key={f} className={`flex items-start gap-2.5 text-xs font-medium leading-tight line-through ${cardDisabledColor}`}>
                        <span className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-center font-bold">—</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <button
                  id={`pricing-plan-${plan.id}-btn`}
                  disabled={isFree || isActive}
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full py-3 rounded-xl text-xs font-extrabold transition-all duration-200 hover:scale-[1.02] active:scale-98 disabled:opacity-100 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-1.5 mt-6 ${cardBtnClass}`}
                >
                  {isActive ? (
                    <>✓ Paket Aktif</>
                  ) : isFree ? (
                    'Paket Default'
                  ) : (
                    <>Pilih {plan.name} <ArrowRight className="w-3.5 h-3.5" /></>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Note */}
      <div className={`border rounded-2xl p-6 text-center space-y-2 max-w-xl mx-auto shadow-sm ${
        theme === 'light' 
          ? 'bg-white border-slate-200' 
          : 'bg-white/5 border-white/10'
      }`}>
        <p className={`text-sm font-extrabold flex items-center justify-center gap-1.5 ${
          theme === 'light' ? 'text-slate-900' : 'text-white'
        }`}>
          🇮🇩 Khusus untuk Guru Honorer Indonesia
        </p>
        <p className={`text-xs max-w-md mx-auto leading-relaxed ${
          theme === 'light' ? 'text-slate-600 font-medium' : 'text-slate-400'
        }`}>
          Semua paket mendukung format RPP Kurikulum Merdeka dan Soal Ujian sesuai standar Kemendikbud terbaru. Dokumen langsung siap diunduh dalam bentuk Word (.docx) tanpa watermark.
        </p>
      </div>

      {/* FAQ */}
      <div className={`space-y-6 pt-6 border-t ${theme === 'light' ? 'border-slate-200' : 'border-white/10'}`}>
        <h2 className="font-display font-black text-2xl text-ink text-center">Pertanyaan Umum</h2>
        <div className="space-y-3.5 max-w-2xl mx-auto">
          {faqs.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
