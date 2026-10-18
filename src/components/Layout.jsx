/**
 * Site frame: skip link, sticky header with primary navigation and search,
 * mobile menu, page outlet with route transition, and footer. Wraps every route in App.jsx.
 */
import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { Menu, X, BookMarked, GitCompareArrows, Library, ClipboardList, Compass, UserRound } from 'lucide-react'
import { regionLinks, toolLinks } from '../lib/navigation.js'
import { SearchBox } from './SearchBox.jsx'
import { useSaved } from '../lib/saved.jsx'

/** Header, navigation and footer around the current page. */
export function Layout() {
  const location = useLocation()
  // The menu belongs to the path it was opened on, so any navigation closes it.
  const [menuOpenOnPath, setMenuOpenOnPath] = useState(null)
  const isMenuOpen = menuOpenOnPath === location.pathname
  const setIsMenuOpen = (shouldOpen) => setMenuOpenOnPath(shouldOpen ? location.pathname : null)
  const { bookmarks, compare, candidate } = useSaved()

  // Return to the top whenever the route changes.
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  useEffect(() => {
    document.body.classList.toggle('menu-open', isMenuOpen)
  }, [isMenuOpen])

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="brand" aria-label="Sarkari Atlas home">
            <span className="brand-mark" aria-hidden="true">
              <Compass size={18} />
            </span>
            <span className="brand-name">
              Sarkari <em>Atlas</em>
            </span>
          </Link>
          <nav className="primary-nav" aria-label="Primary">
            <NavLink to="/exams">All exams</NavLink>
            {regionLinks.map((link) => (
              <NavLink key={link.to} to={link.to}>
                {link.label}
              </NavLink>
            ))}
            <NavLink to="/tools">Tools</NavLink>
          </nav>
          <div className="header-search">
            <SearchBox placeholder="Search" />
          </div>
          <div className="header-actions">
            <NavLink to="/compare" className="header-icon" title="Comparison">
              <GitCompareArrows size={18} aria-hidden="true" />
              {compare.length > 0 && <span className="pip">{compare.length}</span>}
              <span className="visually-hidden">Comparison ({compare.length})</span>
            </NavLink>
            <NavLink to="/profile" className="header-icon" title="My profile">
              <UserRound size={18} aria-hidden="true" />
              {candidate && <span className="pip pip-dot" aria-hidden="true" />}
              <span className="visually-hidden">My profile{candidate ? ' (saved)' : ''}</span>
            </NavLink>
            <NavLink to="/saved" className="header-icon" title="Saved exams">
              <BookMarked size={18} aria-hidden="true" />
              {bookmarks.length > 0 && <span className="pip">{bookmarks.length}</span>}
              <span className="visually-hidden">Saved exams ({bookmarks.length})</span>
            </NavLink>
            <button type="button" className="header-icon menu-toggle" aria-expanded={isMenuOpen} aria-controls="mobile-menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
              <span className="visually-hidden">Menu</span>
            </button>
          </div>
        </div>
        <div id="mobile-menu" className={`mobile-menu ${isMenuOpen ? 'is-open' : ''}`} hidden={!isMenuOpen}>
          <SearchBox onDone={() => setIsMenuOpen(false)} />
          <p className="menu-label">Browse</p>
          <NavLink to="/exams">All exams</NavLink>
          {regionLinks.map((link) => (
            <NavLink key={link.to} to={link.to}>
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/profile">
            <UserRound size={16} aria-hidden="true" /> My profile
          </NavLink>
          <p className="menu-label">Tools</p>
          {toolLinks.map((link) => (
            <NavLink key={link.to} to={link.to}>
              <link.icon size={16} aria-hidden="true" /> {link.label}
            </NavLink>
          ))}
          <NavLink to="/sources">
            <Library size={16} aria-hidden="true" /> Sources
          </NavLink>
          <NavLink to="/coverage">
            <ClipboardList size={16} aria-hidden="true" /> Research coverage
          </NavLink>
        </div>
      </header>

      <main id="main" className="page-main" key={location.pathname}>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-about">
            <p className="brand-name">
              Sarkari <em>Atlas</em>
            </p>
            <p>An independent research guide to Central, Andhra Pradesh and Telangana government recruitment. Not affiliated with any government body. The official notification is always authoritative.</p>
          </div>
          <div>
            <p className="footer-heading">Browse</p>
            <Link to="/exams">All exams</Link>
            {regionLinks.map((link) => (
              <Link key={link.to} to={link.to}>
                {link.label}
              </Link>
            ))}
          </div>
          <div>
            <p className="footer-heading">Tools</p>
            {toolLinks.map((link) => (
              <Link key={link.to} to={link.to}>
                {link.label}
              </Link>
            ))}
          </div>
          <div>
            <p className="footer-heading">Research</p>
            <Link to="/sources">Source directory</Link>
            <Link to="/coverage">Coverage report</Link>
            <Link to="/methodology">Methodology</Link>
            <Link to="/profile">My profile</Link>
            <Link to="/saved">Saved exams</Link>
          </div>
        </div>
      </footer>
    </>
  )
}
