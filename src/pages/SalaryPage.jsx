/**
 * Salary and career explorer: pay rules in force for each government, a free-form
 * in-hand calculator, the central pay matrix by level, and a sortable table of
 * starting pay across profiles. All estimates are labelled and dated.
 */
import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Info } from 'lucide-react'
import { Breadcrumbs, PageHeader, SectionHeading } from '../components/Common.jsx'
import { EstimateTag, SourceChips } from '../components/Badges.jsx'
import { examIndex, labelFor, payRules } from '../lib/data.js'
import { estimateSalary, centralMatrixCells } from '../lib/salary.js'
import { formatDate, formatRupees } from '../lib/format.js'
import { Select } from '../components/Select.jsx'

const modelledRuleSets = Object.entries(payRules.ruleSets).filter(([, ruleSet]) => ruleSet.daPercent != null)
const centralLevels = Object.keys(payRules.ruleSets['central-7cpc'].matrixFirstCells)

/** Pay rule summary cards. */
function RuleSetCards() {
  return (
    <div className="rule-grid">
      {Object.entries(payRules.ruleSets).map(([key, ruleSet]) => (
        <article key={key} className="panel rule-card">
          <h3>{ruleSet.label}</h3>
          <p className="small muted">{ruleSet.payCommission}</p>
          <dl className="key-value compact">
            <dt>DA</dt>
            <dd>{ruleSet.daPercent != null ? `${ruleSet.daPercent}% from ${formatDate(ruleSet.daEffective)}` : 'Not modelled'}</dd>
            <dt>HRA</dt>
            <dd>{ruleSet.hra.length ? ruleSet.hra.map((slab) => `${slab.percent}%`).join(' / ') : 'See note'}</dd>
            <dt>Pension</dt>
            <dd className="small">{ruleSet.pension}</dd>
          </dl>
          <p className="faint small">{ruleSet.daNote}</p>
          {ruleSet.hraNote && <p className="faint small">{ruleSet.hraNote}</p>}
          <SourceChips sourceIds={ruleSet.sources.map((_, position) => `s${position + 1}`)} sources={ruleSet.sources.map((source, position) => ({ ...source, id: `s${position + 1}` }))} />
        </article>
      ))}
    </div>
  )
}

