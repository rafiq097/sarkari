/**
 * Browser entry point: loads self-hosted fonts and styles, then mounts the app.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/fraunces'
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-sans/600.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import './index.css'
import './styles/layout.css'
import './styles/components.css'
import './styles/controls.css'
import './styles/pages.css'
import './styles/profile.css'
import './styles/tools.css'
import './styles/profile-layout.css'
import './styles/roadmap.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
