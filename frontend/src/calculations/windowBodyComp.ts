import type { Measurement } from '../data/types'

import type {
  WindowSolution,
} from './windowSolver'

import {
  calculateBodyCompAtBF,
  calculateBodyFat,
  calculateFFMI,
} from './bodyComposition'

import {
  dateToTimestamp,
  timestampToDate,
} from './util'
import { prepareBodyCompTrendSummary, type BodyCompTrendSummary } from './bodyCompTrendSummary'

export type WindowBodyCompRow = {
  date: string
  dateMin: string
  dateMax: string

  weight: number

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
  solutions: Record<string, WindowSolution | null>,
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

  for (const [key, solution] of Object.entries(solutions)) {

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
        solution.targetDays >= 30? "month": "week"
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

  const window =
    data.slice(start, end + 1)

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
          height: m.height,
        }
      })
      .filter(
        (r): r is {
          leanMass: number
          fatMass: number
          height: number | undefined
        } => r !== null,
      )

  if (rows.length === 0) {
    return {
      date: timestampToDate(time),
      dateMin: timestampToDate(timeMin),
      dateMax: timestampToDate(timeMax),

      weight: 0,

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

  const weight =
    leanMass + fatMass

  const bodyFat =
    weight > 0
      ? (fatMass / weight) * 100
      : undefined

  const FFMI = calculateFFMI({
          leanMass,
          height,
        })?? undefined

  let FFMIatBF15:
    | number
    | undefined

  let LeanMassatBF15:
    | number
    | undefined

  if (
    weight > 0 &&
    bodyFat != null &&
    height != null
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