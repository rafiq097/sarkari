/**
 * Suggestion engine for "Your plan". Scores every current or recurring exam the
 * candidate is not ruled out of, using transparent points (preferences, education
 * match, pay, growth, regularity, home state, competition, upcoming dates) and
 * returns reasons for each score. Also derives last-chance alerts, prepare-together
 * groups (syllabus overlap) and focus subjects. Used by pages/PlanPage.jsx.
 */
import { examIndex, vocabulary } from './data.js'
import { evaluateExam, ageOn, relaxedUpperAge } from './eligibility.js'
import { todayIso } from './format.js'

const levelOrder = vocabulary.educationLevelOrder
const stateJurisdictions = new Set(['andhra-pradesh', 'telangana', 'karnataka'])
// Upcoming official dates within this many days count as "coming up".
const soonWindowDays = 120

/** Days from today to an ISO date (YYYY, YYYY-MM or YYYY-MM-DD). */
function daysUntil(isoDate, today) {
  const padded = `${isoDate}-01-01`.slice(0, 10)
  return Math.round((new Date(padded) - new Date(today)) / 86400000)
}

/** Points for how well the exam's subject requirement uses the candidate's degree or branch. */
function educationPoints(exam, candidate, reasons) {
  const required = exam.eligibilityRules?.educationFields ?? ['any']
  const fields = candidate.fields ?? []
  if (!required.includes('any') && required.some((field) => fields.includes(field) || (field === 'engineering-any' && fields.some((item) => item.startsWith('engineering-'))))) {
    reasons.push({ points: 3, text: 'Uses your specific degree or branch' })
    return 3
  }
  const gap = levelOrder.indexOf(candidate.education) - levelOrder.indexOf(exam.eligibilityRules?.minEducation ?? 'none')
  if (gap >= 3) {
    reasons.push({ points: -2, text: 'Needs a much lower qualification than yours' })
    return -2
  }
  return 0
}

/** Points for preferred governments and sectors. */
function preferencePoints(exam, candidate, reasons) {
  let points = 0
  if (candidate.governments?.includes(exam.jurisdiction)) {
    points += 3
    reasons.push({ points: 3, text: `In your preferred government (${vocabulary.jurisdictions[exam.jurisdiction]})` })
  }
  if (candidate.sectors?.includes(exam.sector)) {
    points += 3
    reasons.push({ points: 3, text: `In your preferred sector (${vocabulary.sectors[exam.sector]})` })
  }
  return points
}

/** Points for home-state fit of state exams. */
function homeStatePoints(exam, candidate, reasons) {
  if (!stateJurisdictions.has(exam.jurisdiction) || !candidate.homeState) return 0
  if (exam.jurisdiction === candidate.homeState) {
    reasons.push({ points: 2, text: 'Your home state: local reservation helps' })
    return 2
  }
  reasons.push({ points: -2, text: 'Another state: local quotas favour that state\'s candidates' })
  return -2
}

/** Points from pay, growth, regularity and competition ratings. */
function qualityPoints(exam, reasons) {
  let points = 0
  const basic = exam.salary?.startingBasic ?? 0
  // Each Rs 15,000 of starting basic adds a point, capped at 4 (about Rs 60,000 and above).
  const payPoints = Math.min(4, Math.floor(basic / 15000))
  if (payPoints > 0) {
    points += payPoints
    reasons.push({ points: payPoints, text: `Starting basic about Rs ${basic.toLocaleString('en-IN')}` })
  }
  const growth = { high: 2, medium: 1 }[exam.ratings?.careerGrowth] ?? 0
  if (growth) {
    points += growth
    reasons.push({ points: growth, text: `${exam.ratings.careerGrowth === 'high' ? 'Strong' : 'Fair'} career growth` })
  }
  if (exam.ratings?.recruitmentRegularity === 'high') {
    points += 1
    reasons.push({ points: 1, text: 'Recruits regularly' })
  }
  if (exam.difficulty?.competition === 'low' || exam.difficulty?.competition === 'medium') {
    points += 1
    reasons.push({ points: 1, text: 'Lower competition than most' })
  }
  return points
}

/** Years left before the candidate crosses the (relaxed) upper age limit, or null. */
export function yearsLeft(exam, candidate, today) {
  const upper = relaxedUpperAge(exam.eligibilityRules ?? {}, candidate)
  if (upper == null || !candidate.birthDate) return null
  return upper - ageOn(candidate.birthDate, today)
}

/** Scores one exam; returns null when the candidate is ruled out or it is historical. */
function scoreExam(exam, candidate, today) {
  if (exam.status === 'historical' || exam.profileType === 'departmental-exam') return null
  const result = evaluateExam(exam, candidate, today)
  if (result.verdict === 'not-eligible') return null
  const reasons = []
  let score = result.verdict === 'eligible' ? 2 : 0
  if (result.verdict === 'eligible') reasons.push({ points: 2, text: 'You meet the age and qualification envelope' })
  else reasons.push({ points: 0, text: 'Some conditions need checking' })
  score += preferencePoints(exam, candidate, reasons) + educationPoints(exam, candidate, reasons) + homeStatePoints(exam, candidate, reasons) + qualityPoints(exam, reasons)
  const soon = exam.keyEvent?.upcoming && daysUntil(exam.keyEvent.date, today) <= soonWindowDays
  if (soon) {
    score += 1
    reasons.push({ points: 1, text: `Official date coming up: ${exam.keyEvent.event}` })
  }
  return { exam, result, score, reasons, soon, yearsLeft: yearsLeft(exam, candidate, today) }
}

/** Jaccard similarity of two tag lists. */
function similarity(tagsA, tagsB) {
  const setA = new Set(tagsA)
  const shared = tagsB.filter((tag) => setA.has(tag)).length
  const union = new Set([...tagsA, ...tagsB]).size
  return union ? shared / union : 0
}

/**
 * Builds the plan for a candidate.
 * Returns { picks, lastChance, comingUp, prepareTogether, focusSubjects, eligibleCount }.
 */
export function buildPlan(candidate) {
  const today = todayIso()
  const scored = examIndex.map((exam) => scoreExam(exam, candidate, today)).filter(Boolean).sort((a, b) => b.score - a.score)
  const picks = scored.slice(0, 8)
  const lastChance = scored.filter((entry) => entry.yearsLeft != null && entry.yearsLeft <= 1).slice(0, 6)
  const comingUp = scored.filter((entry) => entry.soon).slice(0, 6)

  const anchor = picks[0]
  const prepareTogether = anchor
    ? scored
        .filter((entry) => entry.exam.id !== anchor.exam.id)
        .map((entry) => ({ ...entry, overlap: similarity(anchor.exam.syllabusTags, entry.exam.syllabusTags) }))
        .filter((entry) => entry.overlap >= 0.3)
        .sort((a, b) => b.overlap - a.overlap)
        .slice(0, 5)
    : []

  // Focus subjects: tags shared by the most top picks.
  const tagCounts = new Map()
  for (const entry of picks.slice(0, 5)) for (const tag of entry.exam.syllabusTags) tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1)
  const focusSubjects = [...tagCounts.entries()].filter(([, count]) => count >= 2).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([tag, count]) => ({ tag, count }))

  return { picks, lastChance, comingUp, prepareTogether, focusSubjects, eligibleCount: scored.length, anchor }
}
