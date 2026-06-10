import { Tooltip } from '@mui/material'

type MetricValueProps = {
  children: React.ReactNode
  tooltip?: string
  bold?: boolean
}

export default function MetricValue({
  children,
  tooltip,
  bold = true,
}: MetricValueProps) {
  const content = bold
    ? <strong>{children}</strong>
    : <>{children}</>

  if (!tooltip) {
    return content
  }

  return (
    <Tooltip
      title={
        <span style={{ 
            whiteSpace: 'pre-line', 
            textAlign: 'center',
            display: 'block',
            }}>
          {tooltip}
        </span>
      }
    >
      <span>
        {content}
      </span>
    </Tooltip>
  )
}