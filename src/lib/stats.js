/**
 * Statistics helpers shared by the exam profile and analytics page.
 */

/** Selection rates computed only from official counts in the same row. */
export function selectionRates(row) {
  return {
    perApplicant: row.selected && row.applicants ? row.selected / row.applicants : null,
    perAppeared: row.selected && row.appeared ? row.selected / row.appeared : null,
  }
}
