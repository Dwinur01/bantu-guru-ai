import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Shield,
  Calendar,
  Edit3,
  Check,
  Trash2,
  AlertTriangle,
  Zap,
  Sparkles,
  Crown,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { api } from '../services/api';
import { useTheme } from '../hooks/useTheme';

// ─── Types ─────────────────────────────────────────────────────────────────
interface ProfileData {
  id: number;
  name: string;
  email: string;
  plan: string;
  quotaRemaining: number;
  quotaPercentage: number;
  emailVerified: boolean;
  createdAt: string;
  activeSubscription: {
    plan: string;
    status: string;
    expiresAt: string;
  } | null;
}

// ─── Plan Config ────────────────────────────────────────────────────────────
const planConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  free:  { label: 'Gratis',  color: 'text-slate-400',   bg: 'bg-white/5',          border: 'border-white/10',             icon: User },
  saset: { label: 'Saset',   color: 'text-amber-400',   bg: 'bg-amber-500/10',     border: 'border-amber-500/20',         icon: Zap },
  basic: { label: 'Basic',   color: 'text-blue-400',    bg: 'bg-blue-500/10',      border: 'border-blue-500/20',          icon: Sparkles },
  pro:   { label: 'Pro',     color: 'text-purple-400',  bg: 'bg-purple-500/10',    border: 'border-purple-500/20',        icon: Crown },
};

