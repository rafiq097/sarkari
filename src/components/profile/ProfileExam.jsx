/**
 * Exam profile blocks for how selection works: Guide (long-form explainer for big
 * exams), Roadmap (interactive stages, papers, merit and joining) and Syllabus (official topics plus
 * clearly labelled preparation notes). Composed into a tab by ProfileTabs.jsx.
 */
import { ExternalLink, Lightbulb, BookOpen, CheckCircle2 } from 'lucide-react'
import { Rich } from '../Rich.jsx'
import { SourceChips, Unknown, EstimateTag } from '../Badges.jsx'
import { BlockTitle } from './ProfileBasics.jsx'
import { ExamRoadmap } from './ExamRoadmap.jsx'
import { labelFor } from '../../lib/data.js'

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

/** Roadmap block: the interactive stage-by-stage roadmap, then exam-wide rules. */
export function SelectionTab({ exam }) {
  const selection = exam.selection ?? {}
  return (
    <div className="tab-body">
      <BlockTitle sourceIds={selection.sources} sources={exam.sources}>
        Stage by stage
      </BlockTitle>
      {selection.stages?.length ? <ExamRoadmap exam={exam} /> : <Unknown>Selection stages not recorded.</Unknown>}

      <BlockTitle>Exam rules</BlockTitle>
      <dl className="key-value">
        <dt>Normalization</dt>
        <dd>{selection.normalization ? <Rich text={selection.normalization} /> : <Unknown>Not applicable or not stated</Unknown>}</dd>
        <dt>Language / medium</dt>
        <dd>{selection.languages ? <Rich text={selection.languages} /> : <Unknown />}</dd>
      </dl>
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
