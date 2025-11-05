// eslint-disable-next-line @typescript-eslint/no-explicit-any
const React: any = (globalThis as any).React;
import { Requirement } from './types';

// Simple button component
export function Button({ 
  children, 
  onClick, 
  disabled = false, 
  primary = false 
}: { 
  children?: any; 
  onClick?: () => void; 
  disabled?: boolean;
  primary?: boolean;
}) {
  return (
    <button 
      className={`req-button ${primary ? 'primary' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// Requirement Node for Explorer View
export function RequirementNode({ 
  requirement, 
  position 
}: { 
  requirement: Requirement;
  position: { x: number; y: number };
}) {
  const style = {
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: 'translate(-50%, -50%)',
  };

  return (
    <div 
      className={`req-node ${requirement.isHidden ? 'hidden' : ''}`}
      style={style}
      data-priority={requirement.rating.priority}
      title={requirement.description}
    >
      <div className="req-node-title">{requirement.title}</div>
      <div className="req-node-type">{requirement.type}</div>
      <div className="req-node-ratings">
        <div className="req-rating">
          <span className="req-rating-label">P</span>
          <span className="req-rating-value">{requirement.rating.priority}</span>
        </div>
        <div className="req-rating">
          <span className="req-rating-label">R</span>
          <span className="req-rating-value">{requirement.rating.relevance}</span>
        </div>
        <div className="req-rating">
          <span className="req-rating-label">I</span>
          <span className="req-rating-value">{requirement.rating.impact}</span>
        </div>
      </div>
    </div>
  );
}

// Explorer View - Radar visualization
export function RequirementExplorer({ 
  requirements 
}: { 
  requirements: Requirement[];
}) {
  const containerRef = React.useRef(null);
  const [positions, setPositions] = React.useState({});

  React.useEffect(() => {
    if (!containerRef.current || requirements.length === 0) return;

    const container = containerRef.current;
    const centerX = container.offsetWidth / 2;
    const centerY = container.offsetHeight / 2;
    const newPositions: { [key: string]: { x: number; y: number } } = {};

    requirements.forEach((req, index) => {
      // Calculate position based on priority and relevance
      const priority = req.rating.priority;
      const relevance = req.rating.relevance;
      
      // Distance from center (higher priority = closer)
      const minRadius = 120;
      const maxRadius = Math.min(centerX, centerY) - 100;
      const distance = minRadius + ((5 - priority) / 4) * (maxRadius - minRadius);
      
      // Angle around the center
      const angleStep = (2 * Math.PI) / Math.max(requirements.length, 8);
      const angle = index * angleStep + (relevance * 0.1); // Slight offset based on relevance
      
      const x = centerX + distance * Math.cos(angle);
      const y = centerY + distance * Math.sin(angle);
      
      newPositions[req.id] = { x, y };
    });

    setPositions(newPositions);
  }, [requirements]);

  if (requirements.length === 0) {
    return (
      <div className="req-explorer">
        <div className="req-empty-state">
          <div className="req-empty-state-title">No Requirements Found</div>
          <div className="req-empty-state-text">
            Requirements will appear here once available from the prototype data.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="req-explorer" ref={containerRef}>
      {/* Radar rings */}
      <div className="req-radar-rings">
        {[1, 2, 3, 4].map((ring) => (
          <div 
            key={ring}
            className="req-radar-ring"
            style={{
              width: `${ring * 25}%`,
              height: `${ring * 25}%`,
            }}
          />
        ))}
      </div>
      
      {/* Center node */}
      <div className="req-radar-center">
        Requirements<br/>Radar
      </div>

      {/* Requirement nodes */}
      {requirements.map((req: Requirement) => {
        const pos = (positions as any)[req.id];
        if (!pos) return null;
        return (
          <div key={req.id}>
            <RequirementNode 
              requirement={req}
              position={pos}
            />
          </div>
        );
      })}
    </div>
  );
}

// Table View
export function RequirementTable({ 
  requirements 
}: { 
  requirements: Requirement[];
}) {
  if (requirements.length === 0) {
    return (
      <div className="req-empty-state">
        <div className="req-empty-state-title">No Requirements Found</div>
        <div className="req-empty-state-text">
          Requirements will appear here once available from the prototype data.
        </div>
      </div>
    );
  }

  return (
    <table className="req-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Type</th>
          <th>Priority</th>
          <th>Relevance</th>
          <th>Impact</th>
          <th>Source</th>
        </tr>
      </thead>
      <tbody>
        {requirements.map((req) => (
          <tr key={req.id}>
            <td>
              <span className="req-table-id">{req.id}</span>
            </td>
            <td>
              <div style={{ fontWeight: 600 }}>{req.title}</div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                {req.description.substring(0, 100)}...
              </div>
            </td>
            <td>
              <span className="req-table-type">{req.type}</span>
            </td>
            <td>
              <span className={`req-rating-badge priority-${req.rating.priority}`}>
                {req.rating.priority}
              </span>
            </td>
            <td>
              <span className={`req-rating-badge priority-${req.rating.relevance}`}>
                {req.rating.relevance}
              </span>
            </td>
            <td>
              <span className={`req-rating-badge priority-${req.rating.impact}`}>
                {req.rating.impact}
              </span>
            </td>
            <td>{req.source.type}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

