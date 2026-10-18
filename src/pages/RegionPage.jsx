/**
 * Region page for Central, Andhra Pradesh, Telangana or Karnataka. Groups that
 * government's profiles by sector and links to the pay rules in force there.
 */
import { Link } from 'react-router'
import { Info } from 'lucide-react'
import { Breadcrumbs, EmptyState, PageHeader, SectionHeading } from '../components/Common.jsx'
import { ExamCard } from '../components/ExamCard.jsx'
import { examsInJurisdiction, labelFor, payRules } from '../lib/data.js'
import { formatDate } from '../lib/format.js'

const regionIntros = {
  central: 'Union Government recruitment through UPSC, SSC, Railway boards, bank and insurance bodies, defence services, central armed police, science and research organizations, PSUs and other central bodies. Posts are open to candidates from every state.',
  'andhra-pradesh': 'Recruitment by the Andhra Pradesh Public Service Commission, State Level Police Recruitment Board, School Education department (DSC), village and ward secretariats, power utilities, courts and other state bodies. Local-cadre and zonal rules affect how posts are filled.',
  telangana: 'Recruitment by the Telangana Public Service Commission, Telangana State Level Police Recruitment Board, School Education department (DSC), gurukul and health recruitment boards, power utilities, courts and other state bodies. Local-cadre and zonal rules affect how posts are filled.',
  karnataka: 'Recruitment by the Karnataka Public Service Commission, Karnataka Examinations Authority, Karnataka State Police, School Education department, power utilities, courts and other state bodies. Kannada language requirements and Kalyana-Karnataka (Article 371J) reservation affect eligibility and selection.',
}

const payRuleByRegion = {
  central: 'central-7cpc',
  'andhra-pradesh': 'ap-rps-2022',
  telangana: 'ts-rps-2020',
  karnataka: 'ka-7spc',
}

/** Profiles of one government grouped by sector. */
export default function RegionPage({ jurisdiction }) {
  const exams = examsInJurisdiction(jurisdiction)
  const regionName = labelFor('jurisdictions', jurisdiction)
  const ruleSet = payRules.ruleSets[payRuleByRegion[jurisdiction]]

  const bySector = new Map()
  for (const exam of exams) bySector.set(exam.sector, [...(bySector.get(exam.sector) ?? []), exam])
  const sectors = [...bySector.entries()].sort((a, b) => b[1].length - a[1].length)

  return (
    <>
      <Breadcrumbs items={[{ label: regionName }]} />
      <PageHeader eyebrow={jurisdiction === 'central' ? 'Union Government' : 'State Government'} title={regionName} lead={regionIntros[jurisdiction]}>
        <div className="region-meta">
          <span className="numeric">{exams.length}</span> profiles
          <span className="dot" aria-hidden="true" />
          <Link to={`/exams?region=${jurisdiction}`} className="text-link">
            Filter and sort these
          </Link>
        </div>
      </PageHeader>

      {ruleSet && (
        <div className="callout">
          <Info size={18} aria-hidden="true" />
          <div>
            <strong>Pay rules in force: </strong>
            {ruleSet.payCommission} {ruleSet.daPercent != null && `DA ${ruleSet.daPercent}% from ${formatDate(ruleSet.daEffective)}.`}{' '}
            <Link to="/salary" className="text-link">
              Salary explorer
            </Link>
          </div>
        </div>
      )}

      {sectors.length === 0 && <EmptyState title="No profiles yet">Profiles for {regionName} are being researched. See the coverage report for progress.</EmptyState>}

      {sectors.map(([sector, sectorExams], position) => (
        <section key={sector}>
          <SectionHeading number={String(position + 1).padStart(2, '0')} title={labelFor('sectors', sector)} description={`${sectorExams.length} profile${sectorExams.length === 1 ? '' : 's'}`} />
          <div className="card-grid">
            {sectorExams
              .sort((a, b) => (a.status === 'historical') - (b.status === 'historical') || a.name.localeCompare(b.name))
              .map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
          </div>
        </section>
      ))}
    </>
  )
}
