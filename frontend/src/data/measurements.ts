import { loadDB, saveDB } from './storage'
import type { Measurement } from './types'

export function getMeasurements(): Measurement[] {
  return loadDB().measurements
}

export function addMeasurement(m: Measurement) {
  const db = loadDB()
  db.measurements.unshift(m)
  saveDB(db)
  return m
}

export function updateMeasurement(updated: Measurement) {
  const db = loadDB()

  db.measurements = db.measurements.map(m =>
    m.id === updated.id ? updated : m
  )

  saveDB(db)
  return updated
}

export function deleteMeasurement(id: string) {
  const db = loadDB()

  db.measurements = db.measurements.filter(m => m.id !== id)

  saveDB(db)
}

export function saveMeasurements(measurements: Measurement[]) {
  const db = loadDB()

  db.measurements = measurements

  saveDB(db)
  return measurements
}

export function sortMeasurements(
  measurements: Measurement[],
  direction: "asc" | "desc" = "desc"
): Measurement[] {
  return [...measurements].sort((a, b) => {
    const diff =
      new Date(a.date).getTime() - new Date(b.date).getTime();

    return direction === "asc" ? diff : -diff;
  });
}