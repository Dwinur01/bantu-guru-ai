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
          red:      '#C84B2F',
          dark:     '#1F4E79',
          mid:      '#2E75B6',
          light:    '#D6E4F0',
          pale:     '#EBF3FB',
        },
        success: {
          DEFAULT: '#1A7A4A',
          bg: '#E8F5EE',
        },
        warning: {
          DEFAULT: '#B8860B',
          bg: '#FDF3D8',
        },
        error: {
          DEFAULT: '#C84B2F',
          bg: '#FCEAE6',
        },
        ink: '#1A1A2E',
        muted: '#737373',
        rule: '#C8BFB0',
        cream: '#FAF7F2',
        page: '#F5F0E8',
      },
    },
  },
  plugins: [],
}
