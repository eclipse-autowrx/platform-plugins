// eslint-disable-next-line @typescript-eslint/no-explicit-any
const React: any = (globalThis as any).React;
import { useRequirementStore } from './useRequirementStore';
import { Requirement } from './types';

interface Props {
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const DaRequirementTable: React.FC<Props> = ({ onDelete, onEdit }) => {
  const { requirements } = useRequirementStore();

  if (!requirements || requirements.length === 0) {
    return (
      <div className="req-radar-w-full req-radar-h-full req-radar-flex req-radar-items-center req-radar-justify-center req-radar-overflow-auto req-radar-rounded-xl req-radar-border">
        <div className="req-radar-text-center req-radar-p-3">
          <p className="req-radar-text-lg req-radar-font-semibold req-radar-text-gray-dark">No requirements found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="req-radar-w-full req-radar-h-full req-radar-overflow-auto req-radar-rounded-xl req-radar-border">
      <table className="req-radar-w-full" style={{ borderCollapse: 'collapse' }}>
        <thead className="req-radar-bg-gray-100">
          <tr>
            <th className="req-radar-font-semibold req-radar-text-primary-500 req-radar-p-3 req-radar-text-left req-radar-border-b">ID</th>
            <th className="req-radar-font-semibold req-radar-text-primary-500 req-radar-p-3 req-radar-text-left req-radar-border-b">Title</th>
            <th className="req-radar-font-semibold req-radar-text-primary-500 req-radar-p-3 req-radar-text-left req-radar-border-b">Description</th>
            <th className="req-radar-font-semibold req-radar-text-primary-500 req-radar-p-3 req-radar-text-left req-radar-border-b">Type</th>
            <th className="req-radar-font-semibold req-radar-text-primary-500 req-radar-p-3 req-radar-text-left req-radar-border-b">Source</th>
            <th className="req-radar-font-semibold req-radar-text-primary-500 req-radar-p-3 req-radar-text-left req-radar-border-b">Rating</th>
          </tr>
        </thead>
        <tbody>
          {requirements.map((req: Requirement) => {
            const r = req.rating || { priority: 3, relevance: 3, impact: 3 };
            const avg = (r.priority + r.relevance + r.impact) / 3;
            return (
              <tr key={req.id} className="req-radar-hover-bg-gray-100">
                <td className="req-radar-p-3 req-radar-border-b req-radar-text-xs">{req.id}</td>
                <td className="req-radar-p-3 req-radar-border-b req-radar-text-sm">{req.title}</td>
                <td className="req-radar-p-3 req-radar-border-b req-radar-text-xs">{req.description?.substring(0, 100)}...</td>
                <td className="req-radar-p-3 req-radar-border-b req-radar-text-xs">{req.type}</td>
                <td className="req-radar-p-3 req-radar-border-b req-radar-text-xs">
                  {req.source?.type === 'external' && req.source?.link ? (
                    <a
                      href={req.source.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="req-radar-capitalize req-radar-text-blue-600 req-radar-underline"
                    >
                      external
                    </a>
                  ) : (
                    <span className="req-radar-capitalize">{req.source?.type || 'internal'}</span>
                  )}
                </td>
                <td className="req-radar-p-3 req-radar-border-b req-radar-text-xs">{avg.toFixed(1)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DaRequirementTable;

