/**
 * Rich text helper: renders plain text with key figures (Rs amounts, percentages,
 * marks, durations, counts) emphasised so long explanations are easy to scan.
 * Used across exam profile tabs and guides. Text content is never changed.
 */

// Matches "Rs 56,100", "33%", "200 marks", "3 hours", "12 to 13 times", "1,02,000", "2026".
const figurePattern = /(Rs\.?\s?[\d,]+(?:\.\d+)?(?:\s?(?:lakh|crore))?|\d[\d,]*(?:\.\d+)?\s?(?:%|percent|marks|mark|hours|hour|minutes|years|year|days|day|months|lakh|crore|km|cm|times|attempts|papers|questions|vacancies|posts)\b|\b\d{1,3}(?:,\d{2,3})+\b|\b\d+(?:\.\d+)?\b)/g

/** Text with figures wrapped in <strong>. */
export function Rich({ text }) {
  if (text == null) return null
  const parts = String(text).split(figurePattern)
  return parts.map((part, position) =>
    position % 2 === 1 ? (
      <strong key={`${position}-${part}`} className="figure">
        {part}
      </strong>
    ) : (
      part
    ),
  )
}
