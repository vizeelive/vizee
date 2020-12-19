const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: ['./src/**/*.html', './src/**/*.jsx', './src/**/*.js'],
  important: true,
  theme: {
    screens: {
      xs: '360px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    extend: {
      colors: {
        primary: 'var(--vz-primary)',
        pink: {
          50: 'var(--vz-pink-50)',
          100: 'var(--vz-pink-100)',
          200: 'var(--vz-pink-200)',
          300: 'var(--vz-pink-300)',
          400: 'var(--vz-pink-400)',
          500: 'var(--vz-pink-500)',
          600: 'var(--vz-pink-600)',
          700: 'var(--vz-pink-700)',
          800: 'var(--vz-pink-800)',
          900: 'var(--vz-pink-900)'
        },
        gray: {
          ...colors.gray,
          750: 'var(--vz-gray-750)',
          850: 'var(--vz-gray-850)',
          950: 'var(--vz-gray-950)'
        },
        'white-5': 'var(--vz-white-5)',
        'white-10': 'var(--vz-white-10)',
        'white-20': 'var(--vz-white-20)',
        'white-30': 'var(--vz-white-30)',
        'white-40': 'var(--vz-white-40)',
        'white-50': 'var(--vz-white-50)',
        'white-60': 'var(--vz-white-60)',
        'white-70': 'var(--vz-white-70)',
        'white-80': 'var(--vz-white-80)',
        'white-90': 'var(--vz-white-90)',
        'black-5': 'var(--vz-black-5)',
        'black-10': 'var(--vz-black-10)',
        'black-20': 'var(--vz-black-20)',
        'black-30': 'var(--vz-black-30)',
        'black-40': 'var(--vz-black-40)',
        'black-50': 'var(--vz-black-50)',
        'black-60': 'var(--vz-black-60)',
        'black-70': 'var(--vz-black-70)',
        'black-80': 'var(--vz-black-80)',
        'black-90': 'var(--vz-black-90)',
        black: 'var(--vz-black)'
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans]
      },
      minHeight: {
        page: 'calc(100vh - 184px)'
      }
    }
  },
  variants: {},
  plugins: []
};
