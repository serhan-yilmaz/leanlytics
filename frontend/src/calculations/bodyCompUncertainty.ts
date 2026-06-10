export type BodyCompErrorModel = {
  weight: {
    sigma: number
  }

  bodyFat: {
    sigmaRandom: number
    sigmaBias: number
  }

  targetBF: number
}

export const errorModel: BodyCompErrorModel = {
  weight: {
    sigma: 1
  },
  bodyFat: {
    sigmaRandom: 1 / 100,
    sigmaBias: 3 / 100
  },
  targetBF: 0.15
}

function bodyFatSigma(model: BodyCompErrorModel) {
  return Math.sqrt(
    model.bodyFat.sigmaRandom ** 2 +
    model.bodyFat.sigmaBias ** 2
  )
}

const bf = (bodyFat: number) => bodyFat / 100

export function fatMassSD(
  weight: number,        // W
  bodyFat: number,       // BF (%)
  n: number,
  model: BodyCompErrorModel = errorModel
): number {
  const sW = model.weight.sigma
  const sBF = bodyFatSigma(model)
  const sBFu = model.bodyFat.sigmaBias
  const sBFr = model.bodyFat.sigmaRandom

  const BF = bf(bodyFat)

  
  const termBias = weight ** 2 * sBFu ** 2
  const termWeight = BF ** 2 * sW ** 2 / n
  const termBF = weight ** 2 * sBFr ** 2 / n 
  const termCross = (sW ** 2 * sBF ** 2) / n

  return Math.sqrt(termBias + termWeight + termBF + termCross)
}

export function leanMassSD(
  weight: number,        // W
  bodyFat: number,       // BF (%)
  n: number,
  model: BodyCompErrorModel = errorModel
): number {
  const sW = model.weight.sigma
  const sBF = bodyFatSigma(model)
  const sBFu = model.bodyFat.sigmaBias
  const sBFr = model.bodyFat.sigmaRandom

  const BF = bf(bodyFat)

  const termBias = weight ** 2 * sBFu ** 2
  const termWeight = (1 - BF) ** 2 * sW ** 2 / n
  const termBF = weight ** 2 * sBFr ** 2 / n
  const termCross = (sW ** 2 * sBF ** 2) / n

  return Math.sqrt(termBias + termWeight + termBF + termCross)
}

export type BodyCompPoint = {
  weight: number | undefined
  bodyFat: number | undefined // %
  sampleCount: number
}

export function leanMassDiffSD(
  i: BodyCompPoint,
  j: BodyCompPoint,
  model: BodyCompErrorModel = errorModel
): number {
  const sW = model.weight.sigma
  const sBFu = model.bodyFat.sigmaBias
  const sBFr = model.bodyFat.sigmaRandom

  const BFi = i.bodyFat? bf(i.bodyFat): 0
  const BFj = j.bodyFat? bf(j.bodyFat): 0

  const Wi = i.weight? i.weight: 0
  const Wj = j.weight? j.weight: 0

  const ni = i.sampleCount
  const nj = j.sampleCount

  const sBF = (sBFu ** 2 + sBFr ** 2)

  // 1. bias term
  const termBias =
    (Wi - Wj) ** 2 * sBFu ** 2

  // 2. weight-related term
  const termWeight =
    ((1 - BFi) ** 2 / ni + (1 - BFj) ** 2 / nj) *
    sW ** 2

  // 3. random BF term
  const termBF =
    (Wi ** 2 / ni + Wj ** 2 / nj) *
    sBFr ** 2

  // 4. interaction term
  const termCross =
    sW ** 2 * sBF * (1 / ni + 1 / nj)

  return Math.sqrt(
    termBias +
    termWeight +
    termBF +
    termCross
  )
}

