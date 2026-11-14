/**
 * Open/closed state for the collapsed sections (Fold in components/Common.jsx) of one
 * exam page tab. A section named in the URL (?section=) starts open and is scrolled to;
 * the reader's own clicks override that. Used by the exam profile tabs.
 */
import { useEffect, useState } from 'react'

/** Returns { isOpen(sectionId), toggle(sectionId) } for the folds of one tab. */
export function useFolds(requestedSection) {
  const [overrides, setOverrides] = useState({})

  useEffect(() => {
    if (requestedSection) document.getElementById(`section-${requestedSection}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [requestedSection])

  const isOpen = (sectionId) => overrides[sectionId] ?? sectionId === requestedSection
  const toggle = (sectionId) => setOverrides((previous) => ({ ...previous, [sectionId]: !(previous[sectionId] ?? sectionId === requestedSection) }))
  return { isOpen, toggle }
}
