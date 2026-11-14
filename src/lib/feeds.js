/**
 * The list of subscribable calendar feeds: one per exam plus group feeds (by government
 * and by minimum qualification). Shared by the build step that writes the files
 * (scripts/calendar-feeds.mjs) and the Subscribe page that links to them, so both
 * always agree on file names. Plain JavaScript: no browser or Vite features.
 */

// Folder inside the build output that holds every feed.
export const feedsFolder = 'feeds'

/** File path (inside the site) of the feed for one exam. */
export function examFeedPath(examId) {
  return `${feedsFolder}/${examId}.ics`
}

/**
 * Group feeds for a list of exams (index records or full profiles). `labels` maps
 * jurisdiction and education keys to display names (the vocabulary file).
 * Returns [{ path, name, description, examIds }], skipping groups with no exams.
 */
export function groupFeeds(exams, labels) {
  const currentExams = exams.filter((exam) => (exam.status?.type ?? exam.status) !== 'historical')
  const byJurisdiction = Object.entries(labels.jurisdictions).map(([key, label]) => ({
    path: `${feedsFolder}/${key}.ics`,
    name: `${label} exams`,
    description: `Official dates and expected yearly windows for ${label} recruitment.`,
    examIds: currentExams.filter((exam) => exam.jurisdiction === key).map((exam) => exam.id),
  }))
  const byQualification = labels.educationLevelOrder.map((key) => ({
    path: `${feedsFolder}/qualification-${key}.ics`,
    name: `${labels.educationLevels[key]} exams`,
    description: `Exams whose minimum qualification is: ${labels.educationLevels[key]}.`,
    examIds: currentExams.filter((exam) => exam.eligibilityRules?.minEducation === key).map((exam) => exam.id),
  }))
  return [...byJurisdiction, ...byQualification].filter((feed) => feed.examIds.length > 0)
}
