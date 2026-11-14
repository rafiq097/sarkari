/**
 * Data build script. Validates every exam profile in src/data/exams against
 * docs/DATA_SCHEMA.md and writes the lightweight indexes the UI loads eagerly:
 * src/data/generated/exam-index.json and src/data/generated/source-index.json.
 * Run with `npm run data` (also runs before dev and build).
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, statSync } from 'node:fs'
import { join, basename, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { difficultyScore } from '../src/lib/difficulty.js'
import { applyVariant, variantOverrideKeys } from '../src/lib/variants.js'

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const examsDirectory = join(projectRoot, 'src', 'data', 'exams')
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
