import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MobileNavProps {
  navItems: Array<{
    mobileLabel: string;
    path: string;
    icon: React.ComponentType<any>;
    color: string;
    glow: string;
  }>;
}

export const MobileNav: React.FC<MobileNavProps> = ({ navItems }) => {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 glass-dark flex items-center justify-around px-1 shadow-[0_-4px_20px_rgba(0,0,0,0.4)] transition-colors duration-300">
      {navItems.slice(0, 5).map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full py-2 px-1 transition-all duration-200 ${
              isActive ? 'text-red-500' : 'text-muted'
            }`}
          >
            <div
              className={`p-1.5 rounded-xl transition-all duration-200 ${
                isActive ? 'bg-white/5 shadow-inner' : ''
              }`}
            >
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
  );
};
