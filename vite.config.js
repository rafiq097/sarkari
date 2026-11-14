import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { calendarFeeds } from './scripts/calendar-feeds.mjs'

// https://vite.dev/config/
export default defineConfig({
  // calendarFeeds writes the subscribable .ics files into dist/feeds/ at build time.
  plugins: [react(), calendarFeeds()],
  base: '/sarkari/',
})
