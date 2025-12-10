import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// React is already loaded from CDN in index.html, but we use the bundled version for our app
// The CDN version is available for plugins that expect it globally
// Ensure React is available globally (CDN already sets this, but ensure it's there)
if (typeof window !== 'undefined') {
  // Use CDN React for plugins if available, otherwise fallback to bundled
  if (!(window as any).React) {
    ;(window as any).React = React
  }
  if (!(window as any).ReactDOM) {
    ;(window as any).ReactDOM = ReactDOM
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