// ─── Delete Confirmation Modal ───────────────────────────────────────────────
interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  step: 1 | 2;
  onNextStep: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm, isLoading, step, onNextStep }) => {
  const { theme } = useTheme();
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className={`relative rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5 animate-bounce-in border ${
        theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#131318] border-[#272730]'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="font-display font-black text-ink text-lg">
              {step === 1 ? 'Hapus Akun?' : 'Konfirmasi Terakhir'}
            </h3>
            <p className="text-xs text-muted">
              {step === 1
                ? 'Tindakan ini tidak dapat langsung dibatalkan.'
                : 'Ketik HAPUS untuk melanjutkan.'}
            </p>
          </div>
        </div>

        {step === 1 ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-400 space-y-2">
            <p className="font-bold">Dengan menghapus akun, Anda akan kehilangan:</p>
            <ul className="space-y-1 text-xs list-disc list-inside">
              <li>Semua dokumen RPP dan Soal Ujian yang tersimpan</li>
              <li>Riwayat langganan dan transaksi</li>
              <li>Akses ke semua fitur GuruBantu AI</li>
            </ul>
            <p className="text-xs mt-2 font-medium">Akun akan dihapus dalam <strong>24 jam</strong>. Anda bisa membatalkan melalui link di email.</p>
          </div>
        ) : (
          <ConfirmDeleteInput onConfirm={onConfirm} isLoading={isLoading} />
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className={`flex-1 py-2.5 border rounded-xl text-sm font-semibold transition-colors ${
              theme === 'light' ? 'border-slate-200 text-slate-700 hover:bg-slate-50' : 'border-white/5 text-slate-350 hover:bg-white/5'
            }`}
          >
            Batal
          </button>
          {step === 1 && (
            <button
              onClick={onNextStep}
              className="flex-1 py-2.5 bg-brand-red text-slate-950 rounded-xl text-sm font-bold hover:bg-blue-400 transition-colors"
            >
              Lanjutkan
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ConfirmDeleteInput: React.FC<{ onConfirm: () => void; isLoading: boolean }> = ({ onConfirm, isLoading }) => {
  const [value, setValue] = useState('');
  const { theme } = useTheme();
  return (
    <div className="space-y-3">
      <p className="text-sm text-ink">Ketik <strong className="text-red-500 font-bold">HAPUS</strong> di bawah untuk konfirmasi:</p>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={`w-full px-4 py-2.5 border rounded-xl text-sm font-mono focus:outline-none focus:border-red-550 ${
          theme === 'light' ? 'bg-white border-slate-300 text-slate-800' : 'bg-[#0a0a0f] border-red-500/40 text-white'
        }`}
        placeholder="Ketik HAPUS"
        autoFocus
      />
      <button
        onClick={onConfirm}
        disabled={value !== 'HAPUS' || isLoading}
        className="w-full py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-700 transition-colors"
      >
        {isLoading ? 'Memproses...' : 'Ya, Hapus Akun Saya'}
      </button>
    </div>
  );
};

// ─── Main Profile Page ────────────────────────────────────────────────────────
export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, setAuth, clearAuth, accessToken } = useAuthStore();
  const { theme } = useTheme();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Edit Name state
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [nameError, setNameError] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);

  // Delete state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteStep, setDeleteStep] = useState<1 | 2>(1);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // Error
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const res = await api.get<{ success: boolean; data: ProfileData }>('/user/me');
        setProfile(res.data.data);
      } catch {
        setError('Gagal memuat profil. Silakan refresh halaman.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ─── Update Name ─────────────────────────────────────────────────────────
  const handleStartEdit = () => {
    setNewName(profile?.name || user?.name || '');
    setNameError('');
    setIsEditingName(true);
    setNameSaved(false);
  };

  const handleSaveName = async () => {
    if (!newName.trim() || newName.trim().length < 2) {
      setNameError('Nama minimal 2 karakter.');
      return;
    }
    setIsSavingName(true);
    setNameError('');
    try {
      const res = await api.patch<{ success: boolean; data: { name: string } }>('/user/me', { name: newName.trim() });
      if (res.data.success) {
        setProfile((p) => p ? { ...p, name: res.data.data.name } : p);
        // Update Zustand store agar nama langsung berubah di sidebar/header
        if (user && accessToken) {
          setAuth({ ...user, name: res.data.data.name }, accessToken);
        }
        setIsEditingName(false);
        setNameSaved(true);
        setTimeout(() => setNameSaved(false), 3000);
      }
    } catch {
      setNameError('Gagal menyimpan nama. Coba lagi.');
    } finally {
      setIsSavingName(false);
    }
  };

  // ─── Delete Account ───────────────────────────────────────────────────────
  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      await api.delete('/user/me');
      setDeleteSuccess(true);
      setShowDeleteModal(false);
      // Logout setelah 3 detik
      setTimeout(() => {
        clearAuth();
        navigate('/login');
      }, 3500);
    } catch {
      setError('Gagal memproses permintaan penghapusan. Coba lagi.');
      setShowDeleteModal(false);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch { /* ignore */ }
    clearAuth();
    navigate('/login');
  };

  const cfg = planConfig[profile?.plan || user?.plan || 'free'] || planConfig.free;
  const PlanIcon = cfg.icon;

  // ─── Quota Bar ────────────────────────────────────────────────────────────
  const quotaPct = profile?.quotaPercentage ?? user?.quotaPercentage ?? 100;
  const quotaRem = profile?.quotaRemaining ?? user?.quotaRemaining ?? user?.quota_remaining ?? 0;
  const isUnlimited = profile?.plan === 'basic' || profile?.plan === 'pro';

  const quotaBarColor =
    quotaPct <= 20 ? 'bg-error' :
    quotaPct <= 50 ? 'bg-[#D97706]' :
    'bg-success';

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-5 animate-pulse">
        {[1,2,3].map(i => (
          <div key={i} className="bg-cream/90 rounded-xl p-6 space-y-4 border border-rule">
            <div className="h-4 bg-glass/10 rounded w-1/3" />
            <div className="h-8 bg-glass/10 rounded w-2/3" />
            <div className="h-3 bg-glass/10 rounded w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="font-display font-black text-2xl text-ink">Profil Saya</h1>
        <p className="text-sm text-muted mt-0.5">Kelola informasi akun dan langganan Anda.</p>
      </div>

      {/* Delete success notice */}
      {deleteSuccess && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-400 text-sm">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>Permintaan penghapusan akun diterima. Akun akan dihapus dalam 24 jam. Silakan cek email Anda untuk membatalkan jika berubah pikiran.</span>
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* ── 1. Informasi Akun ─────────────────────────────────────────────── */}
      <div className="bg-cream/90 border border-rule rounded-xl p-6 space-y-5 shadow-sm">
        {/* Avatar + Plan Badge */}
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-brand-red text-2xl font-black border shadow-sm ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
            {(profile?.name || user?.name || 'G').substring(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display font-black text-xl text-ink truncate">
                {profile?.name || user?.name || 'Guru'}
              </h2>
              {nameSaved && (
                <span className="flex items-center gap-1 text-xs text-success font-semibold animate-pulse">
                  <Check className="w-3 h-3" /> Tersimpan
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                <PlanIcon className="w-3 h-3" />
                {cfg.label}
              </span>
              {profile?.emailVerified && (
                <span className="inline-flex items-center gap-1 text-xs text-success font-medium">
                  <Shield className="w-3 h-3" /> Email Terverifikasi
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-rule" />

        {/* Info Fields */}
        <div className="space-y-4">
          {/* Nama — Editable */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <User className="w-4 h-4 text-muted mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted font-medium uppercase tracking-wider">Nama Lengkap</p>
                {isEditingName ? (
                  <div className="mt-1 space-y-1.5 animate-in slide-in-from-top-1 duration-200">
                    <input
                      id="profile-name-input"
                      type="text"
                      value={newName}
                      onChange={(e) => { setNewName(e.target.value); setNameError(''); }}
                      className={`w-full px-3 py-2 border-2 rounded-xl text-sm font-medium focus:outline-none transition-colors ${
                        theme === 'light'
                          ? (nameError ? 'border-red-500 text-slate-800' : 'border-slate-350 focus:border-blue-500 text-slate-800 bg-white')
                          : (nameError ? 'border-red-500 text-white' : 'border-white/10 focus:border-blue-500 text-white bg-[#0a0a0f]')
                      }`}
                      placeholder="Nama lengkap Anda"
                      autoFocus
                      onKeyDown={(e) => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') setIsEditingName(false); }}
                    />
                    {nameError && <p className="text-xs text-error">{nameError}</p>}
                    <div className="flex gap-2">
                      <button
                        id="save-name-btn"
                        onClick={handleSaveName}
                        disabled={isSavingName}
                        className="flex items-center gap-1 px-3 py-1.5 bg-success text-white rounded-lg text-xs font-bold hover:bg-[#15803d] disabled:opacity-50 transition-colors"
                      >
                        <Check className="w-3 h-3" />
                        {isSavingName ? 'Menyimpan...' : 'Simpan'}
                      </button>
                      <button onClick={() => setIsEditingName(false)} className={`px-3 py-1.5 border rounded-lg text-xs font-semibold text-muted transition-colors ${theme === 'light' ? 'border-slate-200 hover:bg-slate-50' : 'border-white/5 hover:bg-white/5'}`}>
                        Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm font-bold text-ink mt-0.5">{profile?.name || user?.name || '—'}</p>
                )}
              </div>
            </div>
            {!isEditingName && (
              <button
                id="edit-name-btn"
                onClick={handleStartEdit}
                className={`p-2 rounded-lg transition-colors text-muted hover:text-ink flex-shrink-0 ${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-white/5'}`}
                title="Edit nama"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Email */}
          <div className="flex items-start gap-3">
            <Mail className="w-4 h-4 text-muted mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted font-medium uppercase tracking-wider">Email</p>
              <p className="text-sm font-bold text-ink mt-0.5">{profile?.email || user?.email || '—'}</p>
            </div>
          </div>

          {/* Bergabung */}
          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-muted mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted font-medium uppercase tracking-wider">Bergabung Sejak</p>
              <p className="text-sm font-bold text-ink mt-0.5">
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
                  : '—'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Kuota & Status Langganan ────────────────────────────────────── */}
      <div className="bg-cream/90 border border-rule rounded-xl p-6 space-y-4 shadow-sm">
        <h3 className="font-display font-bold text-base text-ink flex items-center gap-2">
          <Zap className="w-4 h-4 text-brand-red" /> Status Kuota & Langganan
        </h3>

        {/* Kuota Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted font-medium">Kuota Tersedia</span>
            <span className="font-black text-ink">
              {isUnlimited ? 'Unlimited ∞' : `${quotaRem} dokumen (${quotaPct}%)`}
            </span>
          </div>
          {!isUnlimited && (
            <div className="w-full h-2.5 bg-glass/10 rounded-full overflow-hidden border border-rule">
              <div
                className={`h-full rounded-full transition-all duration-700 ${quotaBarColor}`}
                style={{ width: `${Math.max(2, quotaPct)}%` }}
              />
            </div>
          )}
        </div>

        {/* Subscription Info */}
        {profile?.activeSubscription ? (
          <div className={`rounded-xl p-4 border ${cfg.border} ${cfg.bg} flex items-center justify-between`}>
            <div>
              <p className={`text-xs font-bold uppercase tracking-wider ${cfg.color}`}>Langganan Aktif</p>
              <p className="text-sm font-bold text-ink mt-0.5">
                Paket {cfg.label} — Berakhir{' '}
                {new Date(profile.activeSubscription.expiresAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <PlanIcon className={`w-8 h-8 ${cfg.color} opacity-50`} />
          </div>
        ) : (
          <div className={`rounded-xl p-4 border flex items-center justify-between ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
            <div>
              <p className="text-xs text-muted font-bold uppercase tracking-wider">Paket Aktif</p>
              <p className="text-sm font-bold text-ink mt-0.5">Gratis — 5 dokumen / bulan</p>
            </div>
            <button
              id="profile-upgrade-btn"
              onClick={() => navigate('/pricing')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-red text-slate-950 rounded-lg text-xs font-bold hover:bg-blue-400 transition-all hover:scale-105"
            >
              <Zap className="w-3 h-3" /> Upgrade
            </button>
          </div>
        )}
      </div>

      {/* ── 3. Pilihan Paket ────────────────────────────────────────────────── */}
      <div className="bg-cream/90 border border-rule rounded-xl p-6 space-y-4 shadow-sm">
        <h3 className="font-display font-bold text-base text-ink flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-red" /> Tingkatkan Paket
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'saset', name: 'Saset', price: 'Rp 15.000', period: '/ minggu', quota: '25 dok/minggu', icon: Zap, color: 'text-amber-400', bg: 'bg-[#1E1B15]', border: 'border-amber-500/30', cta: 'bg-[#EA580C] hover:bg-[#D97706]' },
            { id: 'basic', name: 'Basic', price: 'Rp 29.000', period: '/ bulan', quota: 'Unlimited', icon: Sparkles, color: 'text-blue-400', bg: 'bg-[#121217]', border: 'border-blue-500/30', cta: 'bg-[#2563EB] hover:bg-[#1D4ED8]', popular: true },
            { id: 'pro',   name: 'Pro',   price: 'Rp 49.000', period: '/ bulan', quota: 'Unlimited + Pro', icon: Crown, color: 'text-purple-400', bg: 'bg-[#0B0B0F]', border: 'border-purple-500/30', cta: 'bg-[#6B21A8] hover:bg-[#581C87]' },
          ].map((p) => {
            const Icon = p.icon;
            const isActive = profile?.plan === p.id;

            const cardBg = theme === 'light'
              ? (p.id === 'basic' ? 'bg-gradient-to-br from-blue-50/95 via-indigo-50/90 to-white/95 text-slate-800'
                 : p.id === 'pro' ? 'bg-gradient-to-br from-purple-50/95 via-violet-50/90 to-white/95 text-slate-800'
                 : 'bg-white text-slate-800')
              : p.bg;

            const cardBorder = theme === 'light'
              ? (isActive ? 'border-indigo-600'
                 : (p.id === 'basic' ? 'border-indigo-200/80 hover:border-indigo-400' : p.id === 'pro' ? 'border-violet-200/80 hover:border-violet-400' : 'border-orange-200/80 hover:border-orange-400'))
              : p.border;

            const cardIconColor = theme === 'light'
              ? (p.id === 'basic' ? 'text-blue-600' : p.id === 'pro' ? 'text-purple-600' : 'text-orange-600')
              : p.color;

            const cardPriceColor = theme === 'light' ? 'text-slate-900' : p.color;

            return (
              <div key={p.id} className={`relative rounded-xl border-2 ${cardBorder} ${cardBg} p-4 flex flex-col gap-2 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg ${isActive ? 'ring-2 ring-offset-1 ring-[#00f2ff]' : ''}`}>
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-red text-slate-950 text-[9px] font-black px-2.5 py-0.5 rounded-full shadow-md">POPULER</span>
                )}
                {isActive && (
                  <span className="absolute -top-3 right-3 bg-success text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-md">AKTIF</span>
                )}
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${cardIconColor}`} />
                  <span className="font-bold text-ink">{p.name}</span>
                </div>
                <div>
                  <span className={`text-lg font-black ${cardPriceColor}`}>{p.price}</span>
                  <span className="text-xs text-muted">{p.period}</span>
                </div>
                <p className="text-xs text-muted">{p.quota}</p>
                <button
                  id={`profile-plan-${p.id}-btn`}
                  disabled={isActive}
                  className={`mt-auto w-full py-2 rounded-lg text-white text-xs font-bold transition-all hover:scale-[1.02] active:scale-95 ${p.cta} disabled:opacity-40 disabled:cursor-not-allowed`}
                  onClick={() => navigate('/pricing')}
                >
                  {isActive ? 'Paket Aktif' : `Pilih ${p.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 4. Aksi Akun ─────────────────────────────────────────────────────── */}
      <div className="bg-cream/90 border border-rule rounded-xl p-6 space-y-3 shadow-sm">
        <h3 className="font-display font-bold text-base text-ink">Pengaturan Akun</h3>

        <button
          id="profile-logout-btn"
          onClick={handleLogout}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-colors text-sm font-medium text-ink group ${theme === 'light' ? 'border-slate-200 hover:bg-slate-50' : 'border-white/5 hover:bg-white/5'}`}
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-4 h-4 text-muted group-hover:text-red-400 transition-colors" />
            <span>Keluar dari Akun</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted" />
        </button>

        <div className="border-t border-rule pt-3">
          <p className="text-xs text-muted mb-2 font-semibold uppercase tracking-wider">Zona Bahaya</p>
          <button
            id="profile-delete-account-btn"
            onClick={() => { setDeleteStep(1); setShowDeleteModal(true); }}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-red-500/10 hover:bg-red-500/5 transition-colors text-sm font-medium text-red-400 group"
          >
            <div className="flex items-center gap-3">
              <Trash2 className="w-4 h-4" />
              <span>Hapus Akun Saya</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted" />
          </button>
          <p className="text-xs text-muted mt-1.5 px-1">Akun akan dihapus permanen setelah 24 jam. Seluruh dokumen dan data Anda akan ikut terhapus.</p>
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setDeleteStep(1); }}
        onConfirm={handleDeleteAccount}
        isLoading={isDeletingAccount}
        step={deleteStep}
        onNextStep={() => setDeleteStep(2)}
      />
    </div>
  );
};

export default Profile;
