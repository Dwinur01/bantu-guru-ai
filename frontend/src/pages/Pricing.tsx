import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, Sparkles, Crown, Users, Star, ChevronDown, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

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
    period: '/ bulan',
    quota: '5 dokumen',
    color: 'text-slate-500',
    glowColor: 'hover:border-slate-300 hover:shadow-md',
    bg: 'bg-white/70',
    border: 'border-slate-200',
    btnClass: 'bg-slate-200 text-slate-600 cursor-not-allowed opacity-50',
    icon: Users,
    features: [
      '5 dokumen per bulan',
      'Generate RPP Kurikulum Merdeka',
      'Generate Soal Ujian (PG + Essay)',
      'Download format .docx',
      'Riwayat dokumen 30 hari',
    ],
    notIncluded: ['Unlimited dokumen', 'Template eksklusif KKG', 'Prioritas AI'],
  },
  {
    id: 'saset',
    name: 'Saset',
    price: 15000,
    priceLabel: 'Rp 15.000',
    period: '/ minggu',
    quota: '25 dokumen',
    color: 'text-amber-500',
    glowColor: 'card-glow-orange',
    bg: 'bg-[#FFFDF9]/80',
    border: 'border-amber-200',
    btnClass: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:shadow-lg hover:shadow-orange-500/20 text-white',
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
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 29000,
    priceLabel: 'Rp 29.000',
    period: '/ bulan',
    quota: 'Unlimited',
    color: 'text-blue-500',
    glowColor: 'card-glow-blue',
    bg: 'bg-blue-50/10',
    border: 'border-blue-200',
    btnClass: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/20 text-white',
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
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 49000,
    priceLabel: 'Rp 49.000',
    period: '/ bulan',
    quota: 'Unlimited + Pro',
    color: 'text-purple-600',
    glowColor: 'card-glow-purple',
    bg: 'bg-purple-50/10',
    border: 'border-purple-200',
    btnClass: 'bg-gradient-to-r from-purple-600 to-violet-700 hover:shadow-lg hover:shadow-purple-500/20 text-white',
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
  },
];

// ─── FAQ Accordion Item ───────────────────────────────────────────────────────
const FaqItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-rule/50 rounded-xl overflow-hidden transition-all duration-300 bg-white/60 hover:bg-white shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50/50 transition-colors"
      >
        <span className="font-bold text-sm text-slate-800 pr-4">{q}</span>
        <div className={`transition-transform duration-300 ${open ? 'rotate-180 text-blue-600' : 'text-slate-400'}`}>
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
        <div className="px-5 pb-4 text-xs text-muted leading-relaxed border-t border-rule/30 pt-3 bg-slate-50/20">
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
  const currentPlan = user?.plan || 'free';

  const handleSelectPlan = (planId: string) => {
    if (planId === 'free' || planId === currentPlan) return;
    navigate(`/payment/${planId}`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-4 animate-page">
      {/* Header */}
      <div className="text-center space-y-3.5">
        <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold border border-blue-100 animate-float">
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

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 p-6 flex flex-col justify-between transition-all duration-300 ${plan.glowColor} ${plan.border} ${plan.bg} ${
                isActive 
                  ? 'ring-4 ring-offset-2 ring-blue-500/20 border-blue-500 bg-blue-50/5' 
                  : 'hover:scale-[1.02] hover:-translate-y-1 shadow-sm hover:shadow-card-hover'
              }`}
            >
              {/* Badges */}
              {plan.popular && !isActive && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg whitespace-nowrap animate-pulse">
                  🚀 PALING POPULER
                </div>
              )}
              {plan.badge && !isActive && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
                  {plan.badge}
                </div>
              )}
              {isActive && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-success text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
                  ✓ PAKET AKTIF ANDA
                </div>
              )}

              <div className="space-y-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Icon & Name */}
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${plan.border} ${plan.bg} shadow-sm`}>
                      <Icon className={`w-5 h-5 ${plan.color}`} />
                    </div>
                    <div>
                      <div className="font-display font-black text-slate-800 leading-tight">{plan.name}</div>
                      <div className="text-[10px] font-bold text-muted uppercase mt-0.5">{plan.quota}</div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mt-5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-900 tracking-tight">{plan.priceLabel}</span>
                      <span className="text-xs text-muted font-semibold">{plan.period}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 mt-6 border-t border-slate-100 pt-5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium leading-tight">
                        <Check className="w-3.5 h-3.5 text-success mt-0.5 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                    {plan.notIncluded?.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-xs text-slate-400 font-medium leading-tight line-through opacity-45">
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
                  className={`w-full py-3 rounded-xl text-xs font-bold transition-all duration-200 hover:scale-[1.02] active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-1.5 mt-6 ${plan.btnClass}`}
                >
                  {isActive ? '✓ Paket Aktif' : isFree ? 'Paket Default' : (
                    <>Pilih {plan.name} <ArrowRight className="w-3.5 h-3.5" /></>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Note */}
      <div className="glass-card border border-white/50 rounded-2xl p-6 text-center space-y-2 hover-card-premium max-w-xl mx-auto shadow-sm">
        <p className="text-sm text-slate-800 font-extrabold flex items-center justify-center gap-1.5">
          🇮🇩 Khusus untuk Guru Honorer Indonesia
        </p>
        <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
          Semua paket mendukung format RPP Kurikulum Merdeka dan Soal Ujian sesuai standar Kemendikbud terbaru. Dokumen langsung siap diunduh dalam bentuk Word (.docx) tanpa watermark.
        </p>
      </div>

      {/* FAQ */}
      <div className="space-y-6 pt-6 border-t border-slate-100">
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
