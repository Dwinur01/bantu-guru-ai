import React from 'react';
import { Menu, LogOut, Sun, Moon } from 'lucide-react';
import { User } from '../../types/auth';

interface TopBarProps {
  user: User | null;
  activeItem: any;
  theme: string;
  toggleTheme: () => void;
  onLogout: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  getPlanBadgeStyle: (plan: string) => string;
}

export const TopBar: React.FC<TopBarProps> = ({
  user,
  activeItem,
  theme,
  toggleTheme,
  onLogout,
  setMobileSidebarOpen,
  getPlanBadgeStyle,
}) => {
  return (
    <header className="h-14 glass-dark flex items-center justify-between px-4 md:px-6 sticky top-0 z-20 shadow-md transition-colors duration-300">
      {/* Left: Hamburger (mobile) + Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="md:hidden p-2 rounded-lg text-ink hover:bg-glass-mid transition-colors"
          aria-label="Open Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        {/* Logo Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <img
              src="/logo-gurubantu.png"
              alt="GuruBantu AI"
              className="w-5 h-5 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <span className="font-display font-black text-sm text-ink">
            GuruBantu <span className="text-red-500">AI</span>
          </span>
        </div>
        {/* Page Title — Desktop */}
        <div className="hidden md:flex items-center gap-2">
          {activeItem && (
            <div
              className={`w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/10 flex items-center justify-center`}
            >
              <activeItem.icon className={`w-3.5 h-3.5 ${activeItem.color}`} />
            </div>
          )}
          <h1 className="font-bold text-base text-ink">
            {activeItem ? activeItem.label : 'GuruBantu AI'}
          </h1>
        </div>
      </div>

      {/* Right: User info */}
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline text-sm text-muted font-medium">
          Halo, <span className="font-bold text-ink">{user?.name?.split(' ')[0] || 'Guru'}</span>
        </span>
        {user?.plan && (
          <span
            className={`hidden lg:inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide ${getPlanBadgeStyle(
              user.plan
            )}`}
          >
            {user.plan.toUpperCase()}
          </span>
        )}
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-muted hover:text-ink rounded-lg transition-colors hover:bg-glass-mid flex items-center justify-center"
          title={theme === 'light' ? 'Aktifkan Mode Gelap' : 'Aktifkan Mode Terang'}
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
            user?.emailVerified
              ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-[0_0_12px_rgba(52,211,153,0.5)]'
              : 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-[0_0_12px_rgba(0,242,255,0.4)]'
          }`}
        >
          {user?.name ? user.name.substring(0, 2).toUpperCase() : 'G'}
        </div>
        {/* Quick Logout — Mobile only */}
        <button
          onClick={onLogout}
          className="p-2 text-muted hover:text-red-500 rounded-lg transition-colors hover:bg-glass-mid md:hidden"
          title="Keluar"
          aria-label="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
