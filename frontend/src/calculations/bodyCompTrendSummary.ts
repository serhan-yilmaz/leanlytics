import { fatMassDiffSD, leanDiffPercentSD, leanMassDiffSD, normLeanMassDiffSD, weightDiffSD } from "./bodyCompUncertainty"
import { dateToTimestamp, timestampToDate } from "./util"

type BodyCompTrendSummary = {
  weightPerMonth: number
  leanPerMonth: number
  fatPerMonth: number
  leanContribution: number
  fatContribution: number
  lean15PerMonth: number
  weightPerMonthTooltip: string
  leanFatCompositionTooltip: string
  lean15PerMonthTooltip: string
  leanContributionTooltip: string
  test_output?: any
}

export function getBodyCompTrendSummary(
  smoothed: {
    date: string
    dateMax: string
    dateMin: string
    weight: number
    bodyFat: number | undefined
    leanMass: number | undefined
    LeanMassatBF15: number | undefined
    sampleCount: number
  }[],
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

  const weightDelta =
    last.weight - first.weight

  const leanMassDelta =
    (last.leanMass ?? 0) -
    (first.leanMass ?? 0)

  const lean15Delta =
    (last.LeanMassatBF15 ?? 0) -
    (first.LeanMassatBF15 ?? 0)

  const weightPerMonth =
    weightDelta / months

  const leanPerMonth =
    leanMassDelta / months
  
  const leanPerMonthError = leanMassDiffSD(
      first, 
      last
    ) / months

  const weightPerMonthError = weightDiffSD(
      first, 
      last
    ) / months

  const fatPerMonth = weightPerMonth - leanPerMonth

  const fatPerMonthError = fatMassDiffSD(
      first, 
      last
    ) / months

  const lean15PerMonth =
    lean15Delta / months

  const lean15PerMonthError = normLeanMassDiffSD(
      first, 
      last
    ) / months

  const leanContribution =
    weightDelta !== 0
      ? (leanMassDelta / weightDelta) * 100
      : 0

   const fatContribution = 100 - leanContribution

   const leanContributionError = leanDiffPercentSD(
    first, 
    last
   ) * 100

// const weightPerMonthTooltip =
//   `Weight ${weightPerMonth >= 0 ? 'gain' : 'loss'}: ${Math.abs(weightPerMonth).toFixed(2)} ± ${weightPerMonthError.toFixed(2)} kg/month\n`

const weightPerMonthTooltip =
  `Weight ${weightPerMonth >= 0 ? 'gain' : 'loss'}: ` +
  `${Math.abs(weightPerMonth).toFixed(2)} ± ${weightPerMonthError.toFixed(2)} kg/month\n`

const leanPerMonthTooltip =
  `Lean ${leanPerMonth >= 0 ? 'gain' : 'loss'}: ` +
  `${Math.abs(leanPerMonth).toFixed(2)} ± ${leanPerMonthError.toFixed(2)} kg/month\n`

const fatPerMonthTooltip =
  `Fat ${fatPerMonth >= 0 ? 'gain' : 'loss'}: ` +
  `${Math.abs(fatPerMonth).toFixed(2)} ± ${fatPerMonthError.toFixed(2)} kg/month\n`

const leanFatCompositionTooltip =
  weightPerMonth >= 0
    ? leanPerMonthTooltip + fatPerMonthTooltip
    : fatPerMonthTooltip + leanPerMonthTooltip

const lean15PerMonthTooltip =
  `Lean@15 ${lean15PerMonth >= 0 ? 'gain' : 'change'}: ` +
  `${(lean15PerMonth).toFixed(2)} ± ${lean15PerMonthError.toFixed(2)} kg/month\n`

const leanContributionTooltip = 
  `Lean ${leanPerMonth >= 0 ? 'gain' : 'loss'}:: ${leanContribution.toFixed(0)}% ± ${leanContributionError.toFixed(0)}% of weight change\n`

const centerDate = timestampToDate(
  0.5 * (dateToTimestamp(first.date) + dateToTimestamp(last.date))
)

const summary =
  `First Window\n` +
  `• Range: ${first.dateMin} - ${first.dateMax}\n` + 
  // `• Date Min: ${first.dateMin}\n` +
  `• Center: ${first.date}\n` +
  // `• Date Max: ${first.dateMax}\n` +
  `• Sample Count: ${first.sampleCount}\n` +
  `• Lean@15: ${first.LeanMassatBF15?.toFixed(1)} kg\n\n` +
  `Last Window\n` +
  `• Range: ${last.dateMin} - ${last.dateMax}\n` + 
  // `• Date Min: ${last.dateMin}\n` +
  `• Center: ${last.date}\n` + 
  // `• Date Max: ${last.dateMax}\n` +
  `• Sample Count: ${last.sampleCount}\n` + 
  `• Lean@15: ${last.LeanMassatBF15?.toFixed(1)} kg\n\n` +
  `Difference\n` + 
  // `• Range: ${first.date} - ${last.date}\n` +
  `• Center: ${centerDate}\n` +
  `• Duration: ${months?.toFixed(1)} months\n` + 
  `• Range: ${monthsMax?.toFixed(1)} months\n` + 
  `• Lean@15: ${lean15Delta >= 0 ? '+' : ''}${lean15Delta.toFixed(1)} kg\n`

// const summary =
//   `First: max=${first.dateMax}, min=${first.dateMin}, avg=${first.date}\n` +
//   `Last: max=${last.dateMax}, min=${last.dateMin}, avg=${last.date}`

  return {
    weightPerMonth,
    weightPerMonthTooltip, 
    leanPerMonth,
    leanFatCompositionTooltip, 
    fatPerMonth, 
    leanContribution,
    leanContributionTooltip, 
    fatContribution, 
    lean15PerMonth,
    lean15PerMonthTooltip, 
    test_output: summary
  }
}