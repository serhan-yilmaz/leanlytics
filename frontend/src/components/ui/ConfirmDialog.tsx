import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material'

type Props = {
  open: boolean
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onClose: () => void
  danger?: boolean
}

export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onClose,
  danger = false,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <Typography variant="body2">
          {description}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          {cancelText}
        </Button>

        <Button
          onClick={onConfirm}
          color={danger ? 'error' : 'primary'}
          variant="contained"
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}