/**
 * Freshness of an exam profile, from its lastVerified date. Used by FreshnessBadge
 * (components/Badges.jsx) on exam cards and the exam page.
 */
import { formatDate, todayIso } from './format.js'

// A profile not checked for longer than this many months is flagged as possibly outdated.
const staleAfterMonths = 12

/** Whole calendar months from one YYYY-MM-DD date to another. */
function monthsBetween(fromIso, toIso) {
  const [fromYear, fromMonth, fromDay] = fromIso.split('-').map(Number)
  const [toYear, toMonth, toDay] = toIso.split('-').map(Number)
  const months = (toYear - fromYear) * 12 + (toMonth - fromMonth)
  return toDay < fromDay ? months - 1 : months
}

/**
 * Returns { isStale, label }. label is "Checked Oct 2026" for a known date, or
 * "Never checked" for null. isStale is true for null or anything older than 12 months.
 */
export function freshnessOf(lastVerified, today = todayIso()) {
  if (!lastVerified) return { isStale: true, label: 'Never checked' }
  // Month and year only: the exact day adds nothing for the reader.
  const label = `Checked ${formatDate(lastVerified.slice(0, 7))}`
  return { isStale: monthsBetween(lastVerified, today) >= staleAfterMonths, label }
}
