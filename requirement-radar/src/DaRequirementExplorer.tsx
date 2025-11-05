// eslint-disable-next-line @typescript-eslint/no-explicit-any
const React: any = (globalThis as any).React;
import {
  ReactFlow,
  Background,
  Panel,
} from '@xyflow/react';

import RequirementNode from './nodes/RequirementNode';
import RadarBackgroundNode from './nodes/RadarBackgroundNode';
import { useRequirementStore } from './useRequirementStore';

const nodeTypes = {
  radarBackground: RadarBackgroundNode,
  requirementNode: RequirementNode,
};

const MAX_RADIUS = 600;
const MIN_RADIUS = 20;
const MAX_RATING = 5;
const NODE_SIZE = 60;

interface DaRequirementExplorerProps {
  onDelete: (id: string) => void;
  onEdit?: (id: string) => void;
}

const Legend: React.FC = () => (
  <div className="border border-gray-200 bg-white p-3 text-da-gray-dark rounded-md shadow-md text-xs">
    <h4 className="font-semibold mb-2">Legend</h4>
    <div className="mb-3">
      <div className="flex items-center mb-2">
        <div
          className="w-4 h-4 rounded-full mr-2"
          style={{ backgroundColor: '#005072' }}
        />
        <span>Local Requirements</span>
      </div>
      <div className="flex items-center">
        <div
          className="w-4 h-4 rounded-full mr-2"
          style={{ backgroundColor: '#aebd38' }}
        />
        <span>Global Requirements</span>
      </div>
    </div>
    <div className="space-y-1">
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

const DaRequirementExplorer: React.FC<DaRequirementExplorerProps> = ({
  onDelete,
  onEdit,
}) => {
  const [nodes, setNodes] = React.useState([]);
  const { requirements } = useRequirementStore();

  React.useEffect(() => {
    console.log('🔄 DaRequirementExplorer requirements changed:', requirements.length, 'requirements');
  }, [requirements]);

  const initialNodes = React.useMemo(() => {
    const reqs = Array.isArray(requirements) ? requirements : [];
    const total = reqs.length;

    // Always build the radar-background node
    const bgNode = {
      id: 'radar-bg',
      type: 'radarBackground',
      position: { x: -MAX_RADIUS, y: -MAX_RADIUS },
      data: { size: MAX_RADIUS, spokes: 8, rings: 5 },
      style: { pointerEvents: 'none' },
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
        const norm = 1 - avgScore / MAX_RATING;

        radius =
          MIN_RADIUS +
          ((MAX_RADIUS - MIN_RADIUS) * (MAX_RATING - avgScore)) /
            (MAX_RATING - 1);

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
        (req.source?.type || 'external') === 'internal' ? '#005072' : '#aebd38';

      // ReactFlow positions nodes by top-left corner, so offset by half the node size
      // to center the circle at the calculated (x, y) polar coordinate
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
    setNodes(initialNodes as any);
  }, [initialNodes]);

  return (
    <div className="flex w-full h-full rounded-xl overflow-hidden" 
      style={{ maxHeight: 'calc(100% - 10px)', position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        panOnDrag={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        minZoom={0.1}
        maxZoom={4}
        proOptions={{ hideAttribution: false }}
        style={{ width: '100%', height: '100%' }}
      >
        {/* <Panel position="bottom-left">
          <Legend />
        </Panel> */}
      </ReactFlow>
      {/* <div style={{
        position: 'absolute',
        bottom: '5px',
        right: '10px',
        fontSize: '10px',
        color: '#999',
        zIndex: 5,
        background: 'rgba(255, 255, 255, 0.5)',
        padding: '2px 5px'
      }}>
        <a href="https://reactflow.dev" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#999' }}>
          React Flow
        </a>
      </div> */}
    </div>
  );
};

export default DaRequirementExplorer;

