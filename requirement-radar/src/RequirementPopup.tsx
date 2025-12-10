// eslint-disable-next-line @typescript-eslint/no-explicit-any
const React: any = (globalThis as any).React;
import { useRequirementStore } from './useRequirementStore';

const RequirementPopup: React.FC<{ onEdit?: (id: string) => void; onDelete?: (id: string) => void }> = ({ onEdit, onDelete }) => {
  const { selectedRequirementId, requirements, setSelectedRequirementId } = useRequirementStore();

  if (!selectedRequirementId) {
    return null;
  }

  // Find the selected requirement
  const requirement = requirements.find(
    (req: any) => (req.id || req.title) === selectedRequirementId
  );

  if (!requirement) {
    return null;
  }

  const handleClose = () => {
    setSelectedRequirementId(null);
  };

  const handleEdit = () => {
    if (onEdit && requirement.id) {
      onEdit(requirement.id);
    }
    handleClose();
  };

  const handleDelete = () => {
    if (onDelete && requirement.id) {
      onDelete(requirement.id);
    }
    handleClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999999,
          pointerEvents: 'all',
        }}
        onClick={handleClose}
      />
      {/* Modal */}
      <div
        className="req-radar-bg-background req-radar-p-6 req-radar-border req-radar-border-color req-radar-rounded req-radar-shadow-lg"
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000000,
          minWidth: '800px',
          maxWidth: '900px',
          maxHeight: '80vh',
          overflowY: 'auto',
          backgroundColor: 'var(--req-radar-background, oklch(1 0 0))',
          borderColor: 'var(--req-radar-border, oklch(0.929 0.013 255.508))',
          borderRadius: 'var(--req-radar-radius, 0.625rem)',
          borderWidth: '1px',
          pointerEvents: 'all',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="req-radar-relative req-radar-flex req-radar-justify-between req-radar-items-center req-radar-mb-4">
          <div className="req-radar-flex req-radar-items-center req-radar-space-x-2">
            <div
              className="req-radar-font-bold req-radar-text-primary"
              style={{
                color: 'var(--req-radar-primary, oklch(0.35 0.08 230))',
                fontSize: '18px',
                lineHeight: '1.1',
              }}
            >
              Requirement Details
            </div>
            {/* {onEdit && (
              <button
                className="req-radar-flex req-radar-items-center req-radar-px-3 req-radar-py-1 req-radar-rounded req-radar-cursor-pointer req-radar-button-flat"
                style={{
                  color: 'var(--req-radar-primary, oklch(0.35 0.08 230))',
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '12px',
                  lineHeight: '1.2',
                }}
                onClick={handleEdit}
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                className="req-radar-flex req-radar-items-center req-radar-px-3 req-radar-py-1 req-radar-rounded req-radar-cursor-pointer req-radar-button-flat"
                style={{
                  color: 'var(--req-radar-primary, oklch(0.35 0.08 230))',
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '12px',
                  lineHeight: '1.2',
                }}
                onClick={handleDelete}
              >
                Delete
              </button>
            )} */}
          </div>
          <div style={{ flexGrow: 1 }}></div>
          {/* Close button - positioned absolutely in top-right corner */}
          <button
            className="req-radar-absolute req-radar-p-1 req-radar-rounded req-radar-cursor-pointer req-radar-button-flat"
            style={{
              top: 0,
              right: 0,
              color: 'var(--req-radar-primary, oklch(0.35 0.08 230))',
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '14px',
              lineHeight: '1.2',
            }}
            onClick={handleClose}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div
          className="req-radar-flex req-radar-flex-col req-radar-space-y-3"
          style={{ fontSize: '12px', lineHeight: '1.4' }}
        >
          {requirement.id && (
            <div className="req-radar-flex">
              <span
                className="req-radar-font-semibold req-radar-mr-2"
                style={{
                  color: 'var(--req-radar-foreground, oklch(0.4199 0.0374 257.28))',
                  fontSize: '12px',
                  lineHeight: '1.4',
                }}
              >
                ID:
              </span>
              <span
                style={{
                  color: 'var(--req-radar-foreground, oklch(0.4199 0.0374 257.28))',
                  fontSize: '12px',
                  lineHeight: '1.4',
                }}
              >
                {requirement.id}
              </span>
            </div>
          )}

          <div className="req-radar-flex">
            <span
              className="req-radar-font-semibold req-radar-mr-2"
              style={{
                color: 'var(--req-radar-foreground, oklch(0.4199 0.0374 257.28))',
                fontSize: '12px',
                lineHeight: '1.4',
              }}
            >
              Title:
            </span>
            <span
              style={{
                color: 'var(--req-radar-foreground, oklch(0.4199 0.0374 257.28))',
                fontSize: '12px',
                lineHeight: '1.4',
              }}
            >
              {requirement.title}
            </span>
          </div>

          {requirement.type && (
            <div className="req-radar-flex">
              <span
                className="req-radar-font-semibold req-radar-mr-2"
                style={{
                  color: 'var(--req-radar-foreground, oklch(0.4199 0.0374 257.28))',
                  fontSize: '12px',
                  lineHeight: '1.4',
                }}
              >
                Type:
              </span>
              <span
                style={{
                  color: 'var(--req-radar-foreground, oklch(0.4199 0.0374 257.28))',
                  fontSize: '12px',
                  lineHeight: '1.4',
                }}
              >
                {requirement.type}
              </span>
            </div>
          )}

          {requirement.description && (
            <div className="req-radar-flex req-radar-flex-col">
              <span
                className="req-radar-font-semibold req-radar-mb-1"
                style={{
                  color: 'var(--req-radar-foreground, oklch(0.4199 0.0374 257.28))',
                  fontSize: '12px',
                  lineHeight: '1.4',
                }}
              >
                Description:
              </span>
              <span
                className="req-radar-ml-4"
                style={{
                  color: 'var(--req-radar-foreground, oklch(0.4199 0.0374 257.28))',
                  fontSize: '12px',
                  lineHeight: '1.4',
                }}
              >
                {requirement.description}
              </span>
            </div>
          )}

          {requirement.source && (
            <div className="req-radar-flex req-radar-flex-col">
              <span
                className="req-radar-font-semibold req-radar-mb-1"
                style={{
                  color: 'var(--req-radar-foreground, oklch(0.4199 0.0374 257.28))',
                  fontSize: '12px',
                  lineHeight: '1.4',
                }}
              >
                Source:
              </span>
              <div className="req-radar-flex req-radar-space-x-3 req-radar-ml-4">
                <span
                  style={{
                    color: 'var(--req-radar-foreground, oklch(0.4199 0.0374 257.28))',
                    fontSize: '12px',
                    lineHeight: '1.4',
                  }}
                >
                  Type: {requirement.source.type}
                </span>
                {requirement.source.link && (
                  <span
                    style={{
                      color: 'var(--req-radar-foreground, oklch(0.4199 0.0374 257.28))',
                      fontSize: '12px',
                      lineHeight: '1.4',
                    }}
                  >
                    Link:{' '}
                    <a
                      href={requirement.source.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: 'var(--req-radar-primary, oklch(0.35 0.08 230))',
                        textDecoration: 'underline',
                        fontSize: '12px',
                        lineHeight: '1.4',
                      }}
                    >
                      {requirement.source.link}
                    </a>
                  </span>
                )}
              </div>
            </div>
          )}

          {requirement.rating && (
            <div className="req-radar-flex req-radar-flex-col">
              <span
                className="req-radar-font-semibold req-radar-mb-1"
                style={{
                  color: 'var(--req-radar-foreground, oklch(0.4199 0.0374 257.28))',
                  fontSize: '12px',
                  lineHeight: '1.4',
                }}
              >
                Rating:
              </span>
              <div className="req-radar-flex req-radar-space-x-6 req-radar-ml-4">
                {requirement.rating.priority !== undefined && (
                  <span
                    style={{
                      color: 'var(--req-radar-foreground, oklch(0.4199 0.0374 257.28))',
                      fontSize: '12px',
                      lineHeight: '1.4',
                    }}
                  >
                    Priority: {requirement.rating.priority}/5
                  </span>
                )}
                {requirement.rating.relevance !== undefined && (
                  <span
                    style={{
                      color: 'var(--req-radar-foreground, oklch(0.4199 0.0374 257.28))',
                      fontSize: '12px',
                      lineHeight: '1.4',
                    }}
                  >
                    Relevance: {requirement.rating.relevance}/5
                  </span>
                )}
                {requirement.rating.impact !== undefined && (
                  <span
                    style={{
                      color: 'var(--req-radar-foreground, oklch(0.4199 0.0374 257.28))',
                      fontSize: '12px',
                      lineHeight: '1.4',
                    }}
                  >
                    Impact: {requirement.rating.impact}/5
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RequirementPopup;
