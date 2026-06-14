import { Link, Outlet, useMatchRoute } from '@tanstack/react-router'
import { AppBar, Toolbar, Box, Button, Stack, IconButton, useTheme} from '@mui/material'

// import logo from '../../assets/leanlytics_logo.png'
import logo from '../../assets/leanlytics_logo.png'
import logoDark from '../../assets/leanlytics_logo_darkmode.png'

import SettingsIcon from '@mui/icons-material/Settings'
import Footer from '../../components/ui/Footer'

export default function AppLayout() {
  const matchRoute = useMatchRoute()

  const isActive = (to: string) =>
    !!matchRoute({ to, fuzzy: false })

  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      
      {/* TOP BAR */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          // backgroundColor: '#000000',
          // borderBottom: '2.5px solid #c6c6c6',
          borderBottom: '2.5px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ gap: 3 }}>


            {/* LOGO */}
            <IconButton
            component={Link}
            to="/"
            sx={{
                mr: 2,
                borderRadius: 2,
                p: 0.5,
            }}
            >
            <Box
                component="img"
                src={isDark? logoDark: logo}
                alt="Leanlytics"
                sx={{
                height: 50,
                width: 'auto',
                display: 'block',
                }}
            />
            </IconButton>

          {/* LOGO (LEFT)
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: '#1e66ff',
              letterSpacing: 0.2,
              userSelect: 'none',
              mr: 2,
            }}
          >
            Leanlytics
          </Typography> */}

          {/* NAV (CENTER/LEFT GROUP) */}
          <Stack direction="row" spacing={1} sx={{ flexGrow: 1 }}>
            
            <Button
              component={Link}
              to="/dashboard"
              variant={isActive('/dashboard') ? 'contained' : 'text'}
              disableElevation
            >
              Dashboard
            </Button>

            <Button
              component={Link}
              to="/measurements"
              variant={isActive('/measurements') ? 'contained' : 'text'}
            >
              Measurements
            </Button>

            <Button
              component={Link}
              to="/trends"
              variant={isActive('/trends') ? 'contained' : 'text'}
            >
              Trends
            </Button>

          </Stack>

          {/* RIGHT SIDE (future: profile/settings) */}
          <Box>
            {/* placeholder for future user menu */}
          </Box>

            <Box sx={{ marginLeft: 'auto' }}>
            <IconButton
                component={Link}
                to="/settings"
                sx={{
                color: '#1e66ff',
                }}
            >
                <SettingsIcon />
            </IconButton>
            </Box>

        </Toolbar>
      </AppBar>

      {/* CONTENT */}
      <Box sx={{ p: 0 }}>
        <Outlet />
      </Box>
      <Footer />

    </Box>
  )
}