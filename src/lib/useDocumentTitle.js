/**
 * Sets the browser tab title for the current page ("SSC CGL | Sarkari Shiksha") so tabs,
 * bookmarks and search results show what the page is. Used by PageHeader, ExamPage,
 * HomePage and the not-found page.
 */
import { useEffect } from 'react'

const siteName = 'Sarkari Shiksha'

/** Sets document.title to "<title> | Sarkari Shiksha", or the site name alone when no title is given. */
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${siteName}` : siteName
  }, [title])
}
