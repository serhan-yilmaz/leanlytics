
type NavyBodyFatInput = {
  sex: 'male' | 'female'
  height: number | undefined
  waist: number | undefined
  neck: number | undefined
  hip?: number | undefined
}

export function calculateBodyFat({
  sex,
  height,
  waist,
  neck,
  hip,
}: NavyBodyFatInput): number | null {

  // basic validation
  if (!height || !waist || !neck) {
    return null
  }

  try {
    let bodyFat = 0

    if (sex === 'male') {
      bodyFat =
        495 /
          (
            1.0324 -
            0.19077 *
              Math.log10((waist - neck))  +
            0.15456 *
              Math.log10(height) 
          ) -
        450
    } else {
      if (!hip) return null

      bodyFat =
        495 /
          (
            1.29579 -
            0.35004 *
              Math.log10(
                waist + hip - neck,
              ) +
            0.221 *
              Math.log10(height)
          ) -
        450
    }

    return Number(bodyFat.toFixed(1))
  } catch {
    return null
  }
}

export function calculateFFMI({
    leanMass, 
    height, 
}: any): number | null {

  // basic validation
  if (!height || !leanMass) {
    return null
  }

  try {
    let ffmi = leanMass / ((height/100)^2)
    ffmi = ffmi - 6.3 * (1.8 - (height/2.54) * 0.0254)

    return Number(ffmi.toFixed(1))
  } catch {
    return null
  }
}

export function calculateBodyCompAtBF({
    weight, 
    height, 
    bodyFat, 
    bfTarget
}: any): any {

  // basic validation
  if (!height || !weight || !bodyFat || !bfTarget) {
    return null
  }

  try {
    let weightAtBf = weight * (2 - 3 * bodyFat/100) / (2 - 3 * bfTarget/100)
    let leanMass = weightAtBf * (1 - bfTarget/100)
    let fatMass = weightAtBf * bfTarget/100
    let FFMI = calculateFFMI({
        leanMass: leanMass, 
        height: height
    }) as number | undefined

    return {
        weight: weightAtBf, 
        bodyFat: bfTarget,
        leanMass: leanMass,
        fatMass: fatMass,
        FFMI: FFMI
    }
  } catch {
    return null
  }
}

export function getBodyComposition(
  m: any,
) {
  const bf = m.bodyFat?? calculateBodyFat({
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
    m.weight * (bf / 100)

  const leanMass =
    m.weight - fatMass

  const FFMI = calculateFFMI({
    leanMass: leanMass, 
    height: m.height
    }) as number | undefined

  const bodyComp = calculateBodyCompAtBF({
    weight: m.weight, 
    height: m.height, 
    bodyFat: bf, 
    bfTarget: 15, 
    })

  const FFMIatBF15 = bodyComp.FFMI as number | undefined
  const LeanMassatBF15 = bodyComp.leanMass as number | undefined

  return {
    bodyFat: bf,
    leanMass: leanMass,
    fatMass: fatMass,
    FFMI: FFMI, 
    FFMIatBF15: FFMIatBF15, 
    LeanMassatBF15: LeanMassatBF15, 
  }
}
