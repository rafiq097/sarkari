/**
 * Data build script. Validates every exam profile in src/data/exams against
 * docs/DATA_SCHEMA.md and writes the lightweight indexes the UI loads eagerly:
 * src/data/generated/exam-index.json and src/data/generated/source-index.json.
 * Run with `npm run data` (also runs before dev and build).
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, statSync } from 'node:fs'
import { join, basename, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const examsDirectory = join(projectRoot, 'src', 'data', 'exams')
const generatedDirectory = join(projectRoot, 'src', 'data', 'generated')
const vocabulary = JSON.parse(readFileSync(join(projectRoot, 'src', 'data', 'vocabulary.json'), 'utf8'))

const problems = []
const warnings = []

// Accepts YYYY, YYYY-MM or YYYY-MM-DD.
const isoDatePattern = /^\d{4}(-\d{2}(-\d{2})?)?$/
const levelValues = new Set(vocabulary.levels)

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

/** Validates one profile and returns its known source ids. */
function validateExam(exam, filePath) {
  const examId = exam.id ?? basename(filePath)
  if (exam.id !== basename(filePath, '.json')) fail(examId, 'id must equal file name')
  for (const field of ['name', 'summary', 'organization', 'jurisdiction', 'sector', 'profileType', 'employmentType', 'lastVerified']) {
    if (exam[field] == null || exam[field] === '') fail(examId, `missing ${field}`)
  }
  checkEnum(examId, 'jurisdiction', exam.jurisdiction, vocabulary.jurisdictions)
  if (!filePath.includes(join('exams', exam.jurisdiction))) fail(examId, 'file is not in its jurisdiction folder')
  checkEnum(examId, 'sector', exam.sector, vocabulary.sectors)
  checkEnum(examId, 'profileType', exam.profileType, vocabulary.profileTypes)
  checkEnum(examId, 'employmentType', exam.employmentType, vocabulary.employmentTypes)
  for (const method of exam.recruitmentMethods ?? []) checkEnum(examId, 'recruitmentMethods', method, vocabulary.recruitmentMethods)
  for (const tag of exam.syllabusTags ?? []) checkEnum(examId, 'syllabusTags', tag, vocabulary.syllabusTags)
  if (!isoDatePattern.test(exam.lastVerified ?? '')) fail(examId, 'lastVerified must be an ISO date')

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
    stages: (exam.selection?.stages ?? []).map((stage) => ({ name: stage.name, type: stage.type })),
    salary: {
      payRuleSet: exam.salary?.payRuleSet ?? 'other',
      payLevel: exam.salary?.payLevel ?? null,
      startingBasic: exam.salary?.startingBasic ?? null,
      officialGross: exam.salary?.officialGross ?? null,
    },
    difficulty: exam.difficulty ?? {},
    ratings: exam.ratings ?? {},
    risk: exam.risk?.overall ?? null,
    syllabusTags: exam.syllabusTags ?? [],
    cutoffCount: (exam.cutoffs ?? []).length,
    statisticCount: (exam.statistics ?? []).length,
    hasGuide: Boolean(exam.guide?.sections?.length),
    confidence: exam.dataQuality?.confidence ?? 'low',
    sourceCount: (exam.sources ?? []).length,
    lastVerified: exam.lastVerified,
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
