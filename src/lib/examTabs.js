/**
 * Tab and section ids of the exam page, plus the map from the ten older tab ids to
 * the four current tabs. Used by pages/ExamPage.jsx so old links (?tab=syllabus) land
 * on the tab and collapsed section that now hold that content.
 */

/** The four tabs, in display order. The first one is the default. */
export const examTabIds = ['overview', 'eligibility', 'exam', 'pay']

/**
 * Older tab id -> current tab and the section inside it. A null section means the
 * content is the always-visible part of that tab.
 */
const legacyTabTargets = {
  quick: { tab: 'overview', section: null },
  sources: { tab: 'overview', section: 'sources' },
  selection: { tab: 'exam', section: null },
  guide: { tab: 'exam', section: 'guide' },
  syllabus: { tab: 'exam', section: 'syllabus' },
  cutoffs: { tab: 'exam', section: 'cutoffs' },
  salary: { tab: 'pay', section: null },
  work: { tab: 'pay', section: 'work' },
}

/**
 * Resolves the ?tab= value of a URL. Returns { tab, section, isLegacy }; isLegacy is
 * true when the URL used an older id and should be rewritten to the current one.
 */
export function resolveExamTab(requestedTab, requestedSection) {
  const legacyTarget = legacyTabTargets[requestedTab]
  if (legacyTarget) return { tab: legacyTarget.tab, section: legacyTarget.section, isLegacy: true }
  const tab = examTabIds.includes(requestedTab) ? requestedTab : examTabIds[0]
  return { tab, section: requestedSection ?? null, isLegacy: false }
}
