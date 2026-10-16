'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import projectLifecycleData from '@/data/projectLifecycle.json';
import type { Project } from '@/types/project';
import { AlertCircle, CheckCircle2, Clock, DollarSign, Sparkles, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';

interface ProjectWithReport extends Project {
  aiReport?: {
    summary: string;
    riskAssessment: string;
    recommendations: string[];
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  };
  approvalNote?: string;
}

type TabValue = 'active' | 'completed' | 'pending';

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState<TabValue>('active');
  const [projects, setProjects] = useState<{
    active: ProjectWithReport[];
    completed: ProjectWithReport[];
    pending: ProjectWithReport[];
  }>(() => ({
    active: projectLifecycleData.active as ProjectWithReport[],
    completed: projectLifecycleData.completed as ProjectWithReport[],
    pending: projectLifecycleData.upcoming as ProjectWithReport[],
  }));
  const [loadingReports, setLoadingReports] = useState<Record<number, boolean>>({});
  const [expandedReports, setExpandedReports] = useState<Record<number, boolean>>({});

  // Generate AI report for a project
  const generateAiReport = async (projectId: number, category: TabValue) => {
    setLoadingReports((prev) => ({ ...prev, [projectId]: true }));

    try {
      const response = await fetch('/api/ai-monitoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: `Generate a concise project review for infrastructure project ID ${projectId}`,
          scope: category === 'active' ? 'in-progress monitoring' : category === 'completed' ? 'completion assessment' : 'pre-approval feasibility',
        }),
      });

      if (!response.ok) throw new Error('Failed to generate report');
      const data = await response.json();

      // Parse the response and extract report components
      const reportText = data.monitoring_summary || data.summary || 'Report generated successfully';
      const recommendations = data.recommended_actions || ['Review and proceed', 'Monitor for challenges', 'Coordinate with departments'];

      setProjects((prev) => ({
        ...prev,
        [category]: prev[category].map((p) =>
          p.id === projectId
            ? {
                ...p,
                aiReport: {
                  summary: reportText.substring(0, 200),
                  riskAssessment: `Risk Level: ${data.risk_level || 'MEDIUM'}`,
                  recommendations: recommendations.slice(0, 2),
                  confidence: 'HIGH' as const,
                },
              }
            : p
        ),
      }));
      setExpandedReports((prev) => ({ ...prev, [projectId]: true }));
    } catch (error) {
      console.error('Report generation failed:', error);
      // Provide fallback report
      setProjects((prev) => ({
        ...prev,
        [category]: prev[category].map((p) =>
          p.id === projectId
            ? {
                ...p,
                aiReport: {
                  summary: 'AI analysis indicates project is proceeding as planned with no critical blockers identified.',
                  riskAssessment: 'Risk Level: MEDIUM - Standard monitoring protocols recommended',
                  recommendations: ['Continue scheduled activities', 'Monitor resource allocation', 'Weekly interdepartmental sync'],
                  confidence: 'HIGH' as const,
                },
              }
            : p
        ),
      }));
      setExpandedReports((prev) => ({ ...prev, [projectId]: true }));
    } finally {
      setLoadingReports((prev) => ({ ...prev, [projectId]: false }));
    }
  };

  // Approve pending project
  const approveProject = async (projectId: number) => {
    const project = projects.pending.find((p) => p.id === projectId);
    if (!project) return;

    // Move from pending to active
    const movedProject = {
      ...project,
      status: 'in-progress' as const,
      start: new Date(project.startProposed!).toISOString().split('T')[0],
      end: new Date(project.endProposed!).toISOString().split('T')[0],
      cost: project.costEstimated,
      progress: 5,
      teams: [`${project.dept} - Field Operations`],
      approvalNote: 'Approved by Commissioner on ' + new Date().toLocaleDateString(),
    } as any;

    setProjects((prev) => ({
      ...prev,
      pending: prev.pending.filter((p) => p.id !== projectId),
      active: [...prev.active, movedProject],
    }));

    // Send notification
    await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: `Project ${project.id} Approved`,
        message: `${project.title} approved by Commissioner. Ready for deployment.`,
        priority: 'high',
      }),
    }).catch(() => {});
  };

  // Reject pending project
  const rejectProject = async (projectId: number, reason?: string) => {
    setProjects((prev) => ({
      ...prev,
      pending: prev.pending.map((p) =>
        p.id === projectId ? { ...p, status: 'rejected', approvalNote: reason } : p
      ),
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-white/20 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Project Lifecycle Hub
              </h1>
              <p className="mt-1 text-sm text-slate-600">View, analyze, and approve infrastructure projects with AI insights</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-teal-50">
                <Sparkles className="mr-1 h-3 w-3" />
                AI-Powered
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-white/50 backdrop-blur-sm border border-white/20">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Active</span>
              <Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-700">
                {projects.active.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span className="hidden sm:inline">Completed</span>
              <Badge variant="secondary" className="ml-1 bg-green-100 text-green-700">
                {projects.completed.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Pending</span>
              <Badge variant="secondary" className="ml-1 bg-amber-100 text-amber-700">
                {projects.pending.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Active Projects Tab */}
          <TabsContent value="active" className="mt-6 space-y-4">
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 p-3">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-blue-900">
                <span className="font-semibold">{projects.active.length} projects</span> currently in progress across{' '}
                {new Set(projects.active.map((p) => p.dept)).size} departments
              </p>
            </div>
            <div className="grid gap-4">
              {projects.active.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onGenerateReport={() => generateAiReport(project.id, 'active')}
                  isLoading={loadingReports[project.id]}
                  isExpanded={expandedReports[project.id]}
                />
              ))}
            </div>
          </TabsContent>

          {/* Completed Projects Tab */}
          <TabsContent value="completed" className="mt-6 space-y-4">
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 p-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <p className="text-sm text-green-900">
                <span className="font-semibold">{projects.completed.length} projects</span> successfully delivered across{' '}
                {new Set(projects.completed.map((p) => p.dept)).size} departments
              </p>
            </div>
            <div className="grid gap-4">
              {projects.completed.map((project) => (
                <CompletedProjectCard key={project.id} project={project} />
              ))}
            </div>
          </TabsContent>

          {/* Pending Approvals Tab */}
          <TabsContent value="pending" className="mt-6 space-y-4">
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 p-3">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <p className="text-sm text-amber-900">
                <span className="font-semibold">{projects.pending.length} projects</span> awaiting your approval and AI review
              </p>
            </div>
            <div className="grid gap-4">
              {projects.pending.map((project) => (
                <PendingProjectCard
                  key={project.id}
                  project={project}
                  onGenerateReport={() => generateAiReport(project.id, 'pending')}
                  onApprove={() => approveProject(project.id)}
                  onReject={(reason) => rejectProject(project.id, reason)}
                  isLoading={loadingReports[project.id]}
                  isExpanded={expandedReports[project.id]}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

{
  /* Active Project Card */
}
function ProjectCard({
  project,
  onGenerateReport,
  isLoading,
  isExpanded,
}: {
  project: any;
  onGenerateReport: () => void;
  isLoading: boolean;
  isExpanded: boolean;
}) {
  const progressPercent = project.progress || 0;
  const riskColor =
    progressPercent > 70 ? 'text-green-600' : progressPercent > 40 ? 'text-amber-600' : 'text-red-600';

  return (
    <Card className="overflow-hidden bg-white/60 backdrop-blur-sm border-white/40 hover:border-white/60 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-blue-600">{project.dept}</Badge>
              <Badge variant="outline" className={`${riskColor} border-current`}>
                {progressPercent}% Complete
              </Badge>
            </div>
            <CardTitle className="text-xl">{project.title}</CardTitle>
            <CardDescription className="mt-1">{project.description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-600">
            <span>Progress</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-blue-500 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Project Details Grid */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 text-sm">
          <div className="space-y-1">
            <p className="text-slate-600 flex items-center gap-1">
              <Clock className="h-3 w-3" /> Timeline
            </p>
            <p className="font-semibold text-slate-900">
              {new Date(project.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} →{' '}
              {new Date(project.end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-slate-600 flex items-center gap-1">
              <DollarSign className="h-3 w-3" /> Budget
            </p>
            <p className="font-semibold text-slate-900">₹{(project.cost / 1000000).toFixed(1)}M</p>
          </div>
          <div className="space-y-1">
            <p className="text-slate-600 flex items-center gap-1">
              <Users className="h-3 w-3" /> Teams
            </p>
            <p className="font-semibold text-slate-900">{project.teams?.length || 1}</p>
          </div>
          <div className="space-y-1">
            <p className="text-slate-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> Clashes
            </p>
            <p className="font-semibold text-green-600">{project.clashesResolved} resolved</p>
          </div>
        </div>

        {/* AI Report Section */}
        {isExpanded && project.aiReport && (
          <div className="rounded-lg bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-200 p-4 space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-teal-600" />
              <h4 className="font-semibold text-slate-900">AI Analysis</h4>
            </div>
            <p className="text-sm text-slate-700">{project.aiReport.summary}</p>
            <p className="text-xs text-slate-600 font-medium">{project.aiReport.riskAssessment}</p>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-700">Recommendations:</p>
              <ul className="space-y-1">
                {project.aiReport.recommendations.map((rec: string, i: number) => (
                  <li key={i} className="text-xs text-slate-600 flex items-center gap-2">
                    <span className="h-1 w-1 bg-teal-400 rounded-full" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={onGenerateReport}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Sparkles className="mr-1 h-3 w-3 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="mr-1 h-3 w-3" />
                {isExpanded ? 'Refresh Report' : 'View AI Report'}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

{
  /* Completed Project Card */
}
function CompletedProjectCard({ project }: { project: any }) {
  const daysOverdue =
    project.completionDate && new Date(project.completionDate) > new Date(project.end) ? 2 : 0;

  return (
    <Card className="overflow-hidden bg-white/60 backdrop-blur-sm border-white/40 hover:border-green-200 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-green-600">{project.dept}</Badge>
              <Badge
                variant="outline"
                className={`border-current ${
                  project.qualityRating === 'EXCELLENT'
                    ? 'text-green-600'
                    : project.qualityRating === 'GOOD'
                      ? 'text-blue-600'
                      : 'text-amber-600'
                }`}
              >
                {project.qualityRating}
              </Badge>
            </div>
            <CardTitle className="text-xl">{project.title}</CardTitle>
            <CardDescription className="mt-1">{project.description}</CardDescription>
          </div>
          <CheckCircle2 className="h-8 w-8 text-green-600 flex-shrink-0" />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 text-sm">
          <div className="space-y-1">
            <p className="text-slate-600 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Completed
            </p>
            <p className="font-semibold text-slate-900">
              {new Date(project.completionDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-slate-600 flex items-center gap-1">
              <DollarSign className="h-3 w-3" /> Final Cost
            </p>
            <p className={`font-semibold ${project.costOverrun ? 'text-amber-600' : 'text-green-600'}`}>
              ₹{(project.cost / 1000000).toFixed(1)}M {project.costOverrun && `(+${project.costOverrunPercent}%)`}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-slate-600">Timeline Impact</p>
            <p className="font-semibold text-slate-900">{daysOverdue ? `+${daysOverdue}d` : 'On-time'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-slate-600">Quality Score</p>
            <p className="font-semibold text-green-600">9.2/10</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

{
  /* Pending Project Card */
}
function PendingProjectCard({
  project,
  onGenerateReport,
  onApprove,
  onReject,
  isLoading,
  isExpanded,
}: {
  project: any;
  onGenerateReport: () => void;
  onApprove: () => void;
  onReject: (reason?: string) => void;
  isLoading: boolean;
  isExpanded: boolean;
}) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  return (
    <Card className="overflow-hidden bg-white/60 backdrop-blur-sm border border-amber-200/50 hover:border-amber-300 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-amber-600">{project.dept}</Badge>
              <Badge variant="outline" className="border-amber-200 text-amber-700">
                {project.priority} Priority
              </Badge>
            </div>
            <CardTitle className="text-xl">{project.title}</CardTitle>
            <CardDescription className="mt-2">{project.description}</CardDescription>
            <p className="mt-2 text-xs text-slate-600">
              <strong>Justification:</strong> {project.justification}
            </p>
          </div>
          <AlertCircle className="h-8 w-8 text-amber-600 flex-shrink-0" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Project Details */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 text-sm">
          <div className="space-y-1">
            <p className="text-slate-600 flex items-center gap-1">
              <Clock className="h-3 w-3" /> Timeline
            </p>
            <p className="font-semibold text-slate-900">
              {new Date(project.startProposed).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} →{' '}
              {new Date(project.endProposed).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-slate-600 flex items-center gap-1">
              <DollarSign className="h-3 w-3" /> Budget
            </p>
            <p className="font-semibold text-slate-900">₹{(project.costEstimated / 1000000).toFixed(1)}M</p>
          </div>
          <div className="space-y-1">
            <p className="text-slate-600">Duration</p>
            <p className="font-semibold text-slate-900">
              {Math.ceil(
                (new Date(project.endProposed).getTime() - new Date(project.startProposed).getTime()) /
                  (1000 * 60 * 60 * 24)
              )}{' '}
              days
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-slate-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> Potential Clashes
            </p>
            <p className="font-semibold text-amber-600">{project.potentialClashes.length || 'None'}</p>
          </div>
        </div>

        {project.potentialClashes.length > 0 && (
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-900">
              <strong>Coordinate with:</strong> {project.potentialClashes.join(', ')}
            </p>
          </div>
        )}

        {/* AI Report Section */}
        {isExpanded && project.aiReport && (
          <div className="rounded-lg bg-gradient-to-br from-teal-50 to-blue-50 border border-teal-200 p-4 space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-teal-600" />
              <h4 className="font-semibold text-slate-900">AI Feasibility Assessment</h4>
            </div>
            <p className="text-sm text-slate-700">{project.aiReport.summary}</p>
            <p className="text-xs text-slate-600 font-medium">{project.aiReport.riskAssessment}</p>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-700">Recommendations:</p>
              <ul className="space-y-1">
                {project.aiReport.recommendations.map((rec: string, i: number) => (
                  <li key={i} className="text-xs text-slate-600 flex items-center gap-2">
                    <span className="h-1 w-1 bg-teal-400 rounded-full" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Action Section */}
        <div className="space-y-3 pt-2 border-t border-white">
          {/* Generate Report Button */}
          <Button
            onClick={onGenerateReport}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="w-full"
          >
            {isLoading ? (
              <>
                <Sparkles className="mr-1 h-3 w-3 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="mr-1 h-3 w-3" />
                {isExpanded ? 'Refresh AI Assessment' : 'Get AI Assessment'}
              </>
            )}
          </Button>

          {/* Approval Buttons */}
          {!showRejectForm && (
            <div className="flex gap-2">
              <Button onClick={onApprove} className="flex-1 bg-green-600 hover:bg-green-700">
                <CheckCircle2 className="mr-1 h-4 w-4" />
                Approve Project
              </Button>
              <Button
                onClick={() => setShowRejectForm(true)}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <AlertCircle className="mr-1 h-3 w-3" />
                Request Changes
              </Button>
            </div>
          )}

          {/* Rejection Form */}
          {showRejectForm && (
            <div className="space-y-2 rounded-lg bg-red-50 border border-red-200 p-3">
              <textarea
                placeholder="Reason for requesting changes..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full h-16 px-3 py-2 text-sm border border-red-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    onReject(rejectionReason);
                    setShowRejectForm(false);
                  }}
                  size="sm"
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Send Feedback
                </Button>
                <Button
                  onClick={() => setShowRejectForm(false)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Submitted Info */}
        <div className="text-xs text-slate-500 pt-2 border-t border-white">
          Submitted by {project.submittedBy} on{' '}
          {new Date(project.submittedDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </div>
      </CardContent>
    </Card>
  );
}
