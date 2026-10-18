/**
 * Home page: search hero, region navigation, live status counts, upcoming official
 * dates, in-depth guides and the tool list. All numbers come from the exam index.
 */
import { Link } from 'react-router'
import { ArrowRight, Landmark, MapPinned, CalendarClock, BookOpenText, ShieldCheck, UserRound } from 'lucide-react'
import { useSaved } from '../lib/saved.jsx'
import { isProfileUsable, summariseMatches } from '../lib/candidate.js'
import { SearchBox } from '../components/SearchBox.jsx'
import { Counter, Reveal, SectionHeading } from '../components/Common.jsx'
import { ExamCard } from '../components/ExamCard.jsx'
import { StatusBadge } from '../components/Badges.jsx'
import { toolLinks } from '../lib/navigation.js'
import { examIndex, sourceIndex, vocabulary, jurisdictionRoutes } from '../lib/data.js'
import { formatDate, todayIso } from '../lib/format.js'

const regionBlurbs = {
  central: 'UPSC, SSC, Railways, banks, defence, CAPF, science bodies and PSUs.',
  'andhra-pradesh': 'APPSC, police, DSC teachers, village and ward secretariats and more.',
  telangana: 'TGPSC, police, teacher recruitment, gurukul and health boards and more.',
}

const quickSearches = ['UPSC', 'SSC CGL', 'Bank PO', 'Group 2', 'Police constable', 'Teacher', 'GATE PSU', 'Junior Engineer']

/** Upcoming official events across all exams, soonest first. */
function upcomingEvents(limit) {
  const today = todayIso()
  return examIndex
    .filter((exam) => exam.keyEvent?.upcoming && exam.keyEvent.date >= today)
    .sort((a, b) => a.keyEvent.date.localeCompare(b.keyEvent.date))
    .slice(0, limit)
}

/** Personal summary when a profile is saved, otherwise an invitation to create one. */
function PersonalStrip() {
  const { candidate } = useSaved()
  if (!isProfileUsable(candidate)) {
    return (
      <Link to="/profile" className="personal-strip">
        <UserRound size={20} aria-hidden="true" />
        <span>
          <strong>Set up your profile once</strong>
          <span className="muted"> Enter age, category and degree, and every page will show what fits you. No login.</span>
        </span>
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    )
  }
  const matches = summariseMatches(candidate)
  const preferred = matches.eligible.filter((entry) => entry.preferred).length
  return (
    <Link to="/plan" className="personal-strip is-set">
      <UserRound size={20} aria-hidden="true" />
      <span>
        <strong>{candidate.name ? `${candidate.name}, ` : ''}you likely fit {matches.eligible.length} exams</strong>
        <span className="muted"> ({preferred} in your preferred governments and sectors), and {matches.check.length} need a closer look. Open your plan.</span>
      </span>
      <ArrowRight size={16} aria-hidden="true" />
    </Link>
  )
}

/** Landing page. */
export default function HomePage() {
  const statusCounts = { active: 0, recurring: 0, historical: 0 }
  for (const exam of examIndex) statusCounts[exam.status] = (statusCounts[exam.status] ?? 0) + 1
  const guides = examIndex.filter((exam) => exam.hasGuide).slice(0, 6)
  const events = upcomingEvents(6)
  const primarySources = sourceIndex.filter((source) => source.type === 'primary').length

  return (
    <div className="home">
      <section className="hero">
        <p className="eyebrow">Government recruitment research</p>
        <h1>
          Every route into government service, <em>checked against the source.</em>
        </h1>
        <p className="lead">Eligibility, exam stages, syllabus, cutoffs, pay and career growth for Central, Andhra Pradesh and Telangana recruitment. Every fact links back to an official notification or document.</p>
        <div className="hero-search">
          <SearchBox size="large" placeholder="Try IAS, SSC CGL, Group 2, constable, bank PO" />
        </div>
        <div className="quick-searches" aria-label="Popular searches">
          {quickSearches.map((term) => (
            <Link key={term} to={`/exams?q=${encodeURIComponent(term)}`}>
              {term}
            </Link>
          ))}
        </div>
        <dl className="hero-stats">
          <div>
            <dt>Profiles</dt>
            <dd>
              <Counter value={examIndex.length} />
            </dd>
          </div>
          <div>
            <dt>Sources cited</dt>
            <dd>
              <Counter value={sourceIndex.length} />
            </dd>
          </div>
          <div>
            <dt>Official sources</dt>
            <dd>
              <Counter value={primarySources} />
            </dd>
          </div>
        </dl>
      </section>

      <PersonalStrip />

      <SectionHeading number="01" title="Choose a government" description="Each section lists every profiled exam and recruitment route for that government." />
      <div className="region-grid">
        {Object.entries(vocabulary.jurisdictions).map(([key, label], position) => {
          const count = examIndex.filter((exam) => exam.jurisdiction === key).length
          const Icon = key === 'central' ? Landmark : MapPinned
          return (
            <Reveal key={key} delay={position * 60}>
              <Link to={jurisdictionRoutes[key]} className="region-card">
                <Icon size={22} aria-hidden="true" />
                <h3>{label}</h3>
                <p>{regionBlurbs[key]}</p>
                <span className="region-count">
                  <span className="numeric">{count}</span> profiles <ArrowRight size={14} aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          )
        })}
      </div>

      <SectionHeading number="02" title="Recruitment status today" description="Active means applications are open or an official schedule exists. Historical routes are kept for reference and clearly marked." />
      <div className="status-strip">
        {Object.entries(statusCounts).map(([status, count]) => (
          <Link key={status} to={`/exams?status=${status}`} className="status-tile">
            <StatusBadge status={status} />
            <span className="status-count numeric">{count}</span>
            <span className="muted">{vocabulary.statusTypes[status]}</span>
          </Link>
        ))}
      </div>

      {events.length > 0 && (
        <>
          <SectionHeading number="03" title="Coming up" description="Next official dates. Tentative dates are marked and come only from official calendars." />
          <ol className="event-list">
            {events.map((exam) => (
              <li key={exam.id}>
                <span className="event-date numeric">{formatDate(exam.keyEvent.date)}</span>
                <span className="event-name">
                  <Link to={`/exams/${exam.id}`}>{exam.abbreviation || exam.name}</Link>
                  <span className="muted"> {exam.keyEvent.event}</span>
                  {exam.keyEvent.dateType === 'official-tentative' && <span className="faint"> (tentative)</span>}
                </span>
                <CalendarClock size={16} aria-hidden="true" className="faint" />
              </li>
            ))}
          </ol>
          <Link to="/calendar" className="text-link more-link">
            Full calendar
          </Link>
        </>
      )}

      {guides.length > 0 && (
        <>
          <SectionHeading number="04" title="In-depth guides" description="Big exams explained stage by stage: syllabus, interview, service allocation and pay levels." />
          <div className="card-grid">
            {guides.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        </>
      )}

      <SectionHeading number="05" title="Decision tools" description="Everything runs in your browser. Nothing you enter leaves your device." />
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

      <div className="trust-note">
        <ShieldCheck size={20} aria-hidden="true" />
        <p>
          Facts carry source links. Ratings for difficulty, competition and risk are our analytical judgments, shown with their reasoning. Missing data is marked, never guessed. Read the <Link to="/methodology" className="text-link">methodology</Link> or the <Link to="/coverage" className="text-link">coverage report</Link>.
        </p>
        <BookOpenText size={20} aria-hidden="true" className="faint" />
      </div>
    </div>
  )
}
