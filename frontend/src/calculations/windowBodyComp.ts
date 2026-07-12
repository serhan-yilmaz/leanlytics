import type { Measurement } from '../data/types'

import type {
  ValidWindowTarget,
  WindowSolution,
  WindowSolutionResults,
} from './windowSolver'

import {
  calculateBodyCompAtBF,
  calculateBodyFat,
  calculateFFMI,
} from './bodyComposition'

import {
  dateToTimestamp,
  millisecondsToDays,
  timestampToDate,
} from './util'
import { prepareBodyCompTrendSummary, type BodyCompTrendSummary } from './bodyCompTrendSummary'
import { prepareBodyCompEstimateSummary, type BodyCompEstimateSummary } from './bodyCompEstimateSummary'

export type WindowBodyCompRow = {
  date: string
  dateMin: string
  dateMax: string

  weight: number

  waist: number | undefined
  height: number | undefined

  bodyFat: number | undefined

  leanMass: number | undefined
  fatMass: number | undefined

  FFMI: number | undefined

  FFMIatBF15: number | undefined
  LeanMassatBF15: number | undefined

  sampleCount: number
}

export type WindowBodyCompPair = {
  windowSolution: WindowSolution
  first: WindowBodyCompRow
  last: WindowBodyCompRow
  trendSummary: BodyCompTrendSummary | undefined
}

export function buildWindowBodyCompTable(
  measurements: Measurement[],
  results: WindowSolutionResults,
): Record<string, WindowBodyCompPair | null> {

  const data = [...measurements].sort(
    (a, b) =>
      new Date(b.date).getTime() -
      new Date(a.date).getTime(),
  )

  const result: Record<
    string,
    WindowBodyCompPair | null
  > = {}

  for (const [key, solution] of Object.entries(results.solutions)) {

    if (!solution) {
      result[key] = null
      continue
    }

    const first = aggregateWindow(
      data,
      solution.firstEnd,
      solution.firstStart,
    );

    const last = aggregateWindow(
      data,
      solution.lastEnd,
      solution.lastStart,
    );

    result[key] = {
      windowSolution: solution,
      first: first,
      last: last,
      trendSummary: prepareBodyCompTrendSummary(
        first,
        last,
        solution,
        solution.targetDays >= 30 ? "month" : "week"
      )
    }
  }

  return result
}

function aggregateWindow(
  data: Measurement[],
  start: number,
  end: number,
): WindowBodyCompRow {

  const window = data.slice(start, end + 1)

  const sampleCount =
    window.length

  const times =
    window.map(
      x => dateToTimestamp(x.date),
    )

  const time =
    average(times)

  const timeMin =
    Math.min(...times)

  const timeMax =
    Math.max(...times)

  const rows =
    window
      .map((m) => {

        const bf =
          calculateBodyFat({
            sex: 'male',
            height: m.height,
            waist: m.waist,
            neck: m.neck,
          })

        if (
          bf == null ||
          m.weight == null
        ) {
          return null
        }

        const fatMass =
          m.weight * bf / 100

        const leanMass =
          m.weight - fatMass

        return {
          leanMass,
          fatMass,
          waist: m.waist,
          height: m.height,
        }
      })
      .filter(
        (r): r is {
          leanMass: number
          fatMass: number
          height: number | undefined
          waist: number | undefined
        } => r !== null,
      )

  if (rows.length === 0) {
    return {
      date: timestampToDate(time),
      dateMin: timestampToDate(timeMin),
      dateMax: timestampToDate(timeMax),

      weight: 0,
      waist: 0,
      height: 0,

      sampleCount,

      bodyFat: undefined,
      leanMass: undefined,
      fatMass: undefined,
      FFMI: undefined,
      FFMIatBF15: undefined,
      LeanMassatBF15: undefined
    }
  }

  const leanMass =
    average(
      rows.map(
        r => r.leanMass,
      ),
    )

  const fatMass =
    average(
      rows.map(
        r => r.fatMass,
      ),
    )

  const heightValues =
    rows
      .map(
        r => r.height,
      )
      .filter(
        (v): v is number =>
          v != null,
      )

  const height =
    heightValues.length
      ? average(heightValues)
      : undefined

  const waistValues =
    rows
      .map(
        r => r.waist,
      )
      .filter(
        (v): v is number =>
          v != null,
      )

  const waist =
    waistValues.length
      ? average(waistValues)
      : undefined

  const weight =
    leanMass + fatMass

  const bodyFat =
    weight > 0
      ? (fatMass / weight) * 100
      : undefined

  const FFMI = calculateFFMI({
    leanMass,
    height,
  }) ?? undefined

  let FFMIatBF15:
    | number
    | undefined

  let LeanMassatBF15:
    | number
    | undefined

  if (
    weight > 0 &&
    bodyFat != null &&
    height != null &&
    waist != null
  ) {

    const bodyComp =
      calculateBodyCompAtBF({
        weight,
        height,
        bodyFat,
        bfTarget: 15,
      })

    FFMIatBF15 =
      bodyComp.FFMI as
      | number
      | undefined

    LeanMassatBF15 =
      bodyComp.leanMass as
      | number
      | undefined
  }

  return {
    date:
      timestampToDate(time),

    dateMin:
      timestampToDate(timeMin),

    dateMax:
      timestampToDate(timeMax),

    weight,

    waist,

    height,

    bodyFat,

    leanMass,

    fatMass,

    FFMI,

    FFMIatBF15,

    LeanMassatBF15,

    sampleCount,
  }
}

