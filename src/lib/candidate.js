/**
 * Candidate profile helpers: the empty profile, whether a profile has enough data,
 * and per-exam verdicts used by My Profile, exam cards, the home page and filters.
 */
import { examIndex } from './data.js'
import { evaluateExam } from './eligibility.js'
import { todayIso } from './format.js'

export const emptyCandidate = {
  name: '',
  birthDate: '',
  category: 'GEN',
  isPwbd: false,
  gender: '',
  homeState: '',
  education: 'graduate',
  fields: [],
  isFinalYear: false,
  governments: [],
  sectors: [],
}

/** True when the profile has the minimum needed for a meaningful eligibility check. */
export function isProfileUsable(candidate) {
  return Boolean(candidate?.birthDate && candidate?.education)
}

/** True when an exam matches the candidate's preferred governments and sectors (empty = any). */
export function fitsPreferences(exam, candidate) {
  const governments = candidate?.governments ?? []
  const sectors = candidate?.sectors ?? []
  return (!governments.length || governments.includes(exam.jurisdiction)) && (!sectors.length || sectors.includes(exam.sector))
}

/** Verdict for one exam, or null without a usable profile. */
export function verdictFor(exam, candidate) {
  if (!isProfileUsable(candidate) || !exam) return null
  return evaluateExam(exam, candidate, todayIso())
}

/** All current and recurring exams with verdicts, split by outcome. */
export function summariseMatches(candidate) {
  const today = todayIso()
  const results = examIndex
    .filter((exam) => exam.status !== 'historical')
    .map((exam) => ({ exam, result: evaluateExam(exam, candidate, today), preferred: fitsPreferences(exam, candidate) }))
  return {
    eligible: results.filter((entry) => entry.result.verdict === 'eligible'),
    check: results.filter((entry) => entry.result.verdict === 'check'),
    notEligible: results.filter((entry) => entry.result.verdict === 'not-eligible'),
  }
}
