/**
 * The two composed exam page tabs: "Exam and syllabus" (roadmap open; explainer,
 * syllabus, cutoffs and companion exams collapsed) and "Pay and career" (pay open;
 * posts, career and work life collapsed). Rendered by pages/ExamPage.jsx.
 */
import { Link } from 'react-router'
import { ArrowRightCircle } from 'lucide-react'
import { Fold } from '../Common.jsx'
import { Unknown } from '../Badges.jsx'
import { PostCards } from './ProfileBasics.jsx'
import { GuideTab, SelectionTab, SyllabusTab } from './ProfileExam.jsx'
import { StatsTab, PaySection, CareerSection } from './ProfileNumbers.jsx'
import { WorkTab } from './ProfileJudgement.jsx'
import { companionsFor, overlapEntryFor } from '../../lib/syllabus.js'
import { useFolds } from '../../lib/useFolds.js'

// Exams sharing at least this share of syllabus subjects count as "prepare together".
const minimumSimilarity = 0.35
const companionCount = 4

/** Exams whose syllabus overlaps enough to prepare for at the same time (for the chosen stream, if any). */
function companionExams(exam) {
  const baseEntry = overlapEntryFor(exam.id, exam.activeVariant?.id)
  if (!baseEntry) return []
  return companionsFor(baseEntry, { limit: companionCount }).filter((entry) => entry.similarity >= minimumSimilarity)
}

/** List of companion exams with the shared share of syllabus, plus a link to the overlap tool. */
function CompanionList({ companions }) {
  return (
    <div className="tab-body">
      <ul className="quick-posts">
        {companions.map((entry) => (
          <li key={entry.key}>
            <Link to={`/exams/${entry.exam.id}${entry.variant ? `?variant=${entry.variant.id}` : ''}`}>{entry.label}</Link> <span className="faint">{Math.round(entry.coverage * 100)}% shared</span>
          </li>
        ))}
      </ul>
      <Link to="/syllabus" className="quick-more">
        Syllabus overlap tool <ArrowRightCircle size={14} aria-hidden="true" />
      </Link>
    </div>
  )
}

/** "Exam and syllabus" tab. */
export function ExamSyllabusTab({ exam, requestedSection }) {
  const folds = useFolds(requestedSection)
  const guideSectionCount = exam.guide?.sections?.length ?? 0
  const subjectCount = exam.syllabus?.sections?.length ?? 0
  const cutoffYearCount = new Set((exam.cutoffs ?? []).map((row) => row.year)).size
  const companions = companionExams(exam)
  return (
    <div className="tab-stack">
      <SelectionTab exam={exam} />
      {guideSectionCount > 0 && (
        <Fold id="guide" title="Explainer" hint={`${guideSectionCount} sections in plain words`} folds={folds}>
          <GuideTab exam={exam} />
        </Fold>
      )}
      <Fold id="syllabus" title="Syllabus" hint={subjectCount ? `${subjectCount} ${subjectCount === 1 ? 'subject' : 'subjects'}` : 'Official document only'} folds={folds}>
        <SyllabusTab exam={exam} />
      </Fold>
      <Fold id="cutoffs" title="Cutoffs and numbers" hint={cutoffYearCount ? `Official cutoffs for ${cutoffYearCount} ${cutoffYearCount === 1 ? 'year' : 'years'}` : 'Vacancies and selections'} folds={folds}>
        <StatsTab exam={exam} />
      </Fold>
      {companions.length > 0 && (
        <Fold id="together" title="Prepare for these together" hint={`${companions.length} exams with a similar syllabus`} folds={folds}>
          <CompanionList companions={companions} />
        </Fold>
      )}
    </div>
  )
}

/** "Pay and career" tab. */
export function PayCareerTab({ exam, requestedSection }) {
  const folds = useFolds(requestedSection)
  const posts = exam.posts ?? []
  const ladderStepCount = exam.career?.progression?.length ?? 0
  return (
    <div className="tab-stack">
      <PaySection exam={exam} />
      <Fold id="posts" title="Posts filled through this route" hint={posts.length ? `${posts.length} ${posts.length === 1 ? 'post' : 'posts'} with pay` : 'Not recorded'} folds={folds}>
        {posts.length ? <PostCards posts={posts} /> : <Unknown>Post list not recorded.</Unknown>}
      </Fold>
      <Fold id="career" title="Career and benefits" hint={ladderStepCount ? `${ladderStepCount} steps on the promotion ladder` : 'Promotions and perks'} folds={folds}>
        <CareerSection exam={exam} />
      </Fold>
      <Fold id="work" title="Work life and risk" hint="Postings, workload, difficulty, risk" folds={folds}>
        <WorkTab exam={exam} />
      </Fold>
    </div>
  )
}
