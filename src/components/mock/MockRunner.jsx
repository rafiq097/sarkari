/**
 * The running mock test screen: a sticky bar with the timer and sections, the open
 * question with its options, the action row (mark for review, clear, previous, next),
 * the question palette and the submit confirmation. State comes from lib/useMockRunner.js.
 * Rendered by pages/MockTestPage.jsx.
 */
import { useEffect, useState } from 'react'
import { Clock, Flag, ChevronLeft, ChevronRight, Lock, Send } from 'lucide-react'
import { useMockRunner } from '../../lib/useMockRunner.js'
import { formatClock } from '../../lib/mock.js'

// The timer turns red in the last minute of a section or test.
const lowTimeSeconds = 60
const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F']

/** Palette status of one question: answered, marked, both, seen without an answer, or not seen. */
function paletteStatus(questionId, state) {
  const isAnswered = state.answers[questionId] != null
  if (state.marked[questionId]) return isAnswered ? 'answered-marked' : 'marked'
  if (isAnswered) return 'answered'
  return state.visited[questionId] ? 'seen' : 'unseen'
}

const statusLabels = {
  answered: 'Answered',
  marked: 'Marked for review',
  'answered-marked': 'Answered and marked',
  seen: 'Not answered',
  unseen: 'Not visited',
}

/** Counts of answered, marked and unanswered questions in a list. */
function countStatuses(questions, state) {
  const answered = questions.filter((question) => state.answers[question.id] != null).length
  return { answered, marked: questions.filter((question) => state.marked[question.id]).length, unanswered: questions.length - answered }
}

/** Grid of numbered buttons for the current section, coloured by status. */
function Palette({ section, sectionIndex, state, onOpen }) {
  return (
    <aside className="mock-palette" aria-label="Question palette">
      <h3>{section.name}</h3>
      <ol className="mock-palette-grid">
        {section.questions.map((question, position) => {
          const status = paletteStatus(question.id, state)
          return (
            <li key={question.id}>
              <button type="button" className={`mock-palette-button is-${status} ${position === state.questionIndex ? 'is-current' : ''}`} onClick={() => onOpen(sectionIndex, position)} aria-label={`Question ${position + 1}: ${statusLabels[status]}`} aria-current={position === state.questionIndex}>
                {position + 1}
              </button>
            </li>
          )
        })}
      </ol>
      <ul className="mock-legend">
        {Object.entries(statusLabels).map(([status, label]) => (
          <li key={status}>
            <span className={`mock-legend-dot is-${status}`} aria-hidden="true" /> {label}
          </li>
        ))}
      </ul>
    </aside>
  )
}

