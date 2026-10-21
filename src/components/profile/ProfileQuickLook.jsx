/**
 * Quick look tab: the default first view of an exam page. Answers the four questions
 * most readers come with (can I apply, what do I earn, how tough, when) in big type,
 * then shows the selection steps, exams to prepare for together and top posts. Each block links to the detailed tab.
 * Rendered by pages/ExamPage.jsx.
 */
import { Link } from 'react-router'
import { ArrowRightCircle } from 'lucide-react'
import { LevelMeter } from '../Badges.jsx'
import { NextStepChip, KeyEventLine } from '../ExamCard.jsx'
import { labelFor, getIndexRecord } from '../../lib/data.js'
import { estimateSalary } from '../../lib/salary.js'
import { companionsFor } from '../../lib/syllabus.js'
import { formatCount, formatRupees, firstSentence, payHeadline } from '../../lib/format.js'
import { difficultyBand } from '../../lib/difficulty.js'

// Only this many post names are shown before "and N more".
const visiblePostCount = 5
// Exams sharing at least this share of syllabus subjects count as "prepare together".
const minimumSimilarity = 0.35
const companionCount = 4

/** Button that opens a detailed tab. */
function MoreLink({ tabId, onOpenTab, children }) {
  return (
    <button type="button" className="quick-more" onClick={() => onOpenTab(tabId)}>
      {children} <ArrowRightCircle size={14} aria-hidden="true" />
    </button>
  )
}

/** One question card with a big answer, a short supporting line and a link to details. */
function QuestionCard({ question, answer, detail, tabId, tabLabel, onOpenTab, children }) {
  return (
    <section className="quick-card">
      <h3 className="quick-question">{question}</h3>
      <div className="quick-answer">{answer}</div>
      {detail && <p className="quick-detail">{detail}</p>}
      {children}
      <MoreLink tabId={tabId} onOpenTab={onOpenTab}>
        {tabLabel}
      </MoreLink>
    </section>
  )
}

/** Age line with category relaxation, e.g. "Age 18 to 32. Extra years: SC 5, ST 5, OBC 3". */
function ageDetail(rules) {
  if (rules?.ageMax == null) return rules?.ageMin != null ? `Minimum age ${rules.ageMin}; no upper limit in the general rule.` : 'No age limit in the general rule.'
  const relaxation = Object.entries(rules.relaxationYears ?? {})
    .filter(([, years]) => years > 0)
    .map(([category, years]) => `${category} ${years}`)
    .join(', ')
  const base = `Age ${rules.ageMin ?? 18} to ${rules.ageMax}.`
  return relaxation ? `${base} Extra years: ${relaxation}.` : base
}

/** Latest statistics row that has both vacancies and a candidate count. */
function latestCompetitionRow(statistics) {
  return [...(statistics ?? [])].reverse().find((row) => row.vacancies && (row.appeared || row.applicants)) ?? null
}

/** Pay line: pay level plus estimated in-hand pay (or the recruiter's stated gross) when known. */
function payDetail(exam) {
  if (exam.employmentType === 'eligibility-only') return 'This is an eligibility test, not a job. Pay comes with the recruitment you clear later.'
  const salary = exam.salary
  const estimate = salary?.startingBasic ? estimateSalary({ ruleSetKey: salary.payRuleSet, basicPay: salary.startingBasic, payLevel: salary.payLevel, fixedAdditions: salary.fixedAdditions ?? [] }) : null
  const takeHome = estimate?.inHand && `About ${formatRupees(estimate.inHand)} a month in hand in a big city (estimate).`
  const statedGross = salary?.officialGrossNote ?? (salary?.officialGross && `About ${formatRupees(salary.officialGross)} a month gross, as stated by the recruiter.`)
  const parts = [salary?.payLevel && `${salary.payLevel}.`, takeHome || statedGross].filter(Boolean)
  return parts.length ? parts.join(' ') : 'Pay differs by post.'
}

/** Big pay answer: basic, stated monthly pay, "No salary" for eligibility tests, or "Varies by post". */
function payAnswer(exam) {
  const pay = payHeadline(exam)
  if (!pay.value) return pay.note === 'Varies' ? 'Varies by post' : pay.note
  return pay.label === 'Starting basic' ? `${pay.value} basic` : `${pay.value} a month`
}

/** "Hard, 76/100" style answer for the difficulty question. */
function difficultyAnswer(score) {
  return score == null ? 'Not rated' : `${difficultyBand(score).label}, ${score}/100`
}

