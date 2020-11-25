import React from 'react';
import { ThemeProvider } from 'styled-components';

export default function Theme({ children }) {
  const getCssVariable = (name) => {
    return getComputedStyle(document.documentElement).getPropertyValue(name);
  };

  const theme = {
    colors: {
      primary: getCssVariable('--vz-primary'),
      white: getCssVariable('--vz-white'),
      black: getCssVariable('--vz-black'),
      pink: {
        50: getCssVariable('--vz-pink-50'),
        100: getCssVariable('--vz-pink-100'),
        200: getCssVariable('--vz-pink-200'),
        300: getCssVariable('--vz-pink-300'),
        400: getCssVariable('--vz-pink-400'),
        500: getCssVariable('--vz-pink-500'),
        600: getCssVariable('--vz-pink-600'),
        700: getCssVariable('--vz-pink-700'),
        800: getCssVariable('--vz-pink-800'),
        900: getCssVariable('--vz-pink-900')
      },
      gray: {
        50: getCssVariable('--vz-gray-50'),
        100: getCssVariable('--vz-gray-100'),
        200: getCssVariable('--vz-gray-200'),
        300: getCssVariable('--vz-gray-300'),
        400: getCssVariable('--vz-gray-400'),
        500: getCssVariable('--vz-gray-500'),
        600: getCssVariable('--vz-gray-600'),
        700: getCssVariable('--vz-gray-700'),
        800: getCssVariable('--vz-gray-800'),
        900: getCssVariable('--vz-gray-900')
      }
    }
  };
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
