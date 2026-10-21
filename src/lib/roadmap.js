/**
 * Builds the step-by-step selection roadmap shown on exam profiles (ExamRoadmap.jsx)
 * from data every profile already has: selection stages and papers, the official
 * timeline, merit rules, and rank allocation and joining notes. An official date appears
 * only when a timeline event clearly names that stage; the month-after-notification figures
 * are labelled estimates from typical gaps between stage types.
 */

// Plain names for each stage type, used on chips and in the step detail.
export const stageTypeLabels = {
  objective: 'Objective (MCQ)',
  descriptive: 'Descriptive / written',
  interview: 'Interview',
  skill: 'Skill test',
  physical: 'Physical test',
  medical: 'Medical exam',
  document: 'Document verification',
  ssb: 'SSB interview',
  merit: 'Merit list',
}

// Words that tie a timeline event to a stage. Each key must appear in both texts.
const stageKeyPatterns = [
  ['prelim', /\bprelim/i],
  ['main', /\bmains?\b/i],
  ['interview', /\binterview|personality test/i],
  ['physical', /\bphysical|\bPET\b|\bPST\b|\bPMT\b/i],
  ['medical', /\bmedical/i],
  ['document', /\bdocument|certificate verification/i],
  ['skill', /\bskill test|\btyping/i],
  ['ssb', /\bSSB\b/i],
]

// Roman or plain numerals after Tier / Phase / Stage, for example "Tier II" or "Phase 1".
const numberedStagePattern = /\b(tier|phase|stage)[\s-]*(iii|ii|i|iv|[1-4])\b/i
const romanToNumber = { i: 1, ii: 2, iii: 3, iv: 4 }

// Timeline events that mark the final result.
const finalResultPattern = /final (result|merit|select)/i

/** Matching keys found in a stage name or event text, such as "prelim" or "tier-2". */
function matchKeys(text) {
  const keys = new Set(stageKeyPatterns.filter(([, pattern]) => pattern.test(text)).map(([key]) => key))
  const numbered = text.match(numberedStagePattern)
  if (numbered) {
    const numeral = numbered[2].toLowerCase()
    keys.add(`${numbered[1].toLowerCase()}-${romanToNumber[numeral] ?? numeral}`)
  }
  return keys
}

/** Every dated official event across cycles, newest first. */
function datedEvents(exam) {
  const events = (exam.status?.cycles ?? []).flatMap((cycle) => cycle.events.filter((event) => event.date))
  return events.sort((a, b) => b.date.localeCompare(a.date))
}

// Events about a stage that are not the stage itself (its result, admit card and so on).
const sideEventPattern = /result|answer key|admit card|call letter|hall ticket|notice|apply|registration|objection|score|shortlist|published/i

/** Newest event that is the stage itself and shares a matching key with its name, or null. */
function eventForStage(stageName, events) {
  const stageKeys = matchKeys(stageName)
  if (!stageKeys.size) return null
  return events.find((event) => !sideEventPattern.test(event.event) && [...matchKeys(event.event)].some((key) => stageKeys.has(key))) ?? null
}

/** Sum of the given papers' marks, or null when any paper has no marks recorded. */
function sumMarks(papers) {
  if (!papers.length || papers.some((paper) => paper.marks == null)) return null
  return papers.reduce((total, paper) => total + paper.marks, 0)
}

/** Stage name without parenthetical detail, for the short chip label. */
function shortName(name) {
  return name.replace(/\s*\([^)]*\)/g, '').trim() || name
}

/** One roadmap step per selection stage, with its marks and the newest matching official date. */
function stageSteps(exam, events) {
  return (exam.selection?.stages ?? []).map((stage) => {
    const papers = stage.papers ?? []
    const countedPapers = stage.countsInMerit ? papers.filter((paper) => !paper.qualifying) : []
    return {
      kind: 'stage',
      key: `stage-${stage.name}`,
      title: stage.name,
      label: shortName(stage.name),
      type: stage.type,
      countsInMerit: stage.countsInMerit,
      papers,
      notes: stage.notes,
      totalMarks: sumMarks(papers),
      countedMarks: stage.countsInMerit ? sumMarks(countedPapers) : null,
      event: eventForStage(stage.name, events),
    }
  })
}

