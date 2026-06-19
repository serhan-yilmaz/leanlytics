import type { Measurement } from './types'

function csvEscape(value: unknown) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`
}

export function exportMeasurements(
  measurements: Measurement[],
) {
  const headers = [
    'date',
    'height',
    'weight',
    'waist',
    'neck',
    'hip',
    'chest',
  ]

  const rows = measurements.map((m) => [
    m.date,
    m.height,
    m.weight,
    m.waist,
    m.neck,
    m.hip,
    m.chest,
  ])

//   const csv = [
//     headers.join(','),
//     ...rows.map((row) =>
//       row.map(csvEscape).join(','),
//     ),
//   ].join('\n')

  const csv = [
    headers.join(','),
    ...rows.map((row) =>
      row.join(','),
    ),
  ].join('\n')

  const blob = new Blob(
    [csv],
    {
      type: 'text/csv;charset=utf-8;',
    },
  )

  const url =
    URL.createObjectURL(blob)

  const link = document.createElement('a')

  link.href = url

  link.download =
    `measurements-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}