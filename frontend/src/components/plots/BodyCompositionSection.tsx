import {
  Box,
  Collapse,
  Divider,
  FormControl,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Select,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material"

import type { WindowBodyCompEstimate, WindowEstimateSolution } from "../../calculations/windowBodyComp"
import MetricValue from "../ui/MetricValue"

import SettingsIcon from '@mui/icons-material/Settings'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"

import type { Measurement } from "../../data/types"
import { useState } from "react"
import { getMetricColors } from "./metricColors"
import { darken } from "../../util/color"
import { ordinalSuffix } from "../../calculations/util"

type Props = {
  estimateResults: Record<string, WindowBodyCompEstimate | null>
  measurements: Measurement[]
  analysisMeasurementIndex: number
  onAnalysisMeasurementIndexChange: (
    index: number,
  ) => void
}

function MetricText({
  label,
  value,
  tooltip,
  unitSuffix,
  color,
}: {
  label: string
  value?: React.ReactNode
  tooltip?: string
  unitSuffix?: string
  color?: string
}) {
  return (
    <Typography variant="body2" sx={{ color: color, fontWeight: 550 }}>
      {label}:{' '}
      <MetricValue
        tooltip={tooltip}
        bold={false}
      >
        <strong>{value}</strong>
        {unitSuffix
          ? ` ${unitSuffix}`
          : ''}
      </MetricValue>
    </Typography>
  )
}

function EstimateSection({
  solution
}: {
  solution: WindowBodyCompEstimate
}) {
  const headerTooltip = (solution.first.dateMin == solution.first.dateMax) ?
    `${solution.first.dateMin}` :
    `From ${solution.first.dateMin} to ${solution.first.dateMax}`;
  const headerAdditional = (solution.first.dateMin == solution.first.dateMax) ?
    ': ' :
    ' for';
  const t = solution.trendSummary

  const theme = useTheme()

  const metricColors = getMetricColors(
    theme.palette.mode === 'dark',
  )

  const [advancedOpen, setAdvancedOpen] = useState(false)

  let waistToHeightRatio = 0;
  if (typeof solution.first.waist === 'number' && typeof solution.first.height === 'number') {
    waistToHeightRatio = solution.first.waist / solution.first.height
  }

  const whtrColors = {
    low: "#86ff86",
    moderate: "#ffec95",
    high: "#ffa4a4",
  }

  let paperColors = {
    whtr: "action.hover",
    ffmi: "action.hover",
    ffmi15: "action.hover"
  }

  if (theme.palette.mode !== 'dark') {
    paperColors = {
      whtr: "rgb(253, 249, 244)",
      ffmi: "rgb(248, 255, 245)",
      ffmi15: "rgb(255, 246, 255)",
    }
  }

  const waistToHeightRiskTooltip = (
    <Box>
      <Typography
        variant="subtitle2"
        sx={{ mb: 0.75 }}
      >
        Waist-to-Height Ratio
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            "auto auto auto",
          columnGap: 2,
          rowGap: 0.5,
        }}
      >
        <strong>WHtR</strong>
        <strong>Body Fat</strong>
        <strong>Category</strong>

        <Box
          component="span"
          sx={{
            color: whtrColors.low,
            fontWeight: 500,
          }}
        >
          {"< 0.50"}
        </Box>

        <Box
          component="span"
          sx={{
            color: whtrColors.low,
            fontWeight: 500,
          }}
        >
          {"< 23%"}
        </Box>

        <Box
          component="span"
          sx={{
            color: whtrColors.low,
            fontWeight: 500,
          }}
        >
          Healthy
        </Box>

        <Box
          component="span"
          sx={{
            color: whtrColors.moderate,
            fontWeight: 500,
          }}
        >
          0.50–0.59
        </Box>

        <Box
          component="span"
          sx={{
            color: whtrColors.moderate,
            fontWeight: 500,
          }}
        >
          23-30%
        </Box>

        <Box
          component="span"
          sx={{
            color: whtrColors.moderate,
            fontWeight: 500,
          }}
        >
          Increased Risk
        </Box>

        <Box
          component="span"
          sx={{
            color: whtrColors.high,
            fontWeight: 500,
          }}
        >
          {"≥ 0.60"}
        </Box>

        <Box
          component="span"
          sx={{
            color: whtrColors.high,
            fontWeight: 500,
          }}
        >
          {"> 30%"}
        </Box>

        <Box
          component="span"
          sx={{
            color: whtrColors.high,
            fontWeight: 500,
          }}
        >
          High Risk
        </Box>
      </Box>

      <Typography
        variant="caption"
        sx={{
          display: "block",
          mt: 1,
          opacity: 0.8,
        }}
      >
        Body fat percentages are expressed on a
        DXA-equivalent scale estimated from
        waist-to-height ratio.
      </Typography>
    </Box>
  )

  const armyTapeTestTooltip = (
    <Box>
      <Typography
        variant="subtitle2"
        sx={{ mb: 0.75 }}
      >
        Army Body Composition Standard (2026)
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "auto auto",
          columnGap: 2,
          rowGap: 0.5,
        }}
      >
        <strong>WHtR</strong>
        <strong>Status</strong>

        <Box
          component="span"
          sx={{
            color: whtrColors.low,
            fontWeight: 600,
          }}
        >
          {"< 0.55"}
        </Box>

        <Box
          component="span"
          sx={{
            color: whtrColors.low,
            fontWeight: 600,
          }}
        >
          PASS
        </Box>

        <Box
          component="span"
          sx={{
            color: whtrColors.high,
            fontWeight: 600,
          }}
        >
          {"≥ 0.55"}
        </Box>

        <Box
          component="span"
          sx={{
            color: whtrColors.high,
            fontWeight: 600,
          }}
        >
          FAIL
        </Box>
      </Box>

      <Typography
        variant="caption"
        sx={{
          display: "block",
          mt: 1,
          opacity: 0.8,
        }}
      >
        The U.S. Army adopted waist-to-height ratio
        (WHtR) as its sole body composition standard
        in July 2026.
      </Typography>
    </Box>
  )

  if (!t) {
    return null
  }

  return (
    <Paper
      variant="outlined"
      sx={{ p: 1.5 }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent:
            'space-between',
        }}
      >
        <Tooltip title={headerTooltip}>
          {/* <Box sx={{display: "flex", alignItems: "center", gap: 0}}> */}
          <Box>
            <Typography variant="subtitle2" sx={{ display: "inline" }}>
              {solution.windowSolution.label}
            </Typography>
            {/* :&nbsp;  */}
            <Typography variant="body2" sx={{ display: "inline" }}>
              {headerAdditional}{' '}
              <MetricValue bold={false}>
                {solution.first.date}
              </MetricValue>
            </Typography>
          </Box>
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

      <Typography
        variant="caption"
        color="text.secondary"
      >
        {solution.windowSolution.description}
      </Typography>

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
          value={
            solution.first.weight.toFixed(0)
          }
          tooltip={solution.trendSummary?.weightTooltip}
          unitSuffix="kg"
        // color={darken(metricColors.weight, 100)}
        />

        <MetricText
          label="Waist"
          value={
            solution.first.waist ? solution.first.waist.toFixed(0) : ""
          }
          tooltip={solution.trendSummary?.waistTooltip}
          unitSuffix="cm"
          color={darken(metricColors.weight, 100)}
        />

        <MetricText
          label="BF"
          value={
            solution.first.bodyFat ? solution.first.bodyFat.toFixed(0) : ""
          }
          tooltip={solution.trendSummary?.bodyfatTooltip}
          unitSuffix="%"
          color={darken(metricColors.bf, 100)}
        />

        <MetricText
          label="Lean"
          value={
            solution.first.leanMass ? solution.first.leanMass.toFixed(0) : ""
          }
          tooltip={solution.trendSummary?.leanFatCompositionTooltip}
          unitSuffix="kg"
          color={darken(metricColors.lean, 100)}
        />

        <MetricText
          label="Lean@15"
          value={
            solution.first.LeanMassatBF15 ? solution.first.LeanMassatBF15.toFixed(0) : ""
          }
          tooltip={solution.trendSummary?.lean15Tooltip}
          unitSuffix="kg"
          color={darken(metricColors.lean15, 100)}
        />

      </Box>

      <Divider sx={{ my: 1.5 }} />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={() =>
          setAdvancedOpen(!advancedOpen)
        }
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            mb: 1,
          }}
        >
          Height-adjusted comparisons
        </Typography>

        <Box sx={{ ml: "auto" }}>
          {advancedOpen ? (
            <ExpandLessIcon fontSize="small" />
          ) : (
            <ExpandMoreIcon fontSize="small" />
          )}
        </Box>
      </Box>

      <Collapse in={advancedOpen}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >

          <Paper
            variant="outlined"
            sx={{
              p: 1.25,
              minWidth: 220,
              flex: 1,
              // backgroundColor: "action.hover"
              backgroundColor: paperColors.whtr,
            }}
          >
            <Typography
              variant="subtitle2"
              gutterBottom
            >
              Waist-to-Height Ratio (WHtR)
            </Typography>

            <Tooltip
              title={solution.trendSummary?.waistToHeightTooltip}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  lineHeight: 1,
                }}
              >
                {waistToHeightRatio.toFixed(2)}
              </Typography>
            </Tooltip>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Waist circumference divided by height
            </Typography>


            <Box sx={{ mt: 1.25 }}>

              <Tooltip
                arrow
                title={waistToHeightRiskTooltip}
              >
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  Health Risk:{" "}
                  <Box
                    component="span"
                    sx={{
                      fontWeight: 600,
                      color:
                        waistToHeightRatio < 0.5
                          ? "success.main"
                          : waistToHeightRatio < 0.6
                            ? "warning.main"
                            : "error.main",
                    }}
                  >
                    {
                      waistToHeightRatio < 0.5
                        ? "Healthy"
                        : waistToHeightRatio < 0.6
                          ? "Increased Risk"
                          : "High Risk"
                    }
                  </Box>
                </Typography>

              </Tooltip>
              <Tooltip
                arrow
                title={armyTapeTestTooltip}
              >
                <Typography variant="body2" sx={{ mt: 0.5 }} >
                  Army Tape Test:{" "}
                  <Box
                    component="span"
                    sx={{
                      fontWeight: 600,
                      color:
                        waistToHeightRatio < 0.55
                          ? "success.main"
                          : "error.main",
                    }}
                  >
                    {
                      waistToHeightRatio < 0.55
                        ? "PASS"
                        : "FAIL"
                    }
                  </Box>
                </Typography>
              </Tooltip>

              <Tooltip title={solution.trendSummary?.nhanesWHtRTooltip}>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  NHANES: <strong>{ordinalSuffix(solution.trendSummary?.nhanesWHtRPercentile)} percentile</strong>
                </Typography>
              </Tooltip>

            </Box>
          </Paper>

          <Paper
            variant="outlined"
            sx={{
              p: 1.25,
              minWidth: 220,
              flex: 1,
              // backgroundColor: "action.hover",
              backgroundColor: paperColors.ffmi,
            }}
          >
            <Typography
              variant="subtitle2"
              gutterBottom
            >
              Fat-Free Mass Index (FFMI)
            </Typography>

            <Tooltip title={solution.trendSummary?.ffmiTooltip}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  lineHeight: 1,
                }}
              >
                {solution.first.FFMI}
              </Typography>
            </Tooltip>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Lean mass divided by squared height
            </Typography>

            <Box sx={{ mt: 1.25 }}>
              <Tooltip title={solution.trendSummary?.nhanesFFMITooltip}>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  NHANES: <strong>{ordinalSuffix(solution.trendSummary?.nhanesFFMIPercentile)} percentile</strong>
                </Typography>
              </Tooltip>

              <Tooltip title={solution.trendSummary?.armyFFMITooltip}>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  Army: <strong>{ordinalSuffix(solution.trendSummary?.armyFFMIPercentile)} percentile</strong>
                </Typography>
              </Tooltip>
            </Box>
          </Paper>

          <Paper
            variant="outlined"
            sx={{
              p: 1.25,
              minWidth: 220,
              flex: 1,
              // backgroundColor: "action.hover",
              backgroundColor: paperColors.ffmi15,
            }}
          >
            <Typography
              variant="subtitle2"
              gutterBottom
            >
              FFMI @ 15%
            </Typography>

            <Tooltip title={solution.trendSummary?.ffmi15Tooltip}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  lineHeight: 1,
                }}
              >
                {solution.first.FFMIatBF15}
              </Typography>
            </Tooltip>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Standardized to 15% body fat
            </Typography>

            <Box sx={{ mt: 1.25 }}>
              <Tooltip title={solution.trendSummary?.nhanesFFMI15Tooltip}>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  NHANES: <strong>{ordinalSuffix(solution.trendSummary?.nhanesFFMI15Percentile)} percentile</strong>
                </Typography>
              </Tooltip>

              <Tooltip title={solution.trendSummary?.armyFFMI15Tooltip}>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  Army: <strong>{ordinalSuffix(solution.trendSummary?.armyFFMI15Percentile)} percentile</strong>
                </Typography>
              </Tooltip>
            </Box>
          </Paper>
        </Box>
      </Collapse>
    </Paper>
  )
}

export default function BodyCompositionSection({
  estimateResults,
  measurements,
  analysisMeasurementIndex,
  onAnalysisMeasurementIndexChange
}: Props) {

  const [optionsAnchorEl, setOptionsAnchorEl] =
    useState<HTMLElement | null>(null)

  const optionsOpen = Boolean(optionsAnchorEl)

  return (
    <Box sx={{ mb: 2 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 1,
        }}
      >
        <Box>
          <Typography>
            Body Composition Estimates
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
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {Object.entries(
          estimateResults,
        ).map(([key, solution]) => {

          if (!solution) {
            return null
          }

          return (
            <EstimateSection
              key={key}
              solution={solution}
            />
          )
        })}
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
        </Box>
      </Menu>

    </Box>
  )
}