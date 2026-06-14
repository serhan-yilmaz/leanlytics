import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import useMediaQuery from '@mui/material/useMediaQuery'

import { createAppTheme } from './theme/theme'
import { router } from './router/router'
import { RouterProvider } from '@tanstack/react-router'

function App() {
  const prefersDarkMode = useMediaQuery(
    '(prefers-color-scheme: dark)'
  )

  const theme = createAppTheme(
    prefersDarkMode ? 'dark' : 'light'
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)