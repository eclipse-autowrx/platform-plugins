// eslint-disable-next-line @typescript-eslint/no-explicit-any
const React: any = (globalThis as any).React;
import {
  ReactFlow,
  useReactFlow,
  applyNodeChanges,
} from '@xyflow/react';

import RequirementNode from './nodes/RequirementNode';
import RadarBackgroundNode from './nodes/RadarBackgroundNode';
import { useRequirementStore } from './useRequirementStore';

const nodeTypes = {
  radarBackground: RadarBackgroundNode,
  requirementNode: RequirementNode,
};

console.log('🔵 Registered nodeTypes:', Object.keys(nodeTypes));

const MAX_RADIUS = 600;
const MIN_RADIUS = 20;
const MAX_RATING = 5;
const NODE_SIZE = 60;

interface DaRequirementExplorerProps {
  onDelete: (id: string) => void;
  onEdit?: (id: string) => void;
}

const Legend: React.FC = () => (
  <div 
    className="req-radar-border req-radar-border-color req-radar-bg-background req-radar-p-3 req-radar-text-foreground req-radar-rounded req-radar-shadow-md req-radar-text-xs"
    style={{
      borderWidth: '1px',
      borderColor: 'var(--req-radar-border, oklch(0.929 0.013 255.508))',
      backgroundColor: 'var(--req-radar-background, oklch(1 0 0))',
      color: 'var(--req-radar-foreground, oklch(0.4199 0.0374 257.28))',
    }}
  >
    <h4 className="req-radar-font-semibold req-radar-mb-2" style={{ color: 'var(--req-radar-foreground, oklch(0.4199 0.0374 257.28))' }}>Legend</h4>
    <div className="req-radar-mb-3">
      <div className="req-radar-flex req-radar-items-center req-radar-mb-2">
        <div
          className="req-radar-w-4 req-radar-h-4 req-radar-rounded-full req-radar-mr-2"
          style={{ backgroundColor: 'var(--req-radar-primary, oklch(0.35 0.08 230))' }}
        />
        <span style={{ color: 'var(--req-radar-foreground, oklch(0.4199 0.0374 257.28))' }}>Local Requirements</span>
      </div>
      <div className="req-radar-flex req-radar-items-center">
        <div
          className="req-radar-w-4 req-radar-h-4 req-radar-rounded-full req-radar-mr-2"
          style={{ backgroundColor: 'var(--req-radar-secondary, oklch(0.7626 0.1532 115.73))' }}
        />
        <span style={{ color: 'var(--req-radar-foreground, oklch(0.4199 0.0374 257.28))' }}>Global Requirements</span>
      </div>
    </div>
    <div className="req-radar-space-y-1" style={{ color: 'var(--req-radar-muted-foreground, oklch(0.554 0.046 257.417))' }}>
      <div>Larger circles = Higher impact</div>
      <div>Closer to center = More relevant</div>
    </div>
  </div>
);

function safeScore(raw: any): number {
  // Handle number input
  if (typeof raw === 'number') {
    // Allow 0 as valid, otherwise ensure 1-5 range
    if (raw === 0) return 1; // Treat 0 as 1 for positioning
    if (raw >= 1 && raw <= MAX_RATING) return raw;
  }
  
  // Handle string input
  if (typeof raw === 'string') {
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed)) {
      // Allow 0 as valid, otherwise ensure 1-5 range
      if (parsed === 0) return 1; // Treat 0 as 1 for positioning
      if (parsed >= 1 && parsed <= MAX_RATING) return parsed;
    }
  }
  
  // Default fallback
  return 3; // Use middle value instead of random
}

const ReactFlowContent: React.FC = () => {
  return null;
};

