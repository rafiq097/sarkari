/**
 * Exam profile tabs for how selection works: Guide (long-form explainer for big
 * exams), Selection (stages, papers, merit rules) and Syllabus (official topics plus
 * clearly labelled preparation notes). Rendered by pages/ExamPage.jsx.
 */
import { ExternalLink, Lightbulb, BookOpen, CheckCircle2 } from 'lucide-react'
import { Rich } from '../Rich.jsx'
import { SourceChips, Unknown, EstimateTag } from '../Badges.jsx'
import { BlockTitle } from './ProfileBasics.jsx'
import { labelFor } from '../../lib/data.js'

const stageTypeLabels = {
  objective: 'Objective (MCQ)',
  descriptive: 'Descriptive / written',
  interview: 'Interview',
  skill: 'Skill test',
  physical: 'Physical test',
  medical: 'Medical exam',
  document: 'Document verification',
  ssb: 'SSB interview',
  merit: 'Merit list',
}

/** Optional table inside a guide section. */
function GuideTable({ table }) {
  return (
    <div className="table-wrap spaced">
      <table className="data-table">
        <thead>
          <tr>
            {table.columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row.join('|')}>
              {row.map((cell, position) => (
                <td key={`${position}-${cell}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Quick-fact chips shown at the top of a guide section. */
function QuickFacts({ facts }) {
  if (!facts?.length) return null
  return (
    <dl className="quick-facts">
      {facts.map((fact) => (
        <div key={fact.label}>
          <dt>{fact.label}</dt>
          <dd>{fact.value}</dd>
        </div>
      ))}
    </dl>
  )
}

/** Guide tab: explainer sections as cards with a sticky table of contents. */
export function GuideTab({ exam }) {
  const sections = exam.guide?.sections ?? []
  return (
    <div className="tab-body guide">
      <nav className="guide-contents" aria-label="Guide contents">
        <p className="eyebrow">In this guide</p>
        <ol>
          {sections.map((section, position) => (
            <li key={section.title}>
              <a href={`#guide-${position}`}>{section.title}</a>
            </li>
          ))}
        </ol>
        <SourceChips sourceIds={exam.guide?.sources} sources={exam.sources} />
      </nav>
      <div className="guide-sections">
        {sections.map((section, position) => {
          const [leadParagraph, ...otherParagraphs] = section.paragraphs ?? []
          return (
            <section key={section.title} id={`guide-${position}`} className={`guide-section kind-${section.kind ?? 'official'}`}>
              <header className="guide-section-head">
                <span className="guide-step numeric">{String(position + 1).padStart(2, '0')}</span>
                <h3>{section.title}</h3>
                {section.kind === 'preparation' && <EstimateTag>Preparation advice, not official</EstimateTag>}
              </header>
              <QuickFacts facts={section.quickFacts} />
              {leadParagraph && (
                <p className="guide-lead">
                  <Rich text={leadParagraph} />
                </p>
              )}
              {otherParagraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 60)}>
                  <Rich text={paragraph} />
                </p>
              ))}
              {section.bullets?.length > 0 && (
                <ul className="check-list">
                  {section.bullets.map((bullet) => (
                    <li key={bullet.slice(0, 80)}>
                      <CheckCircle2 size={16} aria-hidden="true" />
                      <span>
                        <Rich text={bullet} />
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              {section.table && <GuideTable table={section.table} />}
            </section>
          )
        })}
      </div>
    </div>
  )
}

/** One selection stage with its papers. */
function StageCard({ stage, position }) {
  return (
    <article className="stage-card">
      <span className="stage-dot numeric" aria-hidden="true">{position + 1}</span>
      <header>
        <span className="stage-step numeric">Stage {position + 1}</span>
        <h4>{stage.name}</h4>
        <span className="pill-list">
          <span className="badge badge-stone badge-quiet">{stageTypeLabels[stage.type] ?? stage.type}</span>
          {stage.countsInMerit === false && <span className="badge badge-accent badge-quiet">Qualifying only</span>}
          {stage.countsInMerit === true && <span className="badge badge-sage badge-quiet">Counts in final merit</span>}
        </span>
      </header>
      {stage.papers?.length > 0 && (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Paper / test</th>
                <th className="numeric">Marks</th>
                <th className="numeric">Questions</th>
                <th>Duration</th>
                <th>Negative marking</th>
              </tr>
            </thead>
            <tbody>
              {stage.papers.map((paper) => (
                <tr key={paper.name}>
                  <td>
                    <strong>{paper.name}</strong>
                    {paper.qualifying && <span className="badge badge-accent badge-quiet small-badge">Qualifying</span>}
                    {paper.notes && (
                      <div className="faint small">
                        <Rich text={paper.notes} />
                      </div>
                    )}
                  </td>
                  <td className="numeric">{paper.marks ?? '-'}</td>
                  <td className="numeric">{paper.questions ?? '-'}</td>
                  <td>{paper.duration ?? '-'}</td>
                  <td>{paper.negative ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {stage.notes && (
        <p className="stage-notes">
          <Rich text={stage.notes} />
        </p>
      )}
    </article>
  )
}

/** Selection tab. */
export function SelectionTab({ exam }) {
  const selection = exam.selection ?? {}
  const stages = selection.stages ?? []
  return (
    <div className="tab-body">
      <BlockTitle sourceIds={selection.sources} sources={exam.sources}>
        Stages in order
      </BlockTitle>
      {stages.length ? (
        <div className="stage-flow">
          {stages.map((stage, position) => (
            <StageCard key={stage.name} stage={stage} position={position} />
          ))}
        </div>
      ) : (
        <Unknown>Selection stages not recorded.</Unknown>
      )}

      <dl className="key-value spaced">
        <dt>Final merit</dt>
        <dd>{selection.meritCalculation ? <Rich text={selection.meritCalculation} /> : <Unknown />}</dd>
        <dt>Tie-breaking</dt>
        <dd>{selection.tieBreaking ? <Rich text={selection.tieBreaking} /> : <Unknown>Not published in the sources reviewed</Unknown>}</dd>
        <dt>Normalization</dt>
        <dd>{selection.normalization ? <Rich text={selection.normalization} /> : <Unknown>Not applicable or not stated</Unknown>}</dd>
        <dt>Language / medium</dt>
        <dd>{selection.languages ? <Rich text={selection.languages} /> : <Unknown />}</dd>
        <dt>Document verification</dt>
        <dd>{selection.documentVerification ? <Rich text={selection.documentVerification} /> : <Unknown />}</dd>
        <dt>Probation / training</dt>
        <dd>{selection.probation ? <Rich text={selection.probation} /> : <Unknown />}</dd>
      </dl>

      {exam.rankAndAllocation?.text && (
        <>
          <BlockTitle sourceIds={exam.rankAndAllocation.sources} sources={exam.sources}>
            From rank to post
          </BlockTitle>
          <p>
            <Rich text={exam.rankAndAllocation.text} />
          </p>
          <p className="faint small">No rank guarantees a particular post. Allocation depends on vacancies, category, preferences and medical fitness in that year.</p>
        </>
      )}
    </div>
  )
}

/** Syllabus tab: official sections grouped by stage, then preparation notes. */
export function SyllabusTab({ exam }) {
  const syllabus = exam.syllabus ?? {}
  const byStage = new Map()
  for (const section of syllabus.sections ?? []) byStage.set(section.stage, [...(byStage.get(section.stage) ?? []), section])
  return (
    <div className="tab-body">
      <div className="syllabus-head">
        <BlockTitle sourceIds={syllabus.sources} sources={exam.sources}>
          Official syllabus
        </BlockTitle>
        {syllabus.officialLink && (
          <a href={syllabus.officialLink} target="_blank" rel="noreferrer" className="button">
            <BookOpen size={15} aria-hidden="true" /> Official syllabus document <ExternalLink size={13} aria-hidden="true" />
          </a>
        )}
      </div>
      {byStage.size === 0 && <Unknown>Topic list not recorded. Use the official document.</Unknown>}
      {[...byStage.entries()].map(([stage, sections]) => (
        <div key={stage} className="syllabus-stage">
          <h4 className="syllabus-stage-name">{stage}</h4>
          {sections.map((section) => (
            <details key={`${stage}-${section.subject}`} className="syllabus-subject" open={sections.length <= 2}>
              <summary>
                {section.subject} <span className="faint numeric">{section.topics.length} topics</span>
              </summary>
              <ul className="topic-list">
                {section.topics.map((topic) => (
                  <li key={topic}>{topic}</li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      ))}

      {syllabus.supplementary?.length > 0 && (
        <div className="callout callout-plum spaced">
          <Lightbulb size={18} aria-hidden="true" />
          <div>
            <strong>Preparation notes </strong>
            <EstimateTag>Not part of the official syllabus</EstimateTag>
            <ul className="plain-list">
              {syllabus.supplementary.map((item) => (
                <li key={item}>
                  <Rich text={item} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {exam.syllabusTags?.length > 0 && (
        <>
          <BlockTitle>Subject areas (used by the overlap tool)</BlockTitle>
          <ul className="pill-list">
            {exam.syllabusTags.map((tag) => (
              <li key={tag}>{labelFor('syllabusTags', tag)}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
