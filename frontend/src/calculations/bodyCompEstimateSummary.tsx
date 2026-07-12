import { bodyFatSD, fatMassSD, leanMassSD, normLeanMassSD, waistSD, weightSD } from "./bodyCompUncertainty"
import { BodyCompEstimateTooltip } from "../components/plots/TrendWindowTooltip"

import percentilesData from '../data/json/percentiles.json'
import { Box, Divider, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material"
import { ordinalSuffix } from "./util"

export type BodyCompEstimateSummary = {
  weight: number
  waist: number

  bodyfat: number
  leanMass: number
  fatMass: number

  lean15: number

  nhanesFFMIPercentile: number
  nhanesFFMI15Percentile: number

  armyFFMIPercentile: number
  armyFFMI15Percentile: number

  nhanesWHtRPercentile: number

  nhanesBFPercentile: number
  armyBFPercentile: number

  weightTooltip: string
  waistTooltip: string
  waistToHeightTooltip: string
  bodyfatTooltip: string
  leanFatCompositionTooltip: string
  lean15Tooltip: string
  ffmiTooltip: string
  ffmi15Tooltip: string

  nhanesFFMI15Tooltip: any
  armyFFMI15Tooltip: any
  nhanesFFMITooltip: any
  armyFFMITooltip: any
  nhanesWHtRTooltip: any

  detailedSummary?: any
  test_output?: any
}

type Props = {
  date: string
  dateMax: string
  dateMin: string
  weight: number
  waist: number | undefined
  height: number | undefined
  bodyFat: number | undefined
  leanMass: number | undefined
  LeanMassatBF15: number | undefined
  sampleCount: number
}

export function prepareBodyCompEstimateSummary(
  first: Props
): BodyCompEstimateSummary | undefined {
  const weight = first.weight

  const waist = first.waist ?? 0

  const height = first.height ?? 0

  const bodyfat = first.bodyFat ?? 0

  const leanMass = (first.leanMass ?? 0)

  const fatMass = weight - leanMass

  const lean15 = (first.LeanMassatBF15 ?? 0)

  const ffmi = leanMass / (height / 100) ** 2

  const ffmi15 = lean15 / (height / 100) ** 2

  const leanError = leanMassSD(
    weight,
    bodyfat,
    first.sampleCount
  )

  const fatError = fatMassSD(
    weight,
    bodyfat,
    first.sampleCount
  )

  const weightError = weightSD(
    first.sampleCount
  )

  const waistError = waistSD(
    first.sampleCount
  )

  const bodyfatError = 100 * bodyFatSD(
    first.sampleCount
  )

  const lean15Error = normLeanMassSD(
    first
  )

  const waistToHeightRatio = waist / height

  const waistToHeightError = weightError / height

  const ffmiError = leanError / (height / 100) ** 2
  const ffmi15Error = lean15Error / (height / 100) ** 2

  const weightTooltip =
    `Weight: ` +
    `${weight.toFixed(1)} ± ${weightError.toFixed(1)} kg\n`

  const waistTooltip =
    `Waist: ` +
    `${waist.toFixed(1)} ± ${waistError.toFixed(1)} cm\n`

  const waistToHeightTooltip =
    `Waist-to-height-ratio: ` +
    `${waistToHeightRatio.toFixed(3)} ± ${waistToHeightError.toFixed(3)}\n`

  const bodyfatTooltip =
    `Bodyfat %: ` +
    `${bodyfat.toFixed(1)} ± ${bodyfatError.toFixed(1)} %\n`

  const leanTooltip =
    `Lean: ` +
    `${leanMass.toFixed(1)} ± ${leanError.toFixed(1)} kg\n`

  const fatTooltip =
    `Fat: ` +
    `${fatMass.toFixed(1)} ± ${fatError.toFixed(1)} kg\n`

  const leanFatCompositionTooltip = leanTooltip + fatTooltip

  const lean15Tooltip =
    `Lean@15: ` +
    `${lean15.toFixed(1)} ± ${lean15Error.toFixed(1)} kg\n`

  const ffmiTooltip =
    `FFMI: ` +
    `${ffmi.toFixed(2)} ± ${ffmiError.toFixed(2)}\n`

  const ffmi15Tooltip =
    `FFMI@15: ` +
    `${ffmi15.toFixed(2)} ± ${ffmi15Error.toFixed(2)}\n`

  // const dateRange = (first.dateMin == first.dateMax)? 
  //   `${first.dateMin}` : 
  //   `${first.dateMin} - ${first.dateMax}`

  const dateRange = `${first.dateMin} - ${first.dateMax}`;

  const summaryTooltip = (
    <BodyCompEstimateTooltip
      first={{
        range: `${dateRange}`,
        center: first.date,
        sampleCount: first.sampleCount,
        weight: first.weight,
        bf: first.bodyFat,
        lean: first.leanMass,
        lean15: first.LeanMassatBF15,
      }}
    />
  )

  const detailedSummary =
    `First Window\n` +
    `• Range: ${dateRange}\n` +
    `• Center: ${first.date}\n` +
    `• Sample Count: ${first.sampleCount}\n` +
    `• Weight: ${first.weight?.toFixed(1)} kg\n` +
    `• BF: ${first.bodyFat?.toFixed(1)}%\n` +
    `• Lean: ${first.leanMass?.toFixed(1)} kg\n` +
    `• Lean@15: ${first.LeanMassatBF15?.toFixed(1)} kg\n\n`;


  const nhanesFFMIPercentile =
    percentileFromDistribution(
      ffmi,
      percentilesData.nhanes.ffmi,
      percentilesData.nhanes.quantiles,
    )

  const nhanesFFMI15Percentile =
    percentileFromDistribution(
      ffmi15,
      percentilesData.nhanes.ffmi15,
      percentilesData.nhanes.quantiles,
    )

  const armyFFMIPercentile =
    percentileFromDistribution(
      ffmi,
      percentilesData.army.ffmi,
      percentilesData.army.quantiles,
    )

  const armyFFMI15Percentile =
    percentileFromDistribution(
      ffmi15,
      percentilesData.army.ffmi15,
      percentilesData.army.quantiles,
    )

  const nhanesWHtRPercentile =
    percentileFromDistribution(
      waistToHeightRatio,
      percentilesData.nhanes.whtr,
      percentilesData.nhanes.quantiles,
    )

  const nhanesBFPercentile =
    percentileFromDistribution(
      bodyfat,
      percentilesData.nhanes.bf,
      percentilesData.nhanes.quantiles,
    )

  const armyBFPercentile =
    percentileFromDistribution(
      bodyfat,
      percentilesData.army.bf,
      percentilesData.army.quantiles,
    )

  const nhanesFFMI15PercentileRange =
    percentileRange(
      ffmi15,
      ffmi15Error,
      percentilesData.nhanes.ffmi15,
      percentilesData.nhanes.quantiles,
    )

  const armyFFMI15PercentileRange =
    percentileRange(
      ffmi15,
      ffmi15Error,
      percentilesData.army.ffmi15,
      percentilesData.army.quantiles,
    )

  const nhanesFFMIPercentileRange =
    percentileRange(
      ffmi,
      ffmiError,
      percentilesData.nhanes.ffmi,
      percentilesData.nhanes.quantiles,
    )

  const armyFFMIPercentileRange =
    percentileRange(
      ffmi,
      ffmiError,
      percentilesData.army.ffmi,
      percentilesData.army.quantiles,
    )


  const nhanesWHtRPercentileRange =
    percentileRange(
      waistToHeightRatio,
      waistToHeightError,
      percentilesData.nhanes.whtr,
      percentilesData.nhanes.quantiles,
    )

  const nhanesPopulationShort = "NHANES 2017-2018 US adult males"
  const nhanesPopulationText = "NHANES 2017-2018 US adult males, based on DXA body fat measurements."

  const armyPopulationText = "US Army male personnel (2022-2024), based on DXA percentile data from Sergi et al. (2025)."

  const armyTitle = "Compared to U.S. Army Personnel"
  const nhanesTitle = "Compared to U.S. Adult Population"

  const nhanesFFMI15Tooltip = (
    <PopulationPercentileTooltip
      title={nhanesTitle}
      metric="FFMI@15"
      value={ffmi15}
      percentile={
        nhanesFFMI15PercentileRange.center
      }
      range={{
        low:
          nhanesFFMI15PercentileRange.low,
        high:
          nhanesFFMI15PercentileRange.high,
      }}
      population={nhanesPopulationText}
      description=""
      ref={
        getReferencePercentiles(
          percentilesData.nhanes.ffmi15,
          percentilesData.nhanes.quantiles,
        )
      }
    />
  )

  const armyFFMI15Tooltip = (
    <PopulationPercentileTooltip
      title={armyTitle}
      metric="FFMI@15"
      value={ffmi15}
      percentile={
        armyFFMI15PercentileRange.center
      }
      range={{
        low:
          armyFFMI15PercentileRange.low,
        high:
          armyFFMI15PercentileRange.high,
      }}
      population={armyPopulationText}
      description=""
      ref={
        getReferencePercentiles(
          percentilesData.army.ffmi15,
          percentilesData.army.quantiles,
        )
      }
    />
  )

  const nhanesFFMITooltip = (
    <PopulationPercentileTooltip
      title={nhanesTitle}
      metric="FFMI"
      value={ffmi}
      percentile={
        nhanesFFMIPercentileRange.center
      }
      range={{
        low:
          nhanesFFMIPercentileRange.low,
        high:
          nhanesFFMIPercentileRange.high,
      }}
      population={nhanesPopulationText}
      description=""
      ref={
        getReferencePercentiles(
          percentilesData.nhanes.ffmi,
          percentilesData.nhanes.quantiles,
        )
      }
    />
  )


  const armyFFMITooltip = (
    <PopulationPercentileTooltip
      title={armyTitle}
      metric="FFMI"
      value={ffmi}
      percentile={
        armyFFMIPercentileRange.center
      }
      range={{
        low:
          armyFFMIPercentileRange.low,
        high:
          armyFFMIPercentileRange.high,
      }}
      population={armyPopulationText}
      description=""
      ref={
        getReferencePercentiles(
          percentilesData.army.ffmi,
          percentilesData.army.quantiles,
        )
      }
    />
  )

  const nhanesWHtRTooltip = (
    <PopulationPercentileTooltip
      title={nhanesTitle}
      metric="WHtR"
      value={waistToHeightRatio}
      percentile={
        nhanesWHtRPercentileRange.center
      }
      range={{
        low:
          nhanesWHtRPercentileRange.low,
        high:
          nhanesWHtRPercentileRange.high,
      }}
      population={nhanesPopulationShort}
      description=""
      ref={
        getReferencePercentiles(
          percentilesData.nhanes.whtr,
          percentilesData.nhanes.quantiles,
        )
      }
      digits={2}
    />
  )

  return {
    weight,
    waist,
    bodyfat,
    leanMass,
    fatMass,
    lean15,

    nhanesFFMIPercentile,
    nhanesFFMI15Percentile,

    armyFFMIPercentile,
    armyFFMI15Percentile,

    nhanesWHtRPercentile,

    nhanesBFPercentile,
    armyBFPercentile,

    weightTooltip,
    waistTooltip,
    waistToHeightTooltip,
    bodyfatTooltip,
    leanFatCompositionTooltip,
    lean15Tooltip,
    ffmiTooltip,
    ffmi15Tooltip,

    nhanesFFMI15Tooltip,
    armyFFMI15Tooltip,
    nhanesFFMITooltip,
    armyFFMITooltip,
    nhanesWHtRTooltip,

    test_output: summaryTooltip,
    detailedSummary,
  }
}

function percentileFromDistribution(
  value: number,
  distribution: number[],
  quantiles: number[],
): number {

  if (value <= distribution[0]) {
    return quantiles[0] * 100
  }

  const last =
    distribution.length - 1

  if (value >= distribution[last]) {
    return quantiles[last] * 100
  }

  for (let i = 1; i < distribution.length; i++) {

    const x0 = distribution[i - 1]
    const x1 = distribution[i]

    if (value <= x1) {

      const q0 =
        quantiles[i - 1]

      const q1 =
        quantiles[i]

      const t =
        (value - x0) /
        (x1 - x0)

      return (
        q0 +
        t * (q1 - q0)
      ) * 100
    }
  }

  return 100
}

function percentileRange(
  value: number,
  error: number,
  distribution: number[],
  quantiles: number[],
) {
  const low =
    percentileFromDistribution(
      value - error,
      distribution,
      quantiles,
    )

  const high =
    percentileFromDistribution(
      value + error,
      distribution,
      quantiles,
    )

  return {
    low: Math.min(low, high),
    high: Math.max(low, high),
    center:
      percentileFromDistribution(
        value,
        distribution,
        quantiles,
      ),
  }
}

function PopulationPercentileTooltip({
  title,
  metric,
  value,
  percentile,
  range,
  population,
  description,
  ref,
  digits = 1
}: {
  title: string
  metric: string
  value: number
  percentile: number
  range: {
    low: number
    high: number
  }
  population: string
  description: string
  ref: Record<number, number>
  digits?: number
}) {
  return (
    <Box>
      <Typography variant="subtitle2">
        {title}
      </Typography>

      <Divider sx={{ my: 1, borderColor: "inherit" }} />

      <Typography variant="body2">
        {/* {metric}: {value.toFixed(2)} {", "} {ordinalSuffix(percentile)} percentile */}
        {metric}: {ordinalSuffix(percentile)} percentile
      </Typography>

      {/* <Typography variant="body2">
        Percentile: {ordinalSuffix(percentile)}
      </Typography> */}

      <Typography variant="body2">
        Likely range:
        {" "}
        {ordinalSuffix(range.low)}
        {" – "}
        {ordinalSuffix(range.high)}
        {" percentiles"}
      </Typography>

      <Typography
        variant="caption"
        sx={{
          display: "block",
          mt: 1,
          opacity: 0.8,
        }}
      >
        {population}
      </Typography>

      <Typography
        variant="caption"
        sx={{
          display: "block",
          opacity: 0.8,
        }}
      >
        {description}
      </Typography>

      <Box sx={{ mt: 1 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            display: "block",
            mb: 0.5,
          }}
        >
          Reference values
        </Typography>

        <Table
          size="small"
          sx={{
            color: "inherit",
            // "& td": {
            //   borderBottom: "none",
            //   py: 0.25,
            //   px: 0.75,
            //   fontSize: "0.75rem",
            // },
            "& .MuiTableCell-root": {
              color: "inherit",
              borderBottom: "none",
              py: 0.25,
              px: 0.75,
              textAlign: "center",
              fontSize: "0.82rem",
            }
          }}
        >
          <TableBody>
            <TableRow>
              <TableCell>10%</TableCell>
              <TableCell>25%</TableCell>
              <TableCell>50%</TableCell>
              <TableCell>75%</TableCell>
              <TableCell>90%</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>{ref[10].toFixed(digits)}</TableCell>
              <TableCell>{ref[25].toFixed(digits)}</TableCell>
              <TableCell>{ref[50].toFixed(digits)}</TableCell>
              <TableCell>{ref[75].toFixed(digits)}</TableCell>
              <TableCell>{ref[90].toFixed(digits)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>


    </Box>
  )
}

function getReferencePercentiles(
  values: number[],
  quantiles: number[],
): Record<number, number> {
  const targets = [10, 25, 50, 75, 90]

  return Object.fromEntries(
    targets.map((p) => {
      const idx =
        quantiles.findIndex(
          q => Math.round(q * 100) === p,
        )

      return [
        p,
        values[idx],
      ]
    }),
  )
}