import { useMemo, type JSX } from "react"
import { bodyfatDiffSD, fatMassDiffSD, leanDiffPercentSD, leanMassDiffSD, normLeanMassDiffSD, weightDiffSD } from "./bodyCompUncertainty"
import { dateToTimestamp, timestampToDate } from "./util"
import TrendWindowTooltip from "../components/plots/TrendWindowTooltip"
import type { WindowSolution } from "./windowSolver"

export type BodyCompTrendSummary = {
  rateUnit: "month" | "week"

  weightRate: number
  bodyfatRate: number
  leanRate: number
  fatRate: number

  leanContribution: number
  fatContribution: number
  lean15Rate: number

  weightTooltip: string
  bodyfatTooltip: string
  leanFatCompositionTooltip: string
  lean15Tooltip: string
  leanContributionTooltip: string

  detailedSummary?: any
  test_output?: any
}

type Props = {
    date: string
    dateMax: string
    dateMin: string
    weight: number
    bodyFat: number | undefined
    leanMass: number | undefined
    LeanMassatBF15: number | undefined
    sampleCount: number
  }

function formatRateUnit(unit: "month" | "week") {
  return unit === "month" ? "/month" : "/week"
}

function convertMonthsToUnit(months: number, unit: "month" | "week") {
  return unit === "month" ? months : months * 30.4375 / 7
}

