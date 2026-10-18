/**
 * Small static pages: saved exams, tools index, methodology and not-found.
 * Each is a default export of its own module re-exported below for lazy routes.
 */
import { Link } from 'react-router'
import { ArrowRight, BookMarked, Compass } from 'lucide-react'
import { Breadcrumbs, EmptyState, PageHeader, SectionHeading } from '../components/Common.jsx'
import { ExamCard } from '../components/ExamCard.jsx'
import { toolLinks } from '../lib/navigation.js'
import { useSaved } from '../lib/saved.jsx'
import { getIndexRecord } from '../lib/data.js'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'

/** Bookmarked exams. */
export function SavedPage() {
  const { bookmarks } = useSaved()
  const exams = bookmarks.map(getIndexRecord).filter(Boolean)
  return (
    <>
      <Breadcrumbs items={[{ label: 'Saved exams' }]} />
      <PageHeader eyebrow="Your list" title="Saved exams" lead="Bookmarks are stored only in this browser. Clearing site data removes them." />
      {exams.length ? (
        <div className="card-grid">
          {exams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookMarked}
          title="No saved exams"
          action={
            <Link to="/exams" className="button">
              Browse exams
            </Link>
          }
        >
          Use the bookmark button on any exam card or profile to keep it here.
        </EmptyState>
      )}
    </>
  )
}

/** Tools index. */
export function ToolsPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Tools' }]} />
      <PageHeader eyebrow="Decision tools" title="Tools" lead="Everything runs in your browser on the researched data. Results are indicative; official notifications decide." />
      <div className="tool-grid">
        {toolLinks.map((tool) => (
          <Link key={tool.to} to={tool.to} className="tool-card">
            <tool.icon size={20} aria-hidden="true" />
            <span>
              <strong>{tool.label}</strong>
              <span className="muted">{tool.text}</span>
            </span>
            <ArrowRight size={16} aria-hidden="true" className="tool-arrow" />
          </Link>
        ))}
      </div>
    </>
  )
}

const ratingRules = [
  ['Syllabus depth', 'Low: school-level general topics. Medium: graduate-level general or one technical subject. High: several graduate or postgraduate subjects, descriptive papers, or an optional subject.'],
  ['Competition', 'Based on official applicants or appeared candidates per vacancy where published. High: more than about 500 per vacancy. Medium: about 50 to 500. Low: under about 50. Without official counts we rate qualitatively and say so.'],
  ['Time pressure', 'Questions per minute and calculation load in the main objective paper.'],
  ['Technical complexity', 'Whether a specific degree, diploma or trade syllabus is examined, and at what depth.'],
  ['Physical requirements', 'Whether physical standards, endurance tests or demanding medicals are part of selection.'],
  ['Selection uncertainty', 'Number of stages, interview weight, normalization, and how much a single paper decides the result.'],
  ['Recruitment regularity', 'High: an annual cycle that has run on schedule. Medium: regular but with gaps or delays. Low: irregular, years apart, or one-off.'],
  ['Risk', 'Combines limited vacancies, irregular recruitment, changing eligibility, long cycles, and documented cancellations or litigation.'],
]

/** How data is gathered and rated. */
export function MethodologyPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Methodology' }]} />
      <PageHeader eyebrow="Research" title="Methodology" lead="How facts are gathered, how uncertainty is shown, and how the analytical ratings are made." />
      <div className="prose">
        <SectionHeading number="01" title="Facts" />
        <p>Facts come first from official sources: notifications, detailed advertisements, official syllabuses, pay rules and Government Orders, annual reports, results and official statistics. Where an official document could not be reached, a reputable secondary report is used, marked as secondary with a dashed chip. Every profile lists its sources with publisher and year.</p>
        <p>Values that could not be verified are left empty and shown as "Not available". They are never estimated. Dates are only official dates; tentative dates appear only when an official annual calendar labels them so.</p>
        <SectionHeading number="02" title="Status" />
        <p>Active: applications are open or an official schedule exists. Recurring: an established route with no confirmed current notification. Historical: a past or discontinued route, kept for reference and never presented as an opportunity.</p>
        <SectionHeading number="03" title="Salary estimates" />
        <p>Starting basic pay comes from the notification or pay rules. Gross and in-hand figures are estimates built from the DA, HRA and transport rules currently in force, minus pension contribution and professional tax. Income tax, insurance, health-scheme deductions and post-specific allowances are excluded. Bank and some PSU pay is not modelled because DA there changes quarterly or by company rules; the recruiter's own figure is shown instead where published.</p>
        <SectionHeading number="04" title="Selection rates" />
        <p>Selection rate is calculated only when the same official report gives both the number selected and the number who applied or appeared. Both versions are shown with their formula. No individual success probability is ever given.</p>
        <SectionHeading number="05" title="Analytical ratings" />
        <p>Difficulty, career, recruitment regularity and risk ratings are our judgments, not official ratings. Each profile explains its rating.</p>
        <div className="table-wrap">
          <table className="data-table">
            <tbody>
              {ratingRules.map(([name, rule]) => (
                <tr key={name}>
                  <th scope="row">{name}</th>
                  <td>{rule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <SectionHeading number="06" title="Eligibility checker" />
        <p>The checker compares your details with the broadest age and qualification envelope of each exam, plus common SC, ST, OBC, EWS and PwBD age relaxations. Ex-servicemen, widow, departmental and many state-specific relaxations are not modelled. Treat a result as a pointer to read the notification, not a decision.</p>
      </div>
    </>
  )
}

/** Not-found page. */
export function NotFoundPage() {
  useDocumentTitle('Page not found')
  return (
    <EmptyState
      icon={Compass}
      title="Page not found"
      action={
        <Link to="/" className="button">
          Go home
        </Link>
      }
    >
      The address may be mistyped, or the page has moved.
    </EmptyState>
  )
}
