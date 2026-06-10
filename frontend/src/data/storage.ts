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
    const seeded: DB = {
      profile: null,
      measurements: parseCSV(csvRaw),
    }

    localStorage.setItem(KEY, JSON.stringify(seeded))
    return seeded
  }
  return JSON.parse(raw)
}

export function saveDB(db: DB) {
  localStorage.setItem(KEY, JSON.stringify(db))
}

export function resetDB(): DB {
  localStorage.removeItem(KEY)

  const seeded: DB = {
    profile: null,
    measurements: parseCSV(csvRaw),
  }

  localStorage.setItem(KEY, JSON.stringify(seeded))
  return seeded
}