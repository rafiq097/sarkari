/**
 * Overall difficulty score out of 100, built from a profile's six analytical difficulty
 * ratings (low / medium / high) and, when published, official candidates per vacancy.
 * Computed once by scripts/build-data.mjs into the exam index; the bands label it in the UI.
 */

// How much each rating counts; the weights add up to 100. Competition and selection
// uncertainty decide most results, so they weigh most.
const scoreWeights = {
  competition: 30,
  selectionUncertainty: 20,
  syllabusDepth: 20,
  timePressure: 15,
  technicalComplexity: 8,
  physicalRequirements: 7,
}

// Share of a weight each level earns. Low is not zero: every recruitment exam takes real work.
const levelShare = { low: 0.3, medium: 0.65, high: 1 }

// Bands from the top down; the first band whose minimum the score reaches applies.
// Every exam here is competitive, so the cut points sit high to keep the bands distinct.
export const difficultyBands = [
  { minimum: 85, label: 'Very hard', tone: 'brick' },
  { minimum: 72, label: 'Hard', tone: 'accent' },
  { minimum: 60, label: 'Moderate', tone: 'plum' },
  { minimum: 0, label: 'Easier', tone: 'sage' },
]

/**
 * Competition share from candidates per vacancy on a log scale: about 10 per post gives
 * the low share (0.3), 100 the medium share (0.65) and 1,000 or more the full share,
 * matching the low / medium / high thresholds in the methodology.
 */
function competitionShareFromRatio(candidatesPerVacancy) {
  const share = 0.3 + (0.7 * (Math.log10(candidatesPerVacancy) - 1)) / 2
  return Math.min(1, Math.max(0.3, share))
}

/** Latest official candidates per vacancy (appeared, else applied), or null when not published. */
export function candidatesPerVacancy(statistics) {
  const latest = [...(statistics ?? [])].reverse().find((row) => row.vacancies && (row.appeared || row.applicants))
  return latest ? (latest.appeared ?? latest.applicants) / latest.vacancies : null
}

/** Score from 30 (everything low) to 100 (everything high); a missing rating counts as medium. */
export function difficultyScore(difficulty, statistics) {
  const ratio = candidatesPerVacancy(statistics)
  let total = 0
  for (const [key, weight] of Object.entries(scoreWeights)) {
    const share = key === 'competition' && ratio ? competitionShareFromRatio(ratio) : (levelShare[difficulty?.[key]] ?? levelShare.medium)
    total += weight * share
  }
  return Math.round(total)
}

/** Band (label and colour tone) for a score. */
export function difficultyBand(score) {
  return difficultyBands.find((band) => score >= band.minimum)
}
