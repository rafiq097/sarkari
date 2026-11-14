/**
 * Syllabus overlap between exams, from their syllabus subject tags. Used by the syllabus
 * overlap page, the plan (prepare-together groups) and the exam page (Exam and syllabus tab).
 * An exam with stream variants takes part once per stream, each with its own tags.
 */
import { examIndex } from './data.js'

/** Shared tags between two tag lists, Jaccard similarity, and how much of the first list is covered. */
export function overlap(baseTags, otherTags) {
  const base = new Set(baseTags)
  const shared = otherTags.filter((tag) => base.has(tag))
  const union = new Set([...baseTags, ...otherTags]).size
  return { shared, similarity: union ? shared.length / union : 0, coverage: base.size ? shared.length / base.size : 0 }
}

/**
 * One entry per exam, or one per stream for exams with variants:
 * { key, exam, variant (or null), label, syllabusTags }. `key` is unique and URL-safe.
 */
function entriesOf(exam) {
  const examLabel = exam.abbreviation || exam.name
  if (!exam.variants?.length) return [{ key: exam.id, exam, variant: null, label: examLabel, syllabusTags: exam.syllabusTags }]
  return exam.variants.map((variant) => ({ key: `${exam.id}~${variant.id}`, exam, variant, label: `${examLabel} (${variant.name})`, syllabusTags: variant.syllabusTags }))
}

/** Every exam or stream that has syllabus tags, as overlap entries. */
export const overlapEntries = examIndex.flatMap(entriesOf).filter((entry) => entry.syllabusTags.length > 0)

/** The overlap entry of an exam; for an exam with variants, of the given (or first) stream. */
export function overlapEntryFor(examId, variantId) {
  const entries = overlapEntries.filter((entry) => entry.exam.id === examId)
  return entries.find((entry) => entry.variant?.id === variantId) ?? entries[0] ?? null
}

/**
 * Current or recurring exams (or streams) sharing the most syllabus with `baseEntry`, best
 * match first. Other streams of the same exam are left out. Each result is an overlap
 * entry plus { shared, similarity, coverage }.
 */
export function companionsFor(baseEntry, { region = '', limit = 15 } = {}) {
  return overlapEntries
    .filter((entry) => entry.exam.id !== baseEntry.exam.id && entry.exam.status !== 'historical' && (!region || entry.exam.jurisdiction === region))
    .map((entry) => ({ ...entry, ...overlap(baseEntry.syllabusTags, entry.syllabusTags) }))
    .filter((entry) => entry.shared.length > 0)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
}