/** Confirmation shown before a section or the whole test is submitted. */
function SubmitConfirm({ title, counts, warning, confirmLabel, onConfirm, onCancel }) {
  return (
    <div className="mock-confirm-backdrop">
      <div className="mock-confirm" role="alertdialog" aria-modal="true" aria-labelledby="mock-confirm-title">
        <h3 id="mock-confirm-title">{title}</h3>
        <dl className="mock-confirm-counts">
          <div>
            <dd className="numeric">{counts.answered}</dd>
            <dt>Answered</dt>
          </div>
          <div>
            <dd className="numeric">{counts.unanswered}</dd>
            <dt>Not answered</dt>
          </div>
          <div>
            <dd className="numeric">{counts.marked}</dd>
            <dt>Marked for review</dt>
          </div>
        </dl>
        <p className="muted small">{warning}</p>
        <div className="mock-confirm-actions">
          <button type="button" className="button button-ghost" onClick={onCancel} autoFocus>
            Keep going
          </button>
          <button type="button" className="button button-primary" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

/** Section tabs; in locked mode only the current section is open. */
function SectionTabs({ plan, state, onOpen }) {
  if (plan.sections.length < 2) return null
  return (
    <div className="mock-sections" role="tablist" aria-label="Sections">
      {plan.sections.map((section, position) => {
        const isCurrent = position === state.sectionIndex
        const isClosed = plan.isLocked && !isCurrent
        return (
          <button key={section.id} type="button" role="tab" aria-selected={isCurrent} className={isCurrent ? 'is-selected' : ''} disabled={isClosed} onClick={() => onOpen(position, 0)} title={isClosed ? (position < state.sectionIndex ? 'Section submitted' : 'Opens after the current section') : section.name}>
            {isClosed && <Lock size={12} aria-hidden="true" />} {section.name}
          </button>
        )
      })}
    </div>
  )
}

/** The running test. Calls onFinish({ answers, secondsByQuestion }) once it is submitted or time runs out. */
export function MockRunner({ plan, onFinish }) {
  const runner = useMockRunner(plan)
  const { state } = runner
  const [isConfirming, setIsConfirming] = useState(false)
  const section = plan.sections[state.sectionIndex]
  const question = section.questions[state.questionIndex]
  const isLastSection = state.sectionIndex === plan.sections.length - 1
  const isLastQuestion = state.questionIndex === section.questions.length - 1
  // In locked mode "submit" closes only this section until the last one.
  const submitsSection = plan.isLocked && !isLastSection

  useEffect(() => {
    if (state.isFinished) onFinish({ answers: state.answers, secondsByQuestion: state.secondsByQuestion })
  }, [state.isFinished, state.answers, state.secondsByQuestion, onFinish])

  // Warn before the tab is closed or reloaded, since a running test is not saved.
  useEffect(() => {
    const warnBeforeLeaving = (event) => event.preventDefault()
    window.addEventListener('beforeunload', warnBeforeLeaving)
    return () => window.removeEventListener('beforeunload', warnBeforeLeaving)
  }, [])

  const goNext = () => {
    if (!isLastQuestion) runner.open(state.sectionIndex, state.questionIndex + 1)
    else if (!plan.isLocked && !isLastSection) runner.open(state.sectionIndex + 1, 0)
  }
  const goPrevious = () => {
    if (state.questionIndex > 0) runner.open(state.sectionIndex, state.questionIndex - 1)
    else if (!plan.isLocked && state.sectionIndex > 0) runner.open(state.sectionIndex - 1, plan.sections[state.sectionIndex - 1].questions.length - 1)
  }
  const confirmSubmit = () => {
    setIsConfirming(false)
    if (submitsSection) runner.closeSection()
    else runner.finish()
  }
  const confirmQuestions = submitsSection ? section.questions : plan.sections.flatMap((planSection) => planSection.questions)
  const hasPrevious = state.questionIndex > 0 || (!plan.isLocked && state.sectionIndex > 0)
  const hasNext = !isLastQuestion || (!plan.isLocked && !isLastSection)

  return (
    <div className="mock-runner">
      <div className="mock-bar">
        <div className={`mock-timer ${state.remainingSeconds != null && state.remainingSeconds <= lowTimeSeconds ? 'is-low' : ''}`} role="timer" aria-label={plan.isLocked ? 'Time left in this section' : 'Time left'}>
          <Clock size={16} aria-hidden="true" />
          <span className="numeric">{state.remainingSeconds == null ? 'Untimed' : formatClock(state.remainingSeconds)}</span>
          {plan.isLocked && state.remainingSeconds != null && <span className="faint small">this section</span>}
        </div>
        <SectionTabs plan={plan} state={state} onOpen={runner.open} />
        <button type="button" className="button button-primary button-small mock-submit" onClick={() => setIsConfirming(true)}>
          <Send size={14} aria-hidden="true" /> {submitsSection ? 'Submit section' : 'Submit test'}
        </button>
      </div>

      <div className="mock-body">
        <section className="mock-question" aria-labelledby="mock-question-number">
          <p className="mock-question-number" id="mock-question-number">
            Question <span className="numeric">{state.questionIndex + 1}</span> of <span className="numeric">{section.questions.length}</span>
            {state.marked[question.id] && (
              <span className="mock-flag">
                <Flag size={12} aria-hidden="true" /> Marked for review
              </span>
            )}
          </p>
          <p className="mock-question-text">{question.text}</p>
          <div className="mock-options" role="radiogroup" aria-label="Answer options">
            {question.options.map((option, optionIndex) => (
              <label key={option} className={`mock-option ${state.answers[question.id] === optionIndex ? 'is-chosen' : ''}`}>
                <input type="radio" name={`answer-${question.id}`} checked={state.answers[question.id] === optionIndex} onChange={() => runner.answer(optionIndex)} />
                <span className="mock-option-letter">{optionLetters[optionIndex]}</span>
                <span>{option}</span>
              </label>
            ))}
          </div>
          <div className="mock-actions">
            <button type="button" className={`button button-small ${state.marked[question.id] ? 'is-on' : ''}`} onClick={runner.toggleMark} aria-pressed={Boolean(state.marked[question.id])}>
              <Flag size={14} aria-hidden="true" /> {state.marked[question.id] ? 'Unmark' : 'Mark for review'}
            </button>
            <button type="button" className="button button-small button-ghost" onClick={runner.clear} disabled={state.answers[question.id] == null}>
              Clear answer
            </button>
            <span className="mock-actions-gap" />
            <button type="button" className="button button-small" onClick={goPrevious} disabled={!hasPrevious}>
              <ChevronLeft size={14} aria-hidden="true" /> Previous
            </button>
            <button type="button" className="button button-small button-primary" onClick={goNext} disabled={!hasNext}>
              Next <ChevronRight size={14} aria-hidden="true" />
            </button>
          </div>
        </section>
        <Palette section={section} sectionIndex={state.sectionIndex} state={state} onOpen={runner.open} />
      </div>

      {isConfirming && (
        <SubmitConfirm
          title={submitsSection ? `Submit ${section.name}?` : 'Submit the test?'}
          counts={countStatuses(confirmQuestions, state)}
          warning={submitsSection ? 'You cannot come back to this section after submitting it. The next section starts with its own timer.' : 'You cannot change answers after submitting.'}
          confirmLabel={submitsSection ? 'Submit section' : 'Submit test'}
          onConfirm={confirmSubmit}
          onCancel={() => setIsConfirming(false)}
        />
      )}
    </div>
  )
}
