/**
 * Keyword search over the exam index. Scores matches on abbreviation, name,
 * organization, posts, department, sector and summary. Used by the header search,
 * home hero suggestions and the directory.
 */
import { examIndex, vocabulary } from './data.js'

/** Lowercases and strips punctuation so "SSC-CGL" matches "ssc cgl". */
function normalise(text) {
  return String(text ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Field weights: an abbreviation hit matters more than a summary hit.
const weightedFields = [
  [(record) => record.abbreviation, 8],
  [(record) => record.name, 6],
  [(record) => `${record.organization?.abbreviation ?? ''} ${record.organization?.name ?? ''}`, 5],
  [(record) => record.postNames.join(' '), 4],
  [(record) => record.department, 3],
  [(record) => vocabulary.sectors[record.sector], 2],
  [(record) => vocabulary.jurisdictions[record.jurisdiction], 2],
  [(record) => record.summary, 1],
]

const searchableRecords = examIndex.map((record) => ({
  record,
  fields: weightedFields.map(([pick, weight]) => [normalise(pick(record)), weight]),
}))

/** Scores one record for a list of query words; 0 means at least one word missed. */
function scoreRecord(fields, queryWords) {
  let total = 0
  for (const word of queryWords) {
    let best = 0
    for (const [text, weight] of fields) {
      if (!text.includes(word)) continue
      // Whole-word or prefix hits beat mid-word hits.
      const isWordStart = text.startsWith(word) || text.includes(` ${word}`)
      best = Math.max(best, weight * (isWordStart ? 2 : 1))
    }
    if (best === 0) return 0
    total += best
  }
  return total
}

/** Returns index records matching the query, best first. Empty query returns all. */
export function searchExams(query, records = null) {
  const queryWords = normalise(query).split(' ').filter(Boolean)
  const allowedIds = records ? new Set(records.map((record) => record.id)) : null
  const pool = allowedIds ? searchableRecords.filter((entry) => allowedIds.has(entry.record.id)) : searchableRecords
  if (!queryWords.length) return pool.map((entry) => entry.record)
  return pool
    .map((entry) => ({ record: entry.record, score: scoreRecord(entry.fields, queryWords) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.record)
}
