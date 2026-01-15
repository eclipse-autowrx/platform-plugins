// When React is externalized, esbuild keeps the import but expects React to be available globally
// We need to ensure React is on globalThis before components load
import * as ReactModule from 'react'
import * as ReactDOMModule from 'react-dom/client'

// Get React - prefer globalThis (set by host), fallback to imported module
// Critical: Set on globalThis immediately so components can access it
let React: any;
let ReactDOM: any;

// Check if React is available on globalThis (provided by host)
if (typeof globalThis !== 'undefined' && (globalThis as any).React && typeof (globalThis as any).React.createElement === 'function') {
  React = (globalThis as any).React;
} else if (ReactModule && (ReactModule.default || ReactModule) && typeof (ReactModule.default || ReactModule).createElement === 'function') {
  // Use imported React module
  React = ReactModule.default || ReactModule;
} else {
  throw new Error('React is not available. Please ensure React is loaded before this plugin.');
}

// Ensure React is on globalThis for components
if (typeof globalThis !== 'undefined' && React) {
  (globalThis as any).React = React;
}

// Get ReactDOM
if (typeof globalThis !== 'undefined' && (globalThis as any).ReactDOM && typeof (globalThis as any).ReactDOM.createRoot === 'function') {
  ReactDOM = (globalThis as any).ReactDOM;
} else if (ReactDOMModule && (ReactDOMModule.default || ReactDOMModule) && typeof (ReactDOMModule.default || ReactDOMModule).createRoot === 'function') {
  ReactDOM = ReactDOMModule.default || ReactDOMModule;
} else {
  throw new Error('ReactDOM is not available. Please ensure ReactDOM is loaded before this plugin.');
}

// Ensure ReactDOM is on globalThis
if (typeof globalThis !== 'undefined' && ReactDOM) {
  (globalThis as any).ReactDOM = ReactDOM;
}

import Page from './Page'

export const components = { Page }

export function mount(el: HTMLElement, props?: any) {
  const root = ReactDOM.createRoot(el)
  root.render(React.createElement(Page as any, props || {}))
  ;(el as any).__aw_root = root
}

export function unmount(el: HTMLElement) {
  const r = (el as any).__aw_root
  if (r && r.unmount) r.unmount()
  delete (el as any).__aw_root
}

// Optional global registration
if (typeof window !== 'undefined') {
  ;(window as any).DAPlugins = (window as any).DAPlugins || {}
  ;(window as any).DAPlugins['page-plugin'] = { components, mount, unmount }
}


