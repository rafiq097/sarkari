/**
 * Vite build configuration: React, the calendar feeds written at build time, and the
 * PWA service worker that makes the site work offline under the /sarkari/ base path.
 */
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { calendarFeeds } from './scripts/calendar-feeds.mjs'

// GitHub Pages serves the site from this folder; the service worker scope must match it.
const siteBase = '/sarkari/'
// The dark page background, used for the install splash screen and browser bar.
const themeColour = '#121110'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // calendarFeeds writes the subscribable .ics files into dist/feeds/ at build time.
    calendarFeeds(),
    VitePWA({
      // 'prompt' keeps the old version running until the reader presses Reload.
      registerType: 'prompt',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Sarkari Shiksha',
        short_name: 'Sarkari',
        description: 'Research guide to government exams: eligibility, syllabus, cutoffs, pay and careers.',
        start_url: siteBase,
        scope: siteBase,
        display: 'standalone',
        background_color: themeColour,
        theme_color: themeColour,
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // App shell, every page chunk and every exam profile chunk (they are .js files),
        // plus the Latin fonts the site actually renders with.
        globPatterns: ['index.html', 'assets/*.{js,css}', 'assets/*-latin-*.woff2'],
        // Extended Latin files match the pattern above but are rarely needed; they are
        // cached on first use by the runtime rule below instead.
        globIgnores: ['assets/*-latin-ext-*.woff2'],
        // HashRouter keeps every page at the base address, so only that address falls
        // back to the cached shell. Other paths (404.html redirects, /feeds/) go to the network.
        navigateFallback: `${siteBase}index.html`,
        navigateFallbackAllowlist: [new RegExp(`^${siteBase}(index\\.html)?$`)],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            // Other font files (extra scripts and legacy .woff): keep once fetched.
            urlPattern: ({ request }) => request.destination === 'font',
            handler: 'CacheFirst',
            options: { cacheName: 'fonts', expiration: { maxEntries: 40 } },
          },
        ],
      },
    }),
  ],
  base: siteBase,
})
