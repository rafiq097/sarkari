/**
 * Question text as printed in the paper: plain lines keep their breaks, and runs of lines
 * written as "cell | cell | cell" (tables in the official paper) render as a real table
 * whose first row is the header. Used by MockRunner.jsx and MockResult.jsx.
 */

// A table row in the stored question text separates its cells with " | ".
const cellSeparator = ' | '

/** Splits question text into blocks: { type: 'text', lines } or { type: 'table', rows }. */
function toBlocks(text) {
  const blocks = []
  for (const line of text.split('\n')) {
    const type = line.includes(cellSeparator) ? 'table' : 'text'
    const previous = blocks.at(-1)
    const content = type === 'table' ? line.split(cellSeparator) : line
    if (previous?.type === type) previous.items.push(content)
    else blocks.push({ type, items: [content] })
  }
  return blocks
}

/** Renders one question's text with its tables; `className` styles the wrapper. */
export function QuestionText({ text, className = '' }) {
  return (
    <div className={className}>
      {toBlocks(text).map((block, blockIndex) =>
        block.type === 'table' ? (
          <div className="table-wrap mock-question-table" key={blockIndex}>
            <table className="data-table">
              <thead>
                <tr>
                  {block.items[0].map((cell) => (
                    <th key={cell}>{cell}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.items.slice(1).map((row) => (
                  <tr key={row.join()}>
                    {row.map((cell) => (
                      <td key={cell}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p key={blockIndex}>{block.items.join('\n')}</p>
        ),
      )}
    </div>
  )
}
