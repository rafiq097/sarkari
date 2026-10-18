/**
 * Exam profile tabs with numbers: Cutoffs and selection (official cutoffs, vacancy and
 * selection statistics with transparent rate formulas) and Salary and career (pay facts,
 * indicative in-hand estimate, progression, benefits). Rendered by pages/ExamPage.jsx.
 */
import { useState } from 'react'
import { Link } from 'react-router'
import { Info, Calculator } from 'lucide-react'
import { SourceChips, Unknown, EstimateTag } from '../Badges.jsx'
import { BlockTitle } from './ProfileBasics.jsx'
import { Rich } from '../Rich.jsx'
import { CutoffChart } from '../CutoffChart.jsx'
import { estimateSalary, getRuleSet } from '../../lib/salary.js'
import { selectionRates } from '../../lib/stats.js'
import { formatCount, formatPercent, formatRupees, formatDate } from '../../lib/format.js'

/** Cutoff table for every recorded year and stage. */
function CutoffTable({ cutoffs, sources }) {
  const categories = [...new Set(cutoffs.flatMap((row) => Object.keys(row.values)))]
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Year</th>
            <th>Stage</th>
            <th>Scale</th>
            {categories.map((category) => (
              <th key={category} className="numeric">
                {category}
              </th>
            ))}
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {cutoffs.map((row) => (
            <tr key={`${row.year}-${row.stage}`}>
              <td className="numeric">{row.year}</td>
              <td>
                {row.stage}
                {row.note && <div className="faint small">{row.note}</div>}
              </td>
              <td className="small">{row.scale}</td>
              {categories.map((category) => (
                <td key={category} className="numeric">
                  {row.values[category] ?? '-'}
                </td>
              ))}
              <td>
                <SourceChips sourceIds={[row.source]} sources={sources} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Statistics table with computed selection rates. */
function StatisticsTable({ statistics, sources }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Year</th>
            <th className="numeric">Vacancies</th>
            <th className="numeric">Applied</th>
            <th className="numeric">Appeared</th>
            <th className="numeric">Qualified next stage</th>
            <th className="numeric">Interviewed</th>
            <th className="numeric">Selected</th>
            <th className="numeric">Selected / applied</th>
            <th className="numeric">Selected / appeared</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {statistics.map((row) => {
            const rates = selectionRates(row)
            return (
              <tr key={row.year}>
                <td className="numeric">
                  {row.year}
                  {row.note && <div className="faint small text-left">{row.note}</div>}
                </td>
                <td className="numeric">{formatCount(row.vacancies) ?? '-'}</td>
                <td className="numeric">{formatCount(row.applicants) ?? '-'}</td>
                <td className="numeric">{formatCount(row.appeared) ?? '-'}</td>
                <td className="numeric">{formatCount(row.qualifiedNextStage) ?? '-'}</td>
                <td className="numeric">{formatCount(row.interviewed) ?? '-'}</td>
                <td className="numeric">{formatCount(row.selected) ?? '-'}</td>
                <td className="numeric">{formatPercent(rates.perApplicant) ?? '-'}</td>
                <td className="numeric">{formatPercent(rates.perAppeared) ?? '-'}</td>
                <td>
                  <SourceChips sourceIds={[row.source]} sources={sources} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/** Cutoffs and selection tab. */
export function StatsTab({ exam }) {
  const cutoffs = exam.cutoffs ?? []
  const statistics = exam.statistics ?? []
  return (
    <div className="tab-body">
      <BlockTitle>Official cutoffs</BlockTitle>
      {cutoffs.length ? (
        <>
          <CutoffChart cutoffs={cutoffs} />
          <CutoffTable cutoffs={cutoffs} sources={exam.sources} />
          <p className="faint small">Cutoffs from different years can use different vacancies, paper difficulty and normalization. Compare trends, not single numbers.</p>
        </>
      ) : (
        <Unknown>No official category-wise cutoffs were found for this route. We do not publish coaching-site estimates.</Unknown>
      )}

      <BlockTitle>Vacancies, candidates and selections</BlockTitle>
      {statistics.length ? (
        <>
          <StatisticsTable statistics={statistics} sources={exam.sources} />
          <div className="callout spaced">
            <Info size={18} aria-hidden="true" />
            <div>
              <strong>How the rates are calculated. </strong>
              Selected / applied = candidates finally selected divided by candidates who applied. Selected / appeared = candidates finally selected divided by candidates who actually sat the first paper. Both use counts from the same official report and year. These describe the whole field, not any one person's chances.
            </div>
          </div>
        </>
      ) : (
        <Unknown>No reliable official counts of applicants and selections were found. See the competition rating in Difficulty and risk for a qualitative view.</Unknown>
      )}
    </div>
  )
}

/** Indicative in-hand calculator for one starting basic pay. */
function SalaryEstimate({ salary }) {
  const ruleSet = getRuleSet(salary.payRuleSet)
  const [hraSlabIndex, setHraSlabIndex] = useState(0)
  const [customHra, setCustomHra] = useState('')
  const needsManualHra = ruleSet && !ruleSet.hra?.length
  const estimate = estimateSalary({
    ruleSetKey: salary.payRuleSet,
    basicPay: salary.startingBasic,
    payLevel: salary.payLevel,
    fixedAdditions: salary.fixedAdditions,
    hraSlabIndex,
    customHraPercent: needsManualHra && customHra !== '' ? Number(customHra) : null,
  })
  if (!estimate) {
    return (
      <p className="muted">
        {salary.officialGross ? `Gross pay stated by the recruiter: ${formatRupees(salary.officialGross)} per month. ${salary.officialGrossNote ?? ''}` : 'An in-hand estimate is not modelled for this pay system. Use the figures in the official notification.'}
      </p>
    )
  }
  return (
    <div className="estimate panel">
      <div className="estimate-head">
        <h4>
          <Calculator size={16} aria-hidden="true" /> Indicative month-one pay <EstimateTag />
        </h4>
        {ruleSet.hra?.length > 0 ? (
          <select className="select-control" aria-label="Posting place for HRA" value={hraSlabIndex} onChange={(event) => setHraSlabIndex(Number(event.target.value))}>
            {ruleSet.hra.map((slab, position) => (
              <option key={slab.label} value={position}>
                {slab.label}
              </option>
            ))}
          </select>
        ) : (
          <label className="field inline-field">
            <span>HRA % (enter yours)</span>
            <input type="number" min="0" max="40" step="0.5" value={customHra} onChange={(event) => setCustomHra(event.target.value)} />
          </label>
        )}
      </div>
      <table className="data-table estimate-table">
        <tbody>
          {estimate.lines.map((line) => (
            <tr key={line.label}>
              <td>{line.label}</td>
              <td className="numeric">{formatRupees(line.amount)}</td>
            </tr>
          ))}
          <tr className="total-row">
            <td>Estimated gross</td>
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
      <p className="faint small">
        Assumptions: {ruleSet.label}; DA {ruleSet.daPercent}% ({formatDate(ruleSet.daEffective)}). Excludes income tax, insurance and health-scheme deductions, post-specific allowances and arrears. {ruleSet.hraNote}
      </p>
    </div>
  )
}

/** Salary and career tab. */
export function SalaryTab({ exam }) {
  const salary = exam.salary ?? {}
  const career = exam.career ?? {}
  return (
    <div className="tab-body">
      <BlockTitle sourceIds={salary.sources} sources={exam.sources}>
        Official pay
      </BlockTitle>
      <dl className="key-value">
        <dt>Pay level / scale</dt>
        <dd>
          {[salary.payLevel, salary.payScale].filter(Boolean).join(', ') || <Unknown />}
        </dd>
        <dt>Starting basic pay</dt>
        <dd className="numeric">{formatRupees(salary.startingBasic) ?? <Unknown>Varies by post</Unknown>}</dd>
        <dt>Pay rules</dt>
        <dd>{getRuleSet(salary.payRuleSet)?.label ?? 'Organization-specific pay rules'}</dd>
        <dt>Pension</dt>
        <dd>{salary.pension ?? <Unknown />}</dd>
        <dt>Increments</dt>
        <dd>{salary.increments ?? <Unknown />}</dd>
      </dl>
      {salary.notes && (
        <p className="muted spaced">
          <Rich text={salary.notes} />
        </p>
      )}

      <SalaryEstimate salary={salary} />

      {salary.specialAllowances?.length > 0 && (
        <>
          <BlockTitle>Post-specific allowances</BlockTitle>
          <dl className="key-value">
            {salary.specialAllowances.flatMap((allowance) => [<dt key={`${allowance.name}-t`}>{allowance.name}</dt>, <dd key={`${allowance.name}-d`}>{allowance.detail}</dd>])}
          </dl>
        </>
      )}

      <BlockTitle sourceIds={career.sources} sources={exam.sources}>
        Career progression
      </BlockTitle>
      {career.progression?.length ? (
        <ol className="career-ladder">
          {career.progression.map((step) => (
            <li key={step.post}>
              <span className="career-post">{step.post}</span>
              <span className="career-level numeric">{step.level}</span>
              <span className="career-time">
                {step.timeline}
                {step.timelineType === 'typical' && <EstimateTag>Typical, not guaranteed</EstimateTag>}
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <Unknown>Promotion ladder not recorded.</Unknown>
      )}
      <dl className="key-value spaced">
        <dt>What promotions depend on</dt>
        <dd>{career.promotionNotes ? <Rich text={career.promotionNotes} /> : <Unknown />}</dd>
        <dt>Departmental exams</dt>
        <dd>{career.departmentalExams ?? <Unknown>None recorded</Unknown>}</dd>
        <dt>Assured progression</dt>
        <dd>{career.macp ?? <Unknown />}</dd>
      </dl>

      {exam.benefits?.length > 0 && (
        <>
          <BlockTitle>Benefits and perks</BlockTitle>
          <div className="table-wrap">
            <table className="data-table">
              <tbody>
                {exam.benefits.map((benefit) => (
                  <tr key={benefit.item}>
                    <td>
                      <strong>{benefit.item}</strong>
                      {benefit.conditional && <span className="badge badge-plum badge-quiet small-badge">Conditional</span>}
                    </td>
                    <td className="small">
                      <Rich text={benefit.detail} />
                    </td>
                    <td>
                      <SourceChips sourceIds={benefit.sources} sources={exam.sources} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <p className="faint small spaced">
        See all pay rules in the <Link to="/salary" className="text-link">salary explorer</Link>.
      </p>
    </div>
  )
}
