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
      <div className="w-full h-full flex items-center justify-center overflow-auto rounded-xl border">
        <div className="text-center p-3">
          <p className="text-lg font-semibold text-da-gray-dark">No requirements found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-auto rounded-xl border">
      <table className="w-full" style={{ borderCollapse: 'collapse' }}>
        <thead className="bg-gray-100">
          <tr>
            <th className="font-semibold text-da-primary-500 p-3 text-left border-b">ID</th>
            <th className="font-semibold text-da-primary-500 p-3 text-left border-b">Title</th>
            <th className="font-semibold text-da-primary-500 p-3 text-left border-b">Description</th>
            <th className="font-semibold text-da-primary-500 p-3 text-left border-b">Type</th>
            <th className="font-semibold text-da-primary-500 p-3 text-left border-b">Source</th>
            <th className="font-semibold text-da-primary-500 p-3 text-left border-b">Rating</th>
          </tr>
        </thead>
        <tbody>
          {requirements.map((req: Requirement) => {
            const r = req.rating || { priority: 3, relevance: 3, impact: 3 };
            const avg = (r.priority + r.relevance + r.impact) / 3;
            return (
              <tr key={req.id} className="hover:bg-gray-100">
                <td className="p-3 border-b text-xs">{req.id}</td>
                <td className="p-3 border-b text-sm">{req.title}</td>
                <td className="p-3 border-b text-xs">{req.description?.substring(0, 100)}...</td>
                <td className="p-3 border-b text-xs">{req.type}</td>
                <td className="p-3 border-b text-xs">
                  {req.source?.type === 'external' && req.source?.link ? (
                    <a
                      href={req.source.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="capitalize text-blue-600 underline"
                    >
                      external
                    </a>
                  ) : (
                    <span className="capitalize">{req.source?.type || 'internal'}</span>
                  )}
                </td>
                <td className="p-3 border-b text-xs">{avg.toFixed(1)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DaRequirementTable;

