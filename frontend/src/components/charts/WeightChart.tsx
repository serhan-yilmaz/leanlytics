import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

type Props = {
  data: {
    date: string
    value: number
  }[]
}

export default function WeightChart({
  data,
}: Props) {
  return (
    <ResponsiveContainer
      width="100%"
      height={200}
    >
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="date" />

        <YAxis
        domain={[
            (dataMin: number) => Math.max(Math.round(dataMin/5 - 0.5)*5, 0), 
            (dataMax: number) => Math.round(dataMax/5 + 0.5)*5
        ]}
        label={{
            value: 'Body Weight (kg)',
            angle: -90,
            position: 'insideLeft',
            style: {
                textAnchor: 'middle',
            },
        }}
        />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="value"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}