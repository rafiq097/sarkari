/**
 * Line chart of official cutoffs across years for one stage, one line per category.
 * Only drawn when at least two years exist for the chosen stage and scale.
 * Used on exam profiles and the analytics page.
 */
import { useState } from 'react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

// Categorical series colours, chosen to stay distinct on the warm dark surface.
const seriesColours = ['#e4a53f', '#93b99d', '#dc7b5d', '#c49ac0', '#d8cfc0', '#8fa8b8', '#b8a46a', '#7fb3a8']

/** Cutoff trend chart with a stage picker. */
export function CutoffChart({ cutoffs }) {
  const stageKeys = [...new Set(cutoffs.map((row) => `${row.stage} (${row.scale})`))]
  const chartableStages = stageKeys.filter((key) => cutoffs.filter((row) => `${row.stage} (${row.scale})` === key).length >= 2)
  const [stageKey, setStageKey] = useState(chartableStages[0])
  if (!chartableStages.length) return null

  const rows = cutoffs.filter((row) => `${row.stage} (${row.scale})` === stageKey).sort((a, b) => a.year - b.year)
  const categories = [...new Set(rows.flatMap((row) => Object.keys(row.values)))]
  const data = rows.map((row) => ({ year: String(row.year), ...row.values }))

  return (
    <figure className="chart-figure">
      <div className="chart-head">
        <figcaption>Cutoff trend</figcaption>
        {chartableStages.length > 1 && (
          <select className="select-control" aria-label="Stage" value={stageKey} onChange={(event) => setStageKey(event.target.value)}>
            {chartableStages.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        )}
        {chartableStages.length === 1 && <span className="muted small">{stageKey}</span>}
      </div>
      <div className="chart-body" role="img" aria-label={`Cutoff marks by year for ${stageKey}`}>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#312c27" vertical={false} />
            <XAxis dataKey="year" stroke="#7b7266" tickLine={false} axisLine={{ stroke: '#453e37' }} fontSize={12} />
            <YAxis stroke="#7b7266" tickLine={false} axisLine={false} fontSize={12} width={48} domain={['auto', 'auto']} />
            <Tooltip contentStyle={{ background: '#26221e', border: '1px solid #453e37', borderRadius: 8, color: '#ede6d9' }} labelStyle={{ color: '#a1978a' }} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#c9c0b2' }} />
            {categories.map((category, position) => (
              <Line key={category} type="monotone" dataKey={category} stroke={seriesColours[position % seriesColours.length]} strokeWidth={2} dot={{ r: 3 }} connectNulls />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </figure>
  )
}
