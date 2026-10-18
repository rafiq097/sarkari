/**
 * Government cards (Central and each state) with profile and active counts and the
 * biggest exams as quick links. The header shows only Central, so these cards are the
 * main way into state pages. Used on the home page and at the foot of region pages.
 */
import { Link } from 'react-router'
import { ArrowRight, Landmark, MapPinned } from 'lucide-react'
import { Reveal } from './Common.jsx'
import { examIndex, vocabulary, jurisdictionRoutes } from '../lib/data.js'

// How many of the largest exams (by latest vacancies) each card names.
const topExamCount = 3

const regionBlurbs = {
  central: 'UPSC, SSC, Railways, banks, defence, CAPF, science bodies and PSUs.',
  'andhra-pradesh': 'APPSC, police, DSC teachers, power utilities and more.',
  telangana: 'TGPSC, police, teacher recruitment, gurukul and health boards and more.',
  karnataka: 'Karnataka 7th State Pay Commission scales, DA and allowances.',
}

/** Exams of one government with the most recent vacancies first. */
function biggestExams(jurisdiction) {
  return examIndex
    .filter((exam) => exam.jurisdiction === jurisdiction)
    .sort((a, b) => (b.vacancies?.count ?? 0) - (a.vacancies?.count ?? 0))
    .slice(0, topExamCount)
}

/** One government card. */
function RegionCard({ jurisdiction, label }) {
  const exams = examIndex.filter((exam) => exam.jurisdiction === jurisdiction)
  const activeCount = exams.filter((exam) => exam.status === 'active').length
  const Icon = jurisdiction === 'central' ? Landmark : MapPinned
  const isEmpty = exams.length === 0
  return (
    <article className={`region-card ${isEmpty ? 'is-empty' : ''}`}>
      <div className="region-card-head">
        <Icon size={22} aria-hidden="true" />
        {activeCount > 0 && (
          <span className="region-active">
            <span className="numeric">{activeCount}</span> active now
          </span>
        )}
      </div>
      <h3>
        <Link to={jurisdictionRoutes[jurisdiction]} className="region-card-link">
          {label}
        </Link>
      </h3>
      <p>{regionBlurbs[jurisdiction]}</p>
      {!isEmpty && (
        <ul className="region-top">
          {biggestExams(jurisdiction).map((exam) => (
            <li key={exam.id}>
              <Link to={`/exams/${exam.id}`}>{exam.abbreviation || exam.name}</Link>
            </li>
          ))}
        </ul>
      )}
      <span className="region-count">
        {isEmpty ? 'Pay rules and salary guide' : <><span className="numeric">{exams.length}</span> profiles</>} <ArrowRight size={14} aria-hidden="true" />
      </span>
    </article>
  )
}

/** Grid of government cards; `exclude` hides the government whose page is open. */
export function RegionCards({ exclude = null }) {
  const regions = Object.entries(vocabulary.jurisdictions).filter(([key]) => key !== exclude)
  return (
    <div className="region-grid">
      {regions.map(([key, label], position) => (
        <Reveal key={key} delay={position * 60}>
          <RegionCard jurisdiction={key} label={label} />
        </Reveal>
      ))}
    </div>
  )
}
