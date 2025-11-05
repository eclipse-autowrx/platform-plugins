# Flow Plugin Usage Guide

## Overview

The Flow Plugin displays end-to-end system flows in a tabular format, showing the data flow from off-board (Smart Phone, Cloud) through vehicle-to-cloud communication to on-board systems (SDV Runtime, Embedded, Sensors).

## Features

- **Tabular Flow Visualization**: Shows flows across 9 columns organized into Off-board, V2C, and On-board sections
- **ASIL Level Support**: Display ASIL/QM safety levels for each flow item
- **Signal Flow Indicators**: Visual arrows showing direction of data flow between systems
- **Detailed View**: Click on any cell to see detailed information
- **JSON Editor**: Edit flow data directly in JSON format
- **Responsive Design**: Clean, professional styling without external CSS frameworks

## Data Structure

### Flow Data Format

The plugin expects a `data.flow` property with the following structure:

```typescript
{
  data: {
    flow: [
      {
        title: "Step Title",
        flows: [
          {
            offBoard: {
              smartPhone: string,
              p2c: SignalFlow | null,
              cloud: string
            },
            v2c: SignalFlow | null,
            onBoard: {
              sdvRuntime: string,
              s2s: SignalFlow | null,
              embedded: string,
              s2e: SignalFlow | null,
              sensors: string
            }
          }
        ]
      }
    ]
  }
}
```

### SignalFlow Type

```typescript
{
  direction: 'left' | 'right' | 'bi-direction' | 'reverse-bi-direction' | 'down-right' | 'down-left',
  signal: string
}
```

## Cell Data Formats

Each cell (except signal flow cells) can contain data in two formats:

### 1. Simple String with ASIL Level

```
"Description text <ASIL-A>"
"Description text <ASIL-B>"
"Description text <ASIL-C>"
"Description text <ASIL-D>"
"Description text <QM>"
```

### 2. JSON Object (Recommended)

```json
{
  "type": "Mobile App",
  "component": "Authentication Service",
  "description": "User initiates login",
  "preAsilLevel": "QM",
  "postAsilLevel": "QM",
  "riskAssessment": "Optional risk assessment text",
  "approvedBy": "John Doe",
  "approvedAt": "2025-01-01T00:00:00Z"
}
```

**Required Fields:**
- `description`: Main text to display
- `preAsilLevel`: Pre-mitigation ASIL level (A, B, C, D, or QM)

**Optional Fields:**
- `type`: Component type
- `component`: Component name
- `postAsilLevel`: Post-mitigation ASIL level (defaults to QM)
- `riskAssessment`: Risk assessment details
- `approvedBy`: Approver name
- `approvedAt`: Approval timestamp
- Custom fields are also supported

## Signal Flow Data

Signal flow cells (p2c, v2c, s2s, s2e) can contain:

### Simple Format
```json
{
  "direction": "right",
  "signal": "Signal Name"
}
```

### Detailed Format
```json
{
  "direction": "bi-direction",
  "signal": "{\"endpointUrl\": \"https://api.example.com\", \"name\": \"Auth Request\", \"protocol\": \"HTTPS\"}"
}
```

## Example Usage

### Basic Example

```javascript
const flowData = [
  {
    title: "User Authentication Flow",
    flows: [
      {
        offBoard: {
          smartPhone: "User Login <ASIL-A>",
          p2c: {
            direction: "right",
            signal: "Auth Request"
          },
          cloud: "Validate Credentials <ASIL-B>"
        },
        v2c: {
          direction: "bi-direction",
          signal: "Vehicle Status"
        },
        onBoard: {
          sdvRuntime: "Process Command <ASIL-C>",
          s2s: {
            direction: "right",
            signal: "CAN Signal"
          },
          embedded: "Execute Action <ASIL-D>",
          s2e: {
            direction: "left",
            signal: "Feedback"
          },
          sensors: "Read Sensor <QM>"
        }
      }
    ]
  }
];

// Pass to plugin
<Page data={{ flow: flowData }} config={{ onChange: handleFlowChange }} />
```

### Advanced Example with JSON Details

