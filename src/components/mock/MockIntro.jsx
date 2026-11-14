/**
 * Mock test start screen: what the real paper looks like (from the exam's pattern
 * block), how this mock differs (sample questions, scaled time, values not recorded),
 * the rules, and earlier attempts saved in this browser. Rendered by pages/MockTestPage.jsx.
 */
import { AlertTriangle, Play, Info } from 'lucide-react'
import { Unknown, SourceChips } from '../Badges.jsx'
import { formatClock } from '../../lib/mock.js'
import { formatCount, formatDate } from '../../lib/format.js'

// Earlier attempts shown on the start screen.
const shownAttemptCount = 5

/** A number from the pattern, or the "Not recorded" placeholder for null. */
function PatternValue({ value, suffix = '' }) {
  return value == null ? <Unknown>Not recorded</Unknown> : `${formatCount(value)}${suffix}`
}

/** Negative marking as a readable share of the question's marks. */
function negativeText(negativeFraction) {
  if (negativeFraction == null) return <Unknown>Not recorded</Unknown>
  if (negativeFraction === 0) return 'None'
  return `${Math.round(negativeFraction * 100)}% of the question's marks`
}

/** Table of the real paper's sections as recorded in the profile. */
function PatternTable({ pattern }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Section</th>
            <th className="numeric">Questions</th>
            <th className="numeric">Marks</th>
            <th className="numeric">Time</th>
            <th>Negative marking</th>
          </tr>
        </thead>
        <tbody>
          {pattern.sections.map((section) => (
            <tr key={section.id}>
              <td>{section.name}</td>
              <td className="numeric">
                <PatternValue value={section.questions} />
              </td>
              <td className="numeric">
                <PatternValue value={section.marks} />
              </td>
              <td className="numeric">
                <PatternValue value={section.minutes} suffix=" min" />
              </td>
              <td>{negativeText(section.negativeFraction)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Plain-language notes on how this mock will run, including every fallback in use. */
function runNotes(plan) {
  const notes = [
    plan.isLocked ? 'Sections run one after another. Each has its own timer, and you cannot return to a section after submitting it.' : plan.sections.length > 1 ? 'You can switch between sections at any time. One timer covers the whole test.' : null,
    plan.isTimed ? `This set has ${plan.questionCount} questions, so the timer is ${formatClock(plan.sections.reduce((total, section) => total + section.seconds, 0))} in total (scaled from the real paper where the question count is known).` : 'The time limit is not recorded for this paper, so this mock is untimed. Time per question is still measured.',
    plan.sections.some((section) => section.usesAssumedMarks) && 'Marks per question are not recorded for at least one section, so each question there counts 1 mark.',
    plan.sections.some((section) => section.hasUnknownNegative) && 'Negative marking is not recorded for at least one section, so no marks are deducted there.',
    'Mark for review keeps a question flagged in the palette. A marked question with an answer is still scored.',
  ]
  return notes.filter(Boolean)
}

/** Start screen. */
export function MockIntro({ exam, pattern, plan, isSample, attempts, onStart }) {
  return (
    <div className="mock-intro">
      {isSample && (
        <div className="callout callout-brick">
          <AlertTriangle size={18} aria-hidden="true" />
          <div>
            <strong>Sample, not real. </strong>
            These {plan.questionCount} questions are placeholders that only show how the mock test works. They are not from any official paper. Verified questions will replace them.
          </div>
        </div>
      )}

      <h2 className="block-title">
        Real paper: {pattern.stage} <SourceChips sourceIds={pattern.sources} sources={exam.sources} />
      </h2>
      <PatternTable pattern={pattern} />
      <p className="faint small">
        Pattern in use from {pattern.effectiveFrom ? formatDate(pattern.effectiveFrom) : 'a date that is not recorded'}. Total time: {pattern.totalMinutes == null ? 'not recorded' : `${formatCount(pattern.totalMinutes)} minutes`}. {pattern.notes}
      </p>

      <div className="callout spaced">
        <Info size={18} aria-hidden="true" />
        <div>
          <strong>How this mock runs</strong>
          <ul className="plain-list">
            {runNotes(plan).map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </div>

      <button type="button" className="button button-primary mock-start" onClick={onStart}>
        <Play size={16} aria-hidden="true" /> Start mock test
      </button>

      {attempts.length > 0 && (
        <>
          <h2 className="block-title">Your earlier attempts</h2>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th className="numeric">Score</th>
                  <th className="numeric">Correct</th>
                  <th className="numeric">Wrong</th>
                  <th className="numeric">Time</th>
                </tr>
              </thead>
              <tbody>
                {attempts.slice(0, shownAttemptCount).map((attempt) => (
                  <tr key={attempt.finishedAt}>
                    <td>
                      {formatDate(attempt.finishedAt.slice(0, 10))}
                      {attempt.isSample && <span className="faint small"> (sample set)</span>}
                    </td>
                    <td className="numeric">
                      {attempt.score} / {attempt.maximumScore}
                    </td>
                    <td className="numeric">{attempt.correctCount}</td>
                    <td className="numeric">{attempt.wrongCount}</td>
                    <td className="numeric">{formatClock(attempt.seconds)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="faint small">Attempts are saved only in this browser.</p>
        </>
      )}
    </div>
  )
}
