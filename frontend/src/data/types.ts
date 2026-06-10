export type Gender = 'male' | 'female'

export type Profile = {
  gender: Gender
  unitSystem: 'metric' | 'imperial'
}

export type Measurement = {
  id: string
  date: string
  weight?: number
  waist?: number
  neck?: number
  chest?: number
  height?: number
  hip?: number
}