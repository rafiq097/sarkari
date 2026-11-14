/**
 * Notice watcher, run daily by .github/workflows/notice-watch.yaml. Fetches every
 * official link (officialLinks) of every exam profile, reduces each page to its main
 * text, hashes it and compares it with the hash stored in notice-watch/hashes.json.
 * When a page changed it opens one GitHub Issue per exam with the URL and a short text
 * diff (never a duplicate while one is open). Failed fetches never fail the run; they
 * are listed in one summary issue. It never edits exam data: a person reads the issue
 * and updates the profile by hand.
 *
 * Without GITHUB_TOKEN and GITHUB_REPOSITORY (a local run) it only prints what it
 * would report. Pass --limit=N to check just the first N pages while testing.
 */
import { createHash } from 'node:crypto'
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const examsDirectory = join(projectRoot, 'src', 'data', 'exams')
const stateDirectory = join(projectRoot, 'notice-watch')
const hashFilePath = join(stateDirectory, 'hashes.json')
const snapshotDirectory = join(stateDirectory, 'snapshots')

// Government sites can be slow; give up on one page after this long.
const fetchTimeoutMilliseconds = 30000
// Pages fetched at the same time. Kept low to be polite to small government servers.
const concurrentFetches = 4
// A snapshot keeps at most this many text lines, which bounds the repository size.
const maximumSnapshotLines = 1500
// Each side of the diff in an issue shows at most this many lines.
const maximumDiffLines = 15
// Diff lines are cut to this many characters so one long paragraph cannot flood an issue.
const maximumDiffLineLength = 240
const changeLabel = 'notice-watch'
const failureLabel = 'notice-watch-failures'
const failureIssueTitle = 'Notice watcher: pages that could not be fetched'
const githubApi = 'https://api.github.com'

// Whole elements that are never part of the notice content.
const droppedElementPattern = /<(script|style|noscript|svg|nav|header|footer|aside|form|iframe|select)\b[\s\S]*?<\/\1>/gi
// Lines that change on every visit without the notice changing (counters, stamps, footers).
const volatileLinePattern = /last (updated|modified|reviewed)|visitor|page (views|hits)|copyright|\u00a9|all rights reserved|^\d[\d\s:\/.,-]*$/i
const namedEntities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }

/** Lists every JSON file under a directory, recursively. */
function listJsonFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const fullPath = join(directory, entry)
    if (statSync(fullPath).isDirectory()) return listJsonFiles(fullPath)
    return entry.endsWith('.json') ? [fullPath] : []
  })
}

/** Official URLs to watch, each with the exams that list it: Map(url -> [{ id, name }]). */
function watchedUrls() {
  const examsByUrl = new Map()
  for (const filePath of listJsonFiles(examsDirectory)) {
    const exam = JSON.parse(readFileSync(filePath, 'utf8'))
    for (const link of exam.officialLinks ?? []) {
      examsByUrl.set(link.url, [...(examsByUrl.get(link.url) ?? []), { id: exam.id, name: exam.abbreviation || exam.name }])
    }
  }
  return examsByUrl
}

/** Replaces the few HTML entities that matter for plain text. */
function decodeEntities(text) {
  return text
    .replace(/&#(\d+);/g, (match, code) => String.fromCodePoint(Number(code)))
    .replace(/&([a-z]+);/gi, (match, name) => namedEntities[name.toLowerCase()] ?? ' ')
}

/**
 * Reduces an HTML page to the text lines of its main content: scripts, styles,
 * navigation, headers, footers and forms are dropped, then tags are removed and
 * volatile lines (dates on their own, visitor counters, copyright) are filtered out.
 */
export function extractMainLines(html) {
  const withoutComments = html.replace(/<!--[\s\S]*?-->/g, ' ')
  // Prefer the page's own <main> or <article> block when it has one.
  const mainBlock = withoutComments.match(/<(main|article)\b[\s\S]*<\/\1>/i)?.[0]
  const mainLines = mainBlock ? textLines(mainBlock) : []
  // Some sites leave <main> empty and fill it with JavaScript; then read the whole page.
  return mainLines.length ? mainLines : textLines(withoutComments)
}

/** Text lines of an HTML fragment, with boilerplate elements and volatile lines removed. */
function textLines(htmlFragment) {
  const text = decodeEntities(
    htmlFragment
      .replace(droppedElementPattern, ' ')
      // Block-level tags end a line; every other tag just disappears.
      .replace(/<\/?(p|div|li|tr|br|h[1-6]|section|table|ul|ol|td|th)\b[^>]*>/gi, '\n')
      .replace(/<[^>]+>/g, ' '),
  )
  return text
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter((line) => line && !volatileLinePattern.test(line))
    .slice(0, maximumSnapshotLines)
}

/** SHA-256 of text or bytes as a hex string. */
function sha256(content) {
  return createHash('sha256').update(content).digest('hex')
}

/** File-safe name for a URL's snapshot: readable start plus a short hash to stay unique. */
function snapshotName(url) {
  const readable = url.replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/gi, '-').slice(0, 60)
  return `${readable}-${sha256(url).slice(0, 8)}.txt`
}

