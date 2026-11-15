/**
 * Region page for Central, Andhra Pradesh, Telangana or Karnataka. Its own search, sort
 * and filters (components/ExamBrowser.jsx) narrow that government's profiles, which stay
 * grouped by sector; it also links to the pay rules in force there.
 */
import { Link } from 'react-router'
import { Info } from 'lucide-react'
import { Breadcrumbs, EmptyState, PageHeader, SectionHeading } from '../components/Common.jsx'
import { ExamCard } from '../components/ExamCard.jsx'
import { ExamBrowser } from '../components/ExamBrowser.jsx'
import { RegionCards } from '../components/RegionCards.jsx'
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

  // Sector order is fixed by the full list (largest first), so filtering never reshuffles sections.
  const sectorCounts = new Map()
  for (const exam of exams) sectorCounts.set(exam.sector, (sectorCounts.get(exam.sector) ?? 0) + 1)
  const sectorOrder = [...sectorCounts.keys()].sort((a, b) => sectorCounts.get(b) - sectorCounts.get(a))

  /** Filtered results grouped by sector, in the fixed order; results keep the chosen sort. */
  const groupBySector = (results) => sectorOrder.map((sector) => [sector, results.filter((exam) => exam.sector === sector)]).filter(([, sectorExams]) => sectorExams.length > 0)

  return (
    <>
      <Breadcrumbs items={[{ label: regionName }]} />
      <PageHeader eyebrow={jurisdiction === 'central' ? 'Union Government' : 'State Government'} title={regionName} lead={regionIntros[jurisdiction]}>
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

      {exams.length === 0 && <EmptyState title="Pay rules only" action={<Link to="/salary" className="button">Open the salary explorer</Link>}>This guide covers {regionName} pay scales, DA and allowances. Compare them with Central, Andhra Pradesh and Telangana pay in the salary explorer.</EmptyState>}

      {exams.length > 0 && (
        <div className="region-browser">
          <ExamBrowser exams={exams} hideRegion placeholder={`Search ${regionName} exams`}>
            {(results, resetAll) =>
              results.length === 0 ? (
                <EmptyState
                  title="Nothing matches"
                  action={
                    <button type="button" className="button" onClick={resetAll}>
                      Reset search and filters
                    </button>
                  }
                >
                  Try fewer filters or a shorter keyword.
                </EmptyState>
              ) : (
                groupBySector(results).map(([sector, sectorExams], position) => (
                  <section key={sector}>
                    <SectionHeading number={String(position + 1).padStart(2, '0')} title={labelFor('sectors', sector)} description={`${sectorExams.length} profile${sectorExams.length === 1 ? '' : 's'}`} />
                    <div className="card-grid">
                      {sectorExams.map((exam) => (
                        <ExamCard key={exam.id} exam={exam} />
                      ))}
                    </div>
                  </section>
                ))
              )
            }
          </ExamBrowser>
        </div>
      )}

      <section>
        <SectionHeading title="Other governments" description="Switch to another government's exams." />
        <RegionCards exclude={jurisdiction} />
      </section>
    </>
  )
}
