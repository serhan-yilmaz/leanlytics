// data/storage.ts

import type { Profile, Measurement } from './types'
import csvRaw from './mock/measurements.csv?raw'

const KEY = 'leanlytics_state'

export type DB = {
  profile: Profile | null
  measurements: Measurement[]
}

function toNumber(v: string | undefined): number | undefined {
  if (v == null) return undefined

  const trimmed = v.trim()
  if (trimmed === '') return undefined

  const n = Number(trimmed)
  return Number.isFinite(n) ? n : undefined
}

export function parseCSV(csv: string): Measurement[] {
  const lines = csv.trim().split('\n')

  const header = lines[0]
    .split(',')
    .map(h => h.trim().toLowerCase())

  const rows = lines.slice(1)

  const getIndex = (key: string) =>
    header.indexOf(key)

  const iId = getIndex('id')
  const iDate = getIndex('date')
  const iWeight = getIndex('weight')
  const iWaist = getIndex('waist')
  const iNeck = getIndex('neck')
  const iChest = getIndex('chest')
  const iHeight = getIndex('height')
  const iHip = getIndex('hip')

  return rows
    .map(row => {
      const cols = row.split(',').map(c => c.trim())

      const get = (i: number) =>
        i >= 0 ? cols[i] : undefined

      const m: Measurement = {
        id: get(iId) ?? crypto.randomUUID(),
        date: get(iDate) ?? '',
        weight: toNumber(get(iWeight)),
        waist: toNumber(get(iWaist)),
        neck: toNumber(get(iNeck)),
        chest: toNumber(get(iChest)),
        height: toNumber(get(iHeight)),
        hip: toNumber(get(iHip)),
      }

      return m
    })
    .filter(m =>
      m.date &&
      m.weight != null &&
      m.waist != null
    )
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date),
    )
}

export function parseSampleCSV(csv: string): Measurement[] {
  const lines = csv.trim().split('\n')
  const [, ...rows] = lines

  return rows.map(row => {
    const [id, date, weight, waist, neck, chest, height, hip] = row.split(',')

    return {
      id,
      date,
      weight: toNumber(weight),
      waist: toNumber(waist),
      neck: toNumber(neck),
      chest: toNumber(chest),
      height: toNumber(height),
      hip: toNumber(hip),
    }
  })
  .filter((m): m is any =>
    m.weight != null && m.waist != null
  )
  .sort((a, b) => b.date.localeCompare(a.date))
}

export function loadDB(): DB {
  const raw = localStorage.getItem(KEY)
  if (!raw) {
    return {
      profile: null,
      measurements: []
    }
  }
  // if (!raw) {
  //   const seeded: DB = {
  //     profile: null,
  //     measurements: parseCSV(csvRaw),
  //   }

  //   localStorage.setItem(KEY, JSON.stringify(seeded))
  //   return seeded
  // }
  return JSON.parse(raw)
}

export function saveDB(db: DB) {
  localStorage.setItem(KEY, JSON.stringify(db))
}

export function resetDB(): DB {
  localStorage.removeItem(KEY)

  // const seeded: DB = {
  //   profile: null,
  //   measurements: parseCSV(csvRaw),
  // }

  const seeded: DB = {
    profile: null,
    measurements: []
  }

  localStorage.setItem(KEY, JSON.stringify(seeded))
  return seeded
}