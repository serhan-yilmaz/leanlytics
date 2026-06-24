import type { Measurement } from '../data/types'
import { shallowClone, timestampToDate } from './util'

type Target = {
  key: string, 
  label: string, 
  target: number
  tolerance: number
}

const TARGETS: Target[] = [
  { key: "LastWeek", label: "Last Week", target: 7, tolerance: 3 },
  { key: "Last2Weeks", label: "Last 2 Weeks", target: 14, tolerance: 4 },
  { key: "Last3Weeks", label: "Last 3 Weeks", target: 21, tolerance: 5 },
  { key: "LastMonth", label: "Last Month", target: 32, tolerance: 7 },
  { key: "Last2Months", label: "Last 2 Months", target: 63, tolerance: 11 },
  { key: "Last3Months", label: "Last 3 Months", target: 91, tolerance: 15 },
  { key: "Last6Months", label: "Last 6 Months", target: 182, tolerance: 28 },
  { key: "LastYear", label: "Last Year", target: 365, tolerance: 54 },
  { key: "AllTime", label: "All Time", target: Infinity, tolerance: Infinity },
]

type State = {
  iteration: number
  firstStart: number
  firstEnd: number
  firstCenterSum: number

  lastStart: number
  lastEnd: number
  lastCenterSum: number
}

type Candidate = State & {
    _action?: 'enlarge-first' | 'shift-first' | 'enlarge-last'
}

export type WindowSolution = {
  found: boolean

  targetDays: number
  tolerance: number

  actualDelayDays: number
  distanceFromTarget: number

  durationDays: number

  score: number

  firstStart: number
  firstEnd: number
  firstDurationDays: number

  lastStart: number
  lastEnd: number
  lastDurationDays: number

  label: string
}

export type ValidWindowTarget = {
  target: number
  tolerance: number
  score: number
  date: string
}

export type WindowSolutionResults = {
  solutions: Record<string, WindowSolution | null>
  targets: ValidWindowTarget[]
}

function omit<T extends object, K extends keyof T>(obj: T, key: K) {
  const { [key]: _, ...rest } = obj;
  return rest;
}

export function safeTimestampAt(
  data: { date: string }[],
  index: number,
): number {
  if (index < 0 || index >= data.length) {
    return 0
  }

  return getTimestamp(data[index].date)
}

export function findSlopeWindows(
  measurements: Measurement[],
  startIndex: number = 0,
  validWindowTarget?: ValidWindowTarget
): WindowSolutionResults {

  const data = [...measurements].sort(
    (a, b) =>
      new Date(b.date).getTime() -
      new Date(a.date).getTime(),
  )

  const results: WindowSolutionResults = {
    solutions: {}, 
    targets: []
  }

  // let targets = structuredClone(TARGETS)
  let targets = shallowClone<Target[]>(TARGETS)
  if(validWindowTarget){
    targets.push({
      key: "Custom", 
      label: `Comparison Anchor (${validWindowTarget.date})`, 
      target: validWindowTarget.target,
      tolerance: validWindowTarget.tolerance
    })
    // console.log(validWindowTarget)
    // console.log(targets)
  }

  for (const target of targets) {
    results.solutions[target.key] = null
  }

  if (data.length < 2) {
    return results
  }

  if((startIndex + 1) >= data.length){
    return results
  }

  let state: State = {
    iteration: 1, 
    firstStart: 1 + startIndex,
    firstEnd: 1 + startIndex,
    firstCenterSum: (
      getTimestamp(data[1 + startIndex].date)
    ), 
    lastStart: startIndex,
    lastEnd: startIndex,
    lastCenterSum: (
      getTimestamp(data[ startIndex].date)
    ), 
  }

  if (
    !isValidState(
      data,
      data.length,
      state,
    )
  ) {
    return results
  }

  const maxDelay =
    Math.max(
      ...targets.map(
        t => t.target + t.tolerance,
      ),
    )

  while (true) {

    const delayDays = computeDelayDays(
        data,
        state,
      )

    if (delayDays > maxDelay) {
      break
    }

    const score = optimizationFunction(
        data,
        state,
      )

    updateTargetSolutions(
      results,
      data, 
      targets, 
      state,
      delayDays,
      score,
    )

    const candidates: Candidate[] = [

      // Enlarge Last Window
      {
        ...state,
        iteration: state.iteration + 1, 

        lastStart:
          state.lastStart + 1,

        lastCenterSum: state.lastCenterSum + (
          + safeTimestampAt(data, 1 + state.lastStart)
        ), 

        _action: "enlarge-last"
      },

      // Enlarge First Window
      {
        ...state,
        iteration: state.iteration + 1, 

        firstStart:
          state.firstStart + 1,

        firstCenterSum: state.firstCenterSum + (
          + safeTimestampAt(data, 1 + state.firstStart)
        ), 

        _action: "enlarge-first"
      },

      // Shift First Window
      {
        iteration: state.iteration + 1, 

        firstStart:
          state.firstStart + 1,

        firstEnd:
          state.firstEnd + 1,

        lastStart:
          state.lastStart,

        lastEnd:
          state.lastEnd,

        firstCenterSum: state.firstCenterSum + (
          + safeTimestampAt(data, 1 + state.firstStart)
          - safeTimestampAt(data, state.firstEnd)
        ), 

        lastCenterSum: state.lastCenterSum, 

        _action: "shift-first"
      },
    ]

    const validCandidates =
      candidates.filter(
        candidate =>
          isValidState(
            data, 
            data.length,
            candidate,
          ),
      )

    if (
      validCandidates.length === 0
    ) {
      break
    }

    let bestCandidate = validCandidates[0]
    let bestScore = 0

    // let bestScore = optimizationFunction(
    //     data,
    //     bestCandidate,
    //   )    

    for (
      let i = 0;
      i < validCandidates.length;
      i++
    ) {

      const candidate = validCandidates[i]

      const candidateScore = optimizationFunction(
          data,
          candidate,
        )

      if((candidate._action == "enlarge-last") && (candidateScore > score)){
        bestCandidate = candidate
        break;
      }

      // if((candidate._action == "enlarge-first") && (candidateScore > score)){
      //   bestCandidate = candidate
      //   break;
      // }

      if (
        candidateScore > bestScore
      ) {
        bestScore = candidateScore

        bestCandidate = candidate
      }
    }

    state = omit(bestCandidate, "_action");
  }

  return results
}

