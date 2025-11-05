export interface Requirement {
  id: string;
  title: string;
  description: string;
  type: string;
  source: {
    type: 'internal' | 'external';
    link?: string;
  };
  rating: {
    priority: number; // 1-5
    relevance: number; // 1-5
    impact: number; // 1-5
  };
  isHidden?: boolean;
}

export type ViewMode = 'explorer' | 'table';

