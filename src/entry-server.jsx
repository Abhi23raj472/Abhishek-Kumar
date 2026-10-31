import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.jsx'

// Used only at build time by scripts/prerender.mjs: renders the page to
// plain HTML so search engines and link previews see the full content
// without running JavaScript.
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
