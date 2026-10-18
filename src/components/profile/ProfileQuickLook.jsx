/**
 * Quick look tab: the default first view of an exam page. Answers the four questions
 * most readers come with (can I apply, what do I earn, how tough, when) in big type,
 * then shows the selection steps and top posts. Each block links to the detailed tab.
 * Rendered by pages/ExamPage.jsx.
 */
import { ArrowRightCircle } from 'lucide-react'
import { LevelMeter } from '../Badges.jsx'
import { NextStepChip, KeyEventLine } from '../ExamCard.jsx'
import { labelFor, getIndexRecord } from '../../lib/data.js'
import { estimateSalary } from '../../lib/salary.js'
import { formatCount, formatRupees, firstSentence } from '../../lib/format.js'

// Only this many post names are shown before "and N more".
const visiblePostCount = 5

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
  if (rules?.ageMax == null) return 'Age limits differ by post.'
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
function payDetail(salary) {
  const estimate = salary?.startingBasic ? estimateSalary({ ruleSetKey: salary.payRuleSet, basicPay: salary.startingBasic, payLevel: salary.payLevel, fixedAdditions: salary.fixedAdditions ?? [] }) : null
  const takeHome = estimate?.inHand && `about ${formatRupees(estimate.inHand)} a month in hand in a big city (estimate)`
  const statedGross = salary?.officialGross && `about ${formatRupees(salary.officialGross)} a month gross (as stated by the recruiter)`
  const parts = [salary?.payLevel, takeHome || statedGross].filter(Boolean)
  return parts.length ? parts.join(', ') : 'Pay differs by post.'
}

/** Quick look tab. */
export function QuickLookTab({ exam, onOpenTab }) {
  const rules = exam.eligibilityRules ?? {}
  // The date-aware key event is computed on the index record, not the full profile.
  const keyEvent = getIndexRecord(exam.id)?.keyEvent
  const competitionRow = latestCompetitionRow(exam.statistics)
  const perPost = competitionRow ? Math.round((competitionRow.appeared ?? competitionRow.applicants) / competitionRow.vacancies) : null
  const stages = exam.selection?.stages ?? []
  const posts = exam.posts ?? []
  const hiddenPostCount = posts.length - visiblePostCount

  return (
    <div className="tab-body quick-look">
      <p className="quick-hook">{firstSentence(exam.summary)}</p>

      <div className="quick-grid">
        <QuestionCard question="Can I apply?" answer={labelFor('educationLevels', rules.minEducation)} detail={ageDetail(rules)} tabId="eligibility" tabLabel="Full eligibility" onOpenTab={onOpenTab}>
          {rules.finalYearAllowed && <p className="quick-tag">Final-year students can apply</p>}
        </QuestionCard>
        <QuestionCard question="What will I earn?" answer={formatRupees(exam.salary?.startingBasic) ? `${formatRupees(exam.salary.startingBasic)} basic` : 'Varies by post'} detail={payDetail(exam.salary)} tabId="salary" tabLabel="Salary and growth" onOpenTab={onOpenTab} />
        <QuestionCard
          question="How tough is it?"
          answer={perPost ? `${formatCount(perPost)} per post` : <LevelMeter level={exam.difficulty?.competition} label="Competition" />}
          detail={firstSentence(exam.difficulty?.rationale)}
          tabId="cutoffs"
          tabLabel="Cutoffs and numbers"
          onOpenTab={onOpenTab}
        >
          {perPost && <p className="quick-tag">{`${competitionRow.appeared ? 'Appeared' : 'Applied'} per vacancy, ${competitionRow.year}`}</p>}
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
