/**
 * Data access layer. The compact exam index and source index are bundled eagerly;
 * full exam profiles are code-split per file and loaded on demand.
 * Used by every page that reads research data.
 */
import { useEffect, useState } from 'react'
import rawExamIndex from '../data/generated/exam-index.json'
import sourceIndex from '../data/generated/source-index.json'
import vocabulary from '../data/vocabulary.json'
import payRules from '../data/pay-rules/pay-rules.json'
import coverage from '../data/coverage.json'
import { effectiveStatus, keyEventOf } from './status.js'

// Vite turns each matching JSON file into its own lazily loaded chunk.
const profileLoaders = import.meta.glob('../data/exams/*/*.json', { import: 'default' })

const loadersById = Object.fromEntries(
  Object.entries(profileLoaders).map(([path, loader]) => [path.split('/').pop().replace('.json', ''), loader]),
)

// Status and key event are recomputed against today's date so the site ages correctly.
const examIndex = rawExamIndex.map((record) => {
  const keyEvent = record.cycles ? keyEventOf(record.cycles) : record.keyEvent
  return { ...record, keyEvent, declaredStatus: record.status, status: effectiveStatus(record.status, keyEvent) }
})

const indexById = new Map(examIndex.map((record) => [record.id, record]))
const profileCache = new Map()

export { examIndex, sourceIndex, vocabulary, payRules, coverage }

/** Returns the compact index record for an exam id, or undefined. */
export function getIndexRecord(examId) {
  return indexById.get(examId)
}

/** Loads one full profile, caching it for the session. */
export async function loadProfile(examId) {
  if (profileCache.has(examId)) return profileCache.get(examId)
  const loader = loadersById[examId]
  if (!loader) return null
  const loaded = await loader()
  // Display status follows today's date, like the index.
  const profile = { ...loaded, status: { ...loaded.status, declaredType: loaded.status.type, type: effectiveStatus(loaded.status.type, keyEventOf(loaded.status.cycles)) } }
  profileCache.set(examId, profile)
  return profile
}

/**
 * React hook that loads several profiles by id.
 * Returns { profiles, isLoading } with profiles in the same order as the ids.
 */
export function useProfiles(examIds) {
  const idsKey = examIds.join('|')
  const [state, setState] = useState({ key: null, profiles: [] })

  useEffect(() => {
    let isCurrent = true
    const ids = idsKey ? idsKey.split('|') : []
    Promise.all(ids.map(loadProfile)).then((profiles) => {
      if (isCurrent) setState({ key: idsKey, profiles: profiles.filter(Boolean) })
    })
    return () => {
      isCurrent = false
    }
  }, [idsKey])

  const isLoading = state.key !== idsKey
  return { profiles: isLoading ? [] : state.profiles, isLoading }
}

/** React hook for a single profile. Returns { profile, isLoading, notFound }. */
export function useProfile(examId) {
  const { profiles, isLoading } = useProfiles(examId ? [examId] : [])
  return { profile: profiles[0] ?? null, isLoading, notFound: !isLoading && !profiles[0] }
}

/** Label lookup in a vocabulary map with a readable fallback. */
export function labelFor(mapName, key) {
  return vocabulary[mapName]?.[key] ?? key
}

/** Exams of one jurisdiction from the index. */
export function examsInJurisdiction(jurisdiction) {
  return examIndex.filter((record) => record.jurisdiction === jurisdiction)
}

export const jurisdictionRoutes = {
  central: '/central',
  'andhra-pradesh': '/andhra-pradesh',
  telangana: '/telangana',
  karnataka: '/karnataka',
}