export function confidenceScore(
windowInfo: {
  firstCenter: number, 
  lastCenter: number, 
  // firstStartDate: string, 
  // firstEndDate: string, 
  // lastStartDate: string, 
  // lastEndDate: string, 
  sampleCount1: number,
  sampleCount2: number
}): number {
  // const firstCenter = (
  //   getTimestamp(windowInfo.firstStartDate) +
  //   getTimestamp(windowInfo.firstEndDate)
  // ) / 2
  // const firstCenter = (
  //   getTimestamp(windowInfo.firstStartDate) +
  //   getTimestamp(windowInfo.firstEndDate)
  // ) / 2
  // const lastCenter = (
  //   getTimestamp(windowInfo.lastStartDate) +
  //   getTimestamp(windowInfo.lastEndDate)
  // ) / 2

  const durationDays = millisecondsToDays(
    windowInfo.lastCenter
    - windowInfo.firstCenter
  )

  const durationMonth = durationDays / (365.25/12)

  const score = durationMonth / Math.sqrt((1/windowInfo.sampleCount1) + (1/windowInfo.sampleCount2));
  return(score)
}

function optimizationFunction(
  data: Measurement[],
  state: State,
): number {

  const firstPointCount =
    state.firstStart -
    state.firstEnd +
    1

  const lastPointCount =
    state.lastStart -
    state.lastEnd +
    1
  
  // const firstCenter = centerTimestamp(
  //     data, state.firstStart, state.firstEnd
  //   );
  
  // const lastCenter = centerTimestamp(
  //     data, state.lastStart, state.lastEnd
  //   );

  const firstCenter = getFirstCenter(data, state)
  const lastCenter = getLastCenter(data, state)
  
  const score = confidenceScore({
    firstCenter: firstCenter, 
    lastCenter: lastCenter, 
    sampleCount1: firstPointCount, 
    sampleCount2: lastPointCount, 
  })

  // console.log({
  //   state, 
  //   firstStartDate: data[state.firstStart].date,
  //   firstEndDate: data[state.firstEnd].date,
  //   lastStartDate: data[state.lastStart].date,
  //   lastEndDate: data[state.lastEnd].date,
  //   durationDays: millisecondsToDays(lastCenter - firstCenter), 
  //   score: score
  // })

  return score
}