function average(
  values: number[],
): number {

  if (!values.length) {
    return 0
  }

  return (
    values.reduce(
      (a, b) => a + b,
      0,
    ) / values.length
  )
}

type EstimateTarget = {
  key: string
  label: string
  description: string
  threshold: number
}

const ESTIMATE_TARGETS: EstimateTarget[] = [
  {
    key: "Latest",
    label: "Latest Measurement",
    description: "Current estimate from the most recent measurement alone. Most susceptible to day-to-day variation.",
    threshold: Infinity,
  },
  {
    key: "Recent",
    label: "Recent Trend Estimate",
    description: "Averages the last few measurements. Responds quickly to new measurements but remains sensitive to noise. ",
    threshold: 5,
  },
  {
    key: "Balanced",
    label: "Balanced Trend Estimate",
    description: "Provides middle ground between responsiveness and stability, reducing noise while still reflecting recent changes.",
    threshold: 2,
  },
  {
    key: "Stable",
    label: "Stable Trend Estimate",
    description: "Most stable estimate with highest confidence, but with greater delay. Best for looking back to understand what your body composition most likely was at that point.",
    // description: "Most stable estimate with highest confidence, but gives a delayed estimate that reflects further in the past. ", 
    threshold: 1,
  },
]

export type WindowEstimateSolution = {
  label: string
  description: string
  threshold: number
  start: number
  end: number
  quality: number
  delayDays: number
  score: number
  improvementPercent?: number
}

export type WindowBodyCompEstimate = {
  windowSolution: WindowEstimateSolution
  first: WindowBodyCompRow
  trendSummary: BodyCompEstimateSummary | undefined
}

export function buildWindowBodyCompEstimateTable(
  measurements: Measurement[],
  results: Record<string, WindowEstimateSolution | null>,
): Record<string, WindowBodyCompEstimate | null> {

  const data = [...measurements].sort(
    (a, b) =>
      new Date(b.date).getTime() -
      new Date(a.date).getTime(),
  )

  const result: Record<
    string,
    WindowBodyCompEstimate | null
  > = {}

  for (const [key, solution] of Object.entries(results)) {

    if (!solution) {
      result[key] = null
      continue
    }

    const first = aggregateWindow(
      data,
      solution.start,
      solution.end,
    );

    result[key] = {
      windowSolution: solution,
      first: first,
      trendSummary: prepareBodyCompEstimateSummary(
        first
      )
    }
  }

  return result
}

export function solveEstimateWindows(
  measurements: Measurement[],
  startIndex: number = 0
): Record<string, WindowEstimateSolution> {

  const data = [...measurements].sort(
    (a, b) =>
      dateToTimestamp(b.date) -
      dateToTimestamp(a.date),
  )

  if (data.length === 0) {
    return {}
  }

  const result: Record<
    string,
    WindowEstimateSolution
  > = {}

  const frozen = new Set<string>()

  let start = startIndex
  let centerDelay = 0
  let n = 1

  const latestTimestamp = dateToTimestamp(data[start].date)

  const latestTarget = ESTIMATE_TARGETS.find(
    x => x.key === "Latest",
  )

  result["Latest"] = {
    label: latestTarget!.label,
    description: latestTarget!.description,
    threshold: latestTarget!.threshold,
    start: start,
    end: start,
    quality: 1,
    delayDays: 0,
    score: 1
  }

  for (let nextIndex = (start + 1); nextIndex < data.length; nextIndex++) {
    const delayNext = latestTimestamp - dateToTimestamp(
      data[nextIndex].date,
    )
    const nNext = n + 1

    const centerDelayNext = (
      centerDelay * n +
      delayNext
    ) / nNext

    const delayIncrease = millisecondsToDays(
      centerDelayNext - centerDelay
    )

    const quality = Math.sqrt(n)
    const qualityNext = Math.sqrt(nNext)
    const improvementPercent = 100 * (qualityNext / quality - 1) / delayIncrease

    for (const target of ESTIMATE_TARGETS) {

      if (
        frozen.has(target.key)
      ) {
        continue
      }

      const delayDays = millisecondsToDays(centerDelayNext)

      if (
        improvementPercent >= target.threshold
      ) {
        result[target.key] = {
          label: target.label,
          description: target.description,
          threshold: target.threshold,
          start: start,
          end: nextIndex,
          quality: qualityNext,
          delayDays: delayDays,
          score: qualityNext / (1 + delayDays / 30.4375),
          improvementPercent: improvementPercent
        }
      } else {
        frozen.add(target.key)
      }
    }

    n = nNext
    centerDelay = centerDelayNext
  }

  return result
}