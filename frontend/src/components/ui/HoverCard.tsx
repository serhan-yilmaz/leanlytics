import { Card, type CardProps } from '@mui/material'

export default function HoverCard({
  children,
  sx,
  ...props
}: CardProps) {
  return (
    <Card
      {...props}
      sx={{
        flex: 1,
        cursor: 'pointer',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
        border: '1px solid transparent',

        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
          borderColor: 'rgba(0,0,0,0.08)',
        },

        ...sx,
      }}
    >
      {children}
    </Card>
  )
}