function updateTargetSolutions(
  results: WindowSolutionResults,
  data: Measurement[], 
  targets: Target[], 
  state: State,
  delayDays: number,
  score: number,
) {
  // const windowCenter = timestampToDate(getWindowCenter(data, state))
  
  let previousTargetMax = 0
  if(results.targets.length >= 1){
    const target = results.targets[results.targets.length - 1]
    previousTargetMax = target.target + target.tolerance
  }

  let currentTarget = Math.round(delayDays);

  if(currentTarget > previousTargetMax){
    results.targets.push(
      {
        target: Math.round(delayDays),
        // tolerance: 4, 
        score: score, 
        date: timestampToDate(getFirstCenter(data, state)),
        tolerance: Math.ceil(2 + delayDays / 7),
      }
    )
  }
  
  for (const target of targets) {

    const min =
      target.target -
      target.tolerance

    const max =
      target.target +
      target.tolerance

    const allTimeTarget = !isFinite(target.target)

    if (
      !allTimeTarget && (
        delayDays < min ||
        delayDays > max
      )
    ) {
      continue
    }

    const distance = allTimeTarget? 0 : Math.abs(
        delayDays -
        target.target,
      )

    const current = results.solutions[target.key]

    const shouldReplace =
      !current ||
      distance <
        current.distanceFromTarget ||
      (
        distance ===
          current.distanceFromTarget &&
        score >
          current.score
      )

    if (!shouldReplace) {
      continue
    }

    results.solutions[target.key] = {
      found: true,

      targetDays:
        target.target,

      tolerance:
        target.tolerance,

      label: target.label, 

      actualDelayDays:
        delayDays,

      distanceFromTarget:
        distance,

      score,

      firstStart:
        state.firstStart,

      firstEnd:
        state.firstEnd,
    
      firstDurationDays: computeDateDifferenceDays(
        data[state.firstEnd].date, 
        data[state.firstStart].date, 
      ),

      lastStart:
        state.lastStart,

      lastEnd:
        state.lastEnd,

      lastDurationDays: computeDateDifferenceDays(
        data[state.lastEnd].date, 
        data[state.lastStart].date, 
      ), 

      durationDays: computeDurationDays(
            data,
            state,
        )
    }
  }
}

function isValidState(
  data: Measurement[], 
  measurementCount: number,
  state: Candidate,
): boolean {

  if (
    state.firstStart >=
    measurementCount
  ) {
    return false
  }

  if (
    state.firstEnd >=
    measurementCount
  ) {
    return false
  }

  if (
    state.lastStart >=
    measurementCount
  ) {
    return false
  }

  if (
    state.firstStart <
    state.firstEnd
  ) {
    return false
  }

  if (
    state.firstEnd <=
    state.lastStart
  ) {
    return false
  }

  const windowMaxDays = 93; 

  if(state._action == "enlarge-first"){
    if(computeDateDifferenceDays(
            data[state.firstEnd].date, 
            data[state.firstStart].date, 
        ) > windowMaxDays) return false
  }

  if(state._action == "enlarge-last"){
    if(computeDateDifferenceDays(
            data[state.lastEnd].date, 
            data[state.lastStart].date, 
        ) > windowMaxDays) return false
  }

  return true
}

function computeDateDifferenceDays(
    date1: string, 
    date2: string
): number {
  return millisecondsToDays(
    getTimestamp(date1)
    - getTimestamp(date2)
  )
}

function computeDelayDays(
  data: Measurement[],
  state: State,
): number {

  // const firstCenter = centerTimestamp(
  //     data,
  //     state.firstStart,
  //     state.firstEnd,
  //   )

  const firstCenter = getFirstCenter(data, state)

  const last = getTimestamp(data[state.lastEnd].date)

  return millisecondsToDays(
    last -
    firstCenter
  )
}

function millisecondsToDays(
    value: number
): number {
    return value / 86400000
}

function getFirstCenter(
  data: Measurement[],
  state: State,
): number {
  return state.firstCenterSum / (state.firstStart - state.firstEnd + 1)
}

function getLastCenter(
  data: Measurement[],
  state: State,
): number {
  return state.lastCenterSum / (state.lastStart - state.lastEnd + 1)
}

function getWindowCenter(
  data: Measurement[],
  state: State,
): number {
  return (
    + getFirstCenter(data, state) 
    + getLastCenter(data, state)
  ) / 2
}

function computeDurationDays(
  data: Measurement[],
  state: State,
): number {

  // const firstCenter = centerTimestamp(
  //     data,
  //     state.firstStart,
  //     state.firstEnd,
  //   )

  // const lastCenter = centerTimestamp(
  //     data,
  //     state.lastStart,
  //     state.lastEnd,
  //   )

  const firstCenter = getFirstCenter(data, state)
  const lastCenter = getLastCenter(data, state)

  // console.log({
  //   firstCenter,
  //   firstCenter2,
  //   lastCenter,
  //   lastCenter2
  // })

  return millisecondsToDays(
    lastCenter
    - firstCenter
  )
}

function getTimestamp(
    date: string
): number {
  return new Date(date).getTime()
}

// function centerTimestamp(
//   data: Measurement[],
//   start: number,
//   end: number,
// ): number {

//   const startTs = getTimestamp(data[start].date)
//   const endTs = getTimestamp(data[end].date)

//   return (
//     startTs +
//     endTs
//   ) / 2
// }

function centerTimestamp(
  data: Measurement[],
  start: number,
  end: number,
): number {

  const window = data.slice(end, start + 1)
  const window_length = start - end + 1

  if (window_length === 0) {
    return 0
  }

  const sum = window.reduce(
    (acc, m) => acc + getTimestamp(m.date),
    0,
  )

  return sum / window_length
}