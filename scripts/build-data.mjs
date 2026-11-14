/**
 * Data build script. Validates every exam profile in src/data/exams against
 * docs/DATA_SCHEMA.md and writes the lightweight indexes the UI loads eagerly:
 * src/data/generated/exam-index.json and src/data/generated/source-index.json.
 * Run with `npm run data` (also runs before dev and build).
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, statSync, existsSync } from 'node:fs'
import { join, basename, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { difficultyScore } from '../src/lib/difficulty.js'
import { applyVariant, variantOverrideKeys } from '../src/lib/variants.js'

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const examsDirectory = join(projectRoot, 'src', 'data', 'exams')
const mocksDirectory = join(projectRoot, 'src', 'data', 'mocks')
const generatedDirectory = join(projectRoot, 'src', 'data', 'generated')
const vocabulary = JSON.parse(readFileSync(join(projectRoot, 'src', 'data', 'vocabulary.json'), 'utf8'))

const problems = []
const warnings = []

// Accepts YYYY, YYYY-MM or YYYY-MM-DD.
const isoDatePattern = /^\d{4}(-\d{2}(-\d{2})?)?$/
// Full calendar date only, used where a month or year alone is not precise enough.
const fullDatePattern = /^\d{4}-\d{2}-\d{2}$/
const levelValues = new Set(vocabulary.levels)
// Variant ids go into URLs (?variant=it), so they are short kebab-case words.
const variantIdPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/
// Keys every variant has besides its overrides.
const variantIdentityKeys = ['id', 'name']
const sectionSwitchingValues = ['locked', 'free']
// A multiple-choice question needs at least this many options.
const minimumOptionCount = 2

/** Lists every JSON file under a directory, recursively. */
function listJsonFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const fullPath = join(directory, entry)
    if (statSync(fullPath).isDirectory()) return listJsonFiles(fullPath)
    return entry.endsWith('.json') ? [fullPath] : []
  })
}

/** Records a validation problem that fails the build. */
function fail(examId, message) {
  problems.push(`${examId}: ${message}`)
}

/** Checks that a value belongs to a vocabulary map or list. */
function checkEnum(examId, fieldName, value, allowed) {
  const allowedValues = Array.isArray(allowed) ? allowed : Object.keys(allowed)
  if (!allowedValues.includes(value)) fail(examId, `${fieldName} has unknown value "${value}"`)
}

/** Checks that every source id referenced in a section exists in the profile. */
function checkSourceReferences(examId, sectionName, referencedIds, knownSourceIds) {
  for (const sourceId of referencedIds ?? []) {
    if (!knownSourceIds.has(sourceId)) fail(examId, `${sectionName} references missing source "${sourceId}"`)
  }
}

/** Validates the status block, including every dated event. */
function validateStatus(exam, knownSourceIds) {
  checkEnum(exam.id, 'status.type', exam.status?.type, vocabulary.statusTypes)
  for (const cycle of exam.status?.cycles ?? []) {
    for (const event of cycle.events ?? []) {
      if (event.date && !isoDatePattern.test(event.date)) fail(exam.id, `bad date "${event.date}" in ${cycle.cycle}`)
      if (!['official', 'official-tentative'].includes(event.dateType)) fail(exam.id, `event "${event.event}" needs dateType official or official-tentative`)
      checkSourceReferences(exam.id, `status ${cycle.cycle}`, event.source ? [event.source] : [], knownSourceIds)
    }
  }
}

/** Validates the machine-readable eligibility envelope used by the checker. */
function validateEligibilityRules(exam) {
  const rules = exam.eligibilityRules
  if (!rules) return fail(exam.id, 'missing eligibilityRules')
  checkEnum(exam.id, 'eligibilityRules.minEducation', rules.minEducation, vocabulary.educationLevels)
  for (const field of rules.educationFields ?? []) checkEnum(exam.id, 'eligibilityRules.educationFields', field, vocabulary.educationFields)
  checkEnum(exam.id, 'eligibilityRules.gender', rules.gender, ['any', 'male', 'female'])
  if (rules.ageMin != null && rules.ageMax != null && rules.ageMin > rules.ageMax) fail(exam.id, 'ageMin is above ageMax')
}

