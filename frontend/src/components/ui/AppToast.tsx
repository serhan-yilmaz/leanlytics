import { Snackbar, Alert } from '@mui/material'

type Props = {
  open: boolean
  message: string
  severity: 'success' | 'error' | 'info' | 'warning'
  duration: number
  onClose: () => void
}

export default function AppToast({
  open,
  message,
  severity,
  duration,
  onClose,
}: Props) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert severity={severity} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  )
}