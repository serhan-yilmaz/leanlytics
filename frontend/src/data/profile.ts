import { loadDB, saveDB } from './storage'
import type { Profile } from './types'

export function getProfile(): Profile | null {
  return loadDB().profile
}

export function setProfile(profile: Profile) {
  const db = loadDB()
  db.profile = profile
  saveDB(db)
  return profile
}

export function updateProfile(partial: Partial<Profile>) {
  const db = loadDB()

  db.profile = {
    ...(db.profile ?? { height: 0, gender: 'male', unitSystem: 'metric' }),
    ...partial,
  }

  saveDB(db)
  return db.profile
}