const DaRequirementExplorer: React.FC<DaRequirementExplorerProps> = ({
  onDelete,
  onEdit,
}) => {
  const [nodes, setNodes] = React.useState([]);
  const { requirements } = useRequirementStore();
  const { fitView } = useReactFlow();
  const hasFittedOnLoad = React.useRef(false);

  const onNodesChange = (changes: any) => {
    setNodes((nds) => applyNodeChanges(changes, nds));

    if (!hasFittedOnLoad.current) {
      const dimensionChange = changes.find(
        (change: any) => change.type === 'dimensions' && change.id === 'radar-bg'
      );

      if (dimensionChange) {
        fitView({ padding: 0.2, duration: 0 });
        hasFittedOnLoad.current = true;
      }
    }
  };

  React.useEffect(() => {
    console.log('🔄 DaRequirementExplorer requirements changed:', requirements.length, 'requirements');
  }, [requirements]);

  const initialNodes = React.useMemo(() => {
    const reqs = Array.isArray(requirements) ? requirements : [];
    const total = reqs.length;

    const bgNodeSize = 2 * MAX_RADIUS;
    const bgNode = {
      id: 'radar-bg',
      type: 'radarBackground',
      position: { x: -MAX_RADIUS, y: -MAX_RADIUS },
      data: { size: MAX_RADIUS, spokes: 8, rings: 5 },
      style: { 
        pointerEvents: 'none',
        width: bgNodeSize,
        height: bgNodeSize,
      },
    };

    if (total === 0) {
      return [bgNode];
    }

    const angleStep = (2 * Math.PI) / total;
    const safeMinByAngle =
      total > 1 ? NODE_SIZE / (2 * Math.sin(angleStep / 2)) : 0;
    const effectiveMinRadius = Math.max(MIN_RADIUS, safeMinByAngle);

    const reqNodes = reqs.map((req: any, i: number) => {
      let x, y, radius, angle, avgScore, nodeSize;

      if (
        req.x !== undefined &&
        req.y !== undefined &&
        req.radius !== undefined
      ) {
        x = req.x;
        y = req.y;
        radius = req.radius;
        angle = req.angle;
        avgScore = req.avgScore || 3;
        nodeSize = req.nodeSize || 40;
      } else {
        angle = req.angle !== undefined ? req.angle : i * angleStep - Math.PI / 2;

        const raw = req.rating || {};
        const pr = safeScore(raw.priority);
        const rl = safeScore(raw.relevance);
        const im = safeScore(raw.impact);

        avgScore = (pr + rl + im) / 3;
        const norm = avgScore / MAX_RATING;

        radius =
          MAX_RADIUS -
          ((MAX_RADIUS - MIN_RADIUS) * (avgScore - 1)) / (MAX_RATING - 1);

        const MIN_NODE_SIZE = 12;
        const MAX_NODE_SIZE = 70;
        nodeSize = MIN_NODE_SIZE + (MAX_NODE_SIZE - MIN_NODE_SIZE) * norm;

        x = radius * Math.cos(angle);
        y = radius * Math.sin(angle);

        req.x = x;
        req.y = y;
        req.radius = radius;
        req.angle = angle;
        req.avgScore = avgScore;
        req.nodeSize = nodeSize;
      }

      const color =
        (req.source?.type || 'external') === 'internal' 
          ? 'var(--req-radar-primary, oklch(0.35 0.08 230))' 
          : 'var(--req-radar-secondary, oklch(0.7626 0.1532 115.73))';

      const halfSize = nodeSize / 2;

      return {
        id: `req-${req.id || req.title}`,
        type: 'requirementNode',
        position: { x: x - halfSize, y: y - halfSize },
        data: {
          id: req.id || req.title,
          title: req.title,
          description: req.description,
          type: req.type,
          ratingAvg: avgScore,
          rating: {
            priority: safeScore(req.rating?.priority),
            relevance: safeScore(req.rating?.relevance),
            impact: safeScore(req.rating?.impact),
          },
          source: req.source,
          isHidden: req.isHidden,
          color,
          nodeSize,
          requirement: req,
          onDelete,
          onEdit,
        },
        hidden: req.isHidden,
        style: {
          width: nodeSize,
          height: nodeSize,
        },
      };
    });

    return [bgNode, ...reqNodes];
  }, [requirements, onDelete, onEdit]);

  React.useEffect(() => {
    console.log('🎨 DaRequirementExplorer updating nodes:', initialNodes.length, 'nodes');
    console.log('🎨 Node IDs:', initialNodes.map((n: any) => n.id));
    console.log('🎨 All node positions:', initialNodes.map((n: any) => ({
      id: n.id,
      position: n.position,
      size: n.style?.width || 'unknown',
    })));
    setNodes(initialNodes as any);
  }, [initialNodes]);


  return (
    <div className="req-radar-flex req-radar-w-full req-radar-h-full req-radar-rounded-xl req-radar-overflow-hidden req-radar-border" 
      style={{ 
        minHeight: '500px', 
        height: '100%', 
        position: 'relative',
        borderWidth: '2px',
        borderColor: '#e5e7eb',
        borderStyle: 'solid'
      }}>
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        nodesDraggable={false}
        nodesConnectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        minZoom={0.1}
        maxZoom={4}
        fitView={false}
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: false,
          minZoom: 0.1,
          maxZoom: 2,
        }}
        onMove={(event, viewport) => {
          console.log('🔍 ReactFlow onMove - Zoom:', viewport.zoom, 'Position:', { x: viewport.x, y: viewport.y });
        }}
        onMoveStart={(event, viewport) => {
          console.log('🔍 ReactFlow onMoveStart - Zoom:', viewport.zoom);
        }}
        onMoveEnd={(event, viewport) => {
          console.log('🔍 ReactFlow onMoveEnd - Zoom:', viewport.zoom, 'Position:', { x: viewport.x, y: viewport.y });
        }}
        proOptions={{ hideAttribution: true }}
        style={{ width: '100%', height: '100%', minHeight: '500px' }}
      >
        <ReactFlowContent />
        <div style={{ position: 'absolute', bottom: '15px', left: '15px', zIndex: 6 }}>
          <Legend />
        </div>
      </ReactFlow>
    </div>
  );
};

export default DaRequirementExplorer;
