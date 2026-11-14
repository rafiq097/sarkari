/**
 * Mock test logic with no React in it: turns an exam's `pattern` block and a list of
 * questions into a test plan (sections, marks, negative marking, time), and scores a
 * finished attempt. Used by pages/MockTestPage.jsx and the components in components/mock/.
 * Values the pattern does not record (null) fall back to plain defaults, and the plan
 * says which defaults were used so the page can tell the reader.
 */

const secondsPerMinute = 60
// A scaled-down section never gets less time than this, so a short sample set is still usable.
const minimumSectionSeconds = 60
// Used when the pattern does not record marks per question.
const defaultMarksPerQuestion = 1

/**
 * Time for a section in seconds, or null when the pattern has no duration. When the set
 * has fewer questions than the real paper, the time is scaled down in proportion.
 */
function sectionSeconds(patternSection, availableCount) {
  if (patternSection.minutes == null) return null
  const fullSeconds = patternSection.minutes * secondsPerMinute
  if (!patternSection.questions || availableCount >= patternSection.questions) return fullSeconds
  return Math.max(minimumSectionSeconds, Math.round((fullSeconds * availableCount) / patternSection.questions))
}

/** One section of the plan: its questions plus the marking and timing rules to apply. */
function planSection(patternSection, questions) {
  const hasKnownMarks = Boolean(patternSection.marks && patternSection.questions)
  const marksPerQuestion = hasKnownMarks ? patternSection.marks / patternSection.questions : defaultMarksPerQuestion
  return {
    id: patternSection.id,
    name: patternSection.name,
    questions,
    marksPerQuestion,
    // Negative marking is a fraction of the question's marks; unknown means none is applied.
    negativePerQuestion: (patternSection.negativeFraction ?? 0) * marksPerQuestion,
    seconds: sectionSeconds(patternSection, questions.length),
    realQuestionCount: patternSection.questions,
    realMinutes: patternSection.minutes,
    usesAssumedMarks: !hasKnownMarks,
    hasUnknownNegative: patternSection.negativeFraction == null,
  }
}

/**
 * Builds the test plan. Sections with no questions in the set are left out.
 * - isLocked: sections run in order, each on its own timer, with no going back.
 * - totalSeconds: one timer for the whole test (free switching), or null when untimed.
 */
export function buildTestPlan(pattern, questions) {
  const sections = pattern.sections
    .map((patternSection) => planSection(patternSection, questions.filter((question) => question.section === patternSection.id)))
    .filter((section) => section.questions.length > 0)
  const isLocked = pattern.sectionSwitching === 'locked' && sections.length > 1
  const isTimed = sections.every((section) => section.seconds != null)
  return {
    sections,
    isLocked,
    isTimed,
    totalSeconds: isTimed ? sections.reduce((total, section) => total + section.seconds, 0) : null,
    questionCount: sections.reduce((total, section) => total + section.questions.length, 0),
  }
}

/** Rounds a score to two decimals so negative-marking fractions do not show long tails. */
function roundScore(value) {
  return Math.round(value * 100) / 100
}

/** Result of one section: counts, score, accuracy and time. */
function scoreSection(section, answers, secondsByQuestion) {
  const answered = section.questions.filter((question) => answers[question.id] != null)
  const correctCount = answered.filter((question) => answers[question.id] === question.answer).length
  const wrongCount = answered.length - correctCount
  return {
    id: section.id,
    name: section.name,
    questionCount: section.questions.length,
    correctCount,
    wrongCount,
    skippedCount: section.questions.length - answered.length,
    score: roundScore(correctCount * section.marksPerQuestion - wrongCount * section.negativePerQuestion),
    negativeMarks: roundScore(wrongCount * section.negativePerQuestion),
    maximumScore: roundScore(section.questions.length * section.marksPerQuestion),
    // Accuracy is correct answers out of attempted ones; null when nothing was attempted.
    accuracy: answered.length ? correctCount / answered.length : null,
    seconds: section.questions.reduce((total, question) => total + (secondsByQuestion[question.id] ?? 0), 0),
  }
}

/**
 * Scores a finished attempt. `answers` maps question id to the chosen option index;
 * `secondsByQuestion` maps question id to seconds spent on it.
 * Returns totals plus one result per section.
 */
export function scoreAttempt(plan, answers, secondsByQuestion) {
  const sections = plan.sections.map((section) => scoreSection(section, answers, secondsByQuestion))
  const sum = (key) => roundScore(sections.reduce((total, section) => total + section[key], 0))
  const attemptedCount = sum('correctCount') + sum('wrongCount')
  return {
    sections,
    score: sum('score'),
    maximumScore: sum('maximumScore'),
    negativeMarks: sum('negativeMarks'),
    correctCount: sum('correctCount'),
    wrongCount: sum('wrongCount'),
    skippedCount: sum('skippedCount'),
    accuracy: attemptedCount ? sum('correctCount') / attemptedCount : null,
    seconds: sum('seconds'),
  }
}

/** Formats seconds as "m:ss", or "h:mm:ss" from one hour up. */
export function formatClock(totalSeconds) {
  const safeSeconds = Math.max(0, Math.round(totalSeconds))
  const hours = Math.floor(safeSeconds / 3600)
  const minutes = Math.floor((safeSeconds % 3600) / secondsPerMinute)
  const seconds = String(safeSeconds % secondsPerMinute).padStart(2, '0')
  return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${seconds}` : `${minutes}:${seconds}`
}
