'use client';

import { useI18n } from '@/components/LanguageProvider';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import alertContacts from '@/data/alertContacts.json';
import mockProjects from '@/data/mockProjects.json';
import { Activity, AlertTriangle, Bell, Brain, FolderKanban, GitMerge, IndianRupee, Sparkles, TrendingDown } from 'lucide-react';
import { useState } from 'react';

export default function DashboardPage() {
  const { t } = useI18n();
  const projects = (mockProjects as any).features;
  const clashingProjects = projects.filter((p: any) => p.properties.clash_with !== null);
  const totalCost = projects.reduce((sum: number, p: any) => sum + p.properties.cost, 0);
  const wasteRisk = clashingProjects.reduce((sum: number, p: any) => sum + (p.properties.cost * 0.2), 0);
  const [consentGiven, setConsentGiven] = useState(false);
  const [alertLog, setAlertLog] = useState<
    {
      id: string;
      time: string;
      project: string;
      dept: string;
      recipient: string;
      status: 'queued' | 'blocked' | 'sent' | 'failed';
      message: string;
    }[]
  >([]);
  const [decisionMap, setDecisionMap] = useState<Record<string, any>>({});
  const [aiMonitoring, setAiMonitoring] = useState<{ status: 'idle' | 'loading' | 'ready' | 'error'; result?: any }>(
    { status: 'idle' }
  );
  const [aiCoordination, setAiCoordination] = useState<{ status: 'idle' | 'loading' | 'ready' | 'error'; result?: any }>(
    { status: 'idle' }
  );
  const [aiTriggering, setAiTriggering] = useState<{ status: 'idle' | 'loading' | 'ready' | 'error'; result?: any }>(
    { status: 'idle' }
  );
  const [aiDecisionBrief, setAiDecisionBrief] = useState<{ status: 'idle' | 'loading' | 'ready' | 'error'; result?: any }>(
    { status: 'idle' }
  );
  const [aiLastRun, setAiLastRun] = useState<string | null>(null);

  const WORK_SEQUENCE = [
    t('Survey & utility mapping'),
    t('Sewer / stormwater drainage'),
    t('Water supply pipelines'),
    t('Gas pipelines (if required)'),
    t('Electrical ducts / power cables'),
    t('Telecom / fiber'),
    t('Backfill + compaction'),
    t('Road base & surfacing'),
    t('Final inspection + as-built update'),
  ];

  const stats = [
    { label: 'Total Projects', value: projects.length, icon: FolderKanban, accent: 'text-primary' },
    { label: 'Active Clashes', value: clashingProjects.length, icon: AlertTriangle, accent: 'text-destructive' },
    { label: 'Total Investment', value: `₹${(totalCost / 10000000).toFixed(1)}Cr`, icon: IndianRupee, accent: 'text-emerald-600' },
    { label: 'Waste at Risk', value: `₹${(wasteRisk / 10000000).toFixed(1)}Cr`, icon: TrendingDown, accent: 'text-orange-600' },
  ];

  const riskVariant = (risk: string) => {
    if (risk === 'HIGH') return 'destructive' as const;
    if (risk === 'MEDIUM') return 'secondary' as const;
    return 'outline' as const;
  };

  const statusVariant = (status: string) => {
    if (status === 'loading') return 'secondary' as const;
    if (status === 'error') return 'destructive' as const;
    if (status === 'ready') return 'default' as const;
    return 'outline' as const;
  };

  const statusLabel = (status: string) => {
    if (status === 'loading') return t('Running');
    if (status === 'error') return t('Needs retry');
    if (status === 'ready') return t('Ready');
    return t('Idle');
  };

  const buildAlertMessage = (project: any) => {
    const { title, dept, clash_with, risk } = project.properties;
    return t('Clash detected: {title} ({dept}) with {clash}. Risk: {risk}. Please coordinate before field work.', {
      title,
      dept,
      clash: clash_with,
      risk,
    });
  };

  const sendAlert = async (project: any) => {
    const { dept, title } = project.properties;
    const contactInfo = (alertContacts as Record<string, any>)[dept];
    const recipient = contactInfo?.contact ? `${contactInfo.contact} (${dept})` : `Department contact (${dept})`;
    const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const message = buildAlertMessage(project);
    const statusValue: 'queued' | 'blocked' = consentGiven ? 'queued' : 'blocked';
    const entry = {
      id,
      time: new Date().toLocaleTimeString(),
      project: String(title),
      dept: String(dept),
      recipient,
      status: statusValue,
      message,
    };

    setAlertLog((prev) => [entry, ...prev]);

    if (!consentGiven) {
      return;
    }

    try {
      const response = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      const status = data?.status === 'sent' ? 'sent' : 'failed';
      setAlertLog((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
      );
    } catch (error) {
      setAlertLog((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: 'failed' } : item))
      );
    }
  };

  const runDecision = async (project: any) => {
    const payload = {
      project: project.properties,
      contact: (alertContacts as Record<string, any>)[project.properties.dept] ?? null,
    };

    setDecisionMap((prev) => ({
      ...prev,
      [project.properties.id]: { status: 'loading' },
    }));

    try {
      const response = await fetch('/api/ai-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setDecisionMap((prev) => ({
        ...prev,
        [project.properties.id]: { status: 'ready', result: data?.result ?? null },
      }));
    } catch (error) {
      setDecisionMap((prev) => ({
        ...prev,
        [project.properties.id]: { status: 'error' },
      }));
    }
  };

  const sendUpdateEmail = async () => {
    const subject = t('Karana update: clash summary and alerts');
    const text = [
      `${t('Active clashes')}: ${clashingProjects.length}`,
      `${t('Total waste risk')}: ₹${(wasteRisk / 10000000).toFixed(1)}Cr`,
      `${t('Latest alert log entries')}: ${alertLog.length}`,
    ].join('\n');

    const html = `
      <div style="font-family:Arial,sans-serif">
        <h2>${t('Karana update')}</h2>
        <p>${t('Active clashes')}: <strong>${clashingProjects.length}</strong></p>
        <p>${t('Total waste risk')}: <strong>₹${(wasteRisk / 10000000).toFixed(1)}Cr</strong></p>
        <p>${t('Latest alert log entries')}: <strong>${alertLog.length}</strong></p>
      </div>
    `;

    try {
      await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, text, html }),
      });
    } catch (error) {
      console.error('Email update failed:', error);
    }
  };

  const runAiBrief = async () => {
    const payload = {
      city: 'Gwalior',
      totalProjects: projects.length,
      clashCount: clashingProjects.length,
      wasteRisk,
      timestamp: new Date().toISOString(),
      clashes: clashingProjects.map((project: any) => ({
        dept: project.properties.dept,
        title: project.properties.title,
        clash_with: project.properties.clash_with,
        risk: project.properties.risk,
        cost: project.properties.cost,
      })),
      sequence: WORK_SEQUENCE,
    };

    setAiMonitoring({ status: 'loading' });
    setAiCoordination({ status: 'loading' });
    setAiTriggering({ status: 'loading' });
    setAiDecisionBrief({ status: 'loading' });
    setAiLastRun(new Date().toLocaleTimeString());

    const fetchModule = async (
      endpoint: string,
      setter: (value: { status: 'idle' | 'loading' | 'ready' | 'error'; result?: any }) => void
    ) => {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        setter({ status: 'ready', result: data?.result ?? data });
      } catch (error) {
        setter({ status: 'error' });
      }
    };

    await Promise.allSettled([
      fetchModule('/api/ai-monitoring', setAiMonitoring),
      fetchModule('/api/ai-coordination', setAiCoordination),
      fetchModule('/api/ai-triggering', setAiTriggering),
      fetchModule('/api/ai-decision', setAiDecisionBrief),
    ]);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="relative flex-1 overflow-auto bg-background">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                'radial-gradient(circle at 15% 10%, rgba(0,201,167,0.12), transparent 45%), radial-gradient(circle at 85% 15%, rgba(37,99,235,0.10), transparent 40%)',
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 p-6 lg:p-8 space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {t('Gwalior city command')}
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight font-display">
                  {t('Commissioner Dashboard')}
                </h1>
                <p className="text-sm text-muted-foreground mt-2">
                  {t('Live coordination across ministries with AI-grade monitoring and conflict control.')}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {t('Mock Data Mode')}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {t('AI Ready')}
                </Badge>
                <Button size="sm" className="gap-2" onClick={runAiBrief}>
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  {t('Run AI Brief')}
                </Button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div className="space-y-6">
                {/* Stat cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <Card key={stat.label} className="bg-card/80 border-border shadow-[0_12px_30px_-24px_rgba(15,23,42,0.6)]">
                        <CardContent className="p-5">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-muted-foreground">{t(stat.label)}</p>
                            <Icon className={`h-4 w-4 ${stat.accent}`} aria-hidden="true" />
                          </div>
                          <p className="text-2xl font-semibold mt-2">{stat.value}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Clashes table */}
                <Card className="bg-card/80 border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" aria-hidden="true" />
                      {t('Active Clashes')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                          <TableHead>{t('Project')}</TableHead>
                          <TableHead>{t('Department')}</TableHead>
                          <TableHead>{t('Clashing With')}</TableHead>
                          <TableHead className="text-right">{t('Cost')}</TableHead>
                          <TableHead>{t('Risk')}</TableHead>
                          <TableHead className="text-right">{t('Action')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clashingProjects.map((project: any) => (
                          <TableRow key={project.properties.id} className="border-border">
                            <TableCell className="font-medium">{project.properties.title}</TableCell>
                            <TableCell className="text-muted-foreground">{project.properties.dept}</TableCell>
                            <TableCell className="text-muted-foreground">{project.properties.clash_with}</TableCell>
                            <TableCell className="text-right text-muted-foreground">
                              ₹{(project.properties.cost / 1000000).toFixed(1)}L
                            </TableCell>
                            <TableCell>
                              <Badge variant={riskVariant(project.properties.risk)}>
                                {project.properties.risk}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex flex-wrap items-center justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 text-xs gap-1.5"
                                >
                                  <GitMerge className="h-3 w-3" aria-hidden="true" />
                                  {t('Merge Tender')}
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  className="h-7 text-xs"
                                  onClick={() => sendAlert(project)}
                                >
                                  {t('Send Alert')}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-xs"
                                  onClick={() => runDecision(project)}
                                >
                                  {t('AI Decide')}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card className="bg-card/80 border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{t('AI Decisions')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {clashingProjects.map((project: any) => {
                      const decisionState = decisionMap[project.properties.id];
                      const result = decisionState?.result;
                      return (
                        <div
                          key={project.properties.id}
                          className="rounded-md border border-border bg-muted/20 px-4 py-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-sm font-medium">{project.properties.title}</p>
                            <span className="text-xs text-muted-foreground">
                              {decisionState?.status === 'loading'
                                ? t('Analyzing...')
                                : decisionState?.status === 'error'
                                ? t('Failed')
                                : t('Ready')}
                            </span>
                          </div>
                          {result ? (
                            <div className="mt-2 text-xs text-muted-foreground space-y-1">
                              <p>
                                {t('Decision')}: <span className="font-semibold text-foreground">{result.decision}</span> ·
                                {t('Priority')}: <span className="font-semibold text-foreground">{result.priority}</span>
                              </p>
                              <p>{t('Owner')}: {result.owner}</p>
                              <p>{t('Reasoning')}: {result.reasoning}</p>
                            </div>
                          ) : (
                            <p className="mt-2 text-xs text-muted-foreground">
                              {t('Run "AI Decide" to generate a recommendation.')}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Alert Center */}
                <Card className="bg-card/80 border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{t('Alert Center')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-muted/30 px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">{t('Alert consent')}</p>
                        <p className="text-xs text-muted-foreground">{t('Required before sending any alert message.')}</p>
                      </div>
                      <label className="flex items-center gap-2 text-sm font-medium">
                        <input
                          type="checkbox"
                          checked={consentGiven}
                          onChange={(event) => setConsentGiven(event.target.checked)}
                          className="h-4 w-4 rounded border-border"
                          aria-label={t('Consent to send alerts')}
                        />
                        {t('I confirm consent')}
                      </label>
                    </div>

                    <div className="rounded-md border border-border bg-background">
                      <div className="flex items-center justify-between border-b border-border px-4 py-2">
                        <p className="text-sm font-medium">{t('Mock alert log')}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => setAlertLog([])}
                        >
                          {t('Clear log')}
                        </Button>
                      </div>
                      <div className="max-h-64 overflow-auto">
                        {alertLog.length === 0 ? (
                          <p className="px-4 py-6 text-xs text-muted-foreground">
                            {t('No alerts sent yet. Use "Send Alert" from an active clash.')}
                          </p>
                        ) : (
                          <ul className="divide-y divide-border">
                            {alertLog.map((entry) => (
                              <li key={entry.id} className="px-4 py-3 text-xs">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <span className="font-semibold text-foreground">{entry.project}</span>
                                  <span className={entry.status === 'queued' ? 'text-emerald-600' : 'text-destructive'}>
                                    {entry.status === 'queued'
                                      ? t('Queued')
                                      : entry.status === 'sent'
                                      ? t('Sent')
                                      : entry.status === 'failed'
                                      ? t('Failed')
                                      : t('Blocked')}
                                  </span>
                                </div>
                                <p className="mt-1 text-muted-foreground">{entry.message}</p>
                                <div className="mt-2 flex flex-wrap items-center gap-2 text-muted-foreground">
                                  <span>{entry.time}</span>
                                  <span>{t('Recipient')}: {entry.recipient}</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button size="sm" variant="outline" onClick={sendUpdateEmail}>
                        {t('Send Update Email')}
                      </Button>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {t('Demo only: alerts are logged in-app and no real SMS is sent.')}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="bg-card/90 border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Brain className="h-4 w-4 text-primary" aria-hidden="true" />
                      {t('AI Command Center')}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {t('Live reasoning across monitoring, coordination, and alerts.')}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4" aria-live="polite">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{t('Last run')}: {aiLastRun ?? t('Not run yet')}</span>
                      <Button size="xs" variant="outline" onClick={runAiBrief}>
                        {t('Refresh')}
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="rounded-lg border border-border bg-muted/20 p-4">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                            <p className="text-sm font-medium">{t('Monitoring Pulse')}</p>
                          </div>
                          <Badge variant={statusVariant(aiMonitoring.status)} className="text-[11px]">
                            {statusLabel(aiMonitoring.status)}
                          </Badge>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {aiMonitoring.result?.summary ?? t('Run AI Brief to generate a monitoring summary.')}
                        </p>
                      </div>

                      <div className="rounded-lg border border-border bg-muted/20 p-4">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Brain className="h-4 w-4 text-primary" aria-hidden="true" />
                            <p className="text-sm font-medium">{t('Coordination Plan')}</p>
                          </div>
                          <Badge variant={statusVariant(aiCoordination.status)} className="text-[11px]">
                            {statusLabel(aiCoordination.status)}
                          </Badge>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {aiCoordination.result?.coordination_plan ?? t('Run AI Brief to surface the coordination plan.')}
                        </p>
                      </div>

                      <div className="rounded-lg border border-border bg-muted/20 p-4">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Bell className="h-4 w-4 text-destructive" aria-hidden="true" />
                            <p className="text-sm font-medium">{t('Triggering Engine')}</p>
                          </div>
                          <Badge variant={statusVariant(aiTriggering.status)} className="text-[11px]">
                            {statusLabel(aiTriggering.status)}
                          </Badge>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {aiTriggering.result?.reason ?? t('Run AI Brief to determine alert triggers.')}
                        </p>
                      </div>

                      <div className="rounded-lg border border-border bg-muted/20 p-4">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-blue-600" aria-hidden="true" />
                            <p className="text-sm font-medium">{t('Decision Brief')}</p>
                          </div>
                          <Badge variant={statusVariant(aiDecisionBrief.status)} className="text-[11px]">
                            {statusLabel(aiDecisionBrief.status)}
                          </Badge>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {aiDecisionBrief.result?.reasoning ?? t('Run AI Brief to get the decision rationale.')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/90 border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600" aria-hidden="true" />
                      {t('Work Sequencing Order')}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {t('AI uses this standard to prioritize tenders and avoid rework.')}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {WORK_SEQUENCE.map((step, index) => (
                      <div key={step} className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
