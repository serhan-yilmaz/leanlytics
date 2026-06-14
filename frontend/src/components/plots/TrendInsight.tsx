import { Box, Tooltip, Typography } from '@mui/material'
import React from 'react'
import MetricValue from '../ui/MetricValue'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

type Props = {
  children: React.ReactNode
  mt?: number
}

export default function InsightBlock({ children, mt = 1.5 }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        mt,
      }}
    >
      <Typography variant="body2">
        {children}
      </Typography>
    </Box>
  )
}

export function LeanNormalizedInsight({ trend }: { trend: any }) {
  const lean = trend.lean15PerMonth
  const weight = trend.weightPerMonth
  const isWarning = lean < -0.1

  return (
    <InsightBlock>
        {isWarning && '⚠️ '}

        After body fat normalization, the trend suggests{' '}

        {isWarning &&
        (weight > 0
            ? 'a disproportionate fat gain relative to lean gain, resulting in '
            : 'a disproportionate lean loss relative to fat loss, resulting in ')}

        approximately{' '}

        <MetricValue tooltip={trend.lean15PerMonthTooltip}>
            {lean.toFixed(2)} kg/month
        </MetricValue>

        {' '}net muscularity {lean > 0 ? 'gain' : 'change'} (Lean @ 15%).
        <Tooltip
            title={
            <span style={{ whiteSpace: 'pre-line' }}>
                {trend.test_output}
            </span>
            }
        >
            <InfoOutlinedIcon
            sx={{
                ml: 0.5,
                fontSize: 16,
                verticalAlign: 'middle',
                color: 'text.secondary',
                cursor: 'help',
            }}
            />
        </Tooltip>
    </InsightBlock>
  )
}

export function CompositionInsight({ trend }: { trend: any }) {
  return (
    <InsightBlock mt={1.5}>
        Current Trend:{' '}

        <MetricValue tooltip={trend.weightPerMonthTooltip}>
        {Math.abs(trend.weightPerMonth).toFixed(2)} kg/month
        </MetricValue>

        {' '}weight {trend.weightPerMonth > 0 ? 'gain' : 'loss'}, with estimated{' '}

        <MetricValue tooltip={trend.leanFatCompositionTooltip}>
        {trend.weightPerMonth > 0
            ? Math.abs(trend.leanPerMonth).toFixed(2)
            : Math.abs(trend.fatPerMonth).toFixed(2)} kg/month
        </MetricValue>

        {' '}

        {trend.weightPerMonth > 0 ? 'lean' : 'fat'} mass{' '}
        {(trend.weightPerMonth > 0 ? trend.leanPerMonth : trend.fatPerMonth) > 0
        ? 'contribution'
        : 'reduction'}

        {' '}

        <MetricValue tooltip={trend.leanContributionTooltip} bold={false}>
        ({trend.weightPerMonth > 0
            ? trend.leanContribution.toFixed(0)
            : trend.fatContribution.toFixed(0)}
        %)
        </MetricValue>
        .
    </InsightBlock>
  )
}