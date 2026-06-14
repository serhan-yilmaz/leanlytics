import { Box, Button, IconButton, useMediaQuery, useTheme } from '@mui/material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import type { Measurement } from '../../data/types'

import { calculateBodyCompAtBF, calculateBodyFat } from '../../calculations/bodyComposition'

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

  const allColumns: GridColDef[] = [
    { field: 'date', headerName: 'Date', flex: 1, minWidth: 100},
    { field: 'height', headerName: 'Height', flex: 1 },
    { field: 'weight', headerName: 'Weight', flex: 1, description: "Weight measurement (kg)", },
    { field: 'waist', headerName: 'Waist', flex: 1 },
    { field: 'neck', headerName: 'Neck', flex: 1 },
    { field: 'hip', headerName: 'Hip', flex: 1 },
    { field: 'chest', headerName: 'Chest', flex: 1 },
    {
      field: 'bodyFat',
      headerName: 'BF%',
      description: "Body fat estimate (%)", 
      flex: 1, 
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
      field: 'muscularity',
      headerName: 'Lean@15',
      description: 'Lean mass estimate (kg) at 15% body fat', 
      flex: 1, 
      sortable: false,

      valueGetter: (_, row) => {
        return calculateBodyCompAtBF({
          weight: row.weight, 
          height: row.height,
          bodyFat: calculateBodyFat({
            sex: "male", 
            height: row.height,
            waist: row.waist,
            neck: row.neck,
          }),
          bfTarget: 15
        }).leanMass.toFixed(1)
      },
    }, 
    {
      field: 'actions',
      headerName: '',
      sortable: false,
      filterable: false,
      flex: 1, 
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => onEdit?.(params.row.id)}
          >
            <EditIcon fontSize="small" />
            {/* Edit */}
          </IconButton>

          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(params.row.id)}
          >
           <DeleteIcon fontSize="small" />
            {/* X */}
          </IconButton>
        </Box>
      ),
    },
  ]

  const mobileFields = [
    'date',
    'weight',
    // 'waist',
    'bodyFat',
    'muscularity', 
    'actions',
  ]

const columns = allColumns.map((col) => {
  if (col.field === 'actions') {
    return col
  }

  return {
    ...col,
    disableColumnMenu: true,
  }
})

  const visibleColumns = isMobile
    ? columns.filter((c) => mobileFields.includes(c.field))
    : columns

  const sortedData = [...data].sort((a, b) =>
    b.date.localeCompare(a.date)
  )

  return (
    <Box sx={{ height: 'auto', width: '100%' }}>
      <DataGrid
        rows={sortedData}
        columns={visibleColumns}
        getRowId={(row) => row.id}
        onRowDoubleClick={(params) => {
          onEdit?.(params.row.id)
        }}
        disableRowSelectionOnClick
        disableColumnSorting
        initialState={{
          columns: {
            columnVisibilityModel: {
              height: false,
              hip: false,
              chest: false,
              muscularity: !isMobile
            },
          },
          // sorting: {
          //   sortModel: [
          //     { field: 'date', sort: 'desc' },
          //   ],
          // },
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