# Requirements Radar Plugin

A lightweight plugin for visualizing and managing software requirements in a radar/explorer view and table view.

## Features

- **Requirement Scanning**: Scan prototype customer journey to fetch relevant requirements from API
- **Animated Results**: Requirements appear one by one in random order with smooth animations
- **Dual View Modes**: Toggle between Explorer (Radar) view and Table view
- **Visual Priority Mapping**: Requirements are positioned based on priority (distance from center)
- **Color-Coded Ratings**: Different colors for priority levels (1-5)
- **Interactive UI**: Hover effects and smooth transitions
- **Responsive Design**: Works with different screen sizes

## Structure

The plugin consists of 5 main modules:

### 1. **Page.tsx**
Main entry point that:
- Receives `model` and `prototype` data from the host
- Manages view state (explorer vs table)
- Extracts requirements from prototype data
- Injects CSS styles dynamically

### 2. **components.tsx**
Reusable components:
- `Button`: Simple button with hover states
- `RequirementNode`: Individual requirement card in radar view
- `RequirementExplorer`: Radar visualization with circular positioning
- `RequirementTable`: Tabular view of all requirements

### 3. **types.ts**
TypeScript interfaces:
- `Requirement`: Core requirement data structure
- `ViewMode`: Explorer or Table view types

### 4. **injectStyles.ts**
Dynamic CSS injection for styling without Tailwind

### 5. **api.ts**
API integration functions:
- `convertCustomerJourneyToRequirements`: Convert customer journey to requirement text
- `fetchRequirements`: Fetch matching requirements from similarity API

## Data Structure

Requirements are expected in the prototype data as:

```typescript
prototype: {
  extend: {
    requirements: [
      {
        id: string,
        title: string,
        description: string,
        type: string,
        source: {
          type: 'internal' | 'external',
          link?: string
        },
        rating: {
          priority: number,  // 1-5 (5 = highest)
          relevance: number, // 1-5
          impact: number     // 1-5
        }
      }
    ]
  }
}
```

## Priority Color Coding

- **Priority 5**: Red background (Critical)
- **Priority 4**: Orange background (High)
- **Priority 3**: Blue background (Medium)
- **Priority 2**: Green background (Low)
- **Priority 1**: Gray background (Minimal)

## Radar View Algorithm

Requirements are positioned using:
- **Distance from center**: Inversely proportional to priority (higher priority = closer)
- **Angular position**: Evenly distributed around the circle
- **Slight offset**: Based on relevance rating for visual variation

## Building

```bash
bash build.sh
```

Outputs:
- `index.js` - Bundled plugin code
- `index.css` - Compiled styles
- Source maps for debugging

## Dependencies

- React (provided by host)
- No external packages required
- Pure TypeScript/JavaScript implementation

## Usage

### Loading Existing Requirements
The plugin automatically loads requirements when:
1. A prototype with requirements data is available
2. The plugin is registered in the host application
3. The Page component receives `data.prototype.extend.requirements`

### Scanning for New Requirements
1. Click the "🔍 Run new scan" button
2. The plugin will:
   - Extract customer journey from prototype data
   - Convert it to requirement text via API
   - Fetch matching requirements using similarity search
   - Display results one by one with animations
3. Requirements appear in random order for visual effect
4. Each requirement fades in with a slight delay (200-600ms)

### API Integration
The scanning feature uses two endpoints:
- **Workflow API**: `https://workflow.digital.auto/webhook/...`
  - Converts customer journey to structured requirement text
- **Similarity API**: `https://sematha.digitalauto.tech/api/similarity`
  - Finds matching requirements from database
  - Returns top 40 matches with similarity threshold of 0.5

## Development Notes

- No Tailwind CSS - custom styles injected dynamically
- Lean implementation - only 4 core components
- Works standalone without complex dependencies
- Reference implementation based on `PrototypeTabRequirement.tsx` but simplified
