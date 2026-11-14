/**
 * General building blocks: breadcrumbs, section headings, empty states, scroll reveal,
 * tabs, chip filters, single-choice pill filters, the "Show all"
 * toggle and collapsed sections (Fold). Used by most pages.
 */
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { useDocumentTitle } from '../lib/useDocumentTitle.js'
import { ChevronDown, ChevronRight, SearchX } from 'lucide-react'

/** Breadcrumb trail; the last item is the current page. */
export function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol>
        <li>
          <Link to="/">Home</Link>
        </li>
        {items.map((item, position) => (
          <li key={item.label}>
            <ChevronRight size={13} aria-hidden="true" />
            {item.to && position < items.length - 1 ? <Link to={item.to}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/** Page header with an eyebrow label, title and lead paragraph. */
export function PageHeader({ eyebrow, title, lead, children }) {
  useDocumentTitle(typeof title === 'string' ? title : null)
  return (
    <header className="page-header">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      {lead && <p className="lead">{lead}</p>}
      {children}
    </header>
  )
}

/** Section heading with optional index number and description. */
export function SectionHeading({ number, title, description, id }) {
  return (
    <div className="section-heading" id={id}>
      {number && <span className="section-number">{number}</span>}
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
    </div>
  )
}

/** Friendly empty state with an optional action. */
export function EmptyState({ title, children, icon: Icon = SearchX, action }) {
  return (
    <div className="empty-state" role="status">
      <Icon size={28} aria-hidden="true" />
      <h3>{title}</h3>
      {children && <p>{children}</p>}
      {action}
    </div>
  )
}

/** Fades content in when it scrolls into view; the CSS disables motion for reduced-motion users. */
export function Reveal({ children, as: Tag = 'div', className = '', delay = 0 }) {
  const elementRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element || !('IntersectionObserver' in window)) {
      setIsVisible(true)
      return undefined
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag ref={elementRef} className={`reveal ${isVisible ? 'is-visible' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  )
}

/** Accessible tab list; the parent owns the selected tab. */
export function Tabs({ tabs, selected, onSelect, label }) {
  const handleKeyDown = (event) => {
    const position = tabs.findIndex((tab) => tab.id === selected)
    if (event.key === 'ArrowRight') onSelect(tabs[(position + 1) % tabs.length].id)
    if (event.key === 'ArrowLeft') onSelect(tabs[(position - 1 + tabs.length) % tabs.length].id)
  }
  return (
    <div className="tabs" role="tablist" aria-label={label} onKeyDown={handleKeyDown}>
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isSelected = tab.id === selected
        return (
          <button key={tab.id} type="button" role="tab" id={`tab-${tab.id}`} aria-selected={isSelected} aria-controls={`panel-${tab.id}`} tabIndex={isSelected ? 0 : -1} className={isSelected ? 'is-selected' : ''} onClick={() => onSelect(tab.id)}>
            {Icon && <Icon size={15} aria-hidden="true" />}
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

// Long chip groups show this many options until expanded; selected options always show.
const collapsedOptionCount = 10

/** Multi-select chip group used by the directory filters; long groups collapse. */
export function ChipFilter({ legend, options, selected, onChange }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const toggle = (key) => onChange(selected.includes(key) ? selected.filter((value) => value !== key) : [...selected, key])
  const isLong = options.length > collapsedOptionCount + 2
  const visible = isLong && !isExpanded ? options.filter((option, position) => position < collapsedOptionCount || selected.includes(option.key)) : options
  return (
    <fieldset className="chip-filter">
      <legend>
        {legend}
        {selected.length > 0 && <span className="chip-chosen">{selected.length} chosen</span>}
      </legend>
      <div className="chip-row">
        {visible.map((option) => (
          <label key={option.key} className={`chip ${selected.includes(option.key) ? 'is-on' : ''}`}>
            <input type="checkbox" checked={selected.includes(option.key)} onChange={() => toggle(option.key)} />
            {option.label}
            {option.count != null && <span className="chip-count">{option.count}</span>}
          </label>
        ))}
        {isLong && <ShowAllToggle isExpanded={isExpanded} total={options.length} noun="options" onToggle={() => setIsExpanded(!isExpanded)} />}
      </div>
    </fieldset>
  )
}

/** Single-choice pill row (for example All / Central / a state); options are { key, label, count? }. */
export function SegmentedFilter({ label, options, value, onChange }) {
  return (
    <div className="segmented" role="radiogroup" aria-label={label}>
      {options.map((option) => (
        <button key={option.key} type="button" role="radio" aria-checked={value === option.key} className={value === option.key ? 'is-on' : ''} onClick={() => onChange(option.key)}>
          {option.label}
          {option.count != null && <span className="chip-count">{option.count}</span>}
        </button>
      ))}
    </div>
  )
}

/** "Show all N" / "Show fewer" toggle for long lists, so a tab opens short and expands on demand. */
export function ShowAllToggle({ isExpanded, total, noun, onToggle }) {
  return (
    <button type="button" className="show-all" onClick={onToggle} aria-expanded={isExpanded}>
      {isExpanded ? 'Show fewer' : `Show all ${total} ${noun}`}
    </button>
  )
}

/**
 * Collapsed section: a heading row that opens its content on demand, so a tab starts
 * short. The content is only rendered while open. `folds` comes from lib/useFolds.js.
 */
export function Fold({ id, title, hint, folds, children }) {
  const isOpen = folds.isOpen(id)
  return (
    <section className={`fold ${isOpen ? 'is-open' : ''}`} id={`section-${id}`}>
      <h3 className="fold-heading">
        <button type="button" aria-expanded={isOpen} aria-controls={`fold-body-${id}`} onClick={() => folds.toggle(id)}>
          <span className="fold-title">{title}</span>
          {hint && <span className="fold-hint">{hint}</span>}
          <ChevronDown size={18} aria-hidden="true" className="fold-chevron" />
        </button>
      </h3>
      {isOpen && (
        <div className="fold-body" id={`fold-body-${id}`}>
          {children}
        </div>
      )}
    </section>
  )
}
