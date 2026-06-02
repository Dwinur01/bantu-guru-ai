import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Sparkles, ClipboardList, FolderOpen, User, LogOut, Tag, CreditCard } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { api } from '../services/api';
import QuotaBanner, { UpgradeModal } from './QuotaBanner';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Tampil banner jika user Free/Saset dengan kuota ≤ 20%
  const shouldShowBanner =
    user &&
    (user.plan === 'free' || user.plan === 'saset') &&
    (user.showUpgradeBanner || (user.quotaPercentage !== undefined && user.quotaPercentage <= 20));

  const handleLogout = async () => {
    try {
      // Panggil API logout di backend agar HTTP-only cookie dicabut
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout API error:', err);
    } finally {
      // Selalu bersihkan status auth lokal demi kehandalan
      clearAuth();
      navigate('/login');
    }
  };

  const navItems = [
    { label: 'Dashboard', mobileLabel: 'Dashboard', path: '/dashboard', icon: Home },
    { label: 'Buat RPP', mobileLabel: 'Buat RPP', path: '/rpp', icon: Sparkles },
    { label: 'Buat Soal Ujian', mobileLabel: 'Buat Soal', path: '/soal', icon: ClipboardList },
    { label: 'Riwayat Dokumen', mobileLabel: 'Riwayat', path: '/riwayat', icon: FolderOpen },
    { label: 'Paket Langganan', mobileLabel: 'Paket', path: '/pricing', icon: Tag },
    { label: 'Riwayat Transaksi', mobileLabel: 'Transaksi', path: '/billing', icon: CreditCard },
    { label: 'Profil Guru', mobileLabel: 'Profil', path: '/profile', icon: User },
  ];

  const activeItem = navItems.find((item) => location.pathname === item.path);

  return (
    <div className="min-h-screen bg-page text-ink flex flex-col font-sans">
      {/* 1. Sidebar untuk Tablet (768px-1023px) & Desktop (≥1024px) */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-16 lg:w-60 bg-brand-dark flex-col z-30 transition-all duration-200 shadow-sm border-r border-white/5">
        {/* Logo Area */}
        <div className="h-14 flex items-center px-4 lg:px-6 border-b border-white/10 justify-center lg:justify-start gap-2.5">
          <div className="bg-[#E8F5EE] text-[#1A7A4A] p-2 rounded-lg flex-shrink-0 shadow-sm">
            <Sparkles className="w-5 h-5 text-success" />
          </div>
          <span className="font-display font-black text-lg text-white hidden lg:inline tracking-wide">
            GuruBantu <span className="text-brand-red">AI</span>
          </span>
        </div>

        {/* Menu Navigasi Utama */}
        <nav className="flex-1 px-2 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-3 lg:py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 justify-center lg:justify-start ${
                  isActive
                    ? 'bg-white/15 text-white border-l-[3px] border-brand-red shadow-inner'
                    : 'text-white/70 hover:bg-white/10 hover:text-white hover:-translate-y-0.5 lg:hover:translate-y-0'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Tombol Logout Sidebar */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 lg:py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 justify-center lg:justify-start w-full text-white/60 hover:bg-[#FCEAE6] hover:text-[#C84B2F] active:scale-95 group"
            title="Keluar dari Akun"
          >
            <LogOut className="w-5 h-5 flex-shrink-0 group-hover:animate-pulse" />
            <span className="hidden lg:inline">Keluar</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Wrapper */}
      <div className="md:ml-16 lg:ml-60 flex-grow flex flex-col transition-all duration-200">
        {/* Top Header Responsif */}
        <header className="h-14 border-b border-rule bg-white/95 backdrop-blur-sm flex items-center justify-between px-4 md:px-6 sticky top-0 z-20 shadow-sm">
          {/* Sisi Kiri: Judul Halaman atau Logo Mobile */}
          <div className="flex items-center gap-2.5">
            {/* Logo Mobile saja (hidden di tablet/desktop) */}
            <div className="md:hidden flex items-center gap-2">
              <div className="bg-[#E8F5EE] text-[#1A7A4A] p-1.5 rounded-lg">
                <Sparkles className="w-4 h-4 text-success" />
              </div>
              <span className="font-display font-black text-sm text-brand-dark tracking-wide">
                GuruBantu <span className="text-brand-red">AI</span>
              </span>
            </div>

            {/* Judul Halaman Desktop/Tablet */}
            <h1 className="hidden md:block font-bold text-lg text-ink font-sans">
              {activeItem ? activeItem.label : 'GuruBantu AI'}
            </h1>
          </div>

          {/* Sisi Kanan: Status Akun / Profil */}
          <div className="flex items-center gap-3.5">
            {/* Nama Panggilan Pengguna */}
            <span className="hidden sm:inline text-sm text-ink font-medium">
              Halo, <span className="font-bold text-[#1F4E79]">{user?.name || 'Guru'}</span>
            </span>

            {/* Status Plan Badge */}
            {user?.plan && (
              <span className={`hidden lg:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                user.plan === 'free'
                  ? 'bg-[#F2F2F2] text-[#737373]'
                  : user.plan === 'saset'
                  ? 'bg-warning-bg text-warning border border-warning/20'
                  : 'bg-brand-pale text-brand-mid border border-brand-mid/20'
              }`}>
                {user.plan.toUpperCase()}
              </span>
            )}

            {/* Avatar Inisial */}
            <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand-dark text-xs font-bold border border-brand-mid/20 shadow-sm">
              {user?.name ? user.name.substring(0, 2).toUpperCase() : 'G'}
            </div>

            {/* Quick Logout Header (Mobile Only) */}
            <button
              onClick={handleLogout}
              className="p-2 text-muted hover:text-brand-red rounded-lg transition-colors hover:bg-neutral-100 md:hidden"
              title="Keluar dari Akun"
              aria-label="Logout"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </header>

        {/* QuotaBanner — Tampil di bawah header jika kuota hampir/sudah habis */}
        {shouldShowBanner && (
          <QuotaBanner
            quotaRemaining={user?.quotaRemaining ?? user?.quota_remaining ?? 0}
            quotaPercentage={user?.quotaPercentage ?? 0}
            plan={user?.plan ?? 'free'}
            onUpgradeClick={() => setShowUpgradeModal(true)}
          />
        )}

        {/* Halaman Utama Anak */}
        <main className="p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto flex-grow">
          {children}
        </main>

        {/* Buffer Spacing Bottom Mobile untuk Nav Tab */}
        <div className="md:hidden h-14" />
      </div>

      {/* 3. Bottom Tab Bar untuk Mobile (≤767px) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-rule flex items-center justify-around h-14 px-2 safe-area-bottom shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full py-1.5 px-1 transition-all duration-150 ${
                isActive
                  ? 'text-brand-red border-t-2 border-brand-red font-bold'
                  : 'text-muted border-t-2 border-transparent'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-[10px] tracking-tight">{item.mobileLabel}</span>
            </Link>
          );
        })}
      </nav>

      {/* Upgrade Modal — Muncul saat kuota habis */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onNavigatePricing={() => { setShowUpgradeModal(false); navigate('/profile'); }}
      />
    </div>
  );
};
