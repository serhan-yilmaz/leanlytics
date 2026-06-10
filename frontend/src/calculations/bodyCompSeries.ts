import type { Measurement } from '../data/types'
import {
  calculateBodyCompAtBF,
  calculateBodyFat,
  calculateFFMI,
} from './bodyComposition'
import { dateToTimestamp, timestampToDate } from './util'

export type BodyCompRow = {
  date: string
  dateMin: string
  dateMax: string
  time?: number
  timeMax?: number
  timeMin?: number

  weight: number
  waist: number
  neck?: number
  height?: number

  bodyFat: number | undefined
  leanMass: number | undefined
  fatMass: number | undefined

  sampleCount: number
}

export function buildBodyCompTable(
  data: Measurement[],
): BodyCompRow[] {
return data
  .slice()
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  .map((m) => {
    const bf = calculateBodyFat({
      sex: 'male',
      height: m.height,
      waist: m.waist,
      neck: m.neck,
    })

    if (
      bf == null ||
      m.weight == null ||
      m.height == null ||
      m.waist == null ||
      m.neck == null
    ) {
      return null
    }

    const fatMass = m.weight * (bf / 100)
    const leanMass = m.weight - fatMass

    return {
      date: m.date,
      dateMax: m.date, 
      dateMin: m.date, 
      // time: new Date(m.date).getTime(),
      // timeMax: new Date(m.date).getTime(),
      // timeMin: new Date(m.date).getTime(),
      weight: m.weight,
      waist: m.waist,
      neck: m.neck,
      height: m.height,
      bodyFat: bf,
      leanMass,
      fatMass,
      sampleCount: 1
    }
  })
  .filter(Boolean) as BodyCompRow[]
}

function rollingAverage<T extends Record<string, any>>(
  data: T[],
  key: keyof T,
  window: number,
  aggregate: (values: number[]) => number | null = (values) =>
    values.length
      ? values.reduce((a, b) => a + b, 0) / values.length
      : null,
  maxMonths: number = 3, 
): T[] {
  return data.map((_, i) => {
    // const start = Math.max(0, i - window + 1)
    // const windowSlice = data.slice(start, i + 1)
    // const end = Math.min(data.length, i + window)

    // const maxMonths = 3

    const initialEnd = Math.min(data.length, i + window)
    let end = initialEnd

    while (end > i + 1) {
      const months =
        (new Date(data[end - 1].date).getTime() -
          new Date(data[i].date).getTime()) /
        (1000 * 60 * 60 * 24 * 30.4375)

      if (months <= maxMonths) {
        break
      }

      end--
    }

    const windowSlice = data.slice(i, end)
    const trimmedPoints = Math.max(initialEnd - end, 0)
    const effectiveWindow = Math.max(1, end - i)

    const values = windowSlice
    .map((d) => d[key])
    .filter((v) => typeof v === 'number') as number[]

    // const avg =
    //   values.length >= window/2
    //     ? values.reduce((a, b) => a + b, 0) / values.length
    //     : null

    // const window_min = 1
    // const window_min = window/2
    // const window_min = 3
    // const window_min = window
    const window_min = window - trimmedPoints
    // const window_min = effectiveWindow

    const val = values.length >= window_min ? aggregate(values): null

    return {
      ...data[i],
      [key]: val,
      sampleCount: values.length,
    }
  })
}

export function buildSmoothedBodyCompTable(
  data: Measurement[],
  window = 11,
) {
  let table = buildBodyCompTable(data)

  // 1. smooth latent variables FIRST
  table = rollingAverage(table, 'leanMass', window)
  table = rollingAverage(table, 'fatMass', window)

  // 2. smooth waist, height, neck (optional but useful)
  table = rollingAverage(table, 'waist', window)
  table = rollingAverage(table, 'height', window)
  table = rollingAverage(table, 'neck', window)

  table = table.map((row) => {
    const time = dateToTimestamp(row.date)

    return {
      ...row,
      time,
      timeMax: time,
      timeMin: time,
    }
  })

  table = rollingAverage(table, 'time', window)
  table = rollingAverage(
    table, 
    'timeMax', 
    window, 
    (values) => values.length ? Math.max(...values) : null
  )
  table = rollingAverage(
    table, 
    'timeMin', 
    window, 
    (values) => values.length ? Math.min(...values) : null
  )

  // 3. reconstruct derived metrics from smoothed state
  return table.map((row) => {
    const weight =
      (row.leanMass ?? 0) + (row.fatMass ?? 0)

    const bodyFat =
      row.fatMass && weight
        ? (row.fatMass / weight) * 100
        : undefined

    const FFMI =
      row.leanMass && row.height
        ? calculateFFMI({
            leanMass: row.leanMass,
            height: row.height,
          })
        : undefined
    
    if(weight == 0) return null

    const bodyComp = calculateBodyCompAtBF({
        weight: weight, 
        height: row.height, 
        bodyFat: bodyFat, 
        bfTarget: 15, 
        })

    const FFMIatBF15 = bodyComp.FFMI as number | undefined
    const LeanMassatBF15 = bodyComp.leanMass as number | undefined

    return {
      date: timestampToDate(row.time!), 
      dateMax: timestampToDate(row.timeMax!),
      dateMin: timestampToDate(row.timeMin!),
      // date: new Date(row.time!).toISOString().slice(0, 10),
      // dateMax: new Date(row.timeMax!).toISOString().slice(0, 10),
      // dateMin: new Date(row.timeMin!).toISOString().slice(0, 10),
      weight,
      bodyFat,
      FFMI,
      waist: row.waist,
      leanMass: row.leanMass,
      fatMass: row.fatMass,
      neck: row.neck,
      height: row.height,
      sampleCount: row.sampleCount, 
      FFMIatBF15: FFMIatBF15, 
      LeanMassatBF15: LeanMassatBF15
    }
  })
  .filter((r): r is NonNullable<typeof r> => r !== null)
}