/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '320px',
      'sm': '375px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Courier New"', 'monospace'],
      },
      colors: {
        brand: {
          red:   '#00f2ff', // Lumina Electric Blue
          dark:  'var(--bg-page)', // Lumina Obsidian Background
          mid:   '#6366f1', // Lumina Indigo Accent
          light: '#1e1b4b', // Dark Indigo/Violet shade
          pale:  'var(--bg-card)', // Lumina Slate Surface
          navy:  '#4f46e5', // Indigo Navy
        },
        neon: {
          blue:   '#00f2ff',
          indigo: '#6366f1',
          purple: '#8b5cf6',
          cyan:   '#00f2ff',
          green:  '#10b981',
        },
        glass: {
          dark:  'var(--glass-dark-bg)',
          light: 'var(--glass-light-bg)',
          mid:   'var(--glass-mid-bg)',
        },
        success: { DEFAULT: '#10B981', bg: 'rgba(16,185,129,0.1)', glow: 'rgba(16,185,129,0.4)' },
        warning: { DEFAULT: '#F59E0B', bg: 'rgba(245,158,11,0.1)', glow: 'rgba(245,158,11,0.4)' },
        error:   { DEFAULT: '#EF4444', bg: 'rgba(239,68,68,0.1)', glow: 'rgba(239,68,68,0.4)' },
        ink:     'var(--text-primary)', // Light text
        muted:   'var(--text-secondary)', // Slate text
        rule:    'var(--border-color)', // Transparent border
        cream:   'var(--bg-card)', // Dark card bg
        page:    'var(--bg-page)', // Dark page bg
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #020617 0%, #0F172A 50%, #1E1B4B 100%)',
        'gradient-card-blue':   'linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)',
        'gradient-card-purple': 'linear-gradient(135deg, #312e81 0%, #4c1d95 100%)',
        'gradient-card-green':  'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
        'gradient-auth':        'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 50%, #F0F9FF 100%)',
        'shimmer':              'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
      },
      boxShadow: {
        'glow-blue':   '0 0 30px rgba(59,130,246,0.45), 0 0 60px rgba(59,130,246,0.2)',
        'glow-purple': '0 0 30px rgba(139,92,246,0.45), 0 0 60px rgba(139,92,246,0.2)',
        'glow-green':  '0 0 30px rgba(52,211,153,0.45), 0 0 60px rgba(52,211,153,0.2)',
        'glow-sm':     '0 0 15px rgba(59,130,246,0.3)',
        'glass':       '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.1)',
        'card-hover':  '0 20px 60px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.06)',
        'premium':     '0 25px 50px -12px rgba(0,0,0,0.25)',
      },
      animation: {
        'float':            'float 6s ease-in-out infinite',
        'float-slow':       'float 9s ease-in-out infinite',
        'float-delay':      'float 6s ease-in-out 3s infinite',
        'blob':             'blob 8s ease-in-out infinite',
        'blob-delay':       'blob 10s ease-in-out 2s infinite',
        'blob-delay2':      'blob 12s ease-in-out 4s infinite',
        'shimmer':          'shimmer 2.5s linear infinite',
        'glow-pulse':       'glowPulse 2s ease-in-out infinite',
        'glow-pulse-fast':  'glowPulse 1s ease-in-out infinite',
        'slide-up':         'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up-stagger': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in':          'fadeIn 0.4s ease-out forwards',
        'scale-in':         'scaleIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'ripple':           'ripple 1.2s ease-out infinite',
        'orbit':            'orbit 4s linear infinite',
        'spin-slow':        'spin 8s linear infinite',
        'page':             'fadeIn 0.35s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%':      { transform: 'translate(40px, -40px) scale(1.1)' },
          '66%':      { transform: 'translate(-30px, 20px) scale(0.9)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.85)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        ripple: {
          '0%':   { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        orbit: {
          '0%':   { transform: 'rotate(0deg) translateX(30px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(30px) rotate(-360deg)' },
        },
      },
    },
  },
  plugins: [],
}
