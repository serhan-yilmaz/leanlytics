import {
  Box,
  Paper,
  Typography,
  Tooltip,
} from '@mui/material'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

import type {
  WindowBodyCompPair,
} from '../../calculations/windowBodyComp'

import MetricValue from '../ui/MetricValue'

type Props = {
  slopeWindows: Record<
    string,
    WindowBodyCompPair | null
  >
}

const scoreThresholds = [
    {
        color: "#4caf50", 
        threshold: 1.5, 
        label: 'High confidence',
        legendLabel: 'High',
    },
    {
        color: "#ffb300", 
        threshold: 0.5, 
        label: 'Medium confidence',
        legendLabel: 'Medium',
    },
    {
        color: "#ef5350", 
        threshold: 0, 
        label: 'Low confidence',
        legendLabel: 'Low',
    }
]

function getConfidenceMeta(score?: number) {
  if (score == null) {
    return {
      color: "#9e9e9e",
      label: "No confidence data",
    };
  }

  const match = scoreThresholds.find(t => score >= t.threshold);

  return {
    color: match?.color ?? "#9e9e9e",
    label: match?.label ?? "No confidence data",
  };
}

function getConfidenceColor(score?: number) {
  return getConfidenceMeta(score).color;
}

function getConfidenceLabel(score?: number) {
  return getConfidenceMeta(score).label;
}

function formatSignedNumber(value: number, decimals = 2) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}`;
}

// function getConfidenceColor(score?: number) {
//   if (score == null) return '#9e9e9e' // neutral grey
//   const sigmoid = Math.min(1, 2 / (1 + 2 ** (-score)) - 1);

//   scoreThresholds

//   if (score >= 0.75) return '#4caf50' // green
//   if (score >= 0.5) return '#ffb300'   // amber
//   return '#ef5350'
// //   if (score >= 0.2) return '#ef5350'   // red
// //   return '#555' 
// }

// function getConfidenceLabel(score?: number) {
//   if (score == null) return 'No confidence data'
//   if (score >= 0.75) return 'High confidence'
//   if (score >= 0.5) return 'Medium confidence'
//   return 'Low confidence'
// }

function formatStrength(score?: number) {
  if (score == null) return '×-'
  return `×${score.toFixed(1)}`
}

// log-scaled 0–1 normalization for bar
function strengthToBar(score?: number) {
  if (!score || score <= 0) return 0
  return Math.min(1, 2 / (1 + Math.exp(-score)) - 1)
}

function getBarColor(t: number) {
  if (t < 0.33) return '#ef5350'
  if (t < 0.66) return '#ffb300'
  return '#4caf50'
}

function MetricText({
  label,
  value,
  tooltip,
  unitSuffix,
  confidenceScore
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
            <strong>{value}</strong>
            {' '}{unitSuffix}
        </MetricValue>
    </Typography>
)

if(!confidenceScore){
    return metricComponent
}

const confidenceColor = getConfidenceColor(confidenceScore)
const confidenceLabel = getConfidenceLabel(confidenceScore)

if(confidenceScore <= 0.15){
    return <></>
}

  return (
    <Box
        sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        }}
    >
        <Tooltip title={confidenceLabel}>
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
      mb: 1.5
    }}
  >
    <Typography
      variant="caption"
      sx={{ color: 'text.secondary' }}
    >
      Confidence:
    </Typography>

    {scoreThresholds.map(x => (
      <Box
        key={x.legendLabel}
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
    ))}
  </Box>
)

export default function TrendWindowsSection({
  slopeWindows,
}: Props) {

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
        (
          a,
          b,
        ) =>
          a[1]
            .windowSolution
            .targetDays -
          b[1]
            .windowSolution
            .targetDays,
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
          mb: 1
        }}
      >
        {entries.map(([key, pair]) => {

          const t = pair.trendSummary

          if (!t) {
            return null
          }

          const confidenceScore = pair.windowSolution.score
          const confidenceColor = getConfidenceColor(confidenceScore)
          const confidenceLabel = getConfidenceLabel(confidenceScore)

          const unitSuffix = t.rateUnit === "month" ? "mo" : "wk"

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
                  justifyContent: 'space-between',
                }}
              >

                {/* <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Tooltip title={confidenceLabel}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: confidenceColor,
                        boxShadow: `0 0 0 2px ${confidenceColor}33`,
                      }}
                    />
                  </Tooltip> */}

                  <Typography variant="subtitle2">
                    {pair.windowSolution.label}
                  </Typography>
                {/* </Box> */}

                <Tooltip
                  title={t.test_output}
                  slotProps={{
                    tooltip: {
                      sx: {
                        maxWidth: "none"
                      },
                    },
                  }}
                >
                  <InfoOutlinedIcon
                    sx={{
                      fontSize: 18,
                      color: 'text.secondary',
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
                  tooltip={t.weightTooltip}
                  value={formatSignedNumber(t.weightRate, 1)}
                  unitSuffix={`kg/${unitSuffix}`}
                  confidenceScore={confidenceScore}
                />

                <MetricText
                  label="BF"
                  tooltip={t.bodyfatTooltip}
                  value={formatSignedNumber(t.bodyfatRate, 1)}
                  unitSuffix={`%/${unitSuffix}`}
                  confidenceScore={confidenceScore/1.5}
                />

                <MetricText
                  label="Lean"
                  tooltip={t.leanFatCompositionTooltip}
                  value={formatSignedNumber(t.leanRate, 1)}
                  unitSuffix={`kg/${unitSuffix}`}
                  confidenceScore={confidenceScore/3}
                />

                <MetricText
                  label="Lean@15"
                  tooltip={t.lean15Tooltip}
                  value={formatSignedNumber(t.lean15Rate, 1)}
                  unitSuffix={`kg/${unitSuffix}`}
                  confidenceScore={confidenceScore/6}
                />
              </Box>
            </Paper>
          )
        })}
       {legendElement}
      </Box>
    </>
  )
}