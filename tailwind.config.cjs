// tailwind.config.cjs
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#047857', // Dark Emerald Green
        primaryDark: '#052E16', // Deep Forest / Dark Green
        primaryHover: '#065F46',
        secondary: '#64748B',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        darkGreen: {
          950: '#052e16',
          900: '#064e3b',
          800: '#065f46',
          700: '#047857',
          600: '#059669',
        },
      },
    },
  },
  plugins: [],
};
