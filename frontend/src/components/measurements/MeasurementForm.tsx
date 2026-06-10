import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material'

import Grid from '@mui/material/Grid'

import type { Measurement } from '../../data/types'

type Props = {
  open: boolean
  mode: 'create' | 'edit'
  initialData?: Measurement | null
  onClose: () => void
  onSave: (data: Measurement) => void
}

type FormState = {
  id: string
  date: string
  weight: string
  waist: string
  neck: string
  chest: string
  height: string
  hip: string
}

const today = () => new Date().toISOString().split('T')[0]

type FieldConfig = {
  name: keyof Omit<FormState, 'id'>
  label: string
  type: 'text' | 'number' | 'date'
  grid: number
  required: boolean

  min?: number
  max?: number

  placeholder?: string
}

const fields: FieldConfig[] = [
  {
    name: 'date',
    label: 'Date',
    type: 'date',
    grid: 12,
    required: true,
  },
  {
    name: 'height',
    label: 'Height',
    type: 'number',
    grid: 6,
    required: true,
    min: 100,
    max: 250,
    placeholder: 'Height in cm',
  },
    {
    name: 'neck',
    label: 'Neck',
    type: 'number',
    grid: 6,
    required: false,
    min: 10,
    max: 100,
    placeholder: 'Neck circumference in cm',
  },
    {
    name: 'weight',
    label: 'Weight',
    type: 'number',
    grid: 6,
    required: true,
    min: 20,
    max: 1000,
    placeholder: 'Weight in kg',
  },
  {
    name: 'waist',
    label: 'Waist',
    type: 'number',
    grid: 6,
    required: true,
    min: 40,
    max: 300,
    placeholder: 'Waist circumference in cm',
  },
  {
    name: 'hip',
    label: 'Hip',
    type: 'number',
    grid: 6,
    required: false,
    min: 20,
    max: 300,
    placeholder: 'Hip circumference in cm',
  },
  {
    name: 'chest',
    label: 'Chest',
    type: 'number',
    grid: 6,
    required: false,
    min: 20,
    max: 300,
    placeholder: 'Chest circumference in cm',
  },
] as const

export default function MeasurementForm({
  open,
  mode,
  initialData,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<FormState>({
    id: '',
    date: today(),
    weight: '',
    waist: '',
    neck: '',
    chest: '',
    height: '',
    hip: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!open) return

    if (mode === 'edit' && initialData) {
      setForm({
        id: initialData.id,
        date: initialData.date,
        weight: String(initialData.weight ?? ''),
        waist: String(initialData.waist ?? ''),
        neck: String(initialData.neck ?? ''),
        chest: String(initialData.chest ?? ''),
        height: String(initialData.height ?? ''),
        hip: String(initialData.hip ?? ''),
      })
      setErrors({})
    }

    if (mode === 'create') {
      setForm({
        id: crypto.randomUUID(),
        date: today(),
        weight: '',
        waist: '',
        chest: '', 
        hip: '',
        height: initialData?.height
        ? String(initialData.height)
        : '',

        neck: initialData?.neck
        ? String(initialData.neck)
        : '',
      })
      setErrors({})
    }
  }, [open, mode, initialData])

  const update = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: '', }))
  }

  const validate = () => {
    const nextErrors: Record<string, string> = {}

    for (const field of fields) {
      const value =
        form[field.name as keyof FormState]

      // REQUIRED
      if (field.required && value === '') {
        nextErrors[field.name] = 'Required'
        continue
      }

      // NUMBER VALIDATION
      if (
        field.type === 'number' &&
        value !== ''
      ) {
        const num = Number(value)

        if (Number.isNaN(num)) {
          nextErrors[field.name] =
            'Invalid number'
          continue
        }

        if (
          field.min !== undefined &&
          num < field.min
        ) {
          nextErrors[field.name] =
            `Must be at least ${field.min}`
        }

        if (
          field.max && 
          field.max !== undefined &&
          num > field.max
        ) {
          nextErrors[field.name] =
            `Must be at most ${field.max}`
        }
      }
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    const normalized: Measurement = {
      id: form.id,
      date: form.date,
      weight: form.weight ? Number(form.weight) : undefined, 
      waist: form.waist ? Number(form.waist) : undefined,
      neck: form.neck ? Number(form.neck) : undefined,
      chest: form.chest ? Number(form.chest) : undefined,
      height: form.height ? Number(form.height) : undefined,
      hip: form.hip ? Number(form.hip) : undefined,
    }

    onSave(normalized)
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
            {mode === 'create' ? 'Add Measurement' : 'Edit Measurement'}
        </DialogTitle>

        <DialogContent>
            
        <Grid container spacing={2} sx={{ mt: 1 }}>
        {fields.map((field) => (
            <Grid key={field.name} size={field.grid}>
            <TextField
                fullWidth
                required={field.required}
                label={field.label}
                placeholder={field.placeholder}
                type={field.type}
                value={form[field.name as keyof FormState]}
                onChange={(e) =>
                update(field.name as keyof FormState, e.target.value)
                }
                error={!!errors[field.name]}
                helperText={
                  errors[field.name] ?? ''
                }
                slotProps={
                field.type === 'date'
                    ? {
                        inputLabel: { shrink: true },
                    }
                    : undefined
                }
            />
            </Grid>
        ))}
        </Grid>

        </DialogContent>

        <DialogActions>
            <Button onClick={onClose}>Cancel</Button>

            <Button variant="contained" onClick={handleSave}>
            {mode === 'create' ? 'Add' : 'Save'}
            </Button>
        </DialogActions>
    </Dialog>
  )
}