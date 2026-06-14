import { LeanVsBodyFatPlot, NormalizedMuscularityPlot, WeightBodyFatPlot, WeightVsWaistPlot } from './TrendPlot'

import type { ComponentType } from 'react'

import type { FC } from 'react'

type PlotProps = {
  data: any[]
  smoothed: any[]
}
type PlotComponent = FC<Props>

export const plotRegistry = {
  'weight-bodyfat': WeightBodyFatPlot,
  'normalized-muscularity': NormalizedMuscularityPlot,
  'lean-bodyfat': LeanVsBodyFatPlot,
  'weight-waist': WeightVsWaistPlot,
} satisfies Record<string, PlotComponent>

export type PlotType = keyof typeof plotRegistry

type Props = {
  type: PlotType
  data: any[]
  smoothed: any[]
}

export default function Plot({ type, ...props }: Props) {
  const Component = plotRegistry[type]

  if (!Component) return null

  return <Component {...props} />
}