export function prepareBodyCompTrendSummary(
 first: Props, 
 last: Props, 
 windowSolution?: WindowSolution, 
 rateUnit: "month" | "week" = "month",
): BodyCompTrendSummary | undefined {
  const months =
    (new Date(last.date).getTime() -
      new Date(first.date).getTime()) /
    (1000 * 60 * 60 * 24 * 30.4375)

  const monthsMax =
    (new Date(last.dateMax).getTime() -
      new Date(first.dateMin).getTime()) /
    (1000 * 60 * 60 * 24 * 30.4375)

  if (months <= 0) {
    return undefined
  }

  const duration = convertMonthsToUnit(months, rateUnit)

  const weightDelta =
    last.weight - first.weight

  const bodyfatDelta = 
    (last.bodyFat ?? 0) -
    (first.bodyFat ?? 0) 

  const leanMassDelta =
    (last.leanMass ?? 0) -
    (first.leanMass ?? 0)

  const lean15Delta =
    (last.LeanMassatBF15 ?? 0) -
    (first.LeanMassatBF15 ?? 0)

  const weightRate =
    weightDelta / duration

  const bodyfatRate =
    bodyfatDelta / duration

  const leanRate =
    leanMassDelta / duration
  
  const leanRateError = leanMassDiffSD(
      first, 
      last
    ) / duration

  const weightRateError = weightDiffSD(
      first, 
      last
    ) / duration

  const bodyfatRateError = 100 * bodyfatDiffSD(
      first, 
      last
    ) / duration

  const fatRate = weightRate - leanRate

  const fatRateError = fatMassDiffSD(
      first, 
      last
    ) / duration

  const lean15Rate =
    lean15Delta / duration

  const lean15RateError = normLeanMassDiffSD(
      first, 
      last
    ) / duration

  const leanContribution =
    weightDelta !== 0
      ? (leanMassDelta / weightDelta) * 100
      : 0

   const fatContribution = 100 - leanContribution

   const leanContributionError = leanDiffPercentSD(
    first, 
    last
   ) * 100

const unitSuffix = formatRateUnit(rateUnit)

  const weightTooltip =
    `Weight ${weightRate >= 0 ? 'gain' : 'loss'}: ` +
    `${Math.abs(weightRate).toFixed(2)} ± ${weightRateError.toFixed(2)} kg${unitSuffix}\n`

  const bodyfatTooltip =
    `Bodyfat % ${bodyfatRate >= 0 ? 'increase' : 'decrease'}: ` +
    `${Math.abs(bodyfatRate).toFixed(2)} ± ${bodyfatRateError.toFixed(2)} %${unitSuffix}\n`

  const leanTooltip =
    `Lean ${leanRate >= 0 ? 'gain' : 'loss'}: ` +
    `${Math.abs(leanRate).toFixed(2)} ± ${leanRateError.toFixed(2)} kg${unitSuffix}\n`

  const fatTooltip =
    `Fat ${fatRate >= 0 ? 'gain' : 'loss'}: ` +
    `${Math.abs(fatRate).toFixed(2)} ± ${fatRateError.toFixed(2)} kg${unitSuffix}\n`

  const leanFatCompositionTooltip =
    weightRate >= 0
      ? leanTooltip + fatTooltip
      : fatTooltip + leanTooltip

  const lean15Tooltip =
    `Lean@15 ${lean15Rate >= 0 ? 'gain' : 'change'}: ` +
    `${lean15Rate.toFixed(2)} ± ${lean15RateError.toFixed(2)} kg${unitSuffix}\n`

  const leanContributionTooltip =
    `Lean ${leanRate >= 0 ? 'gain' : 'loss'}: ` +
    `${leanContribution.toFixed(0)}% ± ${leanContributionError.toFixed(0)}% of weight change\n`

  const centerDate = timestampToDate(
    0.5 *
      (dateToTimestamp(first.date) +
        dateToTimestamp(last.date))
  )

  const summaryTooltip = (
    <TrendWindowTooltip
      first={{
        range: `${first.dateMin} - ${first.dateMax}`,
        center: first.date,
        sampleCount: first.sampleCount,
        weight: first.weight,
        bf: first.bodyFat,
        lean: first.leanMass,
        lean15: first.LeanMassatBF15,
      }}
      last={{
        range: `${last.dateMin} - ${last.dateMax}`,
        center: last.date,
        sampleCount: last.sampleCount,
        weight: last.weight,
        bf: last.bodyFat,
        lean: last.leanMass,
        lean15: last.LeanMassatBF15,
      }}
      diff={{
        center: centerDate,
        duration: `${months.toFixed(1)} months`,
        range: `${monthsMax.toFixed(1)} months`,
        weight: weightDelta,
        bf: bodyfatDelta,
        lean: leanMassDelta,
        lean15: lean15Delta,
        confidenceScore: windowSolution?.score,
      }}
    />
  )

  const detailedSummary =
    `First Window\n` +
    `• Range: ${first.dateMin} - ${first.dateMax}\n` +
    `• Center: ${first.date}\n` +
    `• Sample Count: ${first.sampleCount}\n` +
    `• Weight: ${first.weight?.toFixed(1)} kg\n` +
    `• BF: ${first.bodyFat?.toFixed(1)}%\n` +
    `• Lean: ${first.leanMass?.toFixed(1)} kg\n` +
    `• Lean@15: ${first.LeanMassatBF15?.toFixed(1)} kg\n\n` +
    `Last Window\n` +
    `• Range: ${last.dateMin} - ${last.dateMax}\n` +
    `• Center: ${last.date}\n` +
    `• Sample Count: ${last.sampleCount}\n` +
    `• Weight: ${last.weight?.toFixed(1)} kg\n` +
    `• BF: ${last.bodyFat?.toFixed(1)}%\n` +
    `• Lean: ${last.leanMass?.toFixed(1)} kg\n` +
    `• Lean@15: ${last.LeanMassatBF15?.toFixed(1)} kg\n\n` +
    `Difference\n` +
    `• Center: ${centerDate}\n` +
    `• Duration: ${months.toFixed(1)} months\n` +
    `• Range: ${monthsMax.toFixed(1)} months\n` +
    `• Weight: ${weightDelta >= 0 ? '+' : ''}${weightDelta.toFixed(1)} kg\n` +
    `• BF: ${bodyfatDelta >= 0 ? '+' : ''}${bodyfatDelta.toFixed(1)}%\n` +
    `• Lean: ${leanMassDelta >= 0 ? '+' : ''}${leanMassDelta.toFixed(1)} kg\n` +
    `• Lean@15: ${lean15Delta >= 0 ? '+' : ''}${lean15Delta.toFixed(1)} kg\n`

  return {
    rateUnit,

    weightRate,
    bodyfatRate,
    leanRate,
    fatRate,
    lean15Rate,

    leanContribution,
    fatContribution,

    weightTooltip,
    bodyfatTooltip,
    leanFatCompositionTooltip,
    lean15Tooltip,
    leanContributionTooltip,

    test_output: summaryTooltip,
    detailedSummary,
  }
}

export function getBodyCompTrendSummary(
  smoothed: Props[],
): BodyCompTrendSummary | undefined {
  if (smoothed.length < 2) {
    return undefined
  }

  const sorted = [...smoothed].sort(
    (a, b) =>
      new Date(a.date).getTime() -
      new Date(b.date).getTime(),
  )

   const last = sorted[sorted.length - 1]

  // const targetMonths = 3
  const targetMonths = Infinity

  const targetTime =
    new Date(last.date).getTime() -
    targetMonths * 30.4375 * 24 * 60 * 60 * 1000

  // const first = sorted[sorted.length - 20]
  // const first = sorted[0]

  const firstIndex = sorted.reduce(
    (bestIdx, row, idx) => {
      const diff = Math.abs(
        new Date(row.date).getTime() - targetTime
      )

      const bestDiff = Math.abs(
        new Date(sorted[bestIdx].date).getTime() - targetTime
      )

      return diff < bestDiff ? idx : bestIdx
    },
    0,
  )

  const first = sorted[firstIndex]
  // const first = sorted[0]

  return prepareBodyCompTrendSummary(first, last)
}