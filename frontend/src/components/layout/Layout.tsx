import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Sparkles, ClipboardList, FolderOpen, User,
  Tag, CreditCard, BookOpen, GraduationCap
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import QuotaBanner, { UpgradeModal } from '../QuotaBanner';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileNav } from './MobileNav';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const shouldShowBanner =
    user &&
    (user.plan === 'free' || user.plan === 'saset') &&
    (user.showUpgradeBanner || (user.quotaPercentage !== undefined && user.quotaPercentage <= 20));

  const handleLogout = async () => {
    await logout();
    navigate('/login');
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
    switch (plan) {
      case 'pro':
        return 'bg-gradient-to-r from-purple-500 to-violet-600 text-white';
      case 'basic':
        return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white';
      case 'saset':
        return 'bg-gradient-to-r from-amber-400 to-orange-500 text-white';
      default:
        return 'bg-white/10 text-white/70';
    }
  };

  return (
    <div className="min-h-screen bg-page text-ink flex flex-col font-sans transition-colors duration-300">
      {/* Sidebar (handles desktop and mobile drawer) */}
      <Sidebar
        user={user}
        navItems={navItems}
        onLogout={handleLogout}
        getPlanBadgeStyle={getPlanBadgeStyle}
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
      />

      {/* Main Content Wrapper */}
      <div className="md:ml-[64px] lg:ml-[240px] flex-grow flex flex-col transition-all duration-300">
        {/* Top Header Bar */}
        <TopBar
          user={user}
          activeItem={activeItem}
          theme={theme}
          toggleTheme={toggleTheme}
          onLogout={handleLogout}
          setMobileSidebarOpen={setMobileSidebarOpen}
          getPlanBadgeStyle={getPlanBadgeStyle}
        />

        {/* Quota warning banner */}
        {shouldShowBanner && (
          <QuotaBanner
            quotaRemaining={user?.quotaRemaining ?? user?.quota_remaining ?? 0}
            quotaPercentage={user?.quotaPercentage ?? 0}
            plan={user?.plan ?? 'free'}
            onUpgradeClick={() => setShowUpgradeModal(true)}
          />
        )}

        {/* Dynamic Route Content */}
        <main key={location.pathname} className="p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto flex-grow animate-page text-ink">
          {children}
        </main>

        {/* Mobile bottom padding for tab bar */}
        <div className="md:hidden h-20" />
      </div>

      {/* Mobile Bottom Tab Navigation */}
      <MobileNav navItems={navItems} />

      {/* Subscription upgrade dialog */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onNavigatePricing={() => {
          setShowUpgradeModal(false);
          navigate('/pricing');
        }}
      />

      {/* Floating Support Button */}
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
