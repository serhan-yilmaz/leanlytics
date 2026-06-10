import { useState } from 'react'
import { Box, Button } from '@mui/material'

import PageHeader from '../components/ui/PageHeader'
import PageContainer from '../components/ui/PageContainer'
import ConfirmDialog from '../components/ui/ConfirmDialog'

import { resetDB } from '../data/storage'
import { useToast } from '../components/ui/useToast'
import AppToast from '../components/ui/AppToast'

export default function Settings() {
  const [resetOpen, setResetOpen] = useState(false)

  const { toast, showToast, hideToast } = useToast()

  return (
    <>
      <PageHeader title="Settings" />

      <PageContainer>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

          <Button
            color="warning"
            variant="contained"
            onClick={() => setResetOpen(true)}
          >
            Reset Measurements
          </Button>

        </Box>

        {/* CONFIRM */}
        <ConfirmDialog
          open={resetOpen}
          title="Reset all measurements?"
          description="This will delete all stored measurements and cannot be undone."
          confirmText="Reset"
          danger
          onClose={() => setResetOpen(false)}
          onConfirm={() => {
            resetDB()
            setResetOpen(false)

            showToast('Measurements reset successfully', 'success')
          }}
        />

        {/* TOAST */}
        <AppToast
          open={toast.open}
          message={toast.message}
          severity={toast.severity}
          duration={toast.duration}
          onClose={hideToast}
        />
      </PageContainer>
    </>
  )
}