/**
 * Vite plugin that writes the subscribable calendar feeds into the build output under
 * /feeds/: one .ics file per exam and one per group (government, minimum qualification).
 * The files are static, so GitHub Pages can serve them to Google and Apple Calendar.
 * Registered in vite.config.js. The format checks live in scripts/check-feeds.mjs.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildCalendar, buildExamCalendar, examCalendarEvents } from '../src/lib/ics.js'
import { examFeedPath, groupFeeds } from '../src/lib/feeds.js'

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const examsDirectory = join(projectRoot, 'src', 'data', 'exams')

/** Lists every JSON file under a directory, recursively. */
function listJsonFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const fullPath = join(directory, entry)
    if (statSync(fullPath).isDirectory()) return listJsonFiles(fullPath)
    return entry.endsWith('.json') ? [fullPath] : []
  })
}

/** Every feed as { path, text }: per-exam feeds first, then the group feeds. */
export function buildAllFeeds(generatedAt = new Date()) {
  const vocabulary = JSON.parse(readFileSync(join(projectRoot, 'src', 'data', 'vocabulary.json'), 'utf8'))
  const exams = listJsonFiles(examsDirectory).map((filePath) => JSON.parse(readFileSync(filePath, 'utf8')))
  const examsById = new Map(exams.map((exam) => [exam.id, exam]))
  const examFeeds = exams.map((exam) => ({ path: examFeedPath(exam.id), text: buildExamCalendar(exam, generatedAt) }))
  const groups = groupFeeds(exams, vocabulary).map((feed) => ({
    path: feed.path,
    text: buildCalendar({
      name: feed.name,
      description: `${feed.description} Confirm every date on the official website.`,
      events: feed.examIds.flatMap((examId) => examCalendarEvents(examsById.get(examId))),
      generatedAt,
    }),
  }))
  return [...examFeeds, ...groups]
}

/** The Vite plugin: emits every feed as a static asset during `vite build`. */
export function calendarFeeds() {
  return {
    name: 'calendar-feeds',
    apply: 'build',
    generateBundle() {
      for (const feed of buildAllFeeds()) this.emitFile({ type: 'asset', fileName: feed.path, source: feed.text })
    },
  }
}
