/**
 * Indicative eligibility engine. Compares a candidate profile with the
 * eligibilityRules envelope of each exam (see docs/DATA_SCHEMA.md).
 * Results are guidance only; the official notification is authoritative.
 * Used by the eligibility checker page and the directory "eligible for me" filter.
 */
import { vocabulary } from './data.js'

const levelOrder = vocabulary.educationLevelOrder

/** Full years between a birth date and a reference date (both YYYY-MM-DD). */
export function ageOn(birthDate, referenceDate) {
  const birth = new Date(`${birthDate}T00:00:00`)
  const reference = new Date(`${referenceDate}T00:00:00`)
  let years = reference.getFullYear() - birth.getFullYear()
  const beforeBirthday =
    reference.getMonth() < birth.getMonth() || (reference.getMonth() === birth.getMonth() && reference.getDate() < birth.getDate())
  if (beforeBirthday) years -= 1
  return years
}

/** Picks the age reference date: a full ISO date from the rules, else today. */
function pickReferenceDate(rules, todayIsoDate) {
  return /^\d{4}-\d{2}-\d{2}$/.test(rules.ageReferenceDate ?? '') ? rules.ageReferenceDate : todayIsoDate
}

/** Upper age limit after category and disability relaxation. */
export function relaxedUpperAge(rules, candidate) {
  if (rules.ageMax == null) return null
  const relaxation = rules.relaxationYears ?? {}
  const categoryYears = candidate.category && candidate.category !== 'GEN' ? relaxation[candidate.category] ?? 0 : 0
  const disabilityYears = candidate.isPwbd ? relaxation.PwBD ?? 0 : 0
  return rules.ageMax + categoryYears + disabilityYears
}

/** True when a candidate's fields satisfy an exam's required fields. */
function fieldsMatch(requiredFields, candidateFields) {
  if (!requiredFields?.length || requiredFields.includes('any')) return true
  return requiredFields.some((required) => {
    if (candidateFields.includes(required)) return true
    // "engineering-any" accepts every engineering branch.
    if (required === 'engineering-any') return candidateFields.some((field) => field.startsWith('engineering-'))
    return false
  })
}

/** Checks age; returns a finding or null. */
function checkAge(rules, candidate, todayIsoDate) {
  if (!candidate.birthDate) return { level: 'unknown', text: 'Add your date of birth to check age limits.' }
  const referenceDate = pickReferenceDate(rules, todayIsoDate)
  const age = ageOn(candidate.birthDate, referenceDate)
  const upperAge = relaxedUpperAge(rules, candidate)
  const onDateText = referenceDate === todayIsoDate ? 'today' : `on ${referenceDate}`
  if (rules.ageMin != null && age < rules.ageMin) return { level: 'fail', text: `Age ${age} ${onDateText} is below the minimum of ${rules.ageMin}.` }
  if (upperAge != null && age > upperAge) return { level: 'fail', text: `Age ${age} ${onDateText} is above the limit of ${upperAge} (after relaxation shown).` }
  const note = referenceDate === todayIsoDate ? ' The official cut-off date may differ.' : ''
  return { level: 'pass', text: `Age ${age} ${onDateText} is within ${rules.ageMin ?? 'no minimum'} to ${upperAge ?? 'no upper limit'}.${note}` }
}

/** Checks qualification level and subject; returns a finding. */
function checkEducation(rules, candidate) {
  const requiredRank = levelOrder.indexOf(rules.minEducation ?? 'none')
  const candidateRank = levelOrder.indexOf(candidate.education ?? 'none')
  const appearingAllowed = rules.finalYearAllowed && candidate.isFinalYear && candidateRank + 1 >= requiredRank
  if (candidateRank < requiredRank && !appearingAllowed) {
    return { level: 'fail', text: `Needs ${vocabulary.educationLevels[rules.minEducation]} or higher.` }
  }
  if (!fieldsMatch(rules.educationFields, candidate.fields ?? [])) {
    const fieldNames = rules.educationFields.map((field) => vocabulary.educationFields[field] ?? field).join(', ')
    return { level: 'fail', text: `Needs a qualification in: ${fieldNames}.` }
  }
  if (candidateRank < requiredRank) return { level: 'check', text: 'Final-year candidates may apply; proof of passing is needed by the date in the notification.' }
  return { level: 'pass', text: 'Qualification level and subject match.' }
}

/** Checks gender and domicile restrictions. */
function checkRestrictions(rules, candidate) {
  const findings = []
  if (rules.gender && rules.gender !== 'any' && candidate.gender && candidate.gender !== rules.gender) {
    findings.push({ level: 'fail', text: `Open only to ${rules.gender} candidates.` })
  }
  if (rules.domicile && candidate.homeState && candidate.homeState !== rules.domicile) {
    findings.push({ level: 'check', text: `Local/domicile rules of ${vocabulary.jurisdictions[rules.domicile]} apply. Non-locals may be limited to open-category posts or excluded.` })
  }
  return findings
}

/**
 * Evaluates one exam for a candidate.
 * Returns { verdict: 'eligible' | 'check' | 'not-eligible', findings: [{ level, text }] }.
 */
export function evaluateExam(examRecord, candidate, todayIsoDate) {
  const rules = examRecord.eligibilityRules ?? {}
  const findings = [checkAge(rules, candidate, todayIsoDate), checkEducation(rules, candidate), ...checkRestrictions(rules, candidate)]
  if (rules.notes) findings.push({ level: 'check', text: rules.notes })
  const hasFail = findings.some((finding) => finding.level === 'fail')
  const needsCheck = findings.some((finding) => finding.level === 'check' || finding.level === 'unknown')
  return { verdict: hasFail ? 'not-eligible' : needsCheck ? 'check' : 'eligible', findings }
}
