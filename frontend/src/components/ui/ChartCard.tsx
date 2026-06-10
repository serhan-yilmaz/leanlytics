import { Paper, Typography, Box } from '@mui/material'

import type { SxProps, Theme } from '@mui/material/styles'

type Props = {
  title?: string
  paperSx?: SxProps<Theme>
  children: React.ReactNode
}

export default function ChartCard({
  title,
  paperSx,
  children,
}: Props) {
  return (
    <Paper
      elevation={0}
    //   sx = {sx}
      sx={[
      {
        mb: 1.5, 
        p: 2,
        border: '1px solid #e5e5e5',
        borderRadius: 2,
        backgroundColor: '#ffffff',
        // ...paperSx
      }, 
      ...(Array.isArray(paperSx) ? paperSx : [paperSx]), 
     ]}
    >
      {title && (
        <Typography
          variant="subtitle1"
          sx={{
            mb: 1,
            fontWeight: 600,
          }}
        >
          {title}
        </Typography>
      )}

      <Box sx={{ height: 'auto' }}>
        {children}
      </Box>
    </Paper>
  )
}