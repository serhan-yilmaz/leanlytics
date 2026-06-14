import { Box } from '@mui/material'
import React from 'react'

type PageContainerProps = {
  children: React.ReactNode
}

export default function PageContainer({ children }: PageContainerProps) {
  return (
    <Box
      sx={(theme) => ({
      backgroundColor:
        theme.palette.mode === 'dark'
          // ? '#181c24'
          ? '#1d2126'
          : '#f3f8ff',
        // bgcolor: 'background.default',
        // backgroundColor: '#f3f8ff', // light blue tint
        borderRadius: 2,
        p: 2.5,
        minHeight: 'calc(100vh - 140px)', // keeps layout stable
      })}
    >
      {children}
    </Box>
  )
}