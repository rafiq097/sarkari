/**
 * Interactive selection roadmap for an exam profile: a row of step chips on a progress
 * track, Previous / Next controls (also arrow keys and swipe), and a detail panel for the
 * chosen step with its papers, marks, merit share or joining notes. Steps come from
 * lib/roadmap.js. The chosen step is kept in the URL (?step=) so it can be linked or opened
 * from Quick look. Rendered at the top of the Roadmap tab (ProfileExam.jsx).
 */
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { ChevronLeft, ChevronRight, CalendarDays, Trophy, BadgeCheck, RotateCcw, Link2, Check, Hourglass } from 'lucide-react'
import { Rich } from '../Rich.jsx'
import { EstimateTag } from '../Badges.jsx'
import { buildRoadmap, stageTypeLabels } from '../../lib/roadmap.js'
import { formatCount, formatDate, todayIso } from '../../lib/format.js'

// A horizontal swipe longer than this (in pixels) on the panel changes the step.
const swipeDistance = 60
// How long the "Link copied" confirmation stays before the button resets.
const copiedResetMilliseconds = 2000

/** "Aug 2026" style month for a dated event (day dropped so the chip stays short). */
function monthOf(event) {
  return formatDate(event.date.slice(0, 7))
}

/** Second line of a chip: the step's month when known, otherwise what kind of step it is. */
function chipCaption(step) {
  if (step.event) return monthOf(step.event)
  if (step.kind === 'merit') return 'Rank list'
  if (step.kind === 'joining') return 'After selection'
  return stageTypeLabels[step.type] ?? 'Stage'
}

/** "Scheduled Aug 2026" or "Last held May 2026", with the tentative flag when official-tentative. */
function eventLine(event) {
  const verb = event.date >= todayIso().slice(0, event.date.length) ? 'Scheduled' : 'Last held'
  return `${verb} ${formatDate(event.date)}${event.dateType === 'official-tentative' ? ' (tentative)' : ''}`
}

/** Marks summary shown at the top right of a stage, or null when nothing is recorded. */
function stageMarksText(step) {
  const { totalMarks, countedMarks, countsInMerit } = step
  if (countsInMerit === false) return totalMarks ? `${formatCount(totalMarks)} marks, qualifying` : 'Qualifying only'
  if (countsInMerit && countedMarks && totalMarks && countedMarks !== totalMarks) return `${formatCount(countedMarks)} of ${formatCount(totalMarks)} marks count`
  if (countsInMerit && (countedMarks || totalMarks)) return `${formatCount(countedMarks ?? totalMarks)} marks count`
  if (countsInMerit) return 'Counts in merit'
  return totalMarks ? `${formatCount(totalMarks)} marks` : null
}

/** What one paper does: qualifying only, counted in merit, or nothing stated. */
function paperRole(paper, step) {
  if (paper.qualifying || step.countsInMerit === false) return { text: 'Qualifying only', tone: 'qualifying' }
  if (step.countsInMerit) return { text: 'Counts in merit', tone: 'counts' }
  return null
}

