import { createTheme } from '@mui/material/styles'

export const createAppTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,

      primary: {
        main: '#1e66ff',
      },

      background: {
        default: mode === 'dark' ? '#121212' : '#f6f7fb',
        // paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
        paper: mode === 'dark' ? '#121212' : '#ffffff',
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