/**
 * Research coverage report: organizations examined, profiles per government,
 * data completeness, source quality, pending items and known gaps.
 * Built from src/data/coverage.json and the exam index.
 */
import { Link } from 'react-router'
import { Breadcrumbs, PageHeader, SectionHeading } from '../components/Common.jsx'
import { coverage, examIndex, sourceIndex, labelFor, vocabulary } from '../lib/data.js'

const coverageStatusLabels = { covered: 'Covered', partial: 'Partly covered', pending: 'Pending' }

/** Completeness counts for one set of profiles. */
function completeness(exams) {
  return {
    total: exams.length,
    withCutoffs: exams.filter((exam) => exam.cutoffCount > 0).length,
    withStatistics: exams.filter((exam) => exam.statisticCount > 0).length,
    withPay: exams.filter((exam) => exam.salary.startingBasic).length,
    withGuide: exams.filter((exam) => exam.hasGuide).length,
    highConfidence: exams.filter((exam) => exam.confidence === 'high').length,
  }
}

/** Coverage page. */
export default function CoveragePage() {
  const primaryCount = sourceIndex.filter((source) => source.type === 'primary').length
  return (
    <>
      <Breadcrumbs items={[{ label: 'Coverage report' }]} />
      <PageHeader eyebrow="Research" title="Coverage report" lead={`What has been researched, how well, and what is still missing. Coverage is broad but not exhaustive: small, one-off and district-level recruitments are not all profiled.`} />

      <SectionHeading number="01" title="Data completeness by government" />
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Government</th>
              <th className="numeric">Profiles</th>
              <th className="numeric">With explainer</th>
              <th className="numeric">With starting pay</th>
              <th className="numeric">With official cutoffs</th>
              <th className="numeric">With selection counts</th>
              <th className="numeric">High confidence</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(vocabulary.jurisdictions).map((jurisdiction) => {
              const counts = completeness(examIndex.filter((exam) => exam.jurisdiction === jurisdiction))
              return (
                <tr key={jurisdiction}>
                  <td>{labelFor('jurisdictions', jurisdiction)}</td>
                  <td className="numeric">{counts.total}</td>
                  <td className="numeric">{counts.withGuide}</td>
                  <td className="numeric">{counts.withPay}</td>
                  <td className="numeric">{counts.withCutoffs}</td>
                  <td className="numeric">{counts.withStatistics}</td>
                  <td className="numeric">{counts.highConfidence}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="faint small spaced">
        Sources: {sourceIndex.length} unique references, {primaryCount} primary and {sourceIndex.length - primaryCount} secondary.
      </p>

      <SectionHeading number="02" title="Organizations examined" />
      {Object.keys(vocabulary.jurisdictions).map((jurisdiction) => {
        const organizations = coverage.organizations.filter((organization) => organization.jurisdiction === jurisdiction)
        if (!organizations.length) return null
        return (
          <div key={jurisdiction} className="spaced">
            <h3 className="block-title">{labelFor('jurisdictions', jurisdiction)}</h3>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Organization</th>
                    <th>Status</th>
                    <th>Profiles</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {organizations.map((organization) => (
                    <tr key={organization.name}>
                      <td>
                        {organization.website ? (
                          <a href={organization.website} target="_blank" rel="noreferrer" className="text-link">
                            {organization.name}
                          </a>
                        ) : (
                          organization.name
                        )}
                      </td>
                      <td>{coverageStatusLabels[organization.status] ?? organization.status}</td>
                      <td className="small">
                        {(organization.profiles ?? []).map((profileId, position) => (
                          <span key={profileId}>
                            {position > 0 && ', '}
                            <Link to={`/exams/${profileId}`} className="text-link">
                              {profileId}
                            </Link>
                          </span>
                        ))}
                      </td>
                      <td className="small">{organization.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}

      {coverage.pending?.length > 0 && (
        <>
          <SectionHeading number="03" title="Pending research" description="Recruitment routes identified but not yet profiled." />
          <ul className="plain-list">
            {coverage.pending.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      )}

      {coverage.gaps?.length > 0 && (
        <>
          <SectionHeading number="04" title="Known gaps across the dataset" />
          <ul className="plain-list">
            {coverage.gaps.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      )}
    </>
  )
}
