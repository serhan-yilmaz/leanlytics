import { Box, Typography, Button } from '@mui/material'

type PageHeaderProps = {
  title: string
  actionLabel?: string
  actionOnClick?: () => void
}

export default function PageHeader({
  title,
  actionLabel,
  actionOnClick,
}: PageHeaderProps) {
  return (
    <Box
      sx={{
        // background: 'linear-gradient(90deg, #1e66ff, #4aa3ff)',
        background: 'linear-gradient(90deg, #0033cc 0%, #007bff 100%)',
        borderRadius: 0,
        padding: "36px 30px",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: 'white',
      }}
    >
      {/* TITLE */}
      <Typography variant="h5" sx={{ fontWeight: 600, fontSize: 28}}>
        {title}
      </Typography>

      {/* ACTION (only if both exist) */}
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
              backgroundColor: 'rgba(255,255,255,0.9)',
            },
          }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  )
}