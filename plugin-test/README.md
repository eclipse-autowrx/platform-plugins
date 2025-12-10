# Plugin Test Environment

A simple test environment for loading and testing plugins dynamically.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will open at `http://localhost:3000`

## Usage

1. Start your plugin's dev server (e.g., `npm run dev` in the plugin folder)
2. Enter the plugin URL in the input field (default: `http://localhost:4000/index.js`)
3. Click "Load Plugin" to load and mount the plugin
4. The plugin will be rendered in the container below

## Features

- Dynamic plugin loading from any URL
- Automatic CSS loading (if `index.css` exists at the same base URL)
- Plugin unmounting and cleanup on reload
- Error handling and status messages
- Tailwind CSS for styling

## How It Works

The test environment:
1. Loads the plugin script dynamically as a `<script>` tag
2. Waits for the plugin to register itself in `window.DAPlugins['page-plugin']`
3. Calls the plugin's `mount()` function with a container element
4. Handles cleanup when reloading or unmounting

Plugins should export:
- `mount(el: HTMLElement, props?: any)` - Function to mount the plugin
- `unmount(el: HTMLElement)` - Function to unmount the plugin (optional)
- Or register via `window.DAPlugins['page-plugin'] = { mount, unmount }`