```javascript
const advancedFlowData = [
  {
    title: "Vehicle Control Flow",
    flows: [
      {
        offBoard: {
          smartPhone: JSON.stringify({
            type: "Mobile App",
            component: "Remote Start Module",
            description: "User initiates remote start",
            preAsilLevel: "A",
            postAsilLevel: "QM",
            approvedBy: "Safety Team"
          }),
          p2c: {
            direction: "right",
            signal: JSON.stringify({
              endpointUrl: "https://api.vehicle.com/control",
              name: "Remote Start Command",
              protocol: "HTTPS",
              encryption: "TLS 1.3"
            })
          },
          cloud: JSON.stringify({
            type: "Cloud Service",
            component: "Command Processor",
            description: "Validates and routes command",
            preAsilLevel: "B",
            postAsilLevel: "QM"
          })
        },
        v2c: {
          direction: "down-right",
          signal: JSON.stringify({
            name: "Vehicle.Control.Start",
            protocol: "MQTT"
          })
        },
        onBoard: {
          sdvRuntime: JSON.stringify({
            type: "Runtime Service",
            component: "Vehicle OS",
            description: "Executes start sequence",
            preAsilLevel: "C",
            postAsilLevel: "B"
          }),
          s2s: {
            direction: "bi-direction",
            signal: "System Bus Signal"
          },
          embedded: JSON.stringify({
            type: "ECU",
            component: "Engine Control Module",
            description: "Starts engine",
            preAsilLevel: "D",
            postAsilLevel: "C"
          }),
          s2e: {
            direction: "right",
            signal: "Actuator Command"
          },
          sensors: JSON.stringify({
            type: "Sensor Array",
            component: "Engine Sensors",
            description: "Monitors engine status",
            preAsilLevel: "QM",
            postAsilLevel: "QM"
          })
        }
      }
    ]
  }
];
```

## Column Structure

The flow table has 9 columns organized into 3 groups:

### Off-board (3 columns)
1. **Smart Phone**: Mobile application or device
2. **p2c** (Phone to Cloud): Signal flow indicator
3. **Cloud**: Cloud service or backend

### Vehicle-to-Cloud (1 column)
4. **v2c** (Vehicle to Cloud): Bi-directional communication indicator

### On-board (5 columns)
5. **SDV Runtime**: Software-defined vehicle runtime
6. **s2s** (System to System): Internal system communication
7. **Embedded**: Embedded systems / ECUs
8. **s2e** (System to ECU): System to embedded communication
9. **Sensors/Actuators**: Physical sensors and actuators

## Features

### Edit Mode
- Click the "Edit" button to enter JSON edit mode
- Modify the flow data directly
- Click "Save" to apply changes or "Cancel" to discard

### ASIL Display
- Check "Show ASIL/QM Levels" to display safety level badges
- Badges are color-coded:
  - ASIL-D: Red (highest criticality)
  - ASIL-C: Orange
  - ASIL-B: Yellow
  - ASIL-A: Blue
  - QM: Gray (Quality Management, lowest criticality)

### Detailed View
- Click any cell to see detailed information in a popup
- View all metadata including type, component, description, ASIL levels, and custom fields
- Links (URLs) are automatically detected and made clickable

### Signal Flow Visualization
- Arrows indicate data flow direction:
  - → : Left to right
  - ← : Right to left
  - ↔ : Bi-directional
  - ↕ : Reverse bi-directional
  - ⤵ : Down-right
  - ⤴ : Down-left

## Styling

The plugin includes custom CSS without external dependencies. All styles are scoped to the plugin and use CSS custom properties for easy theming:

```css
:root {
  --color-primary: #3b82f6;
  --color-secondary: #6366f1;
  /* ... more variables */
}
```

## Configuration

Pass configuration through the `config` prop:

```javascript
<Page 
  data={{ flow: flowData }} 
  config={{ 
    onChange: (newFlowJson) => {
      console.log('Flow updated:', newFlowJson);
      // Save to backend or state
    }
  }} 
/>
```

## Best Practices

1. **Use JSON format** for cells with complex data or ASIL levels
2. **Include meaningful descriptions** for each step
3. **Document ASIL levels** for safety-critical systems
4. **Use consistent naming** for signal flows
5. **Group related flows** under the same step title
6. **Keep titles concise** but descriptive

## Troubleshooting

### Flow not displaying
- Check that `data.flow` is properly formatted
- Verify JSON syntax if using JSON strings in cells
- Check browser console for errors

### ASIL badges not showing
- Ensure "Show ASIL/QM Levels" checkbox is checked
- Verify ASIL level format: must be A, B, C, D, or QM
- Check that `preAsilLevel` field exists in JSON data

### Edit mode not saving
- Verify JSON syntax is valid
- Check that `config.onChange` callback is provided
- Look for validation errors in console

## Development

To modify the plugin:

1. Edit source files in `src/`
2. Run `npm run dev` to start development server
3. Plugin will be available at `http://localhost:4002/index.js`
4. Changes auto-rebuild on save

## Building

```bash
# Development build
npm run dev

# Production build
npm run build
```

The production build outputs to `dist/index.js` with minification and source maps.

