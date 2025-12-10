// eslint-disable-next-line @typescript-eslint/no-explicit-any
const React: any = (globalThis as any).React;
import { useRequirementStore } from '../useRequirementStore';

type RequirementNodeData = {
  id: string;
  title: string;
  description?: string;
  type?: string;
  ratingAvg: number;
  rating?: {
    priority?: number;
    relevance?: number;
    impact?: number;
  };
  source?: {
    type: string;
    link?: string;
  };
  color?: string;
  isHidden?: boolean;
  nodeSize?: number;
  requirement?: any;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
};

function RequirementNode({ data }: { data: RequirementNodeData }) {
  const { isScanning, setSelectedRequirementId, selectedRequirementId } = useRequirementStore();

  const requirement = data.requirement || data;
  // Use nodeSize from data. The node's container is sized by ReactFlow via the style prop.
  const size = data.nodeSize || (6 + (data.ratingAvg || 3) * 8);

  const handleClick = (e: any) => {
    e.stopPropagation();
    // Toggle: if already selected, deselect; otherwise select
    const nodeId = data.id || data.title;
    if (selectedRequirementId === nodeId) {
      setSelectedRequirementId(null);
    } else {
      setSelectedRequirementId(nodeId);
    }
  };

  return (
    <div
      className="req-radar-relative req-radar-flex req-radar-flex-col req-radar-items-center req-radar-justify-center req-radar-w-full req-radar-h-full req-radar-cursor-pointer"
      onClick={handleClick}
    >
      <div className={isScanning ? 'req-radar-animate-pulse' : ''}>
        <div
          className={`req-radar-rounded-full req-radar-flex req-radar-justify-center req-radar-items-center req-radar-p-10 req-radar-text-center req-radar-text-xs req-radar-font-bold 
                req-radar-shadow-md req-radar-transition-all req-radar-duration-300 req-radar-ease-in-out req-radar-hover-scale-105 req-radar-hover-shadow-lg req-radar-text-white 
                ${data.isHidden ? 'req-radar-hidden' : 'req-radar-animate-node-appear'}`}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: data.color || '#3b82f6',
          }}
        />
        <p
          className="req-radar-absolute req-radar-w-200 req-radar-overflow-hidden req-radar-text-ellipsis req-radar-text-center req-radar-mt-4 req-radar-text-sm req-radar-leading-tight req-radar-font-medium"
          style={{ 
            top: `${size * 0.8}px`,
            color: 'var(--req-radar-foreground, oklch(0.4199 0.0374 257.28))'
          }}
          title={data.title}
        >
          {data.title}
        </p>
      </div>
    </div>
  );
}

export default RequirementNode;

