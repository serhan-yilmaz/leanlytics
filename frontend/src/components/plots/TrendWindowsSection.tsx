import {
  Box,
  Paper,
  Typography,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  Select,
  FormControl,
  Alert,
} from '@mui/material'

import SettingsIcon from '@mui/icons-material/Settings'
import HelpOutlineIcon from '@mui/icons-material/HelpOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

import { useState } from 'react'

import type {
  WindowBodyCompPair,
} from '../../calculations/windowBodyComp'

import MetricValue from '../ui/MetricValue'
import TrendConfidenceDialog from './TrendConfidenceDialog'

import type { Measurement } from '../../data/types'
import type { WindowSolutionResults } from '../../calculations/windowSolver'

type Props = {
  slopeWindows: Record<
    string,
    WindowBodyCompPair | null
  >

  windowSolutionResults: WindowSolutionResults

  measurements: Measurement[]

  analysisMeasurementIndex: number

  onAnalysisMeasurementIndexChange: (
    index: number,
  ) => void

  customComparisonIndex: number | undefined
  onCustomComparisonIndexChange: (index: number | undefined) => void
}

const scoreThresholds = [
  {
    key: 'high',
    color: '#4caf50',
    threshold: 1.5,
    label: '🟢 High confidence',
    legendLabel: 'High',
    description:
      'Long duration and/or many measurements support the trend.',
  },
  {
    key: 'medium',
    color: '#ffb300',
    threshold: 0.5,
    label: '🟡 Medium confidence',
    legendLabel: 'Medium',
    description:
      'Trend is plausible but should be interpreted cautiously.',
  },
  {
    key: 'low',
    color: '#ef5350',
    threshold: 0,
    label: '🔴 Low confidence',
    legendLabel: 'Low',
    description:
      'Trend is based on limited data or a short time span and may change substantially with additional measurements.',
  },
]

function getThreshold(key: 'high' | 'medium' | 'low') {
  return scoreThresholds.find((t) => t.key === key)!
}

const REQUIRED_MINIMUM_CONFIDENCE_SCORE = 0.15;

