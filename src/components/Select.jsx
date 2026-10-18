/**
 * Custom dropdown used everywhere instead of the browser's native select: a button that
 * opens a styled list with keyboard support (arrows, Home, End, Enter, Escape, typing to
 * jump) and a filter box for long lists. Options are { value, label, hint?, group? }.
 * Used by forms, sort controls, the compare picker, salary tools and charts.
 */
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, Search } from 'lucide-react'

// Lists longer than this get a filter box at the top.
const searchableAfter = 10

/** Options whose label or hint contains the filter text (case-insensitive). */
function filterOptions(options, filterText) {
  const needle = filterText.trim().toLowerCase()
  if (!needle) return options
  return options.filter((option) => `${option.label} ${option.hint ?? ''} ${option.group ?? ''}`.toLowerCase().includes(needle))
}

/** Options reordered so each group's members sit together, keeping first-seen group order. */
function groupTogether(options) {
  if (!options.some((option) => option.group)) return options
  const groupOrder = [...new Set(options.map((option) => option.group))]
  return [...options].sort((a, b) => groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group))
}

/** Keeps the highlighted option scrolled into view inside the list. */
function useScrollIntoView(listRef, activeIndex, isOpen) {
  useEffect(() => {
    if (!isOpen) return
    listRef.current?.querySelector(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [listRef, activeIndex, isOpen])
}

/** Closes the menu when the user presses or clicks outside it. */
function useOutsideClose(rootRef, isOpen, close) {
  useEffect(() => {
    if (!isOpen) return undefined
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) close()
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [rootRef, isOpen, close])
}

/** The list of options, with group headings when options carry a `group`. */
function OptionList({ options, selectedValue, activeIndex, listId, onPick, onHover, listRef }) {
  return (
    <ul className="select-list" role="listbox" id={listId} ref={listRef} tabIndex={-1}>
      {options.length === 0 && <li className="select-empty">No matches</li>}
      {options.flatMap((option, position) => {
        const rows = []
        // A group heading starts whenever the group changes from the previous option.
        if (option.group && option.group !== options[position - 1]?.group) {
          rows.push(
            <li key={`group-${option.group}`} className="select-group" role="presentation">
              {option.group}
            </li>,
          )
        }
        const isSelected = String(option.value) === String(selectedValue)
        rows.push(
          <li
            key={String(option.value)}
            id={`${listId}-${position}`}
            data-index={position}
            role="option"
            aria-selected={isSelected}
            className={`select-option ${position === activeIndex ? 'is-active' : ''} ${isSelected ? 'is-selected' : ''}`}
            onPointerDown={(event) => event.preventDefault()}
            onClick={() => onPick(option)}
            onPointerMove={() => onHover(position)}
          >
            <span className="select-option-text">
              {option.label}
              {option.hint && <span className="select-option-hint">{option.hint}</span>}
            </span>
            {isSelected && <Check size={15} aria-hidden="true" />}
          </li>,
        )
        return rows
      })}
    </ul>
  )
}

/** Next highlighted index for a navigation key, or null when the key is not a navigation key. */
function nextIndex(key, current, count) {
  if (key === 'ArrowDown') return Math.min(current + 1, count - 1)
  if (key === 'ArrowUp') return Math.max(current - 1, 0)
  if (key === 'Home') return 0
  if (key === 'End') return count - 1
  return null
}

/** Dropdown control. `label` is shown above unless `hideLabel`; `placeholder` shows when nothing is chosen. */
export function Select({ label, value, onChange, options, placeholder = 'Choose', hideLabel = false, disabled = false, className = '' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [filterText, setFilterText] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const rootRef = useRef(null)
  const listRef = useRef(null)
  const buttonRef = useRef(null)
  const listId = useId()
  const isSearchable = options.length > searchableAfter
  const visibleOptions = useMemo(() => filterOptions(groupTogether(options), filterText), [options, filterText])
  const selected = options.find((option) => String(option.value) === String(value))

  const close = () => {
    setIsOpen(false)
    setFilterText('')
  }
  const open = () => {
    if (disabled) return
    setActiveIndex(Math.max(0, groupTogether(options).findIndex((option) => String(option.value) === String(value))))
    setIsOpen(true)
  }
  const pick = (option) => {
    onChange(option.value)
    close()
    buttonRef.current?.focus()
  }

  useOutsideClose(rootRef, isOpen, close)
  useScrollIntoView(listRef, activeIndex, isOpen)

  const onKeyDown = (event) => {
    if (!isOpen) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault()
        open()
      }
      return
    }
    const moved = nextIndex(event.key, activeIndex, visibleOptions.length)
    if (moved != null) {
      event.preventDefault()
      setActiveIndex(moved)
    } else if (event.key === 'Enter' && visibleOptions[activeIndex]) {
      event.preventDefault()
      pick(visibleOptions[activeIndex])
    } else if (event.key === 'Escape' || event.key === 'Tab') {
      close()
    }
  }

  return (
    <div className={`select-field ${className}`} ref={rootRef} onKeyDown={onKeyDown}>
      {label && <span className={hideLabel ? 'visually-hidden' : 'select-label'}>{label}</span>}
      <button
        type="button"
        ref={buttonRef}
        className={`select-button ${isOpen ? 'is-open' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-label={hideLabel ? label : undefined}
        disabled={disabled}
        onClick={() => (isOpen ? close() : open())}
      >
        <span className={selected ? 'select-value' : 'select-placeholder'}>{selected ? selected.label : placeholder}</span>
        <ChevronDown size={16} aria-hidden="true" className="select-chevron" />
      </button>
      {isOpen && (
        <div className="select-menu">
          {isSearchable && (
            <label className="select-search">
              <Search size={14} aria-hidden="true" />
              <input
                autoFocus
                value={filterText}
                placeholder="Type to filter"
                aria-label={`Filter ${label ?? 'options'}`}
                aria-activedescendant={visibleOptions.length ? `${listId}-${activeIndex}` : undefined}
                onChange={(event) => {
                  setFilterText(event.target.value)
                  setActiveIndex(0)
                }}
              />
            </label>
          )}
          <OptionList options={visibleOptions} selectedValue={value} activeIndex={activeIndex} listId={listId} onPick={pick} onHover={setActiveIndex} listRef={listRef} />
        </div>
      )}
    </div>
  )
}
