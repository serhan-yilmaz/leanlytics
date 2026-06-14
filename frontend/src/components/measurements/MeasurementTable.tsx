import { Box, Button, useMediaQuery, useTheme } from '@mui/material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'

import type { Measurement } from '../../data/types'

import { calculateBodyFat } from '../../calculations/bodyComposition'

type Props = {
  data: Measurement[]
  onEdit?: (id: string) => void
  onDelete: (id: string) => void
}

export default function MeasurementTable({
  data,
  onEdit,
  onDelete,
}: Props) {
  if (!data.length) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        No measurements yet
      </Box>
    )
  }

  const theme = useTheme()
  const isMobile = useMediaQuery(
    theme.breakpoints.down('md')
  )

  // const pageSize = 5
  // const hidePagination = data.length <= pageSize

  const columns: GridColDef[] = [
    { field: 'date', headerName: 'Date', flex: 1},
    { field: 'height', headerName: 'Height', flex: 1 },
    { field: 'weight', headerName: 'Weight', flex: 1 },
    { field: 'waist', headerName: 'Waist', flex: 1 },
    { field: 'neck', headerName: 'Neck', flex: 1 },
    { field: 'hip', headerName: 'Hip', flex: 1 },
    { field: 'chest', headerName: 'Chest', flex: 1 },
    {
      field: 'bodyFat',
      headerName: 'BF%',
      width: 100,
      sortable: false,

      valueGetter: (_, row) => {
        return calculateBodyFat({
          sex: "male", 
          height: row.height,
          waist: row.waist,
          neck: row.neck,
        })
      },
    }, 
    {
      field: 'actions',
      headerName: '',
      sortable: false,
      filterable: false,
      width: 160,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            onClick={() => onEdit?.(params.row.id)}
          >
            Edit
          </Button>

          <Button
            size="small"
            color="error"
            onClick={() => onDelete(params.row.id)}
          >
            X
          </Button>
        </Box>
      ),
    },
  ]

  const mobileFields = [
    'date',
    'weight',
    'waist',
    'bodyFat',
    'actions',
  ]

  const visibleColumns = isMobile
    ? columns.filter((c) => mobileFields.includes(c.field))
    : columns

  return (
    <Box sx={{ height: 'auto', width: '100%' }}>
      <DataGrid
        rows={data}
        columns={visibleColumns}
        getRowId={(row) => row.id}
        onRowDoubleClick={(params) => {
          onEdit?.(params.row.id)
        }}
        disableRowSelectionOnClick
        initialState={{
          sorting: {
            sortModel: [
              { field: 'date', sort: 'desc' },
            ],
          },
          pagination: { paginationModel: { pageSize: 10, page: 0 } },
        }}
        sx={{
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'rgba(0,0,0,0.04)',
          },
        }}
      />
    </Box>
  )
}