/** Validates analytical ratings so the UI can sort on them. */
function validateRatings(exam) {
  for (const key of Object.keys(vocabulary.difficultyKeys)) {
    const value = exam.difficulty?.[key]
    if (value != null && !levelValues.has(value)) fail(exam.id, `difficulty.${key} must be low/medium/high`)
  }
  for (const key of Object.keys(vocabulary.ratingKeys)) {
    const value = exam.ratings?.[key]
    if (value != null && !levelValues.has(value)) fail(exam.id, `ratings.${key} must be low/medium/high`)
  }
  if (exam.risk?.overall && !levelValues.has(exam.risk.overall)) fail(exam.id, 'risk.overall must be low/medium/high')
}

/** True for null or a number above zero (pattern counts, marks and minutes). */
function isNullOrPositive(value) {
  return value === null || (typeof value === 'number' && value > 0)
}

/**
 * Validates an exam pattern block (used by the mock test engine). Every value may be
 * null when unknown, but the keys must be present so a missing value is a decision.
 */
function validatePattern(examId, label, pattern, knownSourceIds) {
  if (pattern === undefined) return
  if (pattern.effectiveFrom === undefined) fail(examId, `${label} is missing effectiveFrom (use null when unknown)`)
  else if (pattern.effectiveFrom !== null && !isoDatePattern.test(pattern.effectiveFrom)) fail(examId, `${label} effectiveFrom must be an ISO date or null`)
  if (!pattern.stage) fail(examId, `${label} is missing stage`)
  if (!isNullOrPositive(pattern.totalMinutes)) fail(examId, `${label} totalMinutes must be a positive number or null`)
  if (pattern.sectionSwitching !== null && !sectionSwitchingValues.includes(pattern.sectionSwitching)) fail(examId, `${label} sectionSwitching must be locked, free or null`)
  checkSourceReferences(examId, label, pattern.sources, knownSourceIds)
  if (!Array.isArray(pattern.sections) || pattern.sections.length === 0) return fail(examId, `${label} needs at least one section`)
  const seenSectionIds = new Set()
  for (const section of pattern.sections) {
    if (!variantIdPattern.test(section.id ?? '')) fail(examId, `${label} section needs a kebab-case id`)
    if (seenSectionIds.has(section.id)) fail(examId, `${label} has duplicate section id ${section.id}`)
    seenSectionIds.add(section.id)
    if (!section.name) fail(examId, `${label} section ${section.id} is missing name`)
    for (const key of ['questions', 'marks', 'minutes']) {
      if (!isNullOrPositive(section[key])) fail(examId, `${label} section ${section.id} ${key} must be a positive number or null`)
    }
    const negative = section.negativeFraction
    if (negative !== null && !(typeof negative === 'number' && negative >= 0 && negative <= 1)) fail(examId, `${label} section ${section.id} negativeFraction must be 0 to 1 or null`)
  }
}

