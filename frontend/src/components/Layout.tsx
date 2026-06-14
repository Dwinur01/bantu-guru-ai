import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Sparkles, ClipboardList, FolderOpen, User,
  LogOut, Tag, CreditCard, BookOpen, GraduationCap,
  Menu, X, ChevronRight, Sun, Moon
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { api } from '../services/api';
import QuotaBanner, { UpgradeModal } from './QuotaBanner';
import { useTheme } from '../hooks/useTheme';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const shouldShowBanner =
    user &&
    (user.plan === 'free' || user.plan === 'saset') &&
    (user.showUpgradeBanner || (user.quotaPercentage !== undefined && user.quotaPercentage <= 20));

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout API error:', err);
    } finally {
      clearAuth();
      navigate('/login');
    }
  };

  const navItems = [
    { label: 'Dashboard',         mobileLabel: 'Dashboard',   path: '/dashboard',    icon: Home,         color: 'text-blue-400',   glow: 'rgba(59,130,246,0.6)' },
    { label: 'Buat RPP',          mobileLabel: 'Buat RPP',    path: '/rpp',          icon: Sparkles,     color: 'text-amber-400',  glow: 'rgba(251,191,36,0.6)' },
    { label: 'Buat Soal Ujian',   mobileLabel: 'Buat Soal',   path: '/soal',         icon: ClipboardList,color: 'text-green-400',  glow: 'rgba(52,211,153,0.6)' },
    { label: 'Buat Modul Ajar',   mobileLabel: 'Modul',       path: '/modul-ajar',   icon: BookOpen,     color: 'text-purple-400', glow: 'rgba(167,139,250,0.6)' },
    { label: 'Riwayat Dokumen',   mobileLabel: 'Riwayat',     path: '/riwayat',      icon: FolderOpen,   color: 'text-cyan-400',   glow: 'rgba(34,211,238,0.6)' },
    { label: 'Perpustakaan Guru', mobileLabel: 'Perpustakaan',path: '/perpustakaan', icon: GraduationCap,color: 'text-rose-400',   glow: 'rgba(251,113,133,0.6)' },
    { label: 'Paket Langganan',   mobileLabel: 'Paket',       path: '/pricing',      icon: Tag,          color: 'text-yellow-400', glow: 'rgba(250,204,21,0.6)' },
    { label: 'Riwayat Transaksi', mobileLabel: 'Transaksi',   path: '/billing',      icon: CreditCard,   color: 'text-indigo-400', glow: 'rgba(129,140,248,0.6)' },
    { label: 'Profil Guru',       mobileLabel: 'Profil',      path: '/profile',      icon: User,         color: 'text-sky-400',    glow: 'rgba(56,189,248,0.6)' },
  ];

  const activeItem = navItems.find((item) => location.pathname === item.path);

  const getPlanBadgeStyle = (plan: string) => {
    switch(plan) {
      case 'pro':   return 'bg-gradient-to-r from-purple-500 to-violet-600 text-white';
      case 'basic': return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white';
      case 'saset': return 'bg-gradient-to-r from-amber-400 to-orange-500 text-white';
      default:      return 'bg-white/10 text-white/70';
    }
  };

  // Sidebar content — reusable for both desktop and mobile
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 lg:px-5 border-b border-white/[0.07] gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0 animate-glow-blue">
          <img src="/logo-gurubantu.png" alt="GuruBantu AI" className="w-7 h-7 object-contain rounded-lg" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
        </div>
        <div className="hidden lg:block overflow-hidden">
          <span className="font-display font-black text-white text-base leading-tight block">
            GuruBantu <span className="gradient-text-blue">AI</span>
          </span>
          <span className="text-white/40 text-[10px] font-medium">Admin Guru Otomatis</span>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileSidebarOpen(false)}
              className={`nav-item group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'active bg-gradient-to-r from-white/[0.12] to-white/[0.05] border-l-[3px] border-l-brand-red text-white'
                  : 'text-white/60 hover:text-white'
              }`}
              style={isActive ? { boxShadow: 'inset 0 0 20px rgba(0,242,255,0.05)' } : {}}
            >
              <Icon
                className={`w-[18px] h-[18px] flex-shrink-0 transition-all duration-200 ${isActive ? item.color : 'text-white/40 group-hover:text-white/80'}`}
                style={isActive ? { filter: `drop-shadow(0 0 6px ${item.glow})` } : {}}
              />
              <span className="hidden lg:inline flex-1">{item.label}</span>
              {isActive && <ChevronRight className="hidden lg:block w-3.5 h-3.5 text-white/30 flex-shrink-0" />}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-3 border-t border-white/[0.07] space-y-1">
        {/* User info (desktop) */}
        {user && (
          <div className="hidden lg:flex items-center gap-2.5 px-3 py-2 mb-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
              user.emailVerified
                ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-[0_0_10px_rgba(52,211,153,0.5)]'
                : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
            }`}>
              {user.name ? user.name.substring(0,2).toUpperCase() : 'G'}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-white text-xs font-bold truncate leading-tight">{user.name || 'Guru'}</div>
              <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full inline-block mt-0.5 ${getPlanBadgeStyle(user.plan)}`}>
                {(user.plan || 'FREE').toUpperCase()}
              </div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 w-full text-white/50 hover:text-red-400 hover:bg-red-500/10 active:scale-95 group"
          title="Keluar dari Akun"
        >
          <LogOut className="w-[18px] h-[18px] flex-shrink-0 group-hover:text-red-400" />
          <span className="hidden lg:inline">Keluar</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-page text-ink flex flex-col font-sans">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[64px] lg:w-[240px] glass-dark flex-col z-30 transition-all duration-300">
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-glass-fade"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed left-0 top-0 h-screen w-[260px] glass-dark flex-col z-50 md:hidden transition-transform duration-300 ${
          mobileSidebarOpen ? 'flex translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <SidebarContent />
      </aside>

      {/* ── Main Content ── */}
      <div className="md:ml-[64px] lg:ml-[240px] flex-grow flex flex-col transition-all duration-300">

        {/* Top Header */}
        <header className="h-14 glass-dark border-b border-white/5 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20 shadow-md">
          {/* Left: Hamburger (mobile) + Page Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            {/* Logo Mobile */}
            <div className="md:hidden flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <img src="/logo-gurubantu.png" alt="GuruBantu AI" className="w-5 h-5 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
              </div>
              <span className="font-display font-black text-sm text-white">
                GuruBantu <span className="text-brand-red">AI</span>
              </span>
            </div>
            {/* Page Title — Desktop */}
            <div className="hidden md:flex items-center gap-2">
              {activeItem && (
                <div className={`w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/10 flex items-center justify-center`}>
                  <activeItem.icon className={`w-3.5 h-3.5 ${activeItem.color}`} />
                </div>
              )}
              <h1 className="font-bold text-base text-white">
                {activeItem ? activeItem.label : 'GuruBantu AI'}
              </h1>
            </div>
          </div>

          {/* Right: User info */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-slate-400 font-medium">
              Halo, <span className="font-bold text-white">{user?.name?.split(' ')[0] || 'Guru'}</span>
            </span>
            {user?.plan && (
              <span className={`hidden lg:inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide ${getPlanBadgeStyle(user.plan)}`}>
                {user.plan.toUpperCase()}
              </span>
            )}
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors hover:bg-white/5 flex items-center justify-center"
              title={theme === 'light' ? 'Aktifkan Mode Gelap' : 'Aktifkan Mode Terang'}
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
              user?.emailVerified
                ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-[0_0_12px_rgba(52,211,153,0.5)]'
                : 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-[0_0_12px_rgba(0,242,255,0.4)]'
            }`}>
              {user?.name ? user.name.substring(0, 2).toUpperCase() : 'G'}
            </div>
            {/* Quick Logout — Mobile only */}
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors hover:bg-white/5 md:hidden"
              title="Keluar"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Quota Banner */}
        {shouldShowBanner && (
          <QuotaBanner
            quotaRemaining={user?.quotaRemaining ?? user?.quota_remaining ?? 0}
            quotaPercentage={user?.quotaPercentage ?? 0}
            plan={user?.plan ?? 'free'}
            onUpgradeClick={() => setShowUpgradeModal(true)}
          />
        )}

        {/* Page Content */}
        <main key={location.pathname} className="p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto flex-grow animate-page text-white">
          {children}
        </main>

        {/* Mobile bottom spacer */}
        <div className="md:hidden h-20" />
      </div>

      {/* ── Mobile Bottom Tab Bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 glass-dark border-t border-white/5 flex items-center justify-around px-1 shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
        {navItems.slice(0, 5).map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full py-2 px-1 transition-all duration-200 ${
                isActive ? 'text-brand-red' : 'text-slate-400'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all duration-200 ${
                isActive ? 'bg-white/5 shadow-inner' : ''
              }`}>
                <Icon
                  className={`w-4.5 h-4.5 transition-all ${isActive ? item.color : ''}`}
                  style={isActive ? { filter: `drop-shadow(0 0 4px ${item.glow})` } : {}}
                />
              </div>
              <span className="text-[9px] font-bold tracking-tight">{item.mobileLabel}</span>
            </Link>
          );
        })}
      </nav>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onNavigatePricing={() => { setShowUpgradeModal(false); navigate('/pricing'); }}
      />

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/6282132775342?text=Halo%20Admin%20GuruBantu%20AI%2C%20saya%20guru%20pengguna%20GuruBantu%20dan%20memerlukan%20bantuan..."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-30 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-3 rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_8px_30px_rgba(37,211,102,0.5)] active:scale-95 transition-all duration-200 font-bold text-sm"
        title="Chat Admin GuruBantu via WhatsApp"
      >
        <svg className="w-5 h-5 fill-current flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="hidden sm:inline">Bantuan</span>
      </a>
    </div>
  );
};
