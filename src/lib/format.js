/**
 * Formatting helpers for money, dates and levels. Used across pages and components.
 */

const rupeeFormatter = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 })
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** Formats a number as Indian rupees ("Rs 56,100"), or null when missing. */
export function formatRupees(amount) {
  if (amount == null || Number.isNaN(amount)) return null
  return `Rs ${rupeeFormatter.format(Math.round(amount))}`
}

/** Formats a plain count with Indian digit grouping. */
export function formatCount(value) {
  if (value == null) return null
  return rupeeFormatter.format(value)
}

/** Formats YYYY, YYYY-MM or YYYY-MM-DD into a readable date. */
export function formatDate(isoDate) {
  if (!isoDate) return null
  const [year, month, day] = isoDate.split('-')
  if (!month) return year
  const monthName = monthNames[Number(month) - 1]
  return day ? `${Number(day)} ${monthName} ${year}` : `${monthName} ${year}`
}

// Numeric weights let lists sort and compare by analytical level.
export const levelWeight = { low: 1, medium: 2, high: 3 }

/** Capitalises the first letter of a level for display. */
export function formatLevel(level) {
  if (!level) return 'Not rated'
  return level.charAt(0).toUpperCase() + level.slice(1)
}

/** Computes a percentage with sensible precision for very small rates. */
export function formatPercent(fraction) {
  if (fraction == null || !Number.isFinite(fraction)) return null
  const percent = fraction * 100
  if (percent < 0.1) return `${percent.toFixed(3)}%`
  if (percent < 1) return `${percent.toFixed(2)}%`
  return `${percent.toFixed(1)}%`
}

/** Today's date as YYYY-MM-DD in local time. */
export function todayIso() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

/** Whole days from today until an ISO date (negative when past), or null when undated. */
export function daysFromToday(isoDate) {
  if (!isoDate || isoDate.length < 10) return null
  return Math.round((new Date(isoDate) - new Date(todayIso())) / 86400000)
}

/** First sentence of a summary, used as a one-line hook on cards. */
export function firstSentence(text) {
  // A full stop followed by a space and a capital ends a sentence; "Rs." and "B.Ed." do not match.
  const match = text?.match(/^(.+?[.!?])\s+(?=[A-Z])/)
  return match ? match[1] : text
}

/**
 * Headline pay for a profile: starting basic when known, else the recruiter's stated monthly
 * gross (for example a fixed package), else a plain note. Used by cards and the exam page Overview.
 */
export function payHeadline(exam) {
  if (exam.employmentType === 'eligibility-only') return { label: 'Pay', value: null, note: 'No salary' }
  if (exam.salary?.startingBasic) return { label: 'Starting basic', value: formatRupees(exam.salary.startingBasic), note: null }
  if (exam.salary?.officialGross) return { label: 'Monthly pay', value: formatRupees(exam.salary.officialGross), note: null }
  return { label: 'Starting basic', value: null, note: 'Varies' }
}

// Official dates closer than this many days get a highlighted countdown.
export const urgentWithinDays = 45

/** Countdown text such as "today", "tomorrow" or "in 9 days". */
export function countdownText(days) {
  if (days === 0) return 'today'
  if (days === 1) return 'tomorrow'
  return `in ${days} days`
}
