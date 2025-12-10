import React, { useState, useRef, useEffect } from 'react'

interface PluginModule {
  mount?: (el: HTMLElement, props?: any) => void
  unmount?: (el: HTMLElement) => void
  components?: {
    Page?: React.ComponentType<any>
  }
  Page?: React.ComponentType<any>
}

function App() {
  const [pluginUrl, setPluginUrl] = useState('http://localhost:4000/index.js')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('Ready')
  const pluginContainerRef = useRef<HTMLDivElement>(null)
  const scriptRef = useRef<HTMLScriptElement | null>(null)
  const linkRef = useRef<HTMLLinkElement | null>(null)
  const pluginRef = useRef<PluginModule | null>(null)
  const rootRef = useRef<any>(null) // Store React root reference

  const unmountPlugin = async () => {
    if (!pluginContainerRef.current) return
    
    const container = pluginContainerRef.current
    
    // Unmount using the plugin's unmount function
    // This should handle React cleanup properly
    if (pluginRef.current?.unmount) {
      try {
        pluginRef.current.unmount(container)
      } catch (err) {
        console.error('Error unmounting plugin:', err)
      }
    }
    
    // Also unmount any React root we might have created directly
    if (rootRef.current && typeof rootRef.current.unmount === 'function') {
      try {
        rootRef.current.unmount()
      } catch (err) {
        // Ignore errors
      }
      rootRef.current = null
    }
    
    // Wait for React to finish cleanup
    // React's unmount is synchronous but DOM updates are async
    await new Promise(resolve => {
      // Wait for next tick + animation frame to ensure React cleanup is done
      setTimeout(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(resolve)
        })
      }, 0)
    })
    
    pluginRef.current = null
  }

  const removeScript = () => {
    if (scriptRef.current && scriptRef.current.parentNode) {
      scriptRef.current.parentNode.removeChild(scriptRef.current)
      scriptRef.current = null
    }
    if (linkRef.current && linkRef.current.parentNode) {
      linkRef.current.parentNode.removeChild(linkRef.current)
      linkRef.current = null
    }
    // Clear the DAPlugins registry
    if (window.DAPlugins) {
      delete (window.DAPlugins as any)['page-plugin']
    }
  }

  const loadPlugin = async () => {
    if (!pluginUrl.trim()) {
      setError('Please enter a plugin URL')
      return
    }

    setIsLoading(true)
    setError(null)
    setStatus('Loading plugin...')

    try {
      // Unmount and cleanup previous plugin
      await unmountPlugin()
      removeScript()
      
      // Clear container after unmounting is complete
      // This ensures React has finished all cleanup
      if (pluginContainerRef.current) {
        // Use a small delay to ensure React cleanup is fully done
        await new Promise(resolve => setTimeout(resolve, 50))
        try {
          pluginContainerRef.current.innerHTML = ''
        } catch (err) {
          // Ignore - container might already be empty or in transition
          console.warn('Could not clear container:', err)
        }
      }

      // Try to load CSS from the same base URL
      const cssUrl = pluginUrl.replace(/index\.js$/, 'index.css')
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = cssUrl
      link.onerror = () => {
        // CSS is optional, so we don't treat this as an error
        console.log('No CSS file found at', cssUrl)
      }
      linkRef.current = link
      document.head.appendChild(link)

      // Create new script element
      const script = document.createElement('script')
      script.src = pluginUrl
      script.type = 'text/javascript'
      script.async = true

      script.onload = () => {
        setStatus('Plugin loaded, mounting...')
        
        // Wait a bit for the script to register
        setTimeout(() => {
          try {
            // Check for plugin in DAPlugins registry
            const daPlugins = (window as any).DAPlugins
            let plugin: PluginModule | null = null

            if (daPlugins && daPlugins['page-plugin']) {
              plugin = daPlugins['page-plugin']
            } else {
              // Try to get from module exports (if using dynamic import)
              // For now, we'll rely on DAPlugins
              throw new Error('Plugin not found in DAPlugins registry')
            }

            if (!plugin) {
              throw new Error('Plugin module not found')
            }

            // Mount the plugin
            if (pluginContainerRef.current) {
              if (plugin.mount) {
                plugin.mount(pluginContainerRef.current, {
                  data: {},
                  config: {}
                })
                pluginRef.current = plugin
                setStatus('Plugin mounted successfully!')
                setIsLoading(false)
              } else if (plugin.components?.Page) {
                // If plugin exports components, we need React to render it
                const React = (window as any).React
                const ReactDOM = (window as any).ReactDOM
                if (React && ReactDOM && pluginContainerRef.current) {
                  const root = ReactDOM.createRoot(pluginContainerRef.current)
                  rootRef.current = root
                  root.render(React.createElement(plugin.components.Page, {
                    data: {},
                    config: {}
                  }))
                  pluginRef.current = plugin
                  setStatus('Plugin mounted successfully!')
                  setIsLoading(false)
                } else {
                  throw new Error('React not available for component rendering')
                }
              } else {
                throw new Error('Plugin does not export mount function or Page component')
              }
            }
          } catch (err: any) {
            setError(err.message || 'Failed to mount plugin')
            setStatus('Failed to mount plugin')
            setIsLoading(false)
            console.error('Mount error:', err)
          }
        }, 100)
      }

      script.onerror = () => {
        setError(`Failed to load plugin from ${pluginUrl}`)
        setStatus('Failed to load plugin')
        setIsLoading(false)
      }

      scriptRef.current = script
      document.head.appendChild(script)
    } catch (err: any) {
      setError(err.message || 'Failed to load plugin')
      setStatus('Failed to load plugin')
      setIsLoading(false)
    }
  }

  useEffect(() => {
    return () => {
      unmountPlugin()
      removeScript()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Plugin Test Environment</h1>
          
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label htmlFor="plugin-url" className="block text-sm font-medium text-gray-700 mb-1">
                Plugin URL
              </label>
              <input
                id="plugin-url"
                type="text"
                value={pluginUrl}
                onChange={(e) => setPluginUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    loadPlugin()
                  }
                }}
                placeholder="http://localhost:4000/index.js"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                disabled={isLoading}
              />
            </div>
            
            <button
              onClick={loadPlugin}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Loading...' : 'Load Plugin'}
            </button>
          </div>

          {error && (
            <div className="mt-0 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {status && !error && (
            <div className="mt-3">
              <p className="text-sm text-gray-600">Status: <span className="font-medium">{status}</span></p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 py-2">
        <div
          ref={pluginContainerRef}
          className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[600px] p-2"
        >
          {!pluginRef.current && !isLoading && (
            <div className="flex items-center justify-center h-full min-h-[600px] text-gray-400">
              <div className="text-center">
                <p className="text-lg mb-2">No plugin loaded</p>
                <p className="text-sm">Enter a plugin URL and click "Load Plugin" to start testing</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