/** Free-form calculator. */
function Calculator() {
  const [ruleSetKey, setRuleSetKey] = useState('central-7cpc')
  const [basicPay, setBasicPay] = useState(56100)
  const [payLevel, setPayLevel] = useState('10')
  const [hraSlabIndex, setHraSlabIndex] = useState(0)
  const [customHra, setCustomHra] = useState('')
  const ruleSet = payRules.ruleSets[ruleSetKey]
  const estimate = estimateSalary({ ruleSetKey, basicPay: Number(basicPay), payLevel, hraSlabIndex, customHraPercent: !ruleSet.hra.length && customHra !== '' ? Number(customHra) : null })

  return (
    <div className="calculator panel">
      <div className="calculator-inputs">
        <Select
          label="Pay rules"
          value={ruleSetKey}
          onChange={(key) => {
            setRuleSetKey(key)
            setHraSlabIndex(0)
          }}
          options={modelledRuleSets.map(([key, rules]) => ({ value: key, label: rules.label }))}
        />
        <label className="field">
          <span>Basic pay (Rs per month)</span>
          <input type="number" min="0" step="100" value={basicPay} onChange={(event) => setBasicPay(event.target.value)} />
        </label>
        {ruleSetKey === 'central-7cpc' && (
          <Select label="Pay level (for transport allowance)" value={payLevel} onChange={setPayLevel} options={centralLevels.map((level) => ({ value: level, label: `Level ${level}` }))} />
        )}
        {ruleSet.hra.length ? (
          <Select label="Posting place (HRA)" value={hraSlabIndex} onChange={(slabIndex) => setHraSlabIndex(Number(slabIndex))} options={ruleSet.hra.map((slab, position) => ({ value: position, label: `${slab.label} (${slab.percent}%)` }))} />
        ) : (
          <label className="field">
            <span>HRA % (enter yours)</span>
            <input type="number" min="0" max="40" step="0.5" value={customHra} onChange={(event) => setCustomHra(event.target.value)} />
          </label>
        )}
      </div>
      {estimate && (
        <table className="data-table estimate-table">
          <tbody>
            {estimate.lines.map((line) => (
              <tr key={line.label}>
                <td>{line.label}</td>
                <td className="numeric">{formatRupees(line.amount)}</td>
              </tr>
            ))}
            <tr className="total-row">
              <td>
                Estimated gross <EstimateTag />
              </td>
              <td className="numeric">{formatRupees(estimate.gross)}</td>
            </tr>
            {estimate.deductions.map((line) => (
              <tr key={line.label}>
                <td className="muted">Less {line.label}</td>
                <td className="numeric muted">- {formatRupees(line.amount)}</td>
              </tr>
            ))}
            <tr className="total-row">
              <td>Estimated in-hand before income tax</td>
              <td className="numeric">{formatRupees(estimate.inHand)}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  )
}

/** Central pay matrix viewer for one level. */
function MatrixViewer() {
  const [level, setLevel] = useState('7')
  const cells = centralMatrixCells(level)
  return (
    <div className="panel">
      <Select label="Central pay level" className="select-inline" value={level} onChange={setLevel} options={centralLevels.map((key) => ({ value: key, label: `Level ${key}` }))} />
      <ol className="matrix-cells">
        {cells.map((cell, position) => (
          <li key={`${level}-${position}`}>
            <span className="faint small">Cell {position + 1}</span>
            <span className="numeric">{formatRupees(cell)}</span>
          </li>
        ))}
      </ol>
      <p className="faint small">Each annual increment moves one cell down (3%, rounded to the nearest 100). On promotion you first get one notional increment in your current level, then move to the cell in the new level equal to that amount or the next higher cell (FR 22(I)(a)(1)). Cells computed from the published first and last cell; check the official matrix for your exact stage.</p>
    </div>
  )
}

/** Salary explorer page. */
export default function SalaryPage() {
  const [sortKey, setSortKey] = useState('basic')
  const payTable = useMemo(() => {
    const rows = examIndex.filter((exam) => exam.salary.startingBasic && exam.status !== 'historical')
    return rows.sort((a, b) => (sortKey === 'basic' ? b.salary.startingBasic - a.salary.startingBasic : a.name.localeCompare(b.name)))
  }, [sortKey])

  return (
    <>
      <Breadcrumbs items={[{ label: 'Tools', to: '/tools' }, { label: 'Salary and career' }]} />
      <PageHeader eyebrow="Tool" title="Salary and career explorer" lead="Basic pay is only part of the salary. Dearness Allowance, House Rent Allowance and transport allowance are added; pension contribution and tax are deducted. Here is how each government calculates it." />

      <div className="callout">
        <Info size={18} aria-hidden="true" />
        <div>
          <strong>Central versus state pay. </strong>
          Central employees follow the 7th CPC pay matrix with DA revised twice a year. Andhra Pradesh and Telangana use a master scale set by their own Pay Revision Commissions, and Karnataka uses scales set by its State Pay Commission. Each state sets its own DA, so the same basic pay gives a different gross in each government.
        </div>
      </div>

      <SectionHeading number="01" title="Pay rules in force" />
      <RuleSetCards />

      <SectionHeading number="02" title="In-hand calculator" description="Enter any basic pay. The estimate excludes income tax, insurance, health-scheme deductions, arrears and post-specific allowances." />
      <Calculator />

      <SectionHeading number="03" title="Central pay matrix" description="How pay grows with increments within one level." />
      <MatrixViewer />

      <SectionHeading number="04" title="Starting pay across profiles" description="Starting basic pay of the main post in each current or recurring profile. Use the profile for post-wise pay." />
      <div className="tool-controls">
        <Select label="Sort" className="select-inline" value={sortKey} onChange={setSortKey} options={[{ value: 'basic', label: 'Highest basic first' }, { value: 'name', label: 'Name' }]} />
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Exam</th>
              <th>Government</th>
              <th>Pay level / scale</th>
              <th className="numeric">Starting basic</th>
              <th className="numeric">Indicative gross</th>
            </tr>
          </thead>
          <tbody>
            {payTable.map((exam) => {
              const estimate = estimateSalary({ ruleSetKey: exam.salary.payRuleSet, basicPay: exam.salary.startingBasic, payLevel: exam.salary.payLevel, fixedAdditions: exam.salary.fixedAdditions })
              return (
                <tr key={exam.id}>
                  <td>
                    <Link to={`/exams/${exam.id}?tab=pay`} className="text-link">
                      {exam.abbreviation || exam.name}
                    </Link>
                  </td>
                  <td>{labelFor('jurisdictions', exam.jurisdiction)}</td>
                  <td>{exam.salary.payLevel ?? '-'}</td>
                  <td className="numeric">{formatRupees(exam.salary.startingBasic)}</td>
                  <td className="numeric">{estimate ? formatRupees(estimate.gross) : '-'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="faint small spaced">Indicative gross uses the first HRA slab of each rule set (the largest city class) and higher-city transport allowance where applicable.</p>
    </>
  )
}