const confidenceFilters = [
  {
    value: REQUIRED_MINIMUM_CONFIDENCE_SCORE,
    label: 'All',
  },
  {
    value: getThreshold('medium').threshold,
    label: 'Medium+',
  },
  {
    value: getThreshold('high').threshold,
    label: 'High only',
  },
] as const

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
  minimumConfidenceScore = REQUIRED_MINIMUM_CONFIDENCE_SCORE, 
}: {
  label: string
  value?: React.ReactNode
  tooltip?: string
  unitSuffix: string
  confidenceScore?: number,
  minimumConfidenceScore?: number
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

  if (confidenceScore < minimumConfidenceScore) {
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
  measurements,
  windowSolutionResults, 
  analysisMeasurementIndex,
  onAnalysisMeasurementIndexChange,
  customComparisonIndex, 
  onCustomComparisonIndexChange
}: Props) {
  const [confidenceOpen, setConfidenceOpen] =
    useState(false)

  const [minimumConfidenceScore, setMinimumConfidenceScore] =
    useState(REQUIRED_MINIMUM_CONFIDENCE_SCORE)

  const [optionsAnchorEl, setOptionsAnchorEl] =
    useState<HTMLElement | null>(null)

  const optionsOpen = Boolean(optionsAnchorEl)

  // const isAnchorValid =
  //   customComparisonIndex == null ||
  //   customComparisonIndex < analysisMeasurementIndex

  const isAnchorValid =
    customComparisonIndex == undefined || 
    analysisMeasurementIndex == undefined || 
    windowSolutionResults.targets.length < customComparisonIndex || 
    windowSolutionResults.targets[customComparisonIndex] == undefined || 
    windowSolutionResults.targets[customComparisonIndex].date < measurements[analysisMeasurementIndex].date

  const entries =
    Object.entries(slopeWindows)
      .filter(
        (
          x,
        ): x is [
          string,
          WindowBodyCompPair,
        ] => (
          x[1] !== null &&
          x[1].windowSolution.score >= Math.max(
              REQUIRED_MINIMUM_CONFIDENCE_SCORE,
              minimumConfidenceScore,
            )
        ),
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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 1,
        }}
      >
        <Box>
          <Typography>
            Body Composition Change Trends
          </Typography>

          {analysisMeasurementIndex > 0 && (
            <Typography
              variant="caption"
              color="text.secondary"
            >
              As of{' '}
              {
                measurements[
                  analysisMeasurementIndex
                ]?.date
              }
            </Typography>
          )}
        </Box>

        <IconButton
          size="small"
          sx={{ ml: 'auto' }}
          onClick={(e) =>
            setOptionsAnchorEl(
              e.currentTarget,
            )
          }
        >
          <SettingsIcon
            fontSize="small"
          />
        </IconButton>
      </Box>

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
                <Tooltip title = {`${pair.first.date} → ${pair.last.date}`}>
                  <Typography variant="subtitle2">
                    {
                      pair.windowSolution
                        .label
                    }
                  </Typography>
                </Tooltip>

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
                  minimumConfidenceScore={minimumConfidenceScore}
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
                  minimumConfidenceScore={minimumConfidenceScore}
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
                  minimumConfidenceScore={minimumConfidenceScore}
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
                  minimumConfidenceScore={minimumConfidenceScore}
                />
              </Box>
            </Paper>
          )
        })}

        {legendElement}
      </Box>

      <Menu
        anchorEl={optionsAnchorEl}
        open={optionsOpen}
        onClose={() =>
          setOptionsAnchorEl(null)
        }
      >
        <Box
          sx={{
            p: 2,
            width: 280,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1 }}
            >
              Analysis Date
            </Typography>

            <FormControl
              fullWidth
              size="small"
            >
              <Select
                value={
                  analysisMeasurementIndex
                }
                onChange={(e) =>
                  onAnalysisMeasurementIndexChange(
                    Number(e.target.value),
                  )
                }
              >
                {measurements.map(
                  (
                    measurement,
                    index,
                  ) => (
                    <MenuItem
                      key={
                        measurement.id
                      }
                      value={index}
                    >
                      {measurement.date}
                      {index === 0
                        ? ' (Latest)'
                        : ''}
                    </MenuItem>
                  ),
                )}
              </Select>
            </FormControl>
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1 }}
            >
              Confidence Filter
            </Typography>

            <FormControl
              fullWidth
              size="small"
            >
              <Select
                value={minimumConfidenceScore}
                onChange={(e) =>
                  setMinimumConfidenceScore(
                    Number(e.target.value),
                  )
                }
              >
                {confidenceFilters.map(
                  (filter) => (
                    <MenuItem
                      key={filter.label}
                      value={filter.value}
                    >
                      {filter.label}
                    </MenuItem>
                  ),
                )}
              </Select>
            </FormControl>
          </Box>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle2">
                Comparison Anchor
              </Typography>

              <Tooltip title="Adds an additional reference point into trend comparison. Must be before analysis date.">
                <HelpOutlineIcon fontSize="small" />
              </Tooltip>
            </Box>

            <FormControl fullWidth size="small">
              <Select
                value={
                  customComparisonIndex ?? ''
                }
                displayEmpty
                onChange={(e) => {
                  const v = e.target.value
                  onCustomComparisonIndexChange(
                    v
                  )
                }}
              >
                <MenuItem value={''}>
                  Auto (default)
                </MenuItem>

                {windowSolutionResults.targets.map((m, index) => (
                  (m.score >= minimumConfidenceScore) && (
                  <MenuItem key={m.target} value={index}>
                    {m.date}
                    {/* {index === 0 ? ' (Latest)' : ''} */}
                  </MenuItem>
                  )
                ))}
              </Select>
            </FormControl>
            {!isAnchorValid && (
              <Alert severity="error" sx={{ mb: 1 }}>
                Comparison anchor must be before the analysis date.
              </Alert>
            )}
          </Box>
        </Box>
      </Menu>

      <TrendConfidenceDialog
        open={confidenceOpen}
        onClose={() => setConfidenceOpen(false)}
        scoreThresholds={scoreThresholds}
      />
    </>
  )
}