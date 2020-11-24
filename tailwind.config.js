const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./src/**/*.html', './src/**/*.jsx', './src/**/*.js'],
  theme: {
    colors: {
      black: '#000',
      white: '#fff',
      gray: colors.warmGray,
      primary: '#ee326e',
      pink: {
        50: '#f2e8ec',
        100: '#f1dee7',
        200: '#f3c5de',
        300: '#f471ad',
        400: '#fb75b1',
        500: '#f54e91',
        600: '#ee326e',
        700: '#d2295a',
        800: '#b72a51',
        900: '#9f2a4d'
      }
    }
  },
  variants: {},
  plugins: []
};
