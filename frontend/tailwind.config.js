/** @type {import('tailwindcss').Config} */
export default {
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
      colors: {
        brand: {
          red:      '#2563EB', // mapped to blue for backward compatibility in variables
          dark:     '#0F172A', // slate-900 for sidebar/header
          mid:      '#3B82F6', // blue-500
          light:    '#DBEAFE', // blue-100
          pale:     '#F1F5F9', // slate-100
        },
        success: {
          DEFAULT: '#10B981', // emerald-500
          bg: '#ECFDF5',
        },
        warning: {
          DEFAULT: '#F59E0B', // amber-500
          bg: '#FEF3C7',
        },
        error: {
          DEFAULT: '#EF4444', // red-500
          bg: '#FEF2F2',
        },
        ink: '#0F172A', // slate-900
        muted: '#64748B', // slate-500
        rule: '#E2E8F0', // slate-200
        cream: '#FFFFFF', // clean white cards
        page: '#F8FAFC', // slate-50 background
      },
    },
  },
  plugins: [],
}
