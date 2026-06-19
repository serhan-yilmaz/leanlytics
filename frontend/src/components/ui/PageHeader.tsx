import { Box, Typography, Button } from '@mui/material'
import type { ReactNode } from 'react'

type PageHeaderProps = {
  title: string
  actionLabel?: string
  actionOnClick?: () => void
  actions?: ReactNode
}

export default function PageHeader({
  title,
  actionLabel,
  actionOnClick,
  actions,
}: PageHeaderProps) {
  return (
    <Box
      sx={{
        background:
          'linear-gradient(90deg, #0033cc 0%, #007bff 100%)',
        borderRadius: 0,
        padding: '36px 30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: 'white',
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          fontSize: 28,
        }}
      >
        {title}
      </Typography>

      {(actions ||
        (actionLabel && actionOnClick)) && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {actionLabel && actionOnClick && (
            <Button
              onClick={actionOnClick}
              variant="contained"
              sx={{
                backgroundColor: 'white',
                color: '#1e66ff',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor:
                    'rgba(255,255,255,0.9)',
                },
              }}
            >
              {actionLabel}
            </Button>
          )}

          {actions}
        </Box>
      )}
    </Box>
  )
}