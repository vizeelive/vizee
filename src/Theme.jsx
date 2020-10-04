import React from 'react'
import { ThemeProvider } from 'styled-components'

// Ant Design palette
const theme = {
  colors: {
    blue: {
      base: '#1890ff'
    },
    green: {
      base: '#52c41a'
    },
    red: {
      base: '#f5222d'
    },
    gold: {
      base: '#faad14'
    },
    white: '#fff',
    black: '#000',
    gray: {
			light: '#d8d8d8',
			medium: '#808080',
			dark: '#202020'
    }
  }
};

const Theme = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

export default Theme
