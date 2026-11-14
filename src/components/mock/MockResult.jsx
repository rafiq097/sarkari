/**
 * Mock test result: the score after negative marking, section-wise accuracy, and a
 * question-by-question review with time spent, the correct answer, the explanation and
 * where the question came from. Rendered by pages/MockTestPage.jsx.
 */
import { ExternalLink, RotateCcw, CheckCircle2, XCircle, MinusCircle } from 'lucide-react'
import { formatClock } from '../../lib/mock.js'
import { formatPercent } from '../../lib/format.js'

const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F']

const outcomeDetails = {
  correct: { label: 'Correct', icon: CheckCircle2, tone: 'sage' },
  wrong: { label: 'Wrong', icon: XCircle, tone: 'brick' },
  skipped: { label: 'Not answered', icon: MinusCircle, tone: 'stone' },
}

/** Whether a question was answered correctly, wrongly or not at all. */
function outcomeOf(question, chosenIndex) {
  if (chosenIndex == null) return 'skipped'
  return chosenIndex === question.answer ? 'correct' : 'wrong'
}

/** Where a question came from: a verified official source, or a clear "sample" label. */
function QuestionOrigin({ question }) {
  if (!question.source) return <span className="tag-estimate">Sample, not real</span>
  return (
    <span className="mock-origin">
      <a href={question.source} target="_blank" rel="noreferrer" className="text-link">
        Official paper{question.year ? `, ${question.year}` : ''} <ExternalLink size={11} aria-hidden="true" />
      </a>
      <span className={`badge badge-quiet ${question.verified ? 'badge-sage' : 'badge-stone'}`}>{question.verified ? 'Verified' : 'Not verified'}</span>
    </span>
  )
}

/** One reviewed question, opened on demand to show the explanation. */
function ReviewItem({ question, number, chosenIndex, seconds }) {
  const outcome = outcomeDetails[outcomeOf(question, chosenIndex)]
  const Icon = outcome.icon
  return (
    <details className={`mock-review tone-${outcome.tone}`}>
      <summary>
        <Icon size={16} aria-hidden="true" />
        <span className="mock-review-number numeric">Q{number}</span>
        <span className="mock-review-outcome">{outcome.label}</span>
        <span className="faint small numeric">{formatClock(seconds)}</span>
      </summary>
      <div className="mock-review-body">
        <p>{question.text}</p>
        <p className="small">
          Your answer: <strong>{chosenIndex == null ? 'none' : `${optionLetters[chosenIndex]}. ${question.options[chosenIndex]}`}</strong>
          <br />
          Correct answer: <strong>{`${optionLetters[question.answer]}. ${question.options[question.answer]}`}</strong>
        </p>
        <p className="muted small">{question.explanation}</p>
        <QuestionOrigin question={question} />
      </div>
    </details>
  )
}

/** Result screen. `result` comes from scoreAttempt in lib/mock.js. */
export function MockResult({ plan, result, answers, secondsByQuestion, isSample, onRetry }) {
  return (
    <div className="mock-result">
      <div className="mock-score">
        <p className="quick-question">Your score</p>
        <p className="mock-score-value numeric">
          {result.score} <span>/ {result.maximumScore}</span>
        </p>
        <p className="muted small">
          {result.correctCount} correct, {result.wrongCount} wrong, {result.skippedCount} not answered. {result.negativeMarks > 0 ? `${result.negativeMarks} marks deducted for wrong answers.` : 'No marks deducted.'} Time used: {formatClock(result.seconds)}.
        </p>
        {isSample && <p className="tag-estimate">Sample set, not real questions: this score says nothing about the real exam.</p>}
      </div>

      <h2 className="block-title">Section-wise</h2>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Section</th>
              <th className="numeric">Correct</th>
              <th className="numeric">Wrong</th>
              <th className="numeric">Not answered</th>
              <th className="numeric">Accuracy</th>
              <th className="numeric">Score</th>
              <th className="numeric">Time</th>
            </tr>
          </thead>
          <tbody>
            {result.sections.map((section) => (
              <tr key={section.id}>
                <td>{section.name}</td>
                <td className="numeric">{section.correctCount}</td>
                <td className="numeric">{section.wrongCount}</td>
                <td className="numeric">{section.skippedCount}</td>
                <td className="numeric">{formatPercent(section.accuracy) ?? '-'}</td>
                <td className="numeric">
                  {section.score} / {section.maximumScore}
                </td>
                <td className="numeric">{formatClock(section.seconds)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="faint small">Accuracy = correct answers divided by the questions you attempted.</p>

      <h2 className="block-title">Question by question</h2>
      {plan.sections.map((section) => (
        <div key={section.id} className="mock-review-section">
          {plan.sections.length > 1 && <h3>{section.name}</h3>}
          {section.questions.map((question, position) => (
            <ReviewItem key={question.id} question={question} number={position + 1} chosenIndex={answers[question.id] ?? null} seconds={secondsByQuestion[question.id] ?? 0} />
          ))}
        </div>
      ))}

      <button type="button" className="button mock-start" onClick={onRetry}>
        <RotateCcw size={15} aria-hidden="true" /> Back to the start screen
      </button>
    </div>
  )
}