/**
 * Fetches one URL. Returns { hash, lines } on success (lines is null for PDFs and
 * other non-HTML files, which are hashed as raw bytes) or { error } with a short reason.
 */
async function fetchPage(url) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(fetchTimeoutMilliseconds), redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 (compatible; notice-watcher)', accept: 'text/html,application/pdf,*/*' } })
    if (!response.ok) return { error: `HTTP ${response.status}` }
    const isHtml = (response.headers.get('content-type') ?? '').includes('html')
    if (!isHtml) return { hash: sha256(Buffer.from(await response.arrayBuffer())), lines: null }
    const lines = extractMainLines(await response.text())
    // No text at all means the page is drawn by JavaScript; a hash of nothing would never change.
    if (!lines.length) return { error: 'no readable text (the page needs JavaScript)' }
    return { hash: sha256(lines.join('\n')), lines }
  } catch (fetchError) {
    return { error: fetchError.name === 'TimeoutError' ? `timed out after ${fetchTimeoutMilliseconds / 1000}s` : (fetchError.cause?.code ?? fetchError.message) }
  }
}

/** Runs an async task over items with a fixed number of workers; results keep item order. */
async function mapWithLimit(items, limit, task) {
  const results = new Array(items.length)
  let nextIndex = 0
  const worker = async () => {
    while (nextIndex < items.length) {
      const index = nextIndex
      nextIndex += 1
      results[index] = await task(items[index])
    }
  }
  await Promise.all(Array.from({ length: limit }, worker))
  return results
}

/** Short text diff as Markdown: lines only in the new page, then lines only in the old one. */
export function shortDiff(oldLines, newLines) {
  if (!oldLines || !newLines) return 'The file is not an HTML page (for example a PDF), so only the fact that it changed is known.'
  const oldSet = new Set(oldLines)
  const newSet = new Set(newLines)
  const added = newLines.filter((line) => !oldSet.has(line))
  const removed = oldLines.filter((line) => !newSet.has(line))
  const block = (marker, lines) => lines.slice(0, maximumDiffLines).map((line) => `${marker} ${line.slice(0, maximumDiffLineLength)}`)
  const more = (lines) => (lines.length > maximumDiffLines ? [`  ... and ${lines.length - maximumDiffLines} more`] : [])
  const body = [...block('+', added), ...more(added), ...block('-', removed), ...more(removed)]
  return body.length ? ['```diff', ...body, '```'].join('\n') : 'Only the order or spacing of the text changed.'
}

/** Reads the stored hashes ({ url: hash }); empty on the first run. */
function readHashes() {
  return existsSync(hashFilePath) ? JSON.parse(readFileSync(hashFilePath, 'utf8')) : {}
}

/** Reads the stored text lines of a URL, or null when there is no snapshot. */
function readSnapshot(url) {
  const snapshotPath = join(snapshotDirectory, snapshotName(url))
  return existsSync(snapshotPath) ? readFileSync(snapshotPath, 'utf8').split('\n') : null
}

