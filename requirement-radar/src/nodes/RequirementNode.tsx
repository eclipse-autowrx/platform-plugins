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
  const [showDetails, setShowDetails] = React.useState(false);
  const { isScanning } = useRequirementStore();

  const requirement = data.requirement || data;
  // Use nodeSize from data. The node's container is sized by ReactFlow via the style prop.
  const size = data.nodeSize || (6 + (data.ratingAvg || 3) * 8);

  const handleClick = (e: any) => {
    e.stopPropagation();
    setShowDetails(!showDetails);
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center w-full h-full cursor-pointer"
      onClick={handleClick}
    >
      <div className={isScanning ? 'animate-pulse' : ''}>
        <div
          className={`rounded-full flex justify-center items-center p-[10px] text-center text-xs font-bold 
                shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg text-white 
                ${data.isHidden ? 'hidden' : 'animate-node-appear'}`}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: data.color || '#3b82f6',
          }}
        />
        <p
          className="absolute w-200 overflow-hidden text-ellipsis text-center mt-4 text-sm leading-tight font-medium"
          style={{ top: `${size * 0.8}px` }}
          title={data.title}
        >
          {data.title}
        </p>
      </div>

      {/* Simple Details Popup */}
      {showDetails && (
        <div
          className="fixed bg-white p-3 border rounded-lg shadow-lg overflow-y-auto"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
            minWidth: '250px',
            maxWidth: '500px',
            maxHeight: '50vh',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-2">
            <div className="flex text-sm font-bold text-da-primary-500">
              Requirement Details
            </div>
            <button
              className="p-0.5 hover:text-red-500 hover:bg-red-100 rounded-md"
              onClick={() => setShowDetails(false)}
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col space-y-1.5 text-xs">
            {data.id && (
              <div className="flex">
                <span className="font-semibold text-da-gray-dark mr-1">ID:</span>
                <span>{data.id}</span>
              </div>
            )}

            <div className="flex">
              <span className="font-semibold text-da-gray-dark mr-1">Title:</span>
              <span>{data.title}</span>
            </div>

            {requirement.type && (
              <div className="flex">
                <span className="font-semibold text-da-gray-dark mr-1">Type:</span>
                <span>{requirement.type}</span>
              </div>
            )}

            {requirement.description && (
              <div className="flex flex-col">
                <span className="font-semibold text-da-gray-dark">Description:</span>
                <span className="mt-1 ml-4">{requirement.description}</span>
              </div>
            )}

            {requirement.source && (
              <div className="flex flex-col">
                <span className="font-semibold text-da-gray-dark">Source:</span>
                <div className="flex space-x-3 mt-1 ml-4">
                  <div className="capitalize">Type: {requirement.source.type}</div>
                  {requirement.source.link && (
                    <div>
                      Link:{' '}
                      <a
                        href={requirement.source.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-blue-500"
                      >
                        {requirement.source.link}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {requirement.rating && (
              <div className="flex flex-col">
                <span className="font-semibold text-da-gray-dark">Rating:</span>
                <div className="flex space-x-6 mt-1 ml-4">
                  {requirement.rating.priority !== undefined && (
                    <div>Priority: {requirement.rating.priority}/5</div>
                  )}
                  {requirement.rating.relevance !== undefined && (
                    <div>Relevance: {requirement.rating.relevance}/5</div>
                  )}
                  {requirement.rating.impact !== undefined && (
                    <div>Impact: {requirement.rating.impact}/5</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default RequirementNode;

