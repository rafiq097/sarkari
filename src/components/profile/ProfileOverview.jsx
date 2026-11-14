/**
 * Overview tab: the default first view of an exam page. Answers only five questions in
 * big type (can I apply, what is it, pay range, when it usually opens, selection rate).
 * Everything else sits in collapsed sections here (about, timeline, sources) or in the
 * other tabs. Rendered by pages/ExamPage.jsx.
 */
import { Link } from 'react-router'
import { ArrowRightCircle } from 'lucide-react'
import { Fold } from '../Common.jsx'
import { NextStepChip, KeyEventLine } from '../ExamCard.jsx'
import { AboutRoute, Timeline } from './ProfileBasics.jsx'
import { SourcesTab } from './ProfileJudgement.jsx'
import { labelFor, getIndexRecord } from '../../lib/data.js'
import { estimateSalary } from '../../lib/salary.js'
import { selectionRates } from '../../lib/stats.js'
import { usualOpening } from '../../lib/pattern.js'
import { useSaved } from '../../lib/saved.jsx'
import { useFolds } from '../../lib/useFolds.js'
import { verdictFor } from '../../lib/candidate.js'
import { formatCount, formatDate, formatPercent, formatRupees, firstSentence, payHeadline } from '../../lib/format.js'

// At most this many reasons from the personal verdict are shown on the card.
const visibleFindingCount = 3

const verdictTitles = {
  eligible: 'You are likely eligible',
  check: 'Some conditions need checking',
  'not-eligible': 'You do not meet a requirement',
}

/** Button that opens another tab, optionally at one of its collapsed sections. */
function MoreLink({ tabId, sectionId, onOpenTab, children }) {
  return (
    <button type="button" className="quick-more" onClick={() => onOpenTab(tabId, sectionId ? { section: sectionId } : {})}>
      {children} <ArrowRightCircle size={14} aria-hidden="true" />
    </button>
  )
}

