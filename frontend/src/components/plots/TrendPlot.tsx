import ChartCard from '../ui/ChartCard'
import TimeSeriesChart from '../charts/TimeSeriesChart'
import XYTimeSeriesChart from '../charts/XYTimeSeriesChart'
import { charts } from '../../calculations/chartSeries'
import { useTheme } from '@mui/material/styles'

type Props = {
  data: any[]
  smoothed: any[]
}

export function WeightBodyFatPlot({
  data,
  smoothed,
}: Props) {

  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  
  return (
    <ChartCard title="Weight (kg) and Body Fat %">
      <TimeSeriesChart
        data={charts.weightBodyfat(smoothed)}
        label="Weight (kg)"
        labelRight="Body Fat %"
        yDomainPadding={2}
        yDomainRounding={2}
        seriesColor={isDark ? '#dfdfdf' : '#333'}
        seriesLabel="Smoothed Series"
        height={190}
        series={[
          {
            key: 'weight',
            label: 'Weight (kg)',
            color: isDark ? '#dfdfdf' : '#333',
            yAxisId: 'left',
          },
          {
            key: 'bodyFat',
            label: 'Body Fat %',
            color: '#ef4444',
            yAxisId: 'right',
          },
        ]}
      />
    </ChartCard>
  )
}

export function NormalizedMuscularityPlot({
  data,
  smoothed,
}: Props) {
  return (
    <ChartCard title="Normalized Muscularity (Lean @ 15%)">
      <XYTimeSeriesChart
        series={[
          {
            id: 'smoothed',
            label: 'Smoothed Series',
            dots: 0,
            data: charts.LeanMassatBF15(smoothed),
          },
        ]}
        yLabel="Lean mass (kg)"
        yValueLabel="Lean@15%"
        xLabel="Time"
        xAxisIsDate
        displaySeriesLabel
        height={180}
      />
    </ChartCard>
  )
}

export function LeanVsBodyFatPlot({
  data,
  smoothed,
}: Props) {
  return (
    <ChartCard title="Lean mass (kg) vs Bodyfat %">
      <XYTimeSeriesChart
        series={[
          {
            id: 'raw',
            label: 'Raw Measurements',
            color: '#b33',
            type: 'scatter',
            dots: 2,
            data: charts.leanMassVsBodyfat(data),
          },
          {
            id: 'smoothed',
            label: 'Smoothed Series',
            dots: 0,
            data: charts.leanMassVsBodyfat(smoothed),
          },
        ]}
        yLabel="Lean mass (kg)"
        xLabel="Bodyfat %"
        xDomainPadding={0.2}
        xDomainRounding={1}
        yDomainPadding={0.2}
        yDomainRounding={1}
        displaySeriesLabel
        height={180}
      />
    </ChartCard>
  )
}

export function WeightVsWaistPlot({
  data,
  smoothed,
}: Props) {
  return (
    <ChartCard title="Weight (kg) vs Waist (cm)">
      <XYTimeSeriesChart
        series={[
          {
            id: 'raw',
            label: 'Raw Measurements',
            color: '#b33',
            type: 'scatter',
            dots: 2,
            data: charts.weightVsWaist(data),
          },
          {
            id: 'smoothed',
            label: 'Smoothed Series',
            dots: 0,
            data: charts.weightVsWaist(smoothed),
          },
        ]}
        xLabel="Waist (cm)"
        yLabel="Weight (kg)"
        displaySeriesLabel
        height={180}
      />
    </ChartCard>
  )
}