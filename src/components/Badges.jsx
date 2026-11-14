/**
 * Small status and data-quality markers used on cards, tables and profiles:
 * exam status, analytical level pills, unknown-value placeholders, confidence, freshness and source chips.
 */
import { CircleDot, RotateCw, Archive, HelpCircle, ShieldCheck, ShieldAlert, Shield, ExternalLink, CalendarCheck, History } from 'lucide-react'
import { formatLevel } from '../lib/format.js'
import { difficultyBand } from '../lib/difficulty.js'
import { freshnessOf } from '../lib/freshness.js'

const statusDetails = {
  active: { label: 'Active', icon: CircleDot, tone: 'sage' },
  recurring: { label: 'Recurring', icon: RotateCw, tone: 'accent' },
  historical: { label: 'Historical', icon: Archive, tone: 'stone' },
}

/** Badge for active / recurring / historical status. */
export function StatusBadge({ status }) {
  const details = statusDetails[status] ?? { label: 'Unknown', icon: HelpCircle, tone: 'stone' }
  const Icon = details.icon
  return (
    <span className={`badge badge-${details.tone}`}>
      <Icon size={13} aria-hidden="true" />
      {details.label}
    </span>
  )
}

/** Three-segment meter plus label for a low / medium / high analytical level. */
export function LevelMeter({ level, label }) {
  const filled = { low: 1, medium: 2, high: 3 }[level] ?? 0
  return (
    <span className={`level-meter level-${level ?? 'none'}`} title={label ? `${label}: ${formatLevel(level)}` : formatLevel(level)}>
      <span className="level-bars" aria-hidden="true">
        {[1, 2, 3].map((segment) => (
          <span key={segment} className={segment <= filled ? 'is-filled' : ''} />
        ))}
      </span>
      <span className="level-text">{formatLevel(level)}</span>
    </span>
  )
}

/** Overall difficulty out of 100 with its band, for example "Hard 76/100". */
export function DifficultyScore({ score }) {
  if (score == null) return null
  const band = difficultyBand(score)
  return (
    <span className={`badge badge-${band.tone} difficulty-score`} title={`Overall difficulty: ${score} out of 100 (${band.label}). Our analytical estimate.`}>
      {band.label} <span className="numeric">{score}/100</span>
    </span>
  )
}

/** Placeholder shown wherever a value is unavailable or not verified. */
export function Unknown({ children = 'Not available' }) {
  return (
    <span className="unknown-value">
      <HelpCircle size={13} aria-hidden="true" />
      {children}
    </span>
  )
}

/** Renders a value, or the Unknown placeholder when it is null or empty. */
export function ValueOrUnknown({ value, fallback }) {
  if (value == null || value === '') return <Unknown>{fallback}</Unknown>
  return value
}

const confidenceDetails = {
  high: { icon: ShieldCheck, label: 'High confidence', tone: 'sage' },
  medium: { icon: Shield, label: 'Medium confidence', tone: 'accent' },
  low: { icon: ShieldAlert, label: 'Low confidence', tone: 'brick' },
}

/** Data confidence marker for a profile. */
export function ConfidenceBadge({ confidence }) {
  const details = confidenceDetails[confidence] ?? confidenceDetails.low
  const Icon = details.icon
  return (
    <span className={`badge badge-${details.tone} badge-quiet`}>
      <Icon size={13} aria-hidden="true" />
      {details.label}
    </span>
  )
}

/**
 * Freshness marker for a profile: "Checked Oct 2026" while recent; once the check is
 * over a year old (or was never recorded) a soft warning that links to the official site.
 */
export function FreshnessBadge({ lastVerified, officialUrl }) {
  const freshness = freshnessOf(lastVerified)
  if (!freshness.isStale) {
    return (
      <span className="badge badge-stone badge-quiet freshness-badge">
        <CalendarCheck size={12} aria-hidden="true" />
        {freshness.label}
      </span>
    )
  }
  const Wrapper = officialUrl ? 'a' : 'span'
  const linkProps = officialUrl ? { href: officialUrl, target: '_blank', rel: 'noreferrer' } : {}
  return (
    <Wrapper className="badge badge-plum badge-quiet freshness-badge is-stale" title={freshness.label} {...linkProps}>
      <History size={12} aria-hidden="true" />
      May be outdated, check the official notice
      {officialUrl && <ExternalLink size={10} aria-hidden="true" />}
    </Wrapper>
  )
}

/** Label marking analytical (non-official) content. */
export function EstimateTag({ children = 'Estimate' }) {
  return <span className="tag-estimate">{children}</span>
}

/** Inline numbered links to the sources backing a section. */
export function SourceChips({ sourceIds, sources }) {
  if (!sourceIds?.length) return null
  const byId = new Map((sources ?? []).map((source) => [source.id, source]))
  return (
    <span className="source-chips">
      {sourceIds.map((sourceId) => {
        const source = byId.get(sourceId)
        if (!source) return null
        return (
          <a key={sourceId} href={source.url} target="_blank" rel="noreferrer" className={`source-chip ${source.type === 'secondary' ? 'is-secondary' : ''}`} title={`${source.title} (${source.publisher ?? 'source'}${source.year ? `, ${source.year}` : ''})`}>
            {sourceId.toUpperCase()}
            <ExternalLink size={10} aria-hidden="true" />
          </a>
        )
      })}
    </span>
  )
}
