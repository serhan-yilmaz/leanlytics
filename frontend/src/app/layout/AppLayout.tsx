import { Link, Outlet, useMatchRoute } from '@tanstack/react-router'
import { AppBar, Toolbar, Box, Button, Stack, IconButton, useTheme} from '@mui/material'

// import logo from '../../assets/leanlytics_logo.png'
import logo from '../../assets/leanlytics_logo.png'
import logoDark from '../../assets/leanlytics_logo_darkmode.png'

import SettingsIcon from '@mui/icons-material/Settings'
import Footer from '../../components/ui/Footer'

import MenuIcon from '@mui/icons-material/Menu'
import {
  Menu,
  MenuItem,
  useMediaQuery,
} from '@mui/material'
import { useState } from 'react'

export default function AppLayout() {
  const matchRoute = useMatchRoute()

  const isActive = (to: string) =>
    !!matchRoute({ to, fuzzy: false })

  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [menuAnchor, setMenuAnchor] =
    useState<null | HTMLElement>(null)

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget)
  }

  const closeMenu = () => {
    setMenuAnchor(null)
  }

  const navItems = [
    {
      label: 'Dashboard',
      to: '/dashboard',
    },
    {
      label: 'Measurements',
      to: '/measurements',
    },
    {
      label: 'Trends',
      to: '/trends',
    },
  ]

  const settingsItem = {
    label: 'Settings',
    to: '/settings',
  }

  const mobileItems = [
    ...navItems,
    settingsItem,
  ]

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

        {isMobile? (
        <>
          <Box sx={{ ml: 'auto' }}>
            <IconButton onClick={openMenu}>
              <MenuIcon  sx={{ fontSize: 38 }}/>
            </IconButton>
          </Box>
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={closeMenu}
          >
            {mobileItems.map((item) => (
              <MenuItem
                key={item.to}
                component={Link}
                to={item.to}
                onClick={closeMenu}
              >
                {item.label}
              </MenuItem>
            ))}
          </Menu>
        </>
        ) : (
          <>
            <Stack direction="row" spacing={1} sx={{ flexGrow: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.to}
                  component={Link}
                  to={item.to}
                  variant={isActive(item.to) ? 'contained' : 'text'}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
            <Box sx={{ ml: 'auto' }}>
              <IconButton
                component={Link}
                to={settingsItem.to}
                sx={{ color: '#1e66ff' }}
              >
                <SettingsIcon />
              </IconButton>
            </Box>
          </>
        )}
          {/* <Stack direction="row" spacing={1} sx={{ flexGrow: 1 }}>
            
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

          </Stack> */}

          {/* RIGHT SIDE (future: profile/settings) */}

            {/* <Box sx={{ marginLeft: 'auto' }}>
            <IconButton
                component={Link}
                to="/settings"
                sx={{
                color: '#1e66ff',
                }}
            >
                <SettingsIcon />
            </IconButton>
            </Box> */}

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