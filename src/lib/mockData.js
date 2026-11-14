/**
 * Mock test question sets and saved attempts. Question sets are JSON files in
 * src/data/mocks/<examId>/ and are loaded only when a mock test is opened. Attempts
 * are kept in this browser's localStorage. Used by the exam page (to decide whether to
 * show the "Mock test" entry) and by pages/MockTestPage.jsx.
 */

// Vite turns each question set into its own lazily loaded chunk.
const setLoaders = import.meta.glob('../data/mocks/*/*.json', { import: 'default' })

// Exam ids that have at least one question set (the folder name is the exam id).
const examIdsWithSets = new Set(Object.keys(setLoaders).map((path) => path.split('/').at(-2)))

const attemptsStorageKey = 'gov-exam-portal:mock-attempts:v1'
// Only the most recent attempts are kept so storage never grows without limit.
const maximumStoredAttempts = 60

/** True when an exam has question sets, so the "Mock test" entry may be shown. */
export function hasMockSets(examId) {
  return examIdsWithSets.has(examId)
}

/**
 * Loads the questions for an exam (and stream, when the exam has variants). Verified
 * sets replace the sample set as soon as one exists; until then the sample set is used.
 * Returns { questions, isSample }.
 */
export async function loadMockQuestions(examId, variantId) {
  const paths = Object.keys(setLoaders).filter((path) => path.split('/').at(-2) === examId)
  const loadedSets = await Promise.all(paths.map((path) => setLoaders[path]()))
  const matchingSets = loadedSets.filter((mockSet) => !mockSet.variant || mockSet.variant === variantId)
  const realSets = matchingSets.filter((mockSet) => !mockSet.isSample)
  const usedSets = realSets.length ? realSets : matchingSets
  return { questions: usedSets.flatMap((mockSet) => mockSet.questions), isSample: realSets.length === 0 }
}

/** All saved attempts, newest first; empty when storage is blocked or damaged. */
function readAttempts() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(attemptsStorageKey) ?? '[]')
    return Array.isArray(stored) ? stored : []
  } catch {
    return []
  }
}

/** Saved attempts for one exam and stream, newest first. */
export function attemptsFor(examId, variantId) {
  return readAttempts().filter((attempt) => attempt.examId === examId && (attempt.variantId ?? null) === (variantId ?? null))
}

/** Saves one attempt summary; storage errors are ignored (the result still shows on screen). */
export function saveAttempt(attempt) {
  try {
    window.localStorage.setItem(attemptsStorageKey, JSON.stringify([attempt, ...readAttempts()].slice(0, maximumStoredAttempts)))
  } catch {
    // Storage unavailable: the attempt is simply not remembered.
  }
}