/** Calls the GitHub REST API for this repository; returns parsed JSON or throws. */
async function github(method, path, body) {
  const response = await fetch(`${githubApi}/repos/${process.env.GITHUB_REPOSITORY}${path}`, {
    method,
    headers: { authorization: `Bearer ${process.env.GITHUB_TOKEN}`, accept: 'application/vnd.github+json', 'x-github-api-version': '2022-11-28' },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!response.ok) throw new Error(`GitHub ${method} ${path}: HTTP ${response.status}`)
  return response.json()
}

/** Open issues carrying a label (first 100, far more than this watcher ever keeps open). */
function openIssues(label) {
  return github('GET', `/issues?state=open&labels=${label}&per_page=100`)
}

/** Title of the change issue of one exam. Also the key used to avoid duplicates. */
function changeIssueTitle(exam) {
  return `Official notice page changed: ${exam.name} (${exam.id})`
}

/** Opens one issue per exam with changed pages, skipping exams that already have one open. */
async function reportChanges(changesByExam, canUseGithub) {
  const openTitles = canUseGithub ? new Set((await openIssues(changeLabel)).map((issue) => issue.title)) : new Set()
  for (const { exam, changes } of changesByExam.values()) {
    const title = changeIssueTitle(exam)
    const sections = changes.map((change) => `### ${change.url}\n\n${change.diff}`)
    const body = [`The official page(s) for **${exam.name}** changed since the last check.`, ...sections, `Check the notice and update \`${exam.id}.json\` by hand if needed. This watcher never edits exam data.`].join('\n\n')
    if (openTitles.has(title)) console.log(`skip  ${exam.id}: an issue is already open`)
    else if (canUseGithub) await github('POST', '/issues', { title, body, labels: [changeLabel] })
    else console.log(`would open issue: ${title}\n${body}\n`)
  }
}

/** Writes all fetch failures into the single summary issue (created once, then updated). */
async function reportFailures(failures, canUseGithub) {
  if (!failures.length) return
  const rows = failures.map((failure) => `| ${failure.url} | ${failure.error} | ${failure.exams.map((exam) => exam.id).join(', ')} |`)
  const body = [`${failures.length} page(s) could not be fetched in the latest run. Their stored hashes were left unchanged.`, '', '| URL | Problem | Exams |', '|---|---|---|', ...rows].join('\n')
  if (!canUseGithub) return console.log(`would report failures:\n${body}\n`)
  const existing = (await openIssues(failureLabel)).find((issue) => issue.title === failureIssueTitle)
  if (existing) await github('PATCH', `/issues/${existing.number}`, { body })
  else await github('POST', '/issues', { title: failureIssueTitle, body, labels: [failureLabel] })
}

/** Groups changed URLs by exam: Map(examId -> { exam, changes: [{ url, diff }] }). */
function groupChangesByExam(changedPages) {
  const changesByExam = new Map()
  for (const page of changedPages) {
    for (const exam of page.exams) {
      const entry = changesByExam.get(exam.id) ?? { exam, changes: [] }
      entry.changes.push({ url: page.url, diff: page.diff })
      changesByExam.set(exam.id, entry)
    }
  }
  return changesByExam
}

/** Fetches every watched page and sorts the results into changed, failed and new hashes. */
async function checkPages(pages, storedHashes) {
  const results = await mapWithLimit(pages, concurrentFetches, async ([url, exams]) => ({ url, exams, ...(await fetchPage(url)) }))
  const nextHashes = { ...storedHashes }
  const changedPages = []
  const failures = results.filter((result) => result.error)
  for (const result of results.filter((entry) => !entry.error)) {
    const previousHash = storedHashes[result.url]
    // A page seen for the first time only sets the baseline; nothing has "changed" yet.
    if (previousHash && previousHash !== result.hash) changedPages.push({ ...result, diff: shortDiff(readSnapshot(result.url), result.lines) })
    nextHashes[result.url] = result.hash
    if (result.lines) writeFileSync(join(snapshotDirectory, snapshotName(result.url)), result.lines.join('\n'))
  }
  return { nextHashes, changedPages, failures, checkedCount: results.length }
}

/** Entry point. */
async function main() {
  const limitArgument = process.argv.find((argument) => argument.startsWith('--limit='))
  const allPages = [...watchedUrls().entries()]
  const pages = limitArgument ? allPages.slice(0, Number(limitArgument.split('=')[1])) : allPages
  const canUseGithub = Boolean(process.env.GITHUB_TOKEN && process.env.GITHUB_REPOSITORY)
  mkdirSync(snapshotDirectory, { recursive: true })

  const { nextHashes, changedPages, failures, checkedCount } = await checkPages(pages, readHashes())
  // Sorted keys keep the committed file stable from run to run.
  writeFileSync(hashFilePath, `${JSON.stringify(Object.fromEntries(Object.entries(nextHashes).sort(([a], [b]) => a.localeCompare(b))), null, 2)}\n`)

  // Reporting problems (for example a GitHub outage) must not lose the hashes written above.
  try {
    await reportChanges(groupChangesByExam(changedPages), canUseGithub)
    await reportFailures(failures, canUseGithub)
  } catch (reportError) {
    console.error(`warn  could not report to GitHub: ${reportError.message}`)
  }
  console.log(`ok    ${checkedCount} pages checked, ${changedPages.length} changed, ${failures.length} failed`)
}

// Run only when started directly, so tests can import the pure helpers above.
if (process.argv[1] && fileURLToPath(import.meta.url) === join(process.argv[1])) await main()
