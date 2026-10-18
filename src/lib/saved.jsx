/**
 * Saved state kept in the visitor's browser: bookmarks, the comparison list and
 * the eligibility profile. Provided app-wide through SavedProvider (see App.jsx).
 */
import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const storageKey = 'gov-exam-portal:v1'
const maximumCompared = 4
const SavedContext = createContext(null)

/** Reads saved state; storage can be blocked in private windows, so failures fall back to defaults. */
function readStoredState() {
  try {
    const raw = window.localStorage.getItem(storageKey)
    if (raw) return { bookmarks: [], compare: [], candidate: null, ...JSON.parse(raw) }
  } catch {
    // Storage unavailable or corrupted: start empty.
  }
  return { bookmarks: [], compare: [], candidate: null }
}

/** Writes saved state, ignoring storage errors. */
function writeStoredState(state) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(state))
  } catch {
    // Storage unavailable: keep state in memory only.
  }
}

/** Provider that owns saved state and persists every change. */
export function SavedProvider({ children }) {
  const [state, setState] = useState(readStoredState)

  const update = useCallback((changeState) => {
    setState((previous) => {
      const next = changeState(previous)
      writeStoredState(next)
      return next
    })
  }, [])

  const value = useMemo(
    () => ({
      bookmarks: state.bookmarks,
      compare: state.compare,
      candidate: state.candidate,
      maximumCompared,
      toggleBookmark: (examId) =>
        update((previous) => ({
          ...previous,
          bookmarks: previous.bookmarks.includes(examId) ? previous.bookmarks.filter((id) => id !== examId) : [...previous.bookmarks, examId],
        })),
      toggleCompare: (examId) =>
        update((previous) => {
          if (previous.compare.includes(examId)) return { ...previous, compare: previous.compare.filter((id) => id !== examId) }
          if (previous.compare.length >= maximumCompared) return previous
          return { ...previous, compare: [...previous.compare, examId] }
        }),
      setCompare: (examIds) => update((previous) => ({ ...previous, compare: examIds.slice(0, maximumCompared) })),
      saveCandidate: (candidate) => update((previous) => ({ ...previous, candidate })),
    }),
    [state, update],
  )

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>
}

/** Hook to read and change saved state. */
// eslint-disable-next-line react-refresh/only-export-components
export function useSaved() {
  return useContext(SavedContext)
}
