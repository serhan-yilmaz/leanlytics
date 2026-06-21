import { useState } from 'react'

import DownloadIcon from '@mui/icons-material/Download'
import UploadIcon from '@mui/icons-material/Upload'
import MoreVertIcon from '@mui/icons-material/MoreVert'

import {
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  useMediaQuery,
} from '@mui/material'

import { useTheme } from '@mui/material/styles'

import PageHeader from '../components/ui/PageHeader'
import PageContainer from '../components/ui/PageContainer'
import MeasurementTable from '../components/measurements/MeasurementTable'
import ConfirmDialog from '../components/ui/ConfirmDialog'

import {
  getMeasurements,
  deleteMeasurement,
  addMeasurement,
  updateMeasurement,
} from '../data/measurements'

import { useToast } from '../components/ui/useToast'
import AppToast from '../components/ui/AppToast'
import type { Measurement } from '../data/types'
import MeasurementForm from '../components/measurements/MeasurementForm'
import { exportMeasurements } from '../data/exportMeasurements'

import ImportMeasurementsDialog from '../components/measurements/ImportMeasurementsDialog'

export default function Measurements() {
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { toast, showToast, hideToast } = useToast()

  const data = getMeasurements()
  const latestMeasurement = data[0]

  const [, forceRefresh] = useState(0)
  const refresh = () => forceRefresh(k => k + 1)

  const [formOpen, setFormOpen] = useState(false)
  const [editItem, setEditItem] = useState<Measurement | null>(null)

  const [importOpen, setImportOpen] = useState(false)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const menuOpen = Boolean(menuAnchor)

  const openCreate = () => {
    setEditItem(null)
    setFormOpen(true)
  }

  const openEdit = (id: string) => {
    const item = data.find(x => x.id === id)
    if (!item) return

    setEditItem(item)
    setFormOpen(true)
  }

  const handleSave = (m: Measurement) => {
    if (editItem) {
      updateMeasurement(m)
      showToast('Measurement updated', 'success')
    } else {
      addMeasurement(m)
      showToast('Measurement added', 'success')
    }

    setFormOpen(false)
  }

  return (
    <>
      <PageHeader
        title="Measurements"
        actionLabel="+ New"
        actionOnClick={openCreate}
        actions={
          <>
            {isMobile ? (
              <>
                <Tooltip title="More">
                  <IconButton
                    onClick={e => setMenuAnchor(e.currentTarget)}
                    sx={{ color: 'white' }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Tooltip>

                <Menu
                  anchorEl={menuAnchor}
                  open={menuOpen}
                  onClose={() => setMenuAnchor(null)}
                >
                  <MenuItem
                    onClick={() => {
                      setImportOpen(true)
                      setMenuAnchor(null)
                    }}
                  >
                    <UploadIcon fontSize="small" sx={{ mr: 1 }} />
                    Import CSV
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      exportMeasurements(data)
                      setMenuAnchor(null)
                    }}
                  >
                    <DownloadIcon fontSize="small" sx={{ mr: 1 }} />
                    Export CSV
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Tooltip title="Import CSV">
                  <IconButton
                    onClick={() => setImportOpen(true)}
                    sx={{ color: 'white' }}
                  >
                    <UploadIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Export CSV">
                  <IconButton
                    onClick={() => exportMeasurements(data)}
                    sx={{ color: 'white' }}
                  >
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </>
        }
      />

      <PageContainer sx={{ p: 1, pt: 1.5 }}>
        <MeasurementTable
          data={data}
          onEdit={openEdit}
          onDelete={(id) => setDeleteId(id)}
        />

        <MeasurementForm
          open={formOpen}
          mode={editItem ? 'edit' : 'create'}
          initialData={editItem ?? latestMeasurement}
          onClose={() => setFormOpen(false)}
          onSave={handleSave}
        />

        <ConfirmDialog
          open={!!deleteId}
          title="Delete measurement?"
          description="This action cannot be undone."
          confirmText="Delete"
          danger
          onClose={() => setDeleteId(null)}
          onConfirm={() => {
            if (!deleteId) return

            deleteMeasurement(deleteId)
            setDeleteId(null)

            refresh()

            showToast('Measurement deleted.', 'success')
          }}
        />

        <ImportMeasurementsDialog
          open={importOpen}
          onClose={() => setImportOpen(false)}
          onImport={() => {
            refresh()
          } }
        />

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