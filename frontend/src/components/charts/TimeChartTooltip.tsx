const formatValue = (v: number) =>
  Number.isFinite(v) ? v.toFixed(1) : v

export default function TimeChartTooltip({ active, payload, label, seriesLabel, seriesColor }: any) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-xl bg-white p-3 shadow-lg border border-black/10">
      <div className="text-xs opacity-60 mb-2">{label}</div>

      {payload.map((p: any) => (
        <div key={p.dataKey} className="text-sm">
          <span style={{ color: p.color }}>●</span>{' '}
          {p.name}: {formatValue(p.value)}
        </div>
      ))}
      <span style={{ color: seriesColor, fontWeight: 600, fontSize: 14 }}>{seriesLabel?? ''}</span>
    </div>
  )
}

// export default function TimeChartTooltip(
//     props: any
// ) {
//   const { active, payload, label, value_label } = props
//   if (!active || !payload || !payload.length) {
//     return null
//   }

//   const value = payload[0].value

//   return (
//     <div
//       style={{
//         background: 'white',
//         border: '1px solid #ddd',
//         borderRadius: 8,
//         padding: 10,
//       }}
//     >
//       <div style={{ fontSize: 12, color: '#666' }}>
//         {label}
//       </div>

//       <div style={{ fontSize: 12}}>
//         {value_label}: { }
//         {typeof value === 'number'
//           ? value.toFixed(1)
//           : value}
//       </div>
//     </div>
//   )
// }