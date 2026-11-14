/**
 * "Add to calendar" button for an exam page. Builds an .ics file in the browser from
 * the loaded profile (official dates plus the expected yearly window, each with
 * reminders 7 days and 1 day before) and downloads it. Uses lib/ics.js.
 */
import { CalendarPlus } from 'lucide-react'
import { buildExamCalendar } from '../lib/ics.js'

/** Saves calendar text as a file through a temporary download link. */
function downloadCalendarFile(fileName, calendarText) {
  const objectUrl = URL.createObjectURL(new Blob([calendarText], { type: 'text/calendar;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = fileName
  link.click()
  URL.revokeObjectURL(objectUrl)
}

/** Button that downloads the calendar file of one exam profile. */
export function CalendarButton({ exam }) {
  return (
    <button type="button" className="icon-button" onClick={() => downloadCalendarFile(`${exam.id}.ics`, buildExamCalendar(exam, new Date()))} title="Download dates with reminders 7 days and 1 day before">
      <CalendarPlus size={16} aria-hidden="true" />
      <span>Add to calendar</span>
    </button>
  )
}
