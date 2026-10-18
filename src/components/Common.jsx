/**
 * General building blocks: breadcrumbs, section headings, empty states, scroll reveal,
 * real-data counters, tabs and multi-select chip filters. Used by most pages.
 */
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { ChevronRight, SearchX } from 'lucide-react'

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

/** Counts up to a real number once; shows the final value immediately when motion is reduced. */
export function Counter({ value }) {
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const [displayed, setDisplayed] = useState(prefersReducedMotion ? value : 0)

  useEffect(() => {
    if (prefersReducedMotion) return undefined
    let frameId
    const startTime = performance.now()
    // 900 ms ease-out count, short enough not to delay reading.
    const step = (now) => {
      const progress = Math.min(1, (now - startTime) / 900)
      setDisplayed(Math.round(value * (1 - (1 - progress) ** 3)))
      if (progress < 1) frameId = requestAnimationFrame(step)
    }
    frameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frameId)
  }, [value, prefersReducedMotion])

  return <span className="numeric">{displayed.toLocaleString('en-IN')}</span>
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

/** Multi-select chip group used by the directory filters. */
export function ChipFilter({ legend, options, selected, onChange }) {
  const toggle = (key) => onChange(selected.includes(key) ? selected.filter((value) => value !== key) : [...selected, key])
  return (
    <fieldset className="chip-filter">
      <legend>{legend}</legend>
      <div className="chip-row">
        {options.map((option) => (
          <label key={option.key} className={`chip ${selected.includes(option.key) ? 'is-on' : ''}`}>
            <input type="checkbox" checked={selected.includes(option.key)} onChange={() => toggle(option.key)} />
            {option.label}
            {option.count != null && <span className="chip-count">{option.count}</span>}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
