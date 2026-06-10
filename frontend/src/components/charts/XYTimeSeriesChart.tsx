import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid, 
  Scatter,
  Dot
} from 'recharts'

import TimeChartTooltip from './TimeChartTooltip'

function normalizeX(x: number | string): number {
  if (typeof x === 'number') return x
  return new Date(x).getTime()
}

type XYPoint = {
  date: string
  x: number | string
  y: number
}

export type XYSeries = {
  id: string
  label: string
  color?: string
  seriesColor?: string
  type?: string
  dots?: number
  data: XYPoint[]
}

type Props = {
  series: XYSeries[]
  xLabel?: string
  yLabel?: string
  yValueLabel?: string
  color?: string
  height?: number
  displaySeriesLabel?: boolean
  xAxisIsDate?: boolean
  xDomainPadding?: number
  xDomainRounding?: number
  yDomainPadding?: number
  yDomainRounding?: number
}

export default function XYTimeSeriesChart({
  series,
  xLabel = 'X',
  yLabel = 'Y',
  yValueLabel = undefined, 
  color = '#1976d2',
  height = 300, 
  displaySeriesLabel = false, 
  xAxisIsDate = false, 
  xDomainPadding = undefined, 
  xDomainRounding = undefined, 
  yDomainPadding = undefined, 
  yDomainRounding = undefined, 
}: Props) {
  // const sorted = [...data].sort(
  //   (a, b) =>
  //     new Date(a.date).getTime() -
  //     new Date(b.date).getTime(),
  // )

  // if (!sorted.length) {
  //   return <div>No data</div>
  // }
  const isDateAxis = series.some(s =>
    s.data.some(p => typeof p.x === 'string')
  )

  const formatX = (x: number) =>
  isDateAxis
    ? new Date(x).toISOString().slice(0, 10)
    : x

  const allYValues = series.flatMap((s) =>
    s.data
      .map((p) => p.y)
      .filter((v): v is number => typeof v === 'number')
  )

  const yMin = allYValues.length ? Math.min(...allYValues) : 0
  const yMax = allYValues.length ? Math.max(...allYValues) : 0

  const allXValues = series.flatMap((s) =>
    s.data
      .map((p) => p.x)
      .filter((v): v is number => typeof v === 'number')
  )

  const xMin = allXValues.length ? Math.min(...allXValues) : 0
  const xMax = allXValues.length ? Math.max(...allXValues) : 0

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart>
        <CartesianGrid strokeDasharray="3 3" />

        {/* X = metric */}
        <XAxis
          type="number"
          dataKey="x"
          name={xLabel}
          domain={
            xDomainPadding && xDomainRounding
              ? [
                  Math.max(
                    Math.floor(
                      (xMin - xDomainPadding) / xDomainRounding,
                    ) * xDomainRounding,
                    0,
                  ),
                  Math.ceil(
                    (xMax + xDomainPadding) / xDomainRounding,
                  ) * xDomainRounding,
                ]
              : ['auto', 'auto']
          }
          tickFormatter={
            isDateAxis
              ? (v: any) => new Date(v).toISOString().slice(0, 10) // "10-15"
              : undefined
          }
          label={{
            value: xLabel,
            position: 'insideBottom',
            dy: 10, 
            style: {
              textAnchor: 'middle'
            },
          }}
        />

        {/* Y = metric */}
        <YAxis
          type="number"
          dataKey="y"
          name={yLabel}
          domain={
            yDomainPadding && yDomainRounding
              ? [
                  Math.max(
                    Math.floor(
                      (yMin - yDomainPadding) / yDomainRounding,
                    ) * yDomainRounding,
                    0,
                  ),
                  Math.ceil(
                    (yMax + yDomainPadding) / yDomainRounding,
                  ) * yDomainRounding,
                ]
              : ['auto', 'auto']
          }
          // domain={['auto', 'auto']}
          label={{
            value: yLabel,
            angle: -90,
            position: 'insideLeft',
            style: {
              textAnchor: 'middle',
            },
          }}
        />

        <Tooltip
          content={(props: any) => {
            const item = props.payload?.[0]
            const p = props.payload?.[0]?.payload
            if (!p) return null

            const seriesColor =
              item.stroke ||
              item.fill ||
              color

            return (
              <TimeChartTooltip
                active={props.active}
                payload={[
                  ...(!xAxisIsDate
                    ? [{ name: xLabel, value: formatX(p.x), color: seriesColor }]
                    : []),
                  { name: yValueLabel?? yLabel, value: p.y, color: seriesColor },
                ]}
                label={p.date}
                seriesLabel={
                  displaySeriesLabel
                    ? `${p.seriesLabel}`
                    : ''
                }
                seriesColor = {p.seriesColor?? seriesColor}
              />
            )
          }}
        />

        {/* THIS is the trajectory
        <Line
          type="monotone"
          dataKey="y"
          stroke={color}
          strokeWidth={2.5}
          dot={{ r: 3 }}
        /> */}
        {series.map((s: any) => (
          s.type === 'scatter' ? ( 
            <Scatter
              key={s.id}
              data={s.data.map((p: any) => ({
                ...p,
                x: normalizeX(p.x),
                seriesColor: s.seriesColor,
                seriesLabel: s.label,
                seriesType: s.type,
              }))}
              name={s.label}
              fill={s.color ?? color}
              shape={<Dot r={s.dots?? 3} />}
            />
          ) : 
          <Line
            key={s.id}
            data={s.data.map((p: any) => ({
              ...p,
              x: normalizeX(p.x),
              seriesLabel: s.label,
              seriesColor: s.seriesColor,
              seriesType: s.type,
            }))}
            type="monotone"
            dataKey="y"
            name={s.label}
            stroke={s.color?? color}
            strokeWidth={2.5}
            dot={{ r: s.dots?? 3 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}