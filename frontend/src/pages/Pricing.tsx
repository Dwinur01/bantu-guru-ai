import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, Sparkles, Crown, Users, Star, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
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
    color: 'text-neutral-600',
    bg: 'bg-neutral-50',
    border: 'border-neutral-200',
    btnClass: 'bg-neutral-200 text-neutral-600 cursor-default',
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
    color: 'text-[#D97706]',
    bg: 'bg-[#FFF8E7]',
    border: 'border-[#FDE68A]',
    btnClass: 'bg-[#D97706] hover:bg-[#B45309] text-white',
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
    color: 'text-brand-red',
    bg: 'bg-brand-pale',
    border: 'border-brand-red',
    btnClass: 'bg-brand-red hover:bg-brand-hover text-white',
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
    color: 'text-[#7C3AED]',
    bg: 'bg-[#F5F3FF]',
    border: 'border-[#DDD6FE]',
    btnClass: 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white',
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
    <div className="border border-rule rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-neutral-50 transition-colors"
      >
        <span className="font-semibold text-sm text-ink pr-4">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-muted flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-muted leading-relaxed border-t border-rule">
          <p className="pt-3">{a}</p>
        </div>
      )}
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
    <div className="max-w-5xl mx-auto space-y-12 py-4">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-brand-pale text-brand-red px-4 py-1.5 rounded-full text-xs font-bold border border-brand-red/20">
          <Star className="w-3.5 h-3.5" /> Pilih Paket Terbaik untuk Anda
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-ink">
          Harga yang <span className="text-brand-red">Transparan</span>
        </h1>
        <p className="text-muted text-sm max-w-lg mx-auto leading-relaxed">
          Mulai gratis, tingkatkan kapan saja. Tidak ada biaya tersembunyi, tidak ada kontrak jangka panjang.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isActive = currentPlan === plan.id;
          const isFree = plan.id === 'free';

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 p-5 flex flex-col gap-4 transition-all duration-200 hover:shadow-lg ${
                plan.popular ? 'hover:-translate-y-1 shadow-md' : 'hover:-translate-y-0.5'
              } ${plan.border} ${plan.bg} ${isActive ? 'ring-2 ring-offset-2 ring-brand-red' : ''}`}
            >
              {/* Badges */}
              {plan.popular && !isActive && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-red text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                  PALING POPULER
                </div>
              )}
              {plan.badge && !isActive && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#7C3AED] text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                  {plan.badge}
                </div>
              )}
              {isActive && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-success text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                  ✓ PAKET AKTIF ANDA
                </div>
              )}

              {/* Icon & Name */}
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${plan.border} ${plan.bg}`}>
                  <Icon className={`w-4.5 h-4.5 ${plan.color}`} />
                </div>
                <div>
                  <div className="font-display font-black text-ink">{plan.name}</div>
                  <div className="text-xs text-muted">{plan.quota}</div>
                </div>
              </div>

              {/* Price */}
              <div>
                <div className="flex items-end gap-1">
                  <span className={`text-2xl font-black ${plan.color}`}>{plan.priceLabel}</span>
                </div>
                <span className="text-xs text-muted">{plan.period}</span>
              </div>

              {/* Features */}
              <ul className="space-y-1.5 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-ink">
                    <Check className="w-3.5 h-3.5 text-success mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
                {plan.notIncluded?.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-muted line-through opacity-50">
                    <span className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-center">—</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                id={`pricing-plan-${plan.id}-btn`}
                disabled={isFree || isActive}
                onClick={() => handleSelectPlan(plan.id)}
                className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-1.5 ${plan.btnClass}`}
              >
                {isActive ? '✓ Paket Aktif' : isFree ? 'Paket Default' : (
                  <>Pilih {plan.name} <ArrowRight className="w-3.5 h-3.5" /></>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Comparison Note */}
      <div className="bg-white border border-rule rounded-2xl p-6 text-center space-y-2">
        <p className="text-sm text-ink font-semibold">🎓 Khusus untuk Guru Honorer Indonesia</p>
        <p className="text-xs text-muted max-w-md mx-auto">
          Semua paket mendukung RPP Kurikulum Merdeka dan Soal Ujian sesuai standar Kemendikbud. 
          Dokumen langsung bisa digunakan tanpa editing tambahan.
        </p>
      </div>

      {/* FAQ */}
      <div className="space-y-4">
        <h2 className="font-display font-black text-xl text-ink text-center">Pertanyaan Umum</h2>
        <div className="space-y-3 max-w-2xl mx-auto">
          {faqs.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
