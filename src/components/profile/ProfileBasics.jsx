/**
 * Exam profile tabs for identity and eligibility: Overview (organization, posts,
 * official timeline) and Eligibility (age, education, attempts, reservation).
 * Rendered by pages/ExamPage.jsx.
 */
import { Link } from 'react-router'
import { ExternalLink, AlertTriangle, Info, UserCheck } from 'lucide-react'
import { SourceChips, ValueOrUnknown, Unknown, StatusBadge } from '../Badges.jsx'
import { labelFor } from '../../lib/data.js'
import { formatDate, formatRupees } from '../../lib/format.js'

/** Heading for a block inside a tab, with its source chips. */
export function BlockTitle({ children, sourceIds, sources }) {
  return (
    <h3 className="block-title">
      {children} <SourceChips sourceIds={sourceIds} sources={sources} />
    </h3>
  )
}

/** Official dated events grouped by cycle. */
function Timeline({ cycles, sources }) {
  if (!cycles?.length) return <Unknown>No dated official events recorded for this route.</Unknown>
  return (
    <div className="timeline">
      {cycles.map((cycle) => (
        <div key={cycle.cycle} className="timeline-cycle">
          <h4>{cycle.cycle}</h4>
          <ol>
            {cycle.events.map((event) => (
              <li key={`${event.event}-${event.date}`}>
                <span className="numeric timeline-date">{formatDate(event.date) ?? 'Date not announced'}</span>
                <span>
                  {event.event}
                  {event.dateType === 'official-tentative' && <span className="faint"> (tentative, official calendar)</span>}
                </span>
                <SourceChips sourceIds={event.source ? [event.source] : []} sources={sources} />
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  )
}

/** Overview tab. */
export function OverviewTab({ exam }) {
  return (
    <div className="tab-body">
      <p className="profile-summary">{exam.summary}</p>
      <dl className="key-value">
        <dt>Recruiting body</dt>
        <dd>
          {exam.organization.name} {exam.organization.abbreviation && `(${exam.organization.abbreviation})`}{' '}
          {exam.organization.website && (
            <a href={exam.organization.website} target="_blank" rel="noreferrer" className="text-link">
              website
            </a>
          )}
        </dd>
        <dt>Department served</dt>
        <dd>
          <ValueOrUnknown value={exam.department} fallback="Multiple / not specific" />
        </dd>
        <dt>Route type</dt>
        <dd>{labelFor('profileTypes', exam.profileType)}</dd>
        <dt>Employment</dt>
        <dd>{labelFor('employmentTypes', exam.employmentType)}</dd>
        <dt>Selection uses</dt>
        <dd>{exam.recruitmentMethods.map((method) => labelFor('recruitmentMethods', method)).join(', ')}</dd>
        <dt>Frequency</dt>
        <dd>
          <ValueOrUnknown value={exam.frequency} />
        </dd>
        <dt>Nature</dt>
        <dd>{exam.technical ? 'Technical (specific degree, diploma or trade required)' : 'Non-technical'}</dd>
      </dl>

      {exam.officialLinks?.length > 0 && (
        <div className="link-list">
          {exam.officialLinks.map((link) => (
            <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className="button">
              {link.label} <ExternalLink size={14} aria-hidden="true" />
            </a>
          ))}
        </div>
      )}

      <BlockTitle>Status</BlockTitle>
      <p className="status-line">
        <StatusBadge status={exam.status.type} /> {exam.status.note}
      </p>
      <BlockTitle>Official timeline</BlockTitle>
      <Timeline cycles={exam.status.cycles} sources={exam.sources} />

      <BlockTitle>Posts filled through this route</BlockTitle>
      {exam.posts?.length ? (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Post / service</th>
                <th>Group</th>
                <th>Pay level</th>
                <th className="numeric">Starting basic</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {exam.posts.map((post) => (
                <tr key={post.name}>
                  <td>
                    <strong>{post.name}</strong>
                    {post.notes && <div className="faint small">{post.notes}</div>}
                  </td>
                  <td>{post.group ?? <Unknown>-</Unknown>}</td>
                  <td>{post.payLevel ?? <Unknown>-</Unknown>}</td>
                  <td className="numeric">{formatRupees(post.startingBasic) ?? <Unknown>-</Unknown>}</td>
                  <td className="small">{post.responsibilities ?? <Unknown>-</Unknown>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Unknown>Post list not recorded.</Unknown>
      )}
    </div>
  )
}

/** Eligibility tab. */
export function EligibilityTab({ exam }) {
  const eligibility = exam.eligibility ?? {}
  const sources = exam.sources
  return (
    <div className="tab-body">
      <div className="callout">
        <UserCheck size={18} aria-hidden="true" />
        <div>
          Want a quick answer for your own age, category and degree?{' '}
          <Link to="/eligibility" className="text-link">
            Use the eligibility checker
          </Link>
          . Results are indicative; the official notification decides.
        </div>
      </div>

      <BlockTitle sourceIds={eligibility.sources} sources={sources}>
        Age
      </BlockTitle>
      <p>{eligibility.age?.summary ?? <Unknown />}</p>
      {eligibility.age?.referenceDate && <p className="muted">Age is calculated on: {eligibility.age.referenceDate}</p>}
      {eligibility.age?.relaxations?.length > 0 && (
        <div className="table-wrap spaced">
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th className="numeric">Extra years</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {eligibility.age.relaxations.map((row) => (
                <tr key={row.category}>
                  <td>{row.category}</td>
                  <td className="numeric">{row.years ?? '-'}</td>
                  <td className="small">{row.note ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <dl className="key-value spaced">
        <dt>Education</dt>
        <dd>{eligibility.education?.summary ?? <Unknown />}</dd>
        <dt>Final-year students</dt>
        <dd>{eligibility.education?.finalYearAllowed == null ? <Unknown /> : eligibility.education.finalYearAllowed ? 'May apply (proof needed by the stated date)' : 'Not allowed'}</dd>
        <dt>Minimum marks</dt>
        <dd>
          <ValueOrUnknown value={eligibility.education?.minMarks} fallback="No minimum percentage stated" />
        </dd>
        <dt>Nationality</dt>
        <dd>
          <ValueOrUnknown value={eligibility.nationality} />
        </dd>
        <dt>Domicile / local status</dt>
        <dd>
          <ValueOrUnknown value={eligibility.domicile} fallback="No domicile condition" />
        </dd>
        <dt>Experience</dt>
        <dd>
          <ValueOrUnknown value={eligibility.experience} fallback="Not required" />
        </dd>
        <dt>Physical standards</dt>
        <dd>
          <ValueOrUnknown value={eligibility.physical} fallback="Not applicable" />
        </dd>
        <dt>Medical standards</dt>
        <dd>
          <ValueOrUnknown value={eligibility.medical} fallback="As per service rules" />
        </dd>
      </dl>

      {eligibility.attempts?.length > 0 && (
        <>
          <BlockTitle>Number of attempts</BlockTitle>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Limit</th>
                </tr>
              </thead>
              <tbody>
                {eligibility.attempts.map((row) => (
                  <tr key={row.category}>
                    <td>{row.category}</td>
                    <td>{row.limit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {eligibility.reservation && (
        <>
          <BlockTitle>Reservation</BlockTitle>
          <p>{eligibility.reservation}</p>
        </>
      )}

      {eligibility.examVsPost && (
        <div className="callout callout-sage spaced">
          <Info size={18} aria-hidden="true" />
          <div>
            <strong>Exam eligibility versus post eligibility. </strong>
            {eligibility.examVsPost}
          </div>
        </div>
      )}

      {eligibility.other?.length > 0 && (
        <>
          <BlockTitle>Other conditions</BlockTitle>
          <ul className="plain-list">
            {eligibility.other.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      )}

      {eligibility.disqualifications?.length > 0 && (
        <div className="callout callout-brick spaced">
          <AlertTriangle size={18} aria-hidden="true" />
          <div>
            <strong>Disqualifying conditions and key exceptions</strong>
            <ul className="plain-list">
              {eligibility.disqualifications.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