/** One paper or test as a small card. */
function PaperCard({ paper, step, position }) {
  const role = paperRole(paper, step)
  const facts = [paper.questions && `${formatCount(paper.questions)} questions`, paper.duration, paper.negative && `Negative: ${paper.negative}`].filter(Boolean)
  return (
    <article className={`roadmap-paper ${role ? `is-${role.tone}` : ''}`} style={{ '--item-index': position }}>
      <header>
        <h5>{paper.name}</h5>
        {paper.marks != null && <span className="roadmap-paper-marks numeric">{formatCount(paper.marks)} marks</span>}
      </header>
      {role && <p className="roadmap-paper-role">{role.text}</p>}
      {facts.length > 0 && (
        <ul className="roadmap-paper-facts">
          {facts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      )}
      {paper.notes && (
        <p className="roadmap-paper-notes">
          <Rich text={paper.notes} />
        </p>
      )}
    </article>
  )
}

/** Detail for an exam stage: papers and notes. */
function StageDetail({ step }) {
  return (
    <>
      {step.papers.length > 0 && (
        <>
          <h4 className="roadmap-subhead">Papers and tests</h4>
          <div className="roadmap-papers">
            {step.papers.map((paper, position) => (
              <PaperCard key={paper.name} paper={paper} step={step} position={position} />
            ))}
          </div>
        </>
      )}
      {step.notes && (
        <p className="roadmap-notes">
          <Rich text={step.notes} />
        </p>
      )}
    </>
  )
}

/** Detail for the final merit step: a bar of each stage's share of the marks, then the rules. */
function MeritDetail({ step }) {
  return (
    <>
      {step.shares.length > 0 && (
        <>
          <h4 className="roadmap-subhead">Where the {formatCount(step.totalMarks)} marks come from</h4>
          <div className="merit-bar" role="img" aria-label={step.shares.map((share) => `${share.label} ${share.marks}`).join(', ')}>
            {step.shares.map((share, position) => (
              <span key={share.label} className="merit-segment" style={{ flexGrow: share.marks, '--item-index': position }} />
            ))}
          </div>
          <ul className="merit-legend">
            {step.shares.map((share, position) => (
              <li key={share.label} style={{ '--item-index': position }}>
                <span className="merit-swatch" aria-hidden="true" />
                {share.label}
                <strong className="numeric">{formatCount(share.marks)}</strong>
                <span className="faint numeric">{Math.round((share.marks / step.totalMarks) * 100)}%</span>
              </li>
            ))}
          </ul>
        </>
      )}
      {step.meritCalculation && (
        <p className="roadmap-notes">
          <Rich text={step.meritCalculation} />
        </p>
      )}
      {step.tieBreaking && (
        <details className="roadmap-more">
          <summary>If two candidates have equal marks</summary>
          <p>
            <Rich text={step.tieBreaking} />
          </p>
        </details>
      )}
    </>
  )
}

/** Detail for the joining step: allocation, document checks and training. */
function JoiningDetail({ step }) {
  return (
    <div className="roadmap-joining">
      {step.parts.map((part, position) => (
        <section key={part.heading} style={{ '--item-index': position }}>
          <h4 className="roadmap-subhead">{part.heading}</h4>
          <p>
            <Rich text={part.text} />
          </p>
        </section>
      ))}
      <p className="faint small">No rank guarantees a particular post. Allocation depends on vacancies, category, preferences and medical fitness in that year.</p>
    </div>
  )
}

const detailByKind = { stage: StageDetail, merit: MeritDetail, joining: JoiningDetail }
const iconByKind = { merit: Trophy, joining: BadgeCheck }

/** Previous / Next controls with the step counter. */
function RoadmapNav({ index, count, onMove, isCompact = false }) {
  return (
    <div className={`roadmap-nav ${isCompact ? 'is-compact' : ''}`}>
      {!isCompact && (
        <span className="roadmap-count numeric">
          Step {index + 1} of {count}
        </span>
      )}
      <div className="roadmap-nav-buttons">
        <button type="button" className="button button-ghost" onClick={() => onMove(index - 1)} disabled={index === 0}>
          <ChevronLeft size={16} aria-hidden="true" /> Previous
        </button>
        {index < count - 1 ? (
          <button type="button" className="button button-primary" onClick={() => onMove(index + 1)}>
            Next step <ChevronRight size={16} aria-hidden="true" />
          </button>
        ) : (
          <button type="button" className="button button-primary" onClick={() => onMove(0)}>
            <RotateCcw size={15} aria-hidden="true" /> Back to start
          </button>
        )}
      </div>
    </div>
  )
}

/** Copies a link that opens the roadmap at the current step. */
function CopyStepLink() {
  const [isCopied, setIsCopied] = useState(false)
  const copy = () => {
    navigator.clipboard
      ?.writeText(window.location.href)
      .then(() => {
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), copiedResetMilliseconds)
      })
      .catch(() => {})
  }
  return (
    <button type="button" className="button button-ghost button-small roadmap-copy" onClick={copy} aria-live="polite">
      {isCopied ? <Check size={14} aria-hidden="true" /> : <Link2 size={14} aria-hidden="true" />}
      {isCopied ? 'Link copied' : 'Copy link to this step'}
    </button>
  )
}

/** Keeps the chosen chip centred in the scrollable track without moving the page. */
function useCentreChip(trackRef, index) {
  useEffect(() => {
    const track = trackRef.current
    const chip = track?.querySelector(`[data-step="${index}"]`)
    if (!chip) return
    track.scrollTo({ left: chip.offsetLeft - (track.clientWidth - chip.offsetWidth) / 2, behavior: 'smooth' })
  }, [trackRef, index])
}

