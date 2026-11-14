/**
 * Subscribe page: lists the calendar feeds written at build time under /feeds/ (group
 * feeds and one per exam) and explains how to add a feed to Google Calendar and Apple
 * Calendar. A subscribed feed updates by itself; nothing is sent to any server of ours.
 * Feed names and paths come from lib/feeds.js, shared with the build step.
 */
import { useState } from 'react'
import { Link } from 'react-router'
import { Copy, Check, Info, CalendarPlus } from 'lucide-react'
import { Breadcrumbs, PageHeader, SectionHeading, ShowAllToggle } from '../components/Common.jsx'
import { examIndex, vocabulary } from '../lib/data.js'
import { examFeedPath, groupFeeds } from '../lib/feeds.js'

// How long the "Copied" confirmation stays before the button resets.
const copiedResetMilliseconds = 2000
// The per-exam list opens with this many rows.
const collapsedExamCount = 8
// Google Calendar's own "add a calendar from a URL" screen.
const googleAddByUrlPage = 'https://calendar.google.com/calendar/u/0/r/settings/addbyurl'

/** Full https address of a feed, built from where the site is being served. */
function feedUrl(feedPath) {
  return new URL(`${import.meta.env.BASE_URL}${feedPath}`, window.location.origin).href
}

/** One feed row: name, a copy button for its address and an Apple Calendar link. */
function FeedRow({ name, detail, feedPath }) {
  const [isCopied, setIsCopied] = useState(false)
  const address = feedUrl(feedPath)
  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address)
      setIsCopied(true)
      window.setTimeout(() => setIsCopied(false), copiedResetMilliseconds)
    } catch {
      // Clipboard blocked: the address is still visible in the row to copy by hand.
    }
  }
  return (
    <li className="feed-row">
      <div className="feed-row-text">
        <span className="feed-name">{name}</span>
        {detail && <span className="faint small">{detail}</span>}
        <code className="feed-address">{address}</code>
      </div>
      <div className="feed-row-actions">
        <button type="button" className="button button-small" onClick={copyAddress}>
          {isCopied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />} {isCopied ? 'Copied' : 'Copy address'}
        </button>
        {/* webcal:// makes phones and Macs open their calendar app's subscribe dialog. */}
        <a className="button button-small button-ghost" href={address.replace(/^https?:/, 'webcal:')}>
          <CalendarPlus size={14} aria-hidden="true" /> Open in calendar app
        </a>
      </div>
    </li>
  )
}

/** Subscribe page. */
export default function SubscribePage() {
  const [isExpanded, setIsExpanded] = useState(false)
  const groups = groupFeeds(examIndex, vocabulary)
  const visibleExams = isExpanded ? examIndex : examIndex.slice(0, collapsedExamCount)
  return (
    <>
      <Breadcrumbs items={[{ label: 'Tools', to: '/tools' }, { label: 'Calendar', to: '/calendar' }, { label: 'Subscribe' }]} />
      <PageHeader eyebrow="Tool" title="Subscribe to exam dates" lead="Add a feed to your own calendar once. New official dates then show up by themselves, with reminders 7 days and 1 day before." />
      <div className="callout">
        <Info size={18} aria-hidden="true" />
        <div>
          Exact dates come only from official notices and calendars. Entries titled "Expected window (tentative)" are yearly patterns, not announced dates. Confirm every date on the official website.
        </div>
      </div>

      <SectionHeading number="01" title="How to add a feed" description="Copy a feed address below, then follow the steps for your calendar." />
      <div className="subscribe-steps">
        <section className="panel">
          <h3>Google Calendar</h3>
          <ol className="plain-list">
            <li>Copy the address of the feed you want.</li>
            <li>
              On a computer, open{' '}
              <a href={googleAddByUrlPage} target="_blank" rel="noreferrer" className="text-link">
                Google Calendar, Add from URL
              </a>{' '}
              (or the plus sign next to "Other calendars", then "From URL").
            </li>
            <li>Paste the address and choose "Add calendar".</li>
            <li>It then appears in the Google Calendar app on your phone too. Google refreshes feeds about once a day.</li>
          </ol>
        </section>
        <section className="panel">
          <h3>Apple Calendar</h3>
          <ol className="plain-list">
            <li>On an iPhone, iPad or Mac, press "Open in calendar app" next to a feed and confirm "Subscribe".</li>
            <li>Or on iPhone: Calendar, Calendars, Add Calendar, Add Subscription Calendar, then paste the address.</li>
            <li>Or on a Mac: Calendar, File, New Calendar Subscription, then paste the address.</li>
            <li>Keep "Remove alerts" off to get the reminders.</li>
          </ol>
        </section>
      </div>
      <p className="muted small spaced">
        Want only one exam, without subscribing? Use the "Add to calendar" button on any <Link to="/exams" className="text-link">exam page</Link> to download its dates as a file.
      </p>

      <SectionHeading number="02" title="Group feeds" description="All current exams of one government, or of one minimum qualification." />
      <ul className="feed-list">
        {groups.map((feed) => (
          <FeedRow key={feed.path} name={feed.name} detail={`${feed.examIds.length} exams`} feedPath={feed.path} />
        ))}
      </ul>

      <SectionHeading number="03" title="One exam" description="A feed with the dates of a single exam." />
      <ul className="feed-list">
        {visibleExams.map((exam) => (
          <FeedRow key={exam.id} name={exam.abbreviation || exam.name} detail={exam.abbreviation ? exam.name : null} feedPath={examFeedPath(exam.id)} />
        ))}
      </ul>
      {examIndex.length > collapsedExamCount && <ShowAllToggle isExpanded={isExpanded} total={examIndex.length} noun="exam feeds" onToggle={() => setIsExpanded(!isExpanded)} />}
    </>
  )
}
