# Sample TSX Plugin

A React plugin template built with TypeScript and TSX that can be mounted into other projects via npm link or served standalone.

## Features

- TypeScript + TSX syntax with React
- Auto-rebuild and hot-reload development server
- Production builds with minification
- Can import and bundle npm packages
- Hot-loadable into host applications
- Accepts `data` and `config` props from host

## Quick Start

### Installation

```bash
npm install
```

### Development

Run the development server with auto-rebuild on file changes:

```bash
npm run dev
```

This will:
- Start a development server at `http://localhost:4000`
- Watch `src/` directory for changes
- Auto-rebuild `index.js` on save
- Serve with CORS enabled and caching disabled

Access your plugin at: **`http://localhost:4000/index.js`**

### Production Build

Build optimized, minified production bundle:

```bash
npm run build
```

Output: `dist/index.js` and `dist/index.js.map`

## Project Structure

```
sample-tsx-plugin/
├── src/
│   ├── index.ts           # Plugin entry point
│   ├── Page.tsx           # Main React component
│   └── components/
│       └── Box.tsx        # Example component
├── build.sh               # Development build script
├── build-dist.sh          # Production build script
├── index.js               # Development build output
└── dist/                  # Production build output (created on build)
    └── index.js
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with auto-rebuild on port 4000 |
| `npm run dev:watch` | Only watch and rebuild (no server) |
| `npm run dev:serve` | Only serve files on port 4000 (no auto-rebuild) |
| `npm run build` | Build production bundle to `dist/` folder |

## Using npm Packages

### Option 1: Bundle the package (Self-contained)

Add dependencies to `package.json` and import them normally:

```json
{
  "dependencies": {
    "dayjs": "^1.11.11"
  }
}
```

Then in your code:
```typescript
import dayjs from 'dayjs';

export default function Page({ data, config }: PageProps) {
  const formattedDate = dayjs().format('YYYY-MM-DD HH:mm:ss');
  return <div>Current: {formattedDate}</div>;
}
```

The build process will automatically bundle the package into your plugin.

### Option 2: Use host packages (Shared dependencies)

For packages already loaded in the host environment (React, etc.):

1. Add to `--external` flags in `build.sh` or `build-dist.sh`
2. Import them normally - they'll be resolved at runtime by the host

Example:
```typescript
// React imports are marked as external and provided by host
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
```

Currently external packages:
- `react`
- `react-dom`
- `react-dom/client`

## Plugin API

Your plugin exports ESM modules with the following interface:

### Option 1: Export components (recommended)
```typescript
// src/index.ts
export const components = { Page };
// or
export { Page };
// or
export default Page;
```

### Option 2: Export mount/unmount functions
```typescript
// src/index.ts
export function mount(el: HTMLElement, props?: any) {
  const root = ReactDOM.createRoot(el);
  root.render(React.createElement(Page, props || {}));
  (el as any).__root = root;
}

export function unmount(el: HTMLElement) {
  const root = (el as any).__root;
  if (root && root.unmount) root.unmount();
  delete (el as any).__root;
}
```

### Page Component Props
```typescript
type PageProps = {
  data?: any;    // Dynamic data from host
  config?: any;  // Configuration from plugin settings
};
```

The host loader will automatically detect and use your exports (`Page`, `components.Page`, or `mount/unmount`).

## Development Workflow

1. **Start development**: `npm run dev`
2. **Edit files** in `src/` directory
3. **Save changes** - auto-rebuild happens automatically
4. **Reload** your browser to see changes at `http://localhost:4000/index.js`

## Deployment

1. Build production bundle: `npm run build`
2. Deploy `dist/index.js` to your hosting service
3. Link the plugin in your host application

## Technical Details

### Build Configuration

- **Bundler**: esbuild
- **Format**: ESM (ECMAScript Modules)
- **Platform**: Browser
- **JSX**: Automatic runtime
- **Source maps**: Enabled in both dev and production
- **Minification**: Production only
- **Content-Type**: Served as `application/javascript`

### Development Server

- **Server**: http-server
- **Port**: 4000
- **CORS**: Enabled
- **Caching**: Disabled (`-c-1`)
- **File watcher**: nodemon (watches `.ts` and `.tsx` files)
