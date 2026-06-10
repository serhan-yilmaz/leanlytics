import type { Measurement } from '../data/types'
import { getBodyComposition } from './bodyComposition'

export type SeriesPoint = {
  date: string
  value: number
}

export type MultiSeriesPoint = {
  date: string
  [key: string]: string | number
}

export type XYPoint = {
  date: string
  x: number | string
  y: number
}

export type TimePoint = {
  date: string
  // dynamic series values (leanMass, fatMass, FFMI, etc)
  [key: string]: number | string | undefined
}

export function buildXYSeries(
  data: any[],
  xSelector: (m: Measurement) => number | undefined | string,
  ySelector: (m: Measurement) => number | undefined,
): XYPoint[] {
  return data
    .slice()
    .sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime(),
    )
    .map((m) => {
      const x = xSelector(m)
      const y = ySelector(m)

    if ((typeof x !== 'number' && typeof x !== 'string') || typeof y !== 'number') {
        return null
    }

    //   if (typeof x !== 'number' || typeof y !== 'number') return null

      return {
        date: m.date,
        x,
        y,
      }
    })
    .filter(Boolean) as XYPoint[]
}

export function buildSeriesNew(
  data: any[],
  key: string,
): TimePoint[] {
  return data
    .slice()
    .sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime(),
    )
    .map((m) => ({
      date: m.date,
      [key]: m[key],
    }))
}

export function buildMultiSeriesNew(
  data: any[],
  selectors: Record<
    string,
    (m: any) => number | undefined
  >,
): TimePoint[] {
  return data
    .slice()
    .sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime(),
    )
    .map((m) => {
      const point: TimePoint = { date: m.date }

      for (const [key, selector] of Object.entries(selectors)) {
        const value = selector(m)
        if (typeof value === 'number') {
          point[key] = value
        }
      }

      return point
    })
}

export function buildSeries(
  data: any[],
  selector: (m: Measurement) => number | undefined,
): SeriesPoint[] {
  return data
    .slice()
    .sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime(),
    )
    .map((m) => {
      const value = selector(m)

      if (typeof value !== 'number') {
        return null
      }

      return {
        date: m.date,
        value,
      }
    })
    .filter(Boolean) as SeriesPoint[]
}

export function buildMultiSeries(
  data: Measurement[],
  selectors: Record<
    string,
    (m: Measurement) => number | undefined
  >,
): MultiSeriesPoint[] {
  return data
    .slice()
    .sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime(),
    )
    .map((m) => {
      const point: MultiSeriesPoint = {
        date: m.date,
      }

      for (const [key, selector] of Object.entries(
        selectors,
      )) {
        const value = selector(m)

        if (typeof value === 'number') {
          point[key] = value
        }
      }

      return point
    })
}

export const charts = {
  weight: (data: any[]) =>
    buildSeries(data, (m) => m.weight),

  waist: (data: any[]) =>
    buildSeries(data, (m) => m.waist),

  bodyFat: (data: any[]) =>
    buildSeries(data, (m) => 
      getBodyComposition(m)
        ?.bodyFat,
    ),

  leanFatMass: (data: any[]) =>
    buildMultiSeries(data, {
        leanMass: (m) =>
        getBodyComposition(m)
            ?.leanMass,

        fatMass: (m) =>
        getBodyComposition(m)
            ?.fatMass,
    }),

  weightBodyfat: (data: any[]) =>
    buildMultiSeries(data, {
        weight: (m) => m.weight,
        bodyFat: (m) => getBodyComposition(m)?.bodyFat,
    }),

  FFMI: (data: any[]) =>
    buildSeries(data, (m) => 
      getBodyComposition(m)
        ?.FFMI,
    ),
  FFMIatBF15: (data: any[]) =>
    buildSeries(data, (m) => 
      getBodyComposition(m)
        ?.FFMIatBF15,
    ),
  LeanMassatBF15: (data: any[]) =>
    buildXYSeries(data, 
        (m) => m.date,
        (m) => getBodyComposition(m)?.LeanMassatBF15,
    ),
  weightVsWaist: (data: any[]) =>
    buildXYSeries(
        data,
        (m) => m.waist,
        (m) => m.weight,
    ), 
  leanMassVsBodyfat: (data: any[]) =>
    buildXYSeries(
        data,
        (m) => getBodyComposition(m)?.bodyFat,
        (m) => getBodyComposition(m)?.leanMass,
    )
}

// export const chartsNew = {
//   weight: (data: any[]) =>
//     buildMultiSeriesNew(data, {
//       weight: (m) => m.weight,
//     }),

//   waist: (data: any[]) =>
//     buildMultiSeriesNew(data, {
//       waist: (m) => m.waist,
//     }),

//   leanFatMass: (data: any[]) =>
//     buildMultiSeriesNew(data, {
//       leanMass: (m) => getBodyComposition(m)?.leanMass,
//       fatMass: (m) => getBodyComposition(m)?.fatMass,
//     }),

//   FFMI: (data: any[]) =>
//     buildMultiSeriesNew(data, {
//       FFMI: (m) => getBodyComposition(m)?.FFMI,
//     }),

//   FFMIatBF15: (data: any[]) =>
//     buildMultiSeriesNew(data, {
//       FFMIatBF15: (m) => getBodyComposition(m)?.FFMIatBF15,
//     }),
// }