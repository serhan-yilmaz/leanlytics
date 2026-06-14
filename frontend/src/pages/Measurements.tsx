import { useState } from 'react'

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

export default function Measurements() {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  

  const { toast, showToast, hideToast } = useToast()

  const data = getMeasurements()
  const latestMeasurement = data[0]

  const [, forceRefresh] = useState(0)
  const refresh = () => forceRefresh(k => k + 1)

  const [formOpen, setFormOpen] = useState(false)
  const [editItem, setEditItem] = useState<Measurement | null>(null)

  const openCreate = () => {
    setEditItem(null)
    setFormOpen(true)
  }

  // OPEN EDIT
  const openEdit = (id: string) => {
    const item = data.find(x => x.id === id)
    if (!item) return

    setEditItem(item)
    setFormOpen(true)
  }

  // SAVE (CREATE OR UPDATE)
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
        actionLabel="+ Add New"
        actionOnClick={openCreate}
      />

      <PageContainer sx={{p: 1, pt: 1.5}}>

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