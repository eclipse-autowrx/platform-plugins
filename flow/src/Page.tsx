// eslint-disable-next-line @typescript-eslint/no-explicit-any
const React: any = (globalThis as any).React;

import { FlowStep, SignalFlow, Interface, ASILLevel } from './types';
import { FLOW_CELLS, headerGroups, getNestedValue, setNestedValue, createEmptyFlow } from './utils';
import './styles.css';

type PageProps = { data?: any; config?: any };

interface EditingCell {
  stepIndex: number;
  flowIndex: number;
  fieldPath: string[];
  value: string;
  cellTitle: string;
}

// Arrow components using SVG instead of react-icons
const ArrowLeft = () => (
  <svg className="flow-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const ArrowRight = () => (
  <svg className="flow-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const ArrowsLeftRight = () => (
  <svg className="flow-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);

const ArrowsRightLeft = () => (
  <svg className="flow-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
  </svg>
);

const CornerDownRight = () => (
  <svg className="flow-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h6a4 4 0 014 4v8m0 0l-4-4m4 4l4-4" />
  </svg>
);

const CornerDownLeft = () => (
  <svg className="flow-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 6h-6a4 4 0 00-4 4v8m0 0l4-4m-4 4l-4-4" />
  </svg>
);

const EditIcon = () => (
  <svg className="flow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="flow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const LoadingIcon = () => (
  <svg className="flow-icon loading-spinner" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const EditSmallIcon = () => (
  <svg className="flow-cell-edit-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

// Direction Arrow Component
const DirectionArrow = ({ direction }: { direction: string }) => {
  switch (direction) {
    case 'left':
      return <ArrowLeft />;
    case 'right':
      return <ArrowRight />;
    case 'bi-direction':
      return <ArrowsRightLeft />;
    case 'reverse-bi-direction':
      return <ArrowsLeftRight />;
    case 'down-right':
      return <CornerDownRight />;
    case 'down-left':
      return <CornerDownLeft />;
    default:
      return <ArrowRight />;
  }
};

// ASIL Badge Component
const ASILBadge = ({ level, show }: { level: ASILLevel; show: boolean }) => {
  if (!show) return null;
  
  const badgeClass = `asil-badge asil-badge-${level.toLowerCase()}`;
  const displayText = level === 'QM' ? 'QM' : `ASIL-${level}`;
  
  return <span className={badgeClass}>{displayText}</span>;
};

// Parse flow item data
const parseActivityData = (input: string) => {
  if (!input) return { displayText: '', preAsilLevel: null, data: null };
  
  try {
    const jsonData = JSON.parse(input);
    const preAsil = jsonData.preAsilLevel || jsonData.asilLevel || 'QM';
    return {
      displayText: jsonData.description || '',
      preAsilLevel: preAsil as ASILLevel,
      data: jsonData,
    };
  } catch {
    // Try to extract ASIL level from text
    const safetyLevels = ['<ASIL-D>', '<ASIL-C>', '<ASIL-B>', '<ASIL-A>', '<QM>'];
    const matchedLevel = safetyLevels.find(level => input.includes(level));
    let displayText = input;
    let extractedLevel: ASILLevel | null = null;
    
    if (matchedLevel) {
      displayText = input.replace(matchedLevel, '').trim();
      const level = matchedLevel.startsWith('<ASIL-')
        ? matchedLevel.replace(/<ASIL-|>/g, '')
        : matchedLevel.replace(/[<>]/g, '');
      if (['A', 'B', 'C', 'D', 'QM'].includes(level)) {
        extractedLevel = level as ASILLevel;
      }
    }
    
    return {
      displayText: displayText || input,
      preAsilLevel: extractedLevel,
      data: null,
    };
  }
};

// Flow Item Component
const FlowItem = ({ 
  stringData, 
  showASIL, 
  onEdit 
}: { 
  stringData: string; 
  showASIL: boolean;
  onEdit?: (value: string) => void;
}) => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const { displayText, preAsilLevel, data } = parseActivityData(stringData);
  const content = data !== null ? displayText : displayText || stringData;
  
  const shouldShowBadge = preAsilLevel && content.trim() !== '';
  
  const handleClick = (e: any) => {
    if (onEdit) {
      e.stopPropagation();
      onEdit(stringData);
    } else {
      setShowDropdown(!showDropdown);
    }
  };
  
  if (!content && !preAsilLevel) {
    return (
      <div className={onEdit ? 'flow-cell-editable' : ''} onClick={handleClick}>
        {onEdit && <EditSmallIcon />}
        {stringData}
      </div>
    );
  }
  
  return (
    <div className="flow-dropdown">
      <div 
        className={`flow-dropdown-trigger ${onEdit ? 'flow-cell-editable' : ''}`} 
        onClick={handleClick}
      >
        {onEdit && <EditSmallIcon />}
        <div className="flow-cell-content">
          <span>{content}</span>
          {shouldShowBadge && preAsilLevel && (
            <ASILBadge level={preAsilLevel} show={showASIL} />
          )}
        </div>
      </div>
      
      {showDropdown && !onEdit && (
        <div className="flow-dropdown-content">
          <div className="flow-dropdown-header">
            <div className="flow-dropdown-title">System Activity</div>
            <button className="flow-dropdown-close" onClick={() => setShowDropdown(false)}>
              <CloseIcon />
            </button>
          </div>
          <div className="flow-dropdown-body">
            {data ? (
              <>
                {data.type && (
                  <div className="flow-dropdown-field">
                    <span className="flow-dropdown-field-label">Type:</span>
                    <span>{data.type}</span>
                  </div>
                )}
                {data.component && (
                  <div className="flow-dropdown-field">
                    <span className="flow-dropdown-field-label">Component:</span>
                    <span>{data.component}</span>
                  </div>
                )}
                {data.description && (
                  <div className="flow-dropdown-field">
                    <span className="flow-dropdown-field-label">Description:</span>
                    <span>{data.description}</span>
                  </div>
                )}
                <div className="flow-dropdown-field">
                  <span className="flow-dropdown-field-label">Pre-Mitigation ASIL:</span>
                  <span>{data.preAsilLevel === 'QM' ? 'QM' : `ASIL-${data.preAsilLevel}`}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flow-dropdown-field">
                  <span className="flow-dropdown-field-label">Description:</span>
                  <span>{displayText || stringData}</span>
                </div>
                {preAsilLevel && (
                  <div className="flow-dropdown-field">
                    <span className="flow-dropdown-field-label">ASIL Rating:</span>
                    <span>{preAsilLevel === 'QM' ? 'QM' : `ASIL-${preAsilLevel}`}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Flow Interface Component
const FlowInterface = ({ flow }: { flow: SignalFlow | null }) => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  
  if (!flow) return <div className="flow-cell-content"></div>;
  
  const parseInterfaceData = (input: string) => {
    try {
      const jsonData = JSON.parse(input);
      return {
        displayText: jsonData.endpointUrl || jsonData.name || input,
        data: jsonData,
      };
    } catch {
      return {
        displayText: input,
        data: null,
      };
    }
  };
  
  const { displayText, data } = parseInterfaceData(flow.signal);
  
  return (
    <div className="flow-interface-container">
      {flow.signal && (
        <div className="flow-dropdown">
          <div className="flow-dropdown-trigger" onClick={() => setShowDropdown(!showDropdown)}>
            <DirectionArrow direction={flow.direction} />
          </div>
          
          {showDropdown && (
            <div className="flow-dropdown-content">
              <div className="flow-dropdown-header">
                <div className="flow-dropdown-title">System Interface</div>
                <button className="flow-dropdown-close" onClick={() => setShowDropdown(false)}>
                  <CloseIcon />
                </button>
              </div>
              <div className="flow-dropdown-body">
                {data ? (
                  Object.entries(data)
                    .filter(([key]) => key !== '__typename')
                    .map(([key, value]) => {
                      if (!value) return null;
                      const isLink = typeof value === 'string' && value.startsWith('https://');
                      return (
                        <div key={key} className="flow-dropdown-field">
                          <span className="flow-dropdown-field-label">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                          </span>
                          {isLink ? (
                            <a href={value} target="_blank" rel="noopener noreferrer" className="flow-dropdown-link">
                              {value}
                            </a>
                          ) : (
                            <span>{value}</span>
                          )}
                        </div>
                      );
                    })
                ) : (
                  <>
                    <div className="flow-dropdown-field">
                      <span className="flow-dropdown-field-label">Name:</span>
                      <span>{displayText}</span>
                    </div>
                    <div className="flow-dropdown-field">
                      <span className="flow-dropdown-field-label">Direction:</span>
                      <span>{flow.direction.charAt(0).toUpperCase() + flow.direction.slice(1)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Flow Item Editor Modal Component
const FlowItemEditor = ({
  value,
  title,
  open,
  onOpenChange,
  onChange,
}: {
  value: string;
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (value: string) => void;
}) => {
  const [editValue, setEditValue] = React.useState(value);

  React.useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = () => {
    onChange(editValue);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="flow-modal-overlay" onClick={handleCancel}>
      <div className="flow-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flow-modal-header">
          <h3 className="flow-modal-title">Edit {title}</h3>
          <button className="flow-modal-close" onClick={handleCancel}>
            <CloseIcon />
          </button>
        </div>
        <div className="flow-modal-body">
          <textarea
            className="flow-modal-textarea"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder="Enter value or JSON data..."
          />
          <div className="flow-modal-hint">
            <strong>Tip:</strong> You can enter plain text or JSON data like:
            <pre style={{ marginTop: '0.25rem', fontSize: '0.7rem' }}>
{`{
  "description": "Activity description",
  "type": "Processing",
  "component": "Component name",
  "preAsilLevel": "B"
}`}
            </pre>
          </div>
        </div>
        <div className="flow-modal-footer">
          <button onClick={handleCancel} className="flow-button flow-button-outline">
            Cancel
          </button>
          <button onClick={handleSave} className="flow-button flow-button-primary">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Page({ data, config }: PageProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [originalFlowData, setOriginalFlowData] = React.useState([] as FlowStep[]);
  const [flowData, setFlowData] = React.useState([] as FlowStep[]);
  const [flowString, setFlowString] = React.useState('');
  const [showASIL, setShowASIL] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [currentEditingCell, setCurrentEditingCell] = React.useState(null as EditingCell | null);

  // Initialize flow data
  React.useEffect(() => {
    try {
      if (data?.flow) {
        const parsedFlow = typeof data.flow === 'string' ? JSON.parse(data.flow) : data.flow;
        setFlowData(parsedFlow);
        setOriginalFlowData(parsedFlow);
      } else {
        // Create initial empty flow with one step
        const initialFlows = [
          {
            title: 'New Step',
            flows: [createEmptyFlow()],
          },
        ];
        setFlowData(initialFlows);
        setOriginalFlowData(initialFlows);
      }
    } catch (error) {
      console.error('Error parsing flow data:', error);
    }
  }, [data?.flow]);

  const handleSave = (stringJsonData: string) => {
    try {
      setIsSaving(true);
      const parsedData = JSON.parse(stringJsonData);
      setFlowData(parsedData);
      setOriginalFlowData(parsedData);
      
      // Call onChange callback if provided
      if (config?.onChange) {
        config.onChange(stringJsonData);
      }
    } catch (error) {
      console.error('Error saving flow data:', error);
      alert('Invalid JSON format. Please check your input.');
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFlowData(originalFlowData);
    setFlowString(JSON.stringify(originalFlowData, null, 2));
    setIsEditing(false);
  };

  // Update a nested property within a flow cell
  const updateFlowCell = (
    stepIndex: number,
    flowIndex: number,
    path: string[],
    value: any
  ) => {
    const newData = [...flowData];
    newData[stepIndex].flows[flowIndex] = setNestedValue(
      newData[stepIndex].flows[flowIndex],
      path,
      value
    );
    setFlowData(newData);
    // Auto-save the updated flow data
    const jsonString = JSON.stringify(newData);
    handleSave(jsonString);
  };

  // Open the flow editor for a specific cell
  const openCellEditor = (
    stepIndex: number,
    flowIndex: number,
    fieldPath: string[],
    value: string,
    cellTitle: string
  ) => {
    setCurrentEditingCell({ stepIndex, flowIndex, fieldPath, value, cellTitle });
  };

  return (
    <div className="flow-container">
      <div className="flow-header">
        <h2 className="flow-title">End-to-End Flow</h2>
        <div className="flow-spacer" />
        {!isEditing ? (
          <button
            onClick={() => {
              setFlowString(JSON.stringify(flowData, null, 2));
              setIsEditing(true);
            }}
            className="flow-button flow-button-ghost flow-button-sm"
          >
            <EditIcon /> Edit
          </button>
        ) : isSaving ? (
          <div className="flow-loading">
            <LoadingIcon />
            Saving...
          </div>
        ) : (
          <div className="flow-button-group">
            <button onClick={handleCancel} className="flow-button flow-button-outline">
              Cancel
            </button>
            <button onClick={() => handleSave(flowString)} className="flow-button flow-button-primary">
              Save
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="flow-editor-container">
          <textarea
            className="flow-editor-textarea"
            value={flowString}
            onChange={(e) => setFlowString(e.target.value)}
            placeholder="Enter flow JSON data..."
          />
        </div>
      ) : (
        <>
          <table className="flow-table">
            <colgroup>
              <col />
              <col />
              <col />
              <col />
              <col />
              <col />
              <col />
              <col />
              <col />
            </colgroup>

            <thead className="flow-thead">
              {/* Header Group Row */}
              <tr>
                {headerGroups.map((group, idx) => (
                  <th key={idx} colSpan={group.cells.length}>
                    {group.label}
                  </th>
                ))}
              </tr>
              {/* Individual Column Headers */}
              <tr>
                {FLOW_CELLS.map((cell) => (
                  <th key={cell.key} title={cell.tooltip}>
                    {cell.title}
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody>
              {/* Spacer row */}
              <tr className="flow-spacer-row">
                {FLOW_CELLS.map((_, index) => (
                  <td key={index}></td>
                ))}
              </tr>
              
              {flowData && flowData.length > 0 ? (
                flowData.map((step, stepIndex) => (
                  <React.Fragment key={stepIndex} {...({} as any)}>
                    <tr>
                      <td colSpan={FLOW_CELLS.length} className="flow-step-title">
                        <ChevronRight className="flow-step-chevron-left" />
                        {step.title}
                        <ChevronRight className="flow-step-chevron-right" />
                      </td>
                    </tr>
                    {step.flows.map((flow, flowIndex) => (
                      <tr key={flowIndex}>
                        {FLOW_CELLS.map((cell) => {
                          const cellValue = getNestedValue(flow, cell.path);
                          return (
                            <td
                              key={cell.key}
                              className={`flow-cell ${cell.isSignalFlow ? 'flow-cell-signal' : ''}`}
                            >
                              {cell.isSignalFlow ? (
                                <FlowInterface flow={cellValue} />
                              ) : (
                                <FlowItem 
                                  stringData={cellValue} 
                                  showASIL={showASIL}
                                  onEdit={(val) => 
                                    openCellEditor(
                                      stepIndex,
                                      flowIndex,
                                      cell.path,
                                      val,
                                      cell.title
                                    )
                                  }
                                />
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={FLOW_CELLS.length} className="flow-empty">
                    No flow available. Please edit to add flow data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
      
      {!isEditing && (
        <div className="flow-checkbox-container">
          <input
            type="checkbox"
            id="show-asil"
            className="flow-checkbox"
            checked={showASIL}
            onChange={(e) => setShowASIL(e.target.checked)}
          />
          <label htmlFor="show-asil" className="flow-checkbox-label">
            Show ASIL/QM Levels
          </label>
        </div>
      )}

      {currentEditingCell && (
        <FlowItemEditor
          value={currentEditingCell.value}
          title={currentEditingCell.cellTitle}
          open={!!currentEditingCell}
          onOpenChange={(open) => {
            if (!open) {
              setCurrentEditingCell(null);
            }
          }}
          onChange={(updatedValue) => {
            updateFlowCell(
              currentEditingCell.stepIndex,
              currentEditingCell.flowIndex,
              currentEditingCell.fieldPath,
              updatedValue
            );
            setCurrentEditingCell(null);
          }}
        />
      )}
    </div>
  );
}