export function fatMassDiffSD(
  i: BodyCompPoint,
  j: BodyCompPoint,
  model: BodyCompErrorModel = errorModel
): number {
  const sW = model.weight.sigma
  const sBFu = model.bodyFat.sigmaBias
  const sBFr = model.bodyFat.sigmaRandom

  const BFi = i.bodyFat? bf(i.bodyFat): 0
  const BFj = j.bodyFat? bf(j.bodyFat): 0

  const Wi = i.weight? i.weight: 0
  const Wj = j.weight? j.weight: 0

  const ni = i.sampleCount
  const nj = j.sampleCount

  const sBF = (sBFu ** 2 + sBFr ** 2)

  // 1. bias term
  const termBias =
    (Wi - Wj) ** 2 * sBFu ** 2

  // 2. weight-related term
  const termWeight =
    (BFi ** 2 / ni + BFj ** 2 / nj) *
    sW ** 2

  // 3. random BF term
  const termBF =
    (Wi ** 2 / ni + Wj ** 2 / nj) *
    sBFr ** 2

  // 4. interaction term
  const termCross =
    sW ** 2 * sBF * (1 / ni + 1 / nj)

  return Math.sqrt(
    termBias +
    termWeight +
    termBF +
    termCross
  )
}

export function weightDiffSD(
  i: BodyCompPoint,
  j: BodyCompPoint,
  model: BodyCompErrorModel = errorModel
): number {
  const sW = model.weight.sigma
  const ni = i.sampleCount
  const nj = j.sampleCount
  const termWeight = sW ** 2 * (1 / ni + 1 / nj)
  return Math.sqrt(
    termWeight
  )
}

export function normLeanMassDiffSD(
  i: BodyCompPoint,
  j: BodyCompPoint,
  model: BodyCompErrorModel = errorModel
): number {
  const sW = model.weight.sigma
  const sBFu = model.bodyFat.sigmaBias
  const sBFr = model.bodyFat.sigmaRandom
  const sBF = (sBFu ** 2 + sBFr ** 2)

  const BFi = i.bodyFat? bf(i.bodyFat): 0
  const BFj = j.bodyFat? bf(j.bodyFat): 0

  const Wi = i.weight? i.weight: 0
  const Wj = j.weight? j.weight: 0

  const ni = i.sampleCount
  const nj = j.sampleCount
  
  const c = (1 - model.targetBF) / (2 - 3 * model.targetBF)

  // 1. bias term
  const termBias =
    9 * (Wi - Wj) ** 2 * sBFu ** 2

  // 2. weight-related term
  const termWeight =
    ((2 - 3 * BFi) ** 2 / ni + (2 - 3 * BFj) ** 2 / nj) *
    sW ** 2

  // 3. random BF term
  const termBF =
    9 * (Wi ** 2 / ni + Wj ** 2 / nj) *
    sBFr ** 2

  // 4. interaction term
  const termCross =
    9 * sW ** 2 * sBF * (1 / ni + 1 / nj)

  return c * Math.sqrt(
    termBias +
    termWeight +
    termBF +
    termCross
  )
}

export function leanDiffPercentSD(
  i: BodyCompPoint,
  j: BodyCompPoint,
  model: BodyCompErrorModel = errorModel
): number {
  const sW = model.weight.sigma

  const BFi = i.bodyFat? bf(i.bodyFat): 0
  const BFj = j.bodyFat? bf(j.bodyFat): 0

  const Wi = i.weight? i.weight: 0
  const Wj = j.weight? j.weight: 0

  const ni = i.sampleCount
  const nj = j.sampleCount

  const Delta_W = Wi - Wj
  const Delta_L = Wi * (1 - BFi) - Wj * (1 - BFj)

  const termLean = leanMassDiffSD(
    i, 
    j,
    model
  ) / (Delta_W ** 2)

  const termWeight = weightDiffSD(
    i, 
    j,
    model
  ) * (Delta_L ** 2) / (Delta_W ** 4)

  const cov_mult = (sW ** 2) * (
    (1-BFi)/ni + (1-BFj)/nj
  )
  const termCovariance = - 2 * cov_mult * Delta_L / (Delta_W ** 3)

  return Math.sqrt(
    termLean +
    termWeight +
    termCovariance
  )
}