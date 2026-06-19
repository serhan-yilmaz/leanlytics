import { Box, Tooltip, Typography } from '@mui/material'
import React from 'react'
import MetricValue from '../ui/MetricValue'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import type { BodyCompTrendSummary } from '../../calculations/bodyCompTrendSummary'

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

export function LeanNormalizedInsight({ trend }: { trend: BodyCompTrendSummary }) {
  const lean = trend.lean15Rate
  const weight = trend.weightRate
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

        <MetricValue tooltip={trend.lean15Tooltip}>
            {lean.toFixed(2)} kg/month
        </MetricValue>

        {' '}net muscularity {lean > 0 ? 'gain' : 'change'} (Lean @ 15%).
        <Tooltip
          // title = {trend.test_output}
            title={
            <span style={{ whiteSpace: 'pre-line' }}>
                {trend.test_output}
            </span>
            }
            slotProps={{
              tooltip: {
                sx: {
                  maxWidth: "none",
                  // maxWidth: "none",
                  whiteSpace: "nowrap",
                },
              },
            }}
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

export function CompositionInsight({ trend }: { trend: BodyCompTrendSummary }) {
  return (
    <InsightBlock mt={1.5}>
        Current Trend:{' '}

        <MetricValue tooltip={trend.weightTooltip}>
        {Math.abs(trend.weightRate).toFixed(2)} kg/month
        </MetricValue>

        {' '}weight {trend.weightRate> 0 ? 'gain' : 'loss'}, with estimated{' '}

        <MetricValue tooltip={trend.leanFatCompositionTooltip}>
        {trend.weightRate> 0
            ? Math.abs(trend.leanRate).toFixed(2)
            : Math.abs(trend.fatRate).toFixed(2)} kg/month
        </MetricValue>

        {' '}

        {trend.weightRate > 0 ? 'lean' : 'fat'} mass{' '}
        {(trend.weightRate > 0 ? trend.leanRate : trend.fatRate) > 0
        ? 'contribution'
        : 'reduction'}

        {' '}

        <MetricValue tooltip={trend.leanContributionTooltip} bold={false}>
        ({trend.weightRate > 0
            ? trend.leanContribution.toFixed(0)
            : trend.fatContribution.toFixed(0)}
        %)
        </MetricValue>
        .
    </InsightBlock>
  )
}