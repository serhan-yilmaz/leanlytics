import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts'

import TimeChartTooltip from './TimeChartTooltip'
import { darken } from '../../util/color'

export type SeriesPoint = {
  date: string
  value?: number
  [key: string]: string | number | undefined
}

export type ChartSeriesDefinition = {
  key: string
  label: string
  color?: string
  yAxisId?: 'left' | 'right'
}

type Props = {
  data: SeriesPoint[]

  series?: ChartSeriesDefinition[]

  label?: string
  valueLabel?: string
  labelRight?: string
  yDomainPadding?: number
  yDomainRounding?: number
  height?: number
  seriesLabel?: string
  seriesColor?: string
}

export default function TimeSeriesChart({
  data,
  series,
  label,
  valueLabel,
  labelRight,
  yDomainPadding = 5,
  yDomainRounding = 5,
  height = 200,
  seriesLabel = undefined,
  seriesColor = undefined,
}: Props) {
  const chartSeries =
    series ??
    [
      {
        key: 'value',
        label: valueLabel ?? 'Value',
        // color: '#1976d2'
      },
    ]

  const leftValues = chartSeries
    .filter((s) => (s.yAxisId ?? 'left') === 'left')
    .flatMap((s) =>
      data
        .map((p) => p[s.key])
        .filter((v): v is number => typeof v === 'number'),
    )

  const rightValues = chartSeries
    .filter((s) => s.yAxisId === 'right')
    .flatMap((s) =>
      data
        .map((p) => p[s.key])
        .filter((v): v is number => typeof v === 'number'),
    )

  // const leftValues = chartSeries
  // .filter((s) => (s.yAxisId ?? 'left') === 'left')
  // .flatMap(...)

  // const rightValues = chartSeries
  // .filter((s) => s.yAxisId === 'right')
  // .flatMap(...)

  const leftMin = leftValues.length ? Math.min(...leftValues) : 0
  const leftMax = leftValues.length ? Math.max(...leftValues) : 0

  const rightMin = rightValues.length ? Math.min(...rightValues) : 0
  const rightMax = rightValues.length ? Math.max(...rightValues) : 0

  const hasRightAxis = chartSeries.some(
    (s) => s.yAxisId === 'right',
  )

  const leftSeries = chartSeries.filter(
    (s) => (s.yAxisId ?? 'left') === 'left',
  )

  const rightSeries = chartSeries.filter(
    (s) => s.yAxisId === 'right',
  )

  const leftAxisColor = leftSeries[0]?.color ? darken(leftSeries[0]?.color, 30) : '#666'
  const rightAxisColor = rightSeries[0]?.color ? darken(rightSeries[0]?.color, 30) : '#666'

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="date" />

        <YAxis
          yAxisId="left"
          domain={[
            Math.max(
              Math.floor(
                (leftMin - yDomainPadding) / yDomainRounding,
              ) * yDomainRounding,
              0,
            ),
            Math.ceil(
              (leftMax + yDomainPadding) / yDomainRounding,
            ) * yDomainRounding,
          ]}
          label={{
            value: label,
            angle: -90,
            position: 'insideLeft',
            style: {
              fill: leftAxisColor,
              textAnchor: 'middle',
            },
          }}
        />

        {hasRightAxis && (
          <YAxis
            yAxisId={"right"}
            orientation="right"
            domain={[
              Math.max(
                Math.floor(
                  (rightMin - yDomainPadding) / yDomainRounding,
                ) * yDomainRounding,
                0,
              ),
              Math.ceil(
                (rightMax + yDomainPadding) / yDomainRounding,
              ) * yDomainRounding,
            ]}
            label={{
              value: labelRight,
              angle: -90,
              position: 'insideRight',
              style: {
                fill: rightAxisColor,
                textAnchor: 'middle',
              },
            }}
          />
        )}

        <Tooltip
          content={(props: any) => {
            const payload = props.payload ?? []
            const label = props.label

            if (!payload.length) return null

            return (
              <TimeChartTooltip
                active={props.active}
                label={label}
                payload={payload}
                seriesLabel={seriesLabel}
                seriesColor={seriesColor}
              />
            )
          }}
        />

        {/* <Tooltip content={<TimeChartTooltip />} /> */}

        {chartSeries.length > 1 && <Legend />}

        {chartSeries.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color}
            strokeWidth={2.5}
            yAxisId={s.yAxisId ?? "left"}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}