/** The roadmap for one exam. */
export function ExamRoadmap({ exam }) {
  const steps = buildRoadmap(exam)
  const [searchParams, setSearchParams] = useSearchParams()
  // ?step= is 1-based for readable links; anything missing or out of range opens step 1.
  const requestedIndex = Number(searchParams.get('step')) - 1
  const index = requestedIndex >= 0 && requestedIndex < steps.length ? requestedIndex : 0
  const [direction, setDirection] = useState('forward')
  const rootRef = useRef(null)
  const trackRef = useRef(null)
  const touchStart = useRef(null)
  useCentreChip(trackRef, index)
  if (!steps.length) return null

  const step = steps[index]
  const Detail = detailByKind[step.kind]
  const KindIcon = iconByKind[step.kind]
  const totalMonths = steps.find((item) => item.kind === 'merit')?.estimatedMonth ?? null
  const marksText = step.kind === 'stage' ? stageMarksText(step) : step.totalMarks ? `${formatCount(step.totalMarks)} marks total` : null

  const moveTo = (target, { focusChip = false, bringIntoView = false } = {}) => {
    const next = Math.min(steps.length - 1, Math.max(0, target))
    if (next === index) return
    setDirection(next > index ? 'forward' : 'back')
    setSearchParams(
      (current) => {
        const updated = new URLSearchParams(current)
        updated.set('step', String(next + 1))
        return updated
      },
      { replace: true },
    )
    if (focusChip) document.getElementById(`roadmap-tab-${next}`)?.focus({ preventScroll: true })
    // From the bottom controls the chips are off screen, so bring the roadmap top back into view.
    if (bringIntoView && rootRef.current.getBoundingClientRect().top < 0) rootRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleKeyDown = (event) => {
    const targets = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: steps.length - 1 }
    if (!(event.key in targets)) return
    event.preventDefault()
    moveTo(targets[event.key], { focusChip: true })
  }

  const handleTouchEnd = (event) => {
    if (!touchStart.current) return
    const deltaX = event.changedTouches[0].clientX - touchStart.current.x
    const deltaY = event.changedTouches[0].clientY - touchStart.current.y
    touchStart.current = null
    // Only a clearly sideways swipe counts, so vertical scrolling is never hijacked.
    if (Math.abs(deltaX) > swipeDistance && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) moveTo(index + (deltaX < 0 ? 1 : -1))
  }

  return (
    <section className="roadmap" ref={rootRef} aria-label="Selection roadmap">
      <div className="roadmap-track-card">
        <div className="roadmap-track-wrap" ref={trackRef}>
          <ol className="roadmap-track" role="tablist" aria-label="Roadmap steps" onKeyDown={handleKeyDown}>
            {steps.map((item, position) => {
              const state = position < index ? 'is-done' : position === index ? 'is-current' : ''
              return (
                <li key={item.key} className={`roadmap-step ${state}`} data-step={position}>
                  <button type="button" role="tab" id={`roadmap-tab-${position}`} aria-selected={position === index} aria-controls="roadmap-panel" tabIndex={position === index ? 0 : -1} onClick={() => moveTo(position)}>
                    <span className="roadmap-step-number numeric">{item.kind === 'stage' ? `Stage ${position + 1}` : item.kind === 'merit' ? 'Result' : 'Finish'}</span>
                    <span className="roadmap-step-label">{item.label}</span>
                    <span className="roadmap-step-caption">{chipCaption(item)}</span>
                  </button>
                  {position < steps.length - 1 && <ChevronRight className="roadmap-arrow" size={16} aria-hidden="true" />}
                  <span className="roadmap-marker" aria-hidden="true">
                    <span className="roadmap-dot" />
                    <span className="roadmap-month numeric">{item.estimatedMonth != null ? `Month ${item.estimatedMonth}` : ''}</span>
                  </span>
                </li>
              )
            })}
          </ol>
        </div>
        {totalMonths != null && (
          <p className="roadmap-estimate">
            <Hourglass size={15} aria-hidden="true" />
            <span>
              About <strong className="numeric">{totalMonths} months</strong> from notification to final result
            </span>
            <EstimateTag>Estimate from typical gaps</EstimateTag>
          </p>
        )}
      </div>

      <RoadmapNav index={index} count={steps.length} onMove={moveTo} />

      <div
        role="tabpanel"
        id="roadmap-panel"
        aria-labelledby={`roadmap-tab-${index}`}
        className={`roadmap-panel is-${direction}`}
        key={step.key}
        onTouchStart={(event) => (touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY })}
        onTouchEnd={handleTouchEnd}
      >
        <header className="roadmap-panel-head">
          <div>
            <span className="badge badge-accent badge-quiet numeric">
              Step {index + 1} of {steps.length}
            </span>
            <h3>
              {KindIcon && <KindIcon size={20} aria-hidden="true" />}
              {step.title}
            </h3>
            <p className="roadmap-meta">
              {step.kind === 'stage' && <span>{stageTypeLabels[step.type] ?? step.type}</span>}
              {step.estimatedMonth != null && (
                <span>
                  <Hourglass size={14} aria-hidden="true" /> About month {step.estimatedMonth} after notification (estimate)
                </span>
              )}
              {step.event && (
                <span>
                  <CalendarDays size={14} aria-hidden="true" /> {eventLine(step.event)}
                </span>
              )}
            </p>
            <CopyStepLink />
          </div>
          {marksText && <span className="roadmap-marks numeric">{marksText}</span>}
        </header>
        <Detail step={step} />
        <RoadmapNav index={index} count={steps.length} onMove={(target) => moveTo(target, { bringIntoView: true })} isCompact />
      </div>
    </section>
  )
}
