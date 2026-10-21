/**
 * Exam profile tabs for judgement and evidence: Work life and risk (practical trade-offs
 * plus analytical difficulty, ratings and risk) and Sources (every reference with type,
 * and year, plus data gaps). Rendered by pages/ExamPage.jsx.
 */
import { Link } from 'react-router'
import { ExternalLink, Scale, AlertTriangle } from 'lucide-react'
import { LevelMeter, SourceChips, Unknown, EstimateTag, ConfidenceBadge, DifficultyScore } from '../Badges.jsx'
import { BlockTitle } from './ProfileBasics.jsx'
import { vocabulary, getIndexRecord } from '../../lib/data.js'
import { Rich } from '../Rich.jsx'

const workLifeLabels = {
  postings: 'Posting locations',
  transfers: 'Transfers',
  nature: 'Field or desk',
  workload: 'Workload and hours',
  publicInteraction: 'Public interaction',
  hazards: 'Hazards',
  stability: 'Job stability',
}

/** Work life and risk tab. */
export function WorkTab({ exam }) {
  const workLife = exam.workLife ?? {}
  const difficulty = exam.difficulty ?? {}
  const ratings = exam.ratings ?? {}
  return (
    <div className="tab-body">
      <BlockTitle sourceIds={workLife.sources} sources={exam.sources}>
        Day-to-day reality
      </BlockTitle>
      <dl className="key-value">
        {Object.entries(workLifeLabels).flatMap(([key, label]) => [
          <dt key={`${key}-t`}>{label}</dt>,
          <dd key={`${key}-d`}>{workLife[key] ? <Rich text={workLife[key]} /> : <Unknown />}</dd>,
        ])}
      </dl>

      <div className="callout callout-plum spaced">
        <Scale size={18} aria-hidden="true" />
        <div>
          <strong>Analytical ratings. </strong>
          The ratings below are our judgments from the syllabus, official statistics and recruitment history. They are not official and do not predict any individual result. <Link to="/methodology" className="text-link">How we rate</Link>
        </div>
      </div>

      <div className="rating-grid spaced">
        <div className="panel">
          <h3>
            Difficulty <EstimateTag>Analytical</EstimateTag>
          </h3>
          <p className="difficulty-overall">
            Overall <DifficultyScore score={getIndexRecord(exam.id)?.difficultyScore} />
          </p>
          <dl className="meter-list">
            {Object.entries(vocabulary.difficultyKeys).flatMap(([key, label]) => [
              <dt key={`${key}-t`}>{label}</dt>,
              <dd key={`${key}-d`}>
                <LevelMeter level={difficulty[key]} label={label} />
              </dd>,
            ])}
          </dl>
          {difficulty.rationale && <p className="rationale">
              <Rich text={difficulty.rationale} />
            </p>}
        </div>
        <div className="panel">
          <h3>
            Career and recruitment <EstimateTag>Analytical</EstimateTag>
          </h3>
          <dl className="meter-list">
            {Object.entries(vocabulary.ratingKeys).flatMap(([key, label]) => [
              <dt key={`${key}-t`}>{label}</dt>,
              <dd key={`${key}-d`}>
                <LevelMeter level={ratings[key]} label={label} />
              </dd>,
            ])}
          </dl>
          {ratings.rationale && <p className="rationale">
              <Rich text={ratings.rationale} />
            </p>}
        </div>
      </div>

      <BlockTitle>
        Risk assessment <EstimateTag>Analytical</EstimateTag>
      </BlockTitle>
      <p>
        Overall: <LevelMeter level={exam.risk?.overall} label="Overall risk" />
      </p>
      {exam.risk?.factors?.length > 0 && (
        <div className="table-wrap spaced">
          <table className="data-table">
            <thead>
              <tr>
                <th>Factor</th>
                <th>Level</th>
                <th>Why</th>
              </tr>
            </thead>
            <tbody>
              {exam.risk.factors.map((factor) => (
                <tr key={factor.factor}>
                  <td>{factor.factor}</td>
                  <td>
                    <LevelMeter level={factor.level} />
                  </td>
                  <td className="small">
                    <Rich text={factor.note} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

/** Sources and data-quality tab. */
export function SourcesTab({ exam }) {
  const quality = exam.dataQuality ?? {}
  return (
    <div className="tab-body">
      <p>
        <ConfidenceBadge confidence={quality.confidence} />
      </p>
      {quality.notes && <p className="muted spaced">{quality.notes}</p>}
      {quality.gaps?.length > 0 && (
        <div className="callout callout-brick spaced">
          <AlertTriangle size={18} aria-hidden="true" />
          <div>
            <strong>Known gaps</strong>
            <ul className="plain-list">
              {quality.gaps.map((gap) => (
                <li key={gap}>{gap}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <BlockTitle>References</BlockTitle>
      <ol className="source-list">
        {exam.sources.map((source) => (
          <li key={source.id} id={`source-${source.id}`}>
            <span className="source-id numeric">{source.id.toUpperCase()}</span>
            <div>
              <a href={source.url} target="_blank" rel="noreferrer" className="text-link">
                {source.title} <ExternalLink size={12} aria-hidden="true" />
              </a>
              <p className="faint small">
                {source.publisher}
                {source.year && `, ${source.year}`} / {source.type === 'primary' ? 'Primary (official)' : 'Secondary'}
              </p>
            </div>
            <span className={`badge ${source.type === 'primary' ? 'badge-sage' : 'badge-stone'} badge-quiet`}>{source.type}</span>
          </li>
        ))}
      </ol>
      <p className="faint small">
        Section headings carry chips such as <SourceChips sourceIds={exam.sources.slice(0, 1).map((source) => source.id)} sources={exam.sources} /> that link to the source behind that section. Dashed chips are secondary sources.
      </p>
    </div>
  )
}