/** Problems with one mock question; `sectionIds` are the pattern sections it may belong to. */
function mockQuestionProblems(question, sectionIds) {
  const found = []
  if (!question.id || !question.text || !question.explanation) found.push('needs id, text and explanation')
  if (!sectionIds.has(question.section)) found.push(`section "${question.section}" is not in the exam pattern`)
  if (!Array.isArray(question.options) || question.options.length < minimumOptionCount) found.push(`needs at least ${minimumOptionCount} options`)
  else if (!Number.isInteger(question.answer) || question.answer < 0 || question.answer >= question.options.length) found.push('answer must be the index of one of its options')
  if (typeof question.verified !== 'boolean') found.push('verified must be true or false')
  if (question.source !== null && !/^https?:\/\//.test(question.source ?? '')) found.push('source must be a URL or null')
  // A verified question must say where it came from.
  if (question.verified && (!question.source || !question.year)) found.push('a verified question needs source and year')
  return found
}

/**
 * Validates the question sets in src/data/mocks/<examId>/. Each set must belong to an
 * exam (and stream) that has a pattern block, and each question to one of its sections.
 */
function validateMockSets(examsById) {
  if (!existsSync(mocksDirectory)) return
  for (const filePath of listJsonFiles(mocksDirectory)) {
    const mockSet = JSON.parse(readFileSync(filePath, 'utf8'))
    const folderName = basename(dirname(filePath))
    const label = `mock set ${folderName}/${basename(filePath)}`
    const exam = examsById.get(folderName)
    if (!exam || mockSet.examId !== folderName) {
      fail(folderName, `${label}: folder name and examId must match an exam profile`)
      continue
    }
    if (mockSet.variant && !(exam.variants ?? []).some((variant) => variant.id === mockSet.variant)) fail(exam.id, `${label}: unknown variant "${mockSet.variant}"`)
    const pattern = applyVariant(exam, mockSet.variant).pattern
    if (!pattern) {
      fail(exam.id, `${label}: the exam${mockSet.variant ? ' variant' : ''} has no pattern block`)
      continue
    }
    if (typeof mockSet.isSample !== 'boolean') fail(exam.id, `${label}: isSample must be true or false`)
    const sectionIds = new Set(pattern.sections.map((section) => section.id))
    const seenQuestionIds = new Set()
    for (const question of mockSet.questions ?? []) {
      if (seenQuestionIds.has(question.id)) fail(exam.id, `${label}: duplicate question id ${question.id}`)
      seenQuestionIds.add(question.id)
      for (const problem of mockQuestionProblems(question, sectionIds)) fail(exam.id, `${label} question ${question.id}: ${problem}`)
      // Sample sets must never pass as real: none of their questions may be marked verified.
      if (mockSet.isSample && question.verified) fail(exam.id, `${label} question ${question.id}: a sample set cannot hold verified questions`)
    }
  }
}

/**
 * Validates the stream variants of a profile: unique kebab-case ids, a name, only the
 * allowed override fields, and that each merged variant still passes the same checks
 * as the shared profile (rules enums, syllabus tags, source references).
 */
function validateVariants(exam, knownSourceIds) {
  if (exam.variants === undefined) return
  if (!Array.isArray(exam.variants) || exam.variants.length === 0) return fail(exam.id, 'variants must be a non-empty array (omit the field when there are no variants)')
  const seenVariantIds = new Set()
  for (const variant of exam.variants) {
    const label = `variant "${variant.id}"`
    if (!variantIdPattern.test(variant.id ?? '')) fail(exam.id, `${label} needs a kebab-case id`)
    if (seenVariantIds.has(variant.id)) fail(exam.id, `duplicate variant id ${variant.id}`)
    seenVariantIds.add(variant.id)
    if (!variant.name) fail(exam.id, `${label} is missing name`)
    const overrideKeys = Object.keys(variant).filter((key) => !variantIdentityKeys.includes(key))
    if (overrideKeys.length === 0) fail(exam.id, `${label} overrides nothing`)
    for (const key of overrideKeys) {
      if (!variantOverrideKeys.includes(key)) fail(exam.id, `${label} may not override "${key}" (allowed: ${variantOverrideKeys.join(', ')})`)
    }
    const merged = applyVariant(exam, variant.id)
    validateEligibilityRules({ ...merged, id: `${exam.id} ${label}` })
    validatePattern(exam.id, `${label} pattern`, variant.pattern, knownSourceIds)
    for (const tag of merged.syllabusTags ?? []) checkEnum(exam.id, `${label} syllabusTags`, tag, vocabulary.syllabusTags)
    for (const section of ['eligibility', 'selection', 'syllabus']) checkSourceReferences(exam.id, `${label} ${section}`, merged[section]?.sources, knownSourceIds)
  }
}

/** Validates one profile and returns its known source ids. */
function validateExam(exam, filePath) {
  const examId = exam.id ?? basename(filePath)
  if (exam.id !== basename(filePath, '.json')) fail(examId, 'id must equal file name')
  for (const field of ['name', 'summary', 'organization', 'jurisdiction', 'sector', 'profileType', 'employmentType']) {
    if (exam[field] == null || exam[field] === '') fail(examId, `missing ${field}`)
  }
  checkEnum(examId, 'jurisdiction', exam.jurisdiction, vocabulary.jurisdictions)
  if (!filePath.includes(join('exams', exam.jurisdiction))) fail(examId, 'file is not in its jurisdiction folder')
  checkEnum(examId, 'sector', exam.sector, vocabulary.sectors)
  checkEnum(examId, 'profileType', exam.profileType, vocabulary.profileTypes)
  checkEnum(examId, 'employmentType', exam.employmentType, vocabulary.employmentTypes)
  for (const method of exam.recruitmentMethods ?? []) checkEnum(examId, 'recruitmentMethods', method, vocabulary.recruitmentMethods)
  for (const tag of exam.syllabusTags ?? []) checkEnum(examId, 'syllabusTags', tag, vocabulary.syllabusTags)
  // lastVerified must be present: a full YYYY-MM-DD date, or null when the profile was never checked.
  if (exam.lastVerified === undefined) fail(examId, 'missing lastVerified (use null when unknown)')
  else if (exam.lastVerified !== null && !fullDatePattern.test(exam.lastVerified)) fail(examId, 'lastVerified must be YYYY-MM-DD or null')

  const sources = exam.sources ?? []
  if (sources.length === 0) fail(examId, 'has no sources')
  const knownSourceIds = new Set()
  for (const source of sources) {
    if (knownSourceIds.has(source.id)) fail(examId, `duplicate source id ${source.id}`)
    knownSourceIds.add(source.id)
    if (!/^https?:\/\//.test(source.url ?? '')) fail(examId, `source ${source.id} has no valid url`)
    checkEnum(examId, `source ${source.id} type`, source.type, ['primary', 'secondary'])
  }

  validateStatus(exam, knownSourceIds)
  validateEligibilityRules(exam)
  validateRatings(exam)
  validateVariants(exam, knownSourceIds)
  validatePattern(examId, 'pattern', exam.pattern, knownSourceIds)
  for (const section of ['eligibility', 'selection', 'syllabus', 'salary', 'career', 'workLife', 'rankAndAllocation', 'guide']) {
    checkSourceReferences(examId, section, exam[section]?.sources, knownSourceIds)
  }
  for (const row of [...(exam.cutoffs ?? []), ...(exam.statistics ?? [])]) {
    if (!row.source) fail(examId, `cutoff/statistic row for ${row.year} has no source`)
    checkSourceReferences(examId, `row ${row.year}`, row.source ? [row.source] : [], knownSourceIds)
  }
  for (const benefit of exam.benefits ?? []) checkSourceReferences(examId, `benefit ${benefit.item}`, benefit.sources, knownSourceIds)
  if ((exam.dataQuality?.gaps ?? []).length === 0 && exam.dataQuality?.confidence !== 'high') {
    warnings.push(`${examId}: confidence below high but no gaps listed`)
  }
}

/** Picks the next official upcoming event, or the latest past one. */
function pickKeyEvent(exam, today) {
  const events = (exam.status?.cycles ?? []).flatMap((cycle) =>
    (cycle.events ?? []).filter((event) => event.date).map((event) => ({ ...event, cycle: cycle.cycle })),
  )
  const upcoming = events.filter((event) => event.date >= today).sort((a, b) => a.date.localeCompare(b.date))
  if (upcoming.length) return { ...upcoming[0], upcoming: true }
  const past = events.sort((a, b) => b.date.localeCompare(a.date))
  return past.length ? { ...past[0], upcoming: false } : null
}

/** Latest recorded vacancy count (newest year with a number), shown on cards as a hook. */
function latestVacancies(exam) {
  const rows = (exam.statistics ?? []).filter((row) => row.vacancies != null)
  const newest = rows.reduce((best, row) => (best && best.year >= row.year ? best : row), null)
  return newest ? { year: newest.year, count: newest.vacancies } : null
}

/** Builds the compact record the directory, filters and tools use. */
function toIndexRecord(exam, today) {
  return {
    id: exam.id,
    name: exam.name,
    abbreviation: exam.abbreviation ?? null,
    profileType: exam.profileType,
    jurisdiction: exam.jurisdiction,
    sector: exam.sector,
    organization: exam.organization,
    department: exam.department ?? null,
    technical: Boolean(exam.technical),
    summary: exam.summary,
    employmentType: exam.employmentType,
    recruitmentMethods: exam.recruitmentMethods ?? [],
    frequency: exam.frequency ?? null,
    status: exam.status?.type,
    statusNote: exam.status?.note ?? '',
    keyEvent: pickKeyEvent(exam, today),
    cycles: (exam.status?.cycles ?? []).map((cycle) => ({ cycle: cycle.cycle, events: cycle.events.filter((event) => event.date).map(({ event, date, dateType }) => ({ event, date, dateType })) })),
    postNames: (exam.posts ?? []).map((post) => post.name),
    eligibilityRules: exam.eligibilityRules,
    posts: (exam.posts ?? []).map(({ name, ageMin, ageMax, education, payLevel, startingBasic }) => ({ name, ageMin, ageMax, education, payLevel, startingBasic })),
    vacancies: latestVacancies(exam),
    stages: (exam.selection?.stages ?? []).map((stage) => ({ name: stage.name, type: stage.type })),
    salary: {
      payRuleSet: exam.salary?.payRuleSet ?? 'other',
      payLevel: exam.salary?.payLevel ?? null,
      startingBasic: exam.salary?.startingBasic ?? null,
      officialGross: exam.salary?.officialGross ?? null,
      fixedAdditions: exam.salary?.fixedAdditions ?? [],
    },
    difficulty: exam.difficulty ?? {},
    difficultyScore: difficultyScore(exam.difficulty, exam.statistics),
    ratings: exam.ratings ?? {},
    risk: exam.risk?.overall ?? null,
    syllabusTags: exam.syllabusTags ?? [],
    cutoffCount: (exam.cutoffs ?? []).length,
    statisticCount: (exam.statistics ?? []).length,
    hasGuide: Boolean(exam.guide?.sections?.length),
    confidence: exam.dataQuality?.confidence ?? 'low',
    sourceCount: (exam.sources ?? []).length,
    lastVerified: exam.lastVerified,
    officialUrl: exam.officialLinks?.[0]?.url ?? exam.organization?.website ?? null,
    // Per variant, only what the checker and the overlap tool need, already merged with the shared fields.
    variants: (exam.variants ?? []).map((variant) => {
      const merged = applyVariant(exam, variant.id)
      return { id: variant.id, name: variant.name, eligibilityRules: merged.eligibilityRules, syllabusTags: merged.syllabusTags ?? [] }
    }),
  }
}

/** Merges sources across profiles by URL so the source directory lists each once. */
function buildSourceIndex(exams) {
  const byUrl = new Map()
  for (const exam of exams) {
    for (const source of exam.sources ?? []) {
      const existing = byUrl.get(source.url) ?? { ...source, id: undefined, usedBy: [] }
      existing.usedBy.push({ id: exam.id, name: exam.abbreviation || exam.name })
      byUrl.set(source.url, existing)
    }
  }
  return [...byUrl.values()].map(({ id: _unused, ...rest }) => rest).sort((a, b) => a.publisher?.localeCompare(b.publisher ?? '') || a.title.localeCompare(b.title))
}

const today = new Date().toISOString().slice(0, 10)
const exams = []
const seenIds = new Set()
for (const filePath of listJsonFiles(examsDirectory)) {
  let exam
  try {
    exam = JSON.parse(readFileSync(filePath, 'utf8'))
  } catch (parseError) {
    problems.push(`${filePath}: invalid JSON (${parseError.message})`)
    continue
  }
  if (seenIds.has(exam.id)) fail(exam.id, 'duplicate id')
  seenIds.add(exam.id)
  validateExam(exam, filePath)
  exams.push(exam)
}

validateMockSets(new Map(exams.map((exam) => [exam.id, exam])))

mkdirSync(generatedDirectory, { recursive: true })
const examIndex = exams.map((exam) => toIndexRecord(exam, today)).sort((a, b) => a.name.localeCompare(b.name))
writeFileSync(join(generatedDirectory, 'exam-index.json'), JSON.stringify(examIndex))
writeFileSync(join(generatedDirectory, 'source-index.json'), JSON.stringify(buildSourceIndex(exams)))

for (const warning of warnings) console.warn(`warn  ${warning}`)
if (problems.length) {
  for (const problem of problems) console.error(`error ${problem}`)
  console.error(`\n${problems.length} problem(s) in ${exams.length} profiles`)
  process.exit(1)
}
console.log(`ok    ${exams.length} profiles validated, indexes written`)