/**
 * Each counted stage's share of the final marks. Kept only when the total also appears in
 * the official merit rule text, because some papers count for certain posts only and a
 * plain sum would then overstate the total.
 */
function meritShares(steps, meritCalculation) {
  const shares = steps.filter((step) => step.countedMarks > 0).map((step) => ({ label: step.label, marks: step.countedMarks }))
  const total = shares.reduce((sum, share) => sum + share.marks, 0)
  const ruleText = meritCalculation ?? ''
  const isConfirmed = total > 0 && (ruleText.includes(String(total)) || ruleText.includes(total.toLocaleString('en-IN')))
  return isConfirmed ? { shares, total } : { shares: [], total: null }
}

/** Final merit step: how the rank is made, with each counted stage's share of the marks. */
function meritStep(exam, steps, events) {
  const { shares, total } = meritShares(steps, exam.selection?.meritCalculation)
  return {
    kind: 'merit',
    key: 'merit',
    title: 'Final merit list',
    label: 'Final merit',
    shares,
    totalMarks: total,
    meritCalculation: exam.selection?.meritCalculation,
    tieBreaking: exam.selection?.tieBreaking,
    event: events.find((event) => finalResultPattern.test(event.event)) ?? null,
  }
}

/** Last step: allocation, document checks and training, when any of them is recorded. */
function joiningStep(exam) {
  const parts = [
    { heading: 'From rank to post', text: exam.rankAndAllocation?.text },
    { heading: 'Document verification', text: exam.selection?.documentVerification },
    { heading: 'Training and probation', text: exam.selection?.probation },
  ].filter((part) => part.text)
  if (!parts.length) return null
  return { kind: 'joining', key: 'joining', title: 'Allocation and joining', label: 'Joining', parts, event: null }
}

// Typical months between stages, used only for the labelled estimate. The gap before a
// stage depends on how long the previous stage takes to evaluate: written answers take
// longer to mark than machine-scored tests. The first stage comes about 3 months after
// the notification, and the final result about 1 month after the last stage.
const monthsToFirstStage = 3
const monthsAfterStageType = { objective: 2, descriptive: 5, interview: 1, ssb: 2, skill: 1, physical: 1, medical: 1, document: 1, merit: 1 }
const monthsToFinalResult = 1

/** Numbered part of a stage name ("tier-2", "phase-1"), or null; papers of one tier sit together. */
function numberedKey(name) {
  return [...matchKeys(name)].find((key) => /^(tier|phase|stage)-/.test(key)) ?? null
}

/**
 * Adds an estimated month after notification to each stage step and the merit step.
 * Stages sharing a numbered key with the previous one (Tier II papers) count as the same sitting.
 */
function addEstimatedMonths(steps) {
  let month = 0
  let previous = null
  for (const step of steps) {
    if (step.kind === 'merit') {
      step.estimatedMonth = month + monthsToFinalResult
    } else if (step.kind === 'stage') {
      const isSameSitting = previous && numberedKey(step.title) && numberedKey(step.title) === numberedKey(previous.title)
      if (!isSameSitting) month += previous ? (monthsAfterStageType[previous.type] ?? 2) : monthsToFirstStage
      step.estimatedMonth = month
      previous = step
    }
  }
  return steps
}

/** All roadmap steps for one exam profile, in order. */
export function buildRoadmap(exam) {
  const events = datedEvents(exam)
  const steps = stageSteps(exam, events)
  if (!steps.length) return []
  return addEstimatedMonths([...steps, meritStep(exam, steps, events), joiningStep(exam)].filter(Boolean))
}
