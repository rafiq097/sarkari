/**
 * Syllabus overlap between exams, from their syllabus subject tags. Used by the syllabus
 * overlap page, the plan (prepare-together groups) and the exam page Quick look.
 */
import { examIndex } from './data.js'

/** Shared tags between two tag lists, Jaccard similarity, and how much of the first list is covered. */
export function overlap(baseTags, otherTags) {
  const base = new Set(baseTags)
  const shared = otherTags.filter((tag) => base.has(tag))
  const union = new Set([...baseTags, ...otherTags]).size
  return { shared, similarity: union ? shared.length / union : 0, coverage: base.size ? shared.length / base.size : 0 }
}

/** Current or recurring exams sharing the most syllabus with `baseExam`, best match first. */
export function companionsFor(baseExam, { region = '', limit = 15 } = {}) {
  return examIndex
    .filter((exam) => exam.id !== baseExam.id && exam.status !== 'historical' && exam.syllabusTags.length > 0 && (!region || exam.jurisdiction === region))
    .map((exam) => ({ exam, ...overlap(baseExam.syllabusTags, exam.syllabusTags) }))
    .filter((entry) => entry.shared.length > 0)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
}
