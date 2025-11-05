// Inject CSS styles into the document
export function injectStyles() {
  const styleId = 'requirement-radar-styles';
  
  // Check if styles are already injected
  if (document.getElementById(styleId)) {
    return;
  }

  const styleElement = document.createElement('style');
  styleElement.id = styleId;
  styleElement.textContent = `
/* Requirement Radar Styles */

.req-radar-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  padding: 24px 40px;
}

.req-header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 16px;
  margin-bottom: 24px;
  gap: 12px;
}

.req-title {
  font-size: 24px;
  font-weight: 600;
  color: #2563eb;
  flex: 1;
}

.req-button {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
  white-space: nowrap;
}

.req-button:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.req-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.req-button.primary {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

.req-button.primary:hover:not(:disabled) {
  background: #1d4ed8;
}

.req-button.primary:disabled {
  background: #93c5fd;
  border-color: #93c5fd;
}

.req-content {
  flex: 1;
  width: 100%;
  position: relative;
  overflow: auto;
}

/* Explorer View - Radar */
.req-explorer {
  width: 100%;
  height: 100%;
  position: relative;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 8px;
  overflow: hidden;
}

.req-radar-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, #3b82f6 0%, #2563eb 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 16px;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
  z-index: 10;
  text-align: center;
  line-height: 1.3;
}

.req-radar-rings {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.req-radar-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 50%;
}

.req-node {
  position: absolute;
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  max-width: 200px;
  border: 2px solid #e5e7eb;
}

.req-node:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: scale(1.05);
  z-index: 100;
}

.req-node.hidden {
  opacity: 0;
  transform: scale(0);
}

.req-node-title {
  font-weight: 600;
  font-size: 13px;
  color: #1f2937;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.req-node-type {
  font-size: 11px;
  color: #6b7280;
  margin-bottom: 6px;
}

.req-node-ratings {
  display: flex;
  gap: 8px;
  font-size: 11px;
}

.req-rating {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.req-rating-label {
  color: #9ca3af;
  font-size: 9px;
}

.req-rating-value {
  color: #374151;
  font-weight: 600;
}

/* Priority color coding */
.req-node[data-priority="5"] {
  border-color: #dc2626;
  background: #fef2f2;
}

.req-node[data-priority="4"] {
  border-color: #f59e0b;
  background: #fffbeb;
}

.req-node[data-priority="3"] {
  border-color: #3b82f6;
  background: #eff6ff;
}

.req-node[data-priority="2"] {
  border-color: #10b981;
  background: #f0fdf4;
}

.req-node[data-priority="1"] {
  border-color: #6b7280;
  background: #f9fafb;
}

/* Table View */
.req-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.req-table thead {
  background: #f3f4f6;
}

.req-table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 13px;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
}

.req-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 13px;
  color: #1f2937;
}

.req-table tbody tr:hover {
  background: #f9fafb;
}

.req-table-id {
  font-family: monospace;
  color: #2563eb;
  font-weight: 600;
}

.req-table-type {
  padding: 4px 8px;
  background: #dbeafe;
  border-radius: 4px;
  font-size: 11px;
  display: inline-block;
}

.req-table-rating {
  display: flex;
  gap: 4px;
}

.req-rating-badge {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
}

.req-rating-badge.priority-5 { background: #fee2e2; color: #991b1b; }
.req-rating-badge.priority-4 { background: #fef3c7; color: #92400e; }
.req-rating-badge.priority-3 { background: #dbeafe; color: #1e40af; }
.req-rating-badge.priority-2 { background: #d1fae5; color: #065f46; }
.req-rating-badge.priority-1 { background: #f3f4f6; color: #4b5563; }

.req-empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

.req-empty-state-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #374151;
}

.req-empty-state-text {
  font-size: 14px;
  color: #9ca3af;
}

.req-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 16px;
  color: #6b7280;
}

.req-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(59, 130, 246, 0.3);
  border-radius: 50%;
  border-top-color: #3b82f6;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
  `;

  document.head.appendChild(styleElement);
}

