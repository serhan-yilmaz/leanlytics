import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1e66ff',
    },
    background: {
      default: '#f6f7fb',
      paper: '#ffffff',
    },
  },

  shape: {
    borderRadius: 10,
  },

  typography: {
    fontFamily: [
      'Inter',
      'system-ui',
      'Arial',
      'sans-serif',
    ].join(','),
  },
})