import { useState } from 'react'

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Paper,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormHelperText,
  Tooltip,
} from '@mui/material'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { parseCSV } from '../../data/storage'
import { addOrUpdateMeasurements, saveMeasurements } from '../../data/measurements'
import { useToast } from '../ui/useToast'

type ImportMode = 'merge' | 'replace'

type Props = {
  open: boolean
  onClose: () => void
  onImport: (payload: {
    file: File
    mode: ImportMode
  }) => void
}

export default function ImportMeasurementsDialog({
  open,
  onClose,
  onImport,
}: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [mode, setMode] = useState<ImportMode>('merge')

  const { toast, showToast, hideToast } = useToast()

  const handleClose = () => {
    setFile(null)
    setMode('merge')
    onClose()
  }

//   const handleImport = () => {
//     if (!file) return

//     onImport({
//       file,
//       mode,
//     })

//     setFile(null)
//     setMode('merge')
//     onClose()
//   }

    const handleImport = () => {
        if (!file) return

        const reader = new FileReader()

        reader.onload = () => {
            const csv = String(reader.result ?? '')
            const imported = parseCSV(csv)

            if (mode === 'replace') {
                saveMeasurements(imported)

                showToast(
                    `Imported ${imported.length} measurements (replace mode)`,
                    'success',
                )
            } else {
                addOrUpdateMeasurements(imported)

                showToast(
                    `Merged ${imported.length} measurements`,
                    'success',
                )
            }

            onImport({
                file,
                mode,
            })

            handleClose()
        }

        reader.readAsText(file)
    }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Import Measurements
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            pt: 1,
          }}
        >
          <Button variant="outlined" component="label">
            Choose CSV File

            <input
              hidden
              type="file"
              accept=".csv"
              onChange={(e) =>
                setFile(e.target.files?.[0] ?? null)
              }
            />
          </Button>

          <Paper
            variant="outlined"
            sx={{
              p: 1.25,
              bgcolor: 'background.default',
            }}
          >
            <Typography
              variant="body2"
              color={
                file
                  ? 'text.primary'
                  : 'text.secondary'
              }
            >
              {file?.name ?? 'No file selected'}
            </Typography>
          </Paper>

          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mb: 1,
              }}
            >
              <Typography variant="subtitle2">
                Import Mode
              </Typography>

              <Tooltip
                title={
                  <>
                    <strong>Merge</strong>
                    <br />
                    Updates measurements that share a date and adds new ones. Existing measurements not in the CSV remain unchanged.
                    <br />
                    <br />
                    <strong>Replace</strong>
                    <br />
                    Replaces the entire dataset with the CSV. Measurements not included will be removed.
                  </>
                }
              >
                <InfoOutlinedIcon
                  sx={{
                    fontSize: 16,
                    color: 'text.secondary',
                    cursor: 'help',
                  }}
                />
              </Tooltip>
            </Box>

            <RadioGroup
              value={mode}
              onChange={(e) =>
                setMode(e.target.value as ImportMode)
              }
            >
              <FormControlLabel
                value="merge"
                control={<Radio />}
                label="Merge with Existing Data"
              />

              <FormHelperText
                sx={{
                  ml: 4,
                  mt: -0.5,
                  mb: 1,
                }}
              >
                Update matching dates and add new measurements.
              </FormHelperText>

              <FormControlLabel
                value="replace"
                control={<Radio />}
                label="Replace Existing Data"
              />

              <FormHelperText
                sx={{
                  ml: 4,
                  mt: -0.5,
                }}
              >
                Remove existing measurements not included in the imported CSV.
              </FormHelperText>
            </RadioGroup>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          color={mode === 'replace' ? 'error' : 'primary'}
          disabled={!file}
          onClick={handleImport}
        >
          Import
        </Button>
      </DialogActions>
    </Dialog>
  )
}