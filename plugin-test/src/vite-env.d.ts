/// <reference types="vite/client" />

interface Window {
  DAPlugins?: {
    [key: string]: {
      mount?: (el: HTMLElement, props?: any) => void
      unmount?: (el: HTMLElement) => void
      components?: {
        Page?: React.ComponentType<any>
      }
    }
  }
  React?: typeof React
  ReactDOM?: {
    createRoot: (container: HTMLElement | DocumentFragment) => any
  }
}
