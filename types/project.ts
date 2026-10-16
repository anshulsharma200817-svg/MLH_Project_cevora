export interface Project {
  id: number;
  dept: string;
  title: string;
  status: 'in-progress' | 'completed' | 'pending-approval' | 'rejected';
  start?: string;
  end?: string;
  startProposed?: string;
  endProposed?: string;
  cost?: number;
  costEstimated?: number;
  progress?: number;
  description: string;
  teams?: string[];
  clashesResolved?: number;
  completionDate?: string;
  costOverrun?: boolean;
  costOverrunPercent?: number;
  qualityRating?: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  justification?: string;
  submittedBy?: string;
  submittedDate?: string;
  potentialClashes?: string[];
  approvalStatus?: 'awaiting_ai_review' | 'approved' | 'rejected';
  aiReport?: {
    summary: string;
    riskAssessment: string;
    recommendations: string[];
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  };
  approvalNote?: string;
}