/** One question card with a big answer, a short supporting line and a link to details. */
function QuestionCard({ question, answer, detail, more, isWide = false, children }) {
  return (
    <section className={`quick-card ${isWide ? 'is-wide' : ''}`}>
      <h3 className="quick-question">{question}</h3>
      <div className="quick-answer">{answer}</div>
      {detail && <p className="quick-detail">{detail}</p>}
      {children}
      {more}
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

/**
 * "Can I apply?" card. With a saved My Profile it shows the personal verdict and its
 * reasons; without one it shows the general rule and a prompt to add details.
 */
function CanIApplyCard({ exam, onOpenTab }) {
  const { candidate } = useSaved()
  const rules = exam.eligibilityRules ?? {}
  // The verdict is for the stream being viewed, so it uses the merged rules, not the index's per-stream list.
  const result = verdictFor({ eligibilityRules: rules }, candidate)
  const more = (
    <MoreLink tabId="eligibility" onOpenTab={onOpenTab}>
      Full eligibility
    </MoreLink>
  )
  if (!result) {
    return (
      <QuestionCard question="Can I apply?" answer={labelFor('educationLevels', rules.minEducation)} detail={ageDetail(rules)} more={more}>
        {rules.finalYearAllowed && <p className="quick-tag">Final-year students can apply</p>}
        <p className="quick-last">
          <Link to="/profile" className="text-link">
            Add your details once
          </Link>{' '}
          to get a personal answer here.
        </p>
      </QuestionCard>
    )
  }
  return (
    <QuestionCard question="Can I apply?" answer={verdictTitles[result.verdict]} more={more}>
      <ul className="finding-list">
        {result.findings.slice(0, visibleFindingCount).map((finding) => (
          <li key={finding.text} className={`finding-${finding.level}`}>
            {finding.text}
          </li>
        ))}
      </ul>
      <p className="quick-last">
        Indicative, based on{' '}
        <Link to="/profile" className="text-link">
          your profile
        </Link>
        . The official notification decides.
      </p>
    </QuestionCard>
  )
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

/** Big pay answer: the range of starting basic pay across posts, else the headline pay. */
function payAnswer(exam) {
  const postBasics = (exam.posts ?? []).map((post) => post.startingBasic).filter(Boolean)
  const lowestBasic = Math.min(...postBasics)
  const highestBasic = Math.max(...postBasics)
  if (postBasics.length > 1 && lowestBasic !== highestBasic) return `${formatRupees(lowestBasic)} to ${formatRupees(highestBasic)} basic`
  const pay = payHeadline(exam)
  if (!pay.value) return pay.note === 'Varies' ? 'Varies by post' : pay.note
  return pay.label === 'Starting basic' ? `${pay.value} basic` : `${pay.value} a month`
}

/** Selection-rate answer and its supporting line, from the latest official counts. */
function selectionRateFacts(statistics) {
  const ratedRow = [...(statistics ?? [])].reverse().find((row) => row.selected && (row.appeared || row.applicants))
  if (ratedRow) {
    const rates = selectionRates(ratedRow)
    const usesAppeared = rates.perAppeared != null
    return {
      answer: formatPercent(usesAppeared ? rates.perAppeared : rates.perApplicant),
      detail: `${formatCount(ratedRow.selected)} selected out of ${formatCount(usesAppeared ? ratedRow.appeared : ratedRow.applicants)} who ${usesAppeared ? 'appeared' : 'applied'} (${ratedRow.year}, official counts).`,
    }
  }
  const competitionRow = latestCompetitionRow(statistics)
  if (competitionRow) {
    const perVacancy = Math.round((competitionRow.appeared ?? competitionRow.applicants) / competitionRow.vacancies)
    return {
      answer: `1 post per ${formatCount(perVacancy)}`,
      detail: `${formatCount(perVacancy)} ${competitionRow.appeared ? 'appeared' : 'applied'} per vacancy in ${competitionRow.year}. The final selected count is not published.`,
    }
  }
  return { answer: 'Not published', detail: 'No official counts of candidates and selections were found for this route.' }
}

/** "When does it usually open?" answer and supporting line, from official opening dates. */
function openingFacts(exam) {
  const opening = usualOpening(exam.status?.cycles)
  if (!opening) return { answer: exam.frequency ?? 'No fixed pattern', detail: firstSentence(exam.status?.note) }
  return {
    answer: `Around ${opening.monthName}`,
    detail: `${exam.frequency ? `${exam.frequency}. ` : ''}Based on the last official date: ${opening.basedOn.event}, ${formatDate(opening.basedOn.date)}.`,
  }
}

/** Overview tab. */
export function OverviewTab({ exam, onOpenTab, requestedSection }) {
  const folds = useFolds(requestedSection)
  // The date-aware key event is computed on the index record, not the full profile.
  const indexRecord = getIndexRecord(exam.id)
  const keyEvent = indexRecord?.keyEvent
  const stageCount = exam.selection?.stages?.length ?? 0
  const selectionRate = selectionRateFacts(exam.statistics)
  const opening = openingFacts(exam)
  const cycleCount = exam.status?.cycles?.length ?? 0

  return (
    <div className="tab-body quick-look">
      <div className="quick-grid">
        <CanIApplyCard exam={exam} onOpenTab={onOpenTab} />
        <QuestionCard
          question="What is it?"
          answer={labelFor('profileTypes', exam.profileType)}
          detail={firstSentence(exam.summary)}
          more={
            <MoreLink tabId="exam" onOpenTab={onOpenTab}>
              {stageCount ? `${stageCount} selection stages, step by step` : 'Exam and syllabus'}
            </MoreLink>
          }
        />
        <QuestionCard
          question="What is the pay?"
          answer={payAnswer(exam)}
          detail={payDetail(exam)}
          more={
            <MoreLink tabId="pay" onOpenTab={onOpenTab}>
              Pay and career
            </MoreLink>
          }
        />
        <QuestionCard
          question="When does it usually open?"
          answer={opening.answer}
          detail={opening.detail}
          more={
            <MoreLink tabId="overview" sectionId="timeline" onOpenTab={onOpenTab}>
              Official timeline
            </MoreLink>
          }
        >
          {keyEvent?.upcoming ? (
            <NextStepChip keyEvent={keyEvent} />
          ) : (
            keyEvent && (
              <p className="quick-last">
                <KeyEventLine keyEvent={keyEvent} />
              </p>
            )
          )}
        </QuestionCard>
        <QuestionCard
          question="How many get selected?"
          answer={selectionRate.answer}
          detail={selectionRate.detail}
          isWide
          more={
            <MoreLink tabId="exam" sectionId="cutoffs" onOpenTab={onOpenTab}>
              Cutoffs and numbers
            </MoreLink>
          }
        />
      </div>

      <Fold id="about" title="About this route" hint="Recruiter, route type, official links" folds={folds}>
        <AboutRoute exam={exam} />
      </Fold>
      <Fold id="timeline" title="Official timeline" hint={cycleCount ? `${cycleCount} ${cycleCount === 1 ? 'cycle' : 'cycles'} with official dates` : 'No dated events'} folds={folds}>
        <Timeline cycles={exam.status.cycles} sources={exam.sources} />
      </Fold>
      <Fold id="sources" title="Sources and data gaps" hint={`${exam.sources.length} references`} folds={folds}>
        <SourcesTab exam={exam} />
      </Fold>
    </div>
  )
}
