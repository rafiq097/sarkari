/**
 * Profile generator used while authoring research data. Takes a batch module that
 * exports an array of compact exam specs and writes full profiles that follow
 * docs/DATA_SCHEMA.md. It only adds structure and shared, verified boilerplate
 * (pay matrix source, central reservation and relaxation text, standard benefits);
 * every exam-specific fact must come from the spec.
 * Usage: node scripts/authoring/make-profile.mjs scripts/authoring/batches/<batch>.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const researchDate = '2026-10-18'

// Shared sources referenced by many profiles.
const sharedSources = {
  payMatrix: { title: '7th CPC pay matrix', url: 'https://doe.gov.in/pay-commission-matrix', publisher: 'Department of Expenditure, Ministry of Finance', year: 2016, type: 'primary' },
  defencePay: { title: 'CDS (II) 2026 notification: armed forces officer pay table and MSP', url: 'https://www.upsc.gov.in/sites/default/files/Notif-CDS-II-2026-Engl-200526.pdf', publisher: 'Union Public Service Commission', year: 2026, type: 'primary' },
  sscCalendar: { title: 'SSC tentative calendar of examinations 2026-27 (released 8 Jan 2026)', url: 'https://news.careers360.com/ssc-exam-calendar-2026-cgle-junior-engineer-selection-post-phase-14-chsl-stenographer-mts-havaldar-notification-schedule/amp', publisher: 'Careers360 (reports the SSC calendar)', year: 2026, type: 'secondary' },
  upscCalendar2027: { title: 'UPSC Annual Calendar 2027', url: 'https://upsc.gov.in/content/annual-calendar-2027-0', publisher: 'Union Public Service Commission', year: 2026, type: 'primary' },
}

const centralRelaxations = [
  { category: 'SC / ST', years: 5 },
  { category: 'OBC', years: 3 },
  { category: 'PwBD (unreserved / OBC / SC-ST)', years: 10, note: '10, 13 and 15 years respectively.' },
  { category: 'Ex-servicemen', years: 3, note: 'After deducting military service from actual age, as per notice.' },
]

const centralReservation = 'Central reservation: SC 15%, ST 7.5%, OBC (non-creamy layer) 27%, EWS 10%, plus horizontal reservation for PwBD and ex-servicemen as per rules.'

/** Turns [id, title, url, publisher, year, type] tuples or shared keys into source objects. */
function buildSources(spec) {
  const sources = (spec.sources ?? []).map(([id, title, url, publisher, year, type = 'primary']) => ({ id, title, url, publisher, year, type, accessed: researchDate }))
  for (const key of spec.sharedSources ?? []) {
    sources.push({ id: key, ...sharedSources[key], accessed: researchDate })
  }
  return sources
}

/** Expands one compact spec into a full profile. */
function expand(spec) {
  const usesCentralRules = spec.central !== false && spec.jurisdiction === 'central'
  const eligibility = {
    ...spec.eligibility,
    age: { relaxations: usesCentralRules && spec.centralRelaxation !== false ? centralRelaxations : [], ...spec.eligibility.age },
    reservation: spec.eligibility.reservation ?? (usesCentralRules ? centralReservation : null),
    sources: spec.eligibility.sources ?? ['s1'],
  }
  const relaxationYears = spec.eligibilityRules.relaxationYears ?? (usesCentralRules && spec.centralRelaxation !== false ? { OBC: 3, SC: 5, ST: 5, EWS: 0, PwBD: 10 } : { OBC: 0, SC: 0, ST: 0, EWS: 0, PwBD: 0 })
  const payRuleSet = spec.salary?.payRuleSet ?? 'other'
  const salarySources = spec.salary?.sources ?? (payRuleSet === 'central-7cpc' ? ['payMatrix'] : payRuleSet === 'defence-7cpc' ? ['defencePay'] : ['s1'])
  const sharedKeys = new Set(spec.sharedSources ?? [])
  for (const id of salarySources) if (sharedSources[id]) sharedKeys.add(id)
  const specWithShared = { ...spec, sharedSources: [...sharedKeys] }

  return {
    id: spec.id,
    name: spec.name,
    abbreviation: spec.abbreviation ?? null,
    profileType: spec.profileType ?? 'exam',
    jurisdiction: spec.jurisdiction,
    sector: spec.sector,
    organization: spec.organization,
    department: spec.department ?? null,
    technical: Boolean(spec.technical),
    summary: spec.summary,
    employmentType: spec.employmentType ?? 'permanent',
    recruitmentMethods: spec.recruitmentMethods,
    frequency: spec.frequency ?? null,
    officialLinks: spec.officialLinks ?? [],
    status: spec.status,
    posts: spec.posts ?? [],
    eligibility,
    eligibilityRules: { ageReferenceDate: null, finalYearAllowed: false, gender: 'any', domicile: null, educationFields: ['any'], notes: '', ...spec.eligibilityRules, relaxationYears },
    selection: { sources: ['s1'], ...spec.selection },
    syllabus: { sources: ['s1'], supplementary: [], ...spec.syllabus },
    syllabusTags: spec.syllabusTags ?? [],
    cutoffs: spec.cutoffs ?? [],
    statistics: spec.statistics ?? [],
    rankAndAllocation: spec.rankAndAllocation ? { sources: ['s1'], ...spec.rankAndAllocation } : null,
    salary: { asOf: '2026-10', ...spec.salary, payRuleSet, sources: salarySources },
    career: { sources: salarySources, ...spec.career },
    benefits: spec.benefits ?? (usesCentralRules && payRuleSet === 'central-7cpc' ? [{ item: 'Central government benefits', detail: 'CGHS where available, LTC, earned and half-pay leave, HRA or government quarters, NPS with the UPS option.', conditional: false, sources: ['payMatrix'] }] : []),
    workLife: { sources: ['s1'], ...spec.workLife },
    difficulty: spec.difficulty,
    ratings: spec.ratings,
    risk: spec.risk,
    ...(spec.guide ? { guide: { sources: ['s1'], ...spec.guide } } : {}),
    sources: buildSources(specWithShared),
    dataQuality: spec.dataQuality,
    lastVerified: researchDate,
  }
}

const batchPath = resolve(process.argv[2])
const { default: specs } = await import(pathToFileURL(batchPath).href)
for (const spec of specs) {
  const profile = expand(spec)
  const directory = join(projectRoot, 'src', 'data', 'exams', spec.jurisdiction)
  mkdirSync(directory, { recursive: true })
  writeFileSync(join(directory, `${spec.id}.json`), `${JSON.stringify(profile, null, 2)}\n`)
  console.log(`wrote ${spec.jurisdiction}/${spec.id}.json`)
}
