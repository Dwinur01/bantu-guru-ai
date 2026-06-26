import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, LogOut, X } from 'lucide-react';
import { User } from '../../types/auth';

interface SidebarProps {
  user: User | null;
  navItems: Array<{
    label: string;
    mobileLabel: string;
    path: string;
    icon: React.ComponentType<any>;
    color: string;
    glow: string;
  }>;
  onLogout: () => void;
  getPlanBadgeStyle: (plan: string) => string;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  navItems,
  onLogout,
  getPlanBadgeStyle,
  mobileSidebarOpen,
  setMobileSidebarOpen,
}) => {
  const location = useLocation();

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar border border-rule md:border-y-0 md:border-l-0 md:border-r rounded-2xl md:rounded-none transition-colors duration-300 shadow-2xl md:shadow-none">
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 lg:px-5 border-b border-rule gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0">
            <img
              src="/logo-gurubantu.png"
              alt="GuruBantu AI"
              className="w-7 h-7 object-contain rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <div className="block md:hidden lg:block overflow-hidden">
            <span className="font-display font-black text-ink text-base leading-tight block">
              GuruBantu <span className="text-blue-500">AI</span>
            </span>
            <span className="text-muted text-[10px] font-medium">Admin Guru Otomatis</span>
          </div>
        </div>
        
        {/* Close Button on Mobile */}
        <button
          onClick={() => setMobileSidebarOpen(false)}
          className="md:hidden p-2 rounded-lg text-muted hover:text-ink hover:bg-glass-mid transition-colors"
          aria-label="Close Sidebar"
        >
          <X className="w-5 h-5" />
        </button>
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
                  ? 'active bg-gradient-to-r from-white/[0.12] to-white/[0.05] border-l-[3px] border-l-red-500 text-white'
                  : 'text-muted hover:text-ink'
              }`}
              style={isActive ? { boxShadow: 'inset 0 0 20px rgba(0,242,255,0.05)' } : {}}
            >
              <Icon
                className={`w-[18px] h-[18px] flex-shrink-0 transition-all duration-200 ${
                  isActive ? item.color : 'text-muted group-hover:text-ink'
                }`}
                style={isActive ? { filter: `drop-shadow(0 0 6px ${item.glow})` } : {}}
              />
              <span className="inline md:hidden lg:inline flex-1">{item.label}</span>
              {isActive && (
                <ChevronRight className="block md:hidden lg:block w-3.5 h-3.5 text-muted flex-shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-3 border-t border-rule space-y-1">
        {/* User info (desktop) */}
        {user && (
          <div className="flex md:hidden lg:flex items-center gap-2.5 px-3 py-2 mb-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                user.emailVerified
                  ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-[0_0_10px_rgba(52,211,153,0.5)]'
                  : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
              }`}
            >
              {user.name ? user.name.substring(0, 2).toUpperCase() : 'G'}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-ink text-xs font-bold truncate leading-tight">
                {user.name || 'Guru'}
              </div>
              <div
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full inline-block mt-0.5 ${getPlanBadgeStyle(
                  user.plan
                )}`}
              >
                {(user.plan || 'FREE').toUpperCase()}
              </div>
            </div>
          </div>
        )}
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 w-full text-muted hover:text-red-400 hover:bg-red-500/10 active:scale-95 group"
          title="Keluar dari Akun"
        >
          <LogOut className="w-[18px] h-[18px] flex-shrink-0 group-hover:text-red-400" />
          <span className="inline md:hidden lg:inline">Keluar</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[64px] lg:w-[240px] flex-col z-30 transition-all duration-300">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      {/* Mobile Sidebar */}
      <aside
        className={`fixed left-4 top-4 bottom-4 w-[240px] flex-col z-50 md:hidden transition-transform duration-300 ${
          mobileSidebarOpen ? 'flex translate-x-0' : '-translate-x-[calc(100%+24px)]'
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
};
