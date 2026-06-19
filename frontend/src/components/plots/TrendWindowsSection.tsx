import {
  Box,
  Paper,
  Typography,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

import { useState } from 'react'

import type {
  WindowBodyCompPair,
} from '../../calculations/windowBodyComp'

import MetricValue from '../ui/MetricValue'
import TrendConfidenceDialog from './TrendConfidenceDialog'

type Props = {
  slopeWindows: Record<
    string,
    WindowBodyCompPair | null
  >
}

const scoreThresholds = [
  {
    color: '#4caf50',
    threshold: 1.5,
    label: '🟢 High confidence',
    legendLabel: 'High',
    description:
      'Long duration and/or many measurements support the trend.',
  },
  {
    color: '#ffb300',
    threshold: 0.5,
    label: '🟡 Medium confidence',
    legendLabel: 'Medium',
    description:
      'Trend is plausible but should be interpreted cautiously.',
  },
  {
    color: '#ef5350',
    threshold: 0,
    label: '🔴 Low confidence',
    legendLabel: 'Low',
    description:
      'Trend is based on limited data or a short time span and may change substantially with additional measurements.',
  },
]

function getConfidenceMeta(score?: number) {
  if (score == null) {
    return {
      color: '#9e9e9e',
      label: 'No confidence data',
      description: '',
    }
  }

  const match = scoreThresholds.find(
    (t) => score >= t.threshold,
  )

  return {
    color: match?.color ?? '#9e9e9e',
    label: match?.label ?? 'No confidence data',
    description: match?.description ?? '',
  }
}

function getConfidenceColor(score?: number) {
  return getConfidenceMeta(score).color
}

function formatSignedNumber(
  value: number,
  decimals = 2,
) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(
    decimals,
  )}`
}

function MetricText({
  label,
  value,
  tooltip,
  unitSuffix,
  confidenceScore,
}: {
  label: string
  value?: React.ReactNode
  tooltip?: string
  unitSuffix: string
  confidenceScore?: number
}) {
  const metricComponent = (
    <Typography variant="body2">
      {label}:{' '}
        <MetricValue tooltip={tooltip} bold={false}>
          <strong>{value}</strong> {unitSuffix}
        </MetricValue>
    </Typography>
  )

  if (!confidenceScore) {
    return metricComponent
  }

  const confidenceColor =
    getConfidenceColor(confidenceScore)

  if (confidenceScore <= 0.15) {
    return <></>
  }

  const meta = getConfidenceMeta(confidenceScore)

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Tooltip
        title={
          <Box>
            <strong>{meta.label}</strong>
            <br />
            {meta.description}
          </Box>
        }
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: confidenceColor,
            boxShadow: `0 0 0 2px ${confidenceColor}33`,
          }}
        />
      </Tooltip>

      {metricComponent}
    </Box>
  )
}

export default function TrendWindowsSection({
  slopeWindows,
}: Props) {
  const [confidenceOpen, setConfidenceOpen] =
    useState(false)

  const entries =
    Object.entries(slopeWindows)
      .filter(
        (
          x,
        ): x is [
          string,
          WindowBodyCompPair,
        ] => x[1] !== null,
      )
      .sort(
        (a, b) =>
          a[1].windowSolution.targetDays -
          b[1].windowSolution.targetDays,
      )

  const legendElement = (
    <Box
      sx={{
        display: 'flex',
        marginLeft: 'auto',
        marginRight: 'auto',
        alignItems: 'center',
        gap: 2,
        mt: 0.5,
        color: 'text.secondary',
        fontSize: 12,
        mb: 1.5,
        cursor: 'pointer',
      }}
      onClick={() => setConfidenceOpen(true)}
    >
      <Typography
        variant="caption"
        sx={{ color: 'text.secondary' }}
      >
        Confidence:
      </Typography>

      {scoreThresholds.map((x) => (
        <Tooltip
          key={x.legendLabel}
          title={
            <Box>
              <strong>{x.label}</strong>
              <br />
              {x.description}
            </Box>
          }
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: x.color,
                boxShadow: `0 0 0 2px ${x.color}33`,
              }}
            />

            <Typography variant="caption">
              {x.legendLabel}
            </Typography>
          </Box>
        </Tooltip>
      ))}
    </Box>
  )

  return (
    <>
      <Typography sx={{ mb: 1 }}>
        Body Composition Change Trends
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          mb: 1,
        }}
      >
        {entries.map(([key, pair]) => {
          const t = pair.trendSummary

          if (!t) {
            return null
          }

          const confidenceScore =
            pair.windowSolution.score

          const unitSuffix =
            t.rateUnit === 'month'
              ? 'mo'
              : 'wk'

          return (
            <Paper
              key={key}
              variant="outlined"
              sx={{
                p: 1.5,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent:
                    'space-between',
                }}
              >
                <Typography variant="subtitle2">
                  {
                    pair.windowSolution
                      .label
                  }
                </Typography>

                <Tooltip
                  title={t.test_output}
                  slotProps={{
                    tooltip: {
                      sx: {
                        maxWidth:
                          'none',
                      },
                    },
                  }}
                >
                  <InfoOutlinedIcon
                    sx={{
                      fontSize: 18,
                      color:
                        'text.secondary',
                      cursor: 'help',
                    }}
                  />
                </Tooltip>
              </Box>

              <Box
                sx={{
                  mt: 1,
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                <MetricText
                  label="Weight"
                  tooltip={
                    t.weightTooltip
                  }
                  value={formatSignedNumber(
                    t.weightRate,
                    1,
                  )}
                  unitSuffix={`kg/${unitSuffix}`}
                  confidenceScore={
                    confidenceScore
                  }
                />

                <MetricText
                  label="BF"
                  tooltip={
                    t.bodyfatTooltip
                  }
                  value={formatSignedNumber(
                    t.bodyfatRate,
                    1,
                  )}
                  unitSuffix={`%/${unitSuffix}`}
                  confidenceScore={
                    confidenceScore / 1.67
                  }
                />

                <MetricText
                  label="Lean"
                  tooltip={
                    t.leanFatCompositionTooltip
                  }
                  value={formatSignedNumber(
                    t.leanRate,
                    1,
                  )}
                  unitSuffix={`kg/${unitSuffix}`}
                  confidenceScore={
                    confidenceScore / 3
                  }
                />

                <MetricText
                  label="Lean@15"
                  tooltip={t.lean15Tooltip}
                  value={formatSignedNumber(
                    t.lean15Rate,
                    1,
                  )}
                  unitSuffix={`kg/${unitSuffix}`}
                  confidenceScore={
                    confidenceScore / 6
                  }
                />
              </Box>
            </Paper>
          )
        })}

        {legendElement}
      </Box>

      <TrendConfidenceDialog
        open={confidenceOpen}
        onClose={() => setConfidenceOpen(false)}
        scoreThresholds={scoreThresholds}
      />
    </>
  )
}