/** Quick look tab. */
export function QuickLookTab({ exam, onOpenTab }) {
  const rules = exam.eligibilityRules ?? {}
  // The date-aware key event is computed on the index record, not the full profile.
  const indexRecord = getIndexRecord(exam.id)
  const keyEvent = indexRecord?.keyEvent
  const competitionRow = latestCompetitionRow(exam.statistics)
  const perPost = competitionRow ? Math.round((competitionRow.appeared ?? competitionRow.applicants) / competitionRow.vacancies) : null
  const stages = exam.selection?.stages ?? []
  const posts = exam.posts ?? []
  const hiddenPostCount = posts.length - visiblePostCount
  const companions = indexRecord?.syllabusTags?.length ? companionsFor(indexRecord, { limit: companionCount }).filter((entry) => entry.similarity >= minimumSimilarity) : []

  return (
    <div className="tab-body quick-look">
      <p className="quick-hook">{firstSentence(exam.summary)}</p>

      <div className="quick-grid">
        <QuestionCard question="Can I apply?" answer={labelFor('educationLevels', rules.minEducation)} detail={ageDetail(rules)} tabId="eligibility" tabLabel="Full eligibility" onOpenTab={onOpenTab}>
          {rules.finalYearAllowed && <p className="quick-tag">Final-year students can apply</p>}
        </QuestionCard>
        <QuestionCard question="What will I earn?" answer={payAnswer(exam)} detail={payDetail(exam)} tabId="salary" tabLabel="Salary and growth" onOpenTab={onOpenTab} />
        <QuestionCard
          question="How tough is it?"
          answer={difficultyAnswer(indexRecord?.difficultyScore)}
          detail={firstSentence(exam.difficulty?.rationale)}
          tabId="cutoffs"
          tabLabel="Cutoffs and numbers"
          onOpenTab={onOpenTab}
        >
          {perPost ? (
            <p className="quick-tag">{`${formatCount(perPost)} ${competitionRow.appeared ? 'appeared' : 'applied'} per vacancy, ${competitionRow.year}`}</p>
          ) : (
            <p className="quick-tag">
              <LevelMeter level={exam.difficulty?.competition} label="Competition" /> competition
            </p>
          )}
        </QuestionCard>
        <QuestionCard question="When is the next step?" answer={keyEvent?.upcoming ? <NextStepChip keyEvent={keyEvent} /> : 'Next cycle expected'} detail={keyEvent?.upcoming ? exam.frequency : exam.status?.note} tabId="overview" tabLabel="Official timeline" onOpenTab={onOpenTab}>
          {!keyEvent?.upcoming && keyEvent && (
            <p className="quick-last">
              <KeyEventLine keyEvent={keyEvent} />
            </p>
          )}
        </QuestionCard>
      </div>

      {stages.length > 0 && (
        <section className="quick-section">
          <h3 className="quick-question">How you get selected</h3>
          <ol className="quick-steps">
            {stages.map((stage, position) => (
              <li key={stage.name}>
                <span className="quick-step-number numeric">{position + 1}</span>
                <span>{stage.name}</span>
              </li>
            ))}
          </ol>
          <MoreLink tabId="selection" onOpenTab={onOpenTab}>
            Exam pattern and syllabus
          </MoreLink>
        </section>
      )}

      {companions.length > 0 && (
        <section className="quick-section">
          <h3 className="quick-question">Prepare for these together</h3>
          <ul className="quick-posts">
            {companions.map((entry) => (
              <li key={entry.exam.id}>
                <Link to={`/exams/${entry.exam.id}`}>{entry.exam.abbreviation || entry.exam.name}</Link> <span className="faint">{Math.round(entry.coverage * 100)}% shared</span>
              </li>
            ))}
          </ul>
          <Link to="/syllabus" className="quick-more">
            Syllabus overlap tool <ArrowRightCircle size={14} aria-hidden="true" />
          </Link>
        </section>
      )}

      {posts.length > 0 && (
        <section className="quick-section">
          <h3 className="quick-question">Jobs you can get</h3>
          <ul className="quick-posts">
            {posts.slice(0, visiblePostCount).map((post) => (
              <li key={post.name}>{post.name}</li>
            ))}
            {hiddenPostCount > 0 && <li className="quick-posts-more">and {hiddenPostCount} more</li>}
          </ul>
          <MoreLink tabId="overview" onOpenTab={onOpenTab}>
            All posts with pay
          </MoreLink>
        </section>
      )}
    </div>
  )
}
