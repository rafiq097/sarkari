/**
 * Search input with live suggestions (ARIA combobox). Enter opens the directory with
 * the query; choosing a suggestion opens that profile. Used in the header, the home hero,
 * the mobile menu and the mobile search sheet (Layout.jsx).
 */
import { useId, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Search, ArrowRight } from 'lucide-react'
import { searchExams } from '../lib/search.js'
import { labelFor } from '../lib/data.js'

const suggestionLimit = 7

/**
 * Search box; `size` is "large" for the hero. `isInline` keeps the suggestions in the
 * page flow and always visible (for the search sheet), and focuses the input on open.
 */
export function SearchBox({ size = 'normal', placeholder = 'Search exams, posts, organizations', onDone, isInline = false }) {
  const navigate = useNavigate()
  const listId = useId()
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activePosition, setActivePosition] = useState(-1)

  const suggestions = useMemo(() => (query.trim().length >= 2 ? searchExams(query).slice(0, suggestionLimit) : []), [query])

  const finish = (path) => {
    setIsOpen(false)
    setQuery('')
    setActivePosition(-1)
    navigate(path)
    onDone?.()
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setIsOpen(true)
      setActivePosition((position) => Math.min(position + 1, suggestions.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActivePosition((position) => Math.max(position - 1, -1))
    } else if (event.key === 'Escape') {
      setIsOpen(false)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      if (activePosition >= 0 && suggestions[activePosition]) finish(`/exams/${suggestions[activePosition].id}`)
      else if (query.trim()) finish(`/exams?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const showList = (isOpen || isInline) && query.trim().length >= 2

  return (
    <div className={`search-box search-${size} ${isInline ? 'search-inline' : ''}`}>
      <Search size={size === 'large' ? 20 : 16} className="search-icon" aria-hidden="true" />
      <input
        type="search"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={activePosition >= 0 ? `${listId}-${activePosition}` : undefined}
        aria-label="Search exams"
        data-autofocus={isInline || undefined}
        enterKeyHint="search"
        placeholder={placeholder}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setIsOpen(true)
          setActivePosition(-1)
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        onKeyDown={handleKeyDown}
      />
      {showList && (
        <ul className="search-suggestions" id={listId} role="listbox">
          {suggestions.map((exam, position) => (
            <li key={exam.id} id={`${listId}-${position}`} role="option" aria-selected={position === activePosition} className={position === activePosition ? 'is-active' : ''} onMouseDown={(event) => event.preventDefault()} onClick={() => finish(`/exams/${exam.id}`)}>
              <span className="suggestion-name">
                {exam.abbreviation && <strong>{exam.abbreviation}</strong>} {exam.name}
              </span>
              <span className="suggestion-meta">
                {exam.organization?.abbreviation || exam.organization?.name} / {labelFor('jurisdictions', exam.jurisdiction)}
              </span>
            </li>
          ))}
          {suggestions.length === 0 && <li className="suggestion-empty">No exam matches "{query}". Try a post name or organization.</li>}
          <li className="suggestion-all" onMouseDown={(event) => event.preventDefault()} onClick={() => finish(`/exams?q=${encodeURIComponent(query.trim())}`)}>
            See all results <ArrowRight size={14} aria-hidden="true" />
          </li>
        </ul>
      )}
    </div>
  )
}
