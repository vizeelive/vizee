module.exports = {
  purge: ['./src/**/*.html', './src/**/*.jsx', './src/**/*.js'],
  theme: {
    colors: {
      black: 'var(--vz-black)',
      white: 'var(--vz-white)',
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
        50: 'var(--vz-gray-50)',
        100: 'var(--vz-gray-100)',
        200: 'var(--vz-gray-200)',
        300: 'var(--vz-gray-300)',
        400: 'var(--vz-gray-400)',
        500: 'var(--vz-gray-500)',
        600: 'var(--vz-gray-600)',
        700: 'var(--vz-gray-700)',
        800: 'var(--vz-gray-800)',
        900: 'var(--vz-gray-900)'
      }
    }
  },
  variants: {},
  plugins: []
};
