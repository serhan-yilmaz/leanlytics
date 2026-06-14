import { Box, Link, Typography } from '@mui/material'
import { Link as RouterLink } from '@tanstack/react-router'

export default function Footer() {

  return (
    <Box
      component="footer"
      sx={(theme) => ({
        mt: 0,
        py: 3,
        px: 2,
        // borderTop: '1px solid #eee',
        borderTop: '1px solid',
        borderColor: 'divider', 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        fontSize: 13,
        // color: '#777',
        // backgroundColor: '#FBFBFD'
        color: theme.palette.mode === 'dark'? '#909090': '#777', 
        backgroundColor: theme.palette.mode === 'dark'
          ? '#1e1e1e'
          : '#FBFBFD',
      })}
    >
      {/* Left */}
      <Typography sx={{ fontSize: 13 }}>
        Leanlytics · Personal physique analytics
      </Typography>

      {/* Center links */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Link href="/" underline="hover" color="inherit">
          About
        </Link>

        <Link
          href="https://github.com/serhan-yilmaz/leanlytics"
          underline="hover"
          color="inherit"
          target="_blank"
          rel="noopener"
        >
          GitHub
        </Link>

        <Link
          component={RouterLink}
          to="/privacy"
          underline="hover"
          color="inherit"
        >
          Privacy
        </Link>
      </Box>

      {/* Right */}
      <Typography sx={{ fontSize: 13 }}>
        {/* Built by{' '} */}
        <Link
          href="https://github.com/serhan-yilmaz"
          target="_blank"
          rel="noreferrer"
          underline="none"
          sx={{
            color: '#888',
            transition: '0.15s ease',
            '&:hover': {
              color: '#666',
              borderBottom: '1px solid rgba(136,136,136,0.8)',
            },
          }}
        >
          serhan-yilmaz
        </Link>
        {/* <a
            href="https://github.com/serhan-yilmaz"
            target="_blank"
            rel="noreferrer"
            style={{ color: 'inherit', textDecoration: 'none' }}
            onMouseEnter={(e) => {
            e.currentTarget.style.borderBottom = '1px solid rgba(136,136,136,0.8)'
            e.currentTarget.style.color = '#666'
            }}
            onMouseLeave={(e) => {
            e.currentTarget.style.borderBottom = 'none'
            e.currentTarget.style.color = '#888'
            }}
        >
            serhan-yilmaz
        </a> */}
      </Typography>
    </Box>
  )
}