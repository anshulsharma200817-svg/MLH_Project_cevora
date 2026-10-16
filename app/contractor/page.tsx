'use client';

import { useI18n } from '@/components/LanguageProvider';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Clock, IndianRupee, Medal, Trophy } from 'lucide-react';

export default function ContractorPage() {
  const { t } = useI18n();
  const contractors = [
    { id: 1, name: 'BuildCorp India Ltd', completed: 12, avgDelay: 3, penalty: 125000 },
    { id: 2, name: 'Infrastructure Plus', completed: 18, avgDelay: 1, penalty: 45000 },
    { id: 3, name: 'Highway Systems', completed: 8, avgDelay: 7, penalty: 280000 },
    { id: 4, name: 'Urban Development Co', completed: 15, avgDelay: 2, penalty: 85000 },
    { id: 5, name: 'Metro Engineering', completed: 20, avgDelay: 0, penalty: 0 },
  ];

  const getScore = (completed: number, delay: number) => {
    return Math.max(0, 100 - delay * 5 - (completed < 10 ? 10 : 0));
  };

  const sortedContractors = [...contractors].sort(
    (a, b) => getScore(b.completed, b.avgDelay) - getScore(a.completed, a.avgDelay)
  );

  const avgDelay = (sortedContractors.reduce((sum, c) => sum + c.avgDelay, 0) / sortedContractors.length).toFixed(1);
  const totalPenalties = sortedContractors.reduce((sum, c) => sum + c.penalty, 0);

  const rankIcon = (idx: number) => {
    if (idx === 0) return <Medal className="h-4 w-4 text-yellow-500" aria-label={t('Rank 1')} />;
    if (idx === 1) return <Medal className="h-4 w-4 text-gray-500" aria-label={t('Rank 2')} />;
    if (idx === 2) return <Medal className="h-4 w-4 text-orange-500" aria-label={t('Rank 3')} />;
    return <span className="text-xs text-muted-foreground w-4 text-center">{idx + 1}</span>;
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-destructive';
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-auto">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{t('Contractor Performance')}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t('Scorecard and rankings based on project delivery performance')}</p>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">{t('Top Performer')}</p>
                  <Trophy className="h-4 w-4 text-yellow-500" aria-hidden="true" />
                </div>
                <p className="text-lg font-semibold mt-2">{sortedContractors[0].name}</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">{t('Avg. Delay')}</p>
                  <Clock className="h-4 w-4 text-orange-500" aria-hidden="true" />
                </div>
                <p className="text-lg font-semibold mt-2">{avgDelay} days</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">{t('Total Penalties')}</p>
                  <IndianRupee className="h-4 w-4 text-primary" aria-hidden="true" />
                </div>
                <p className="text-lg font-semibold mt-2">₹{(totalPenalties / 100000).toFixed(1)}L</p>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <Card className="bg-card border-border">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="w-12">{t('Rank')}</TableHead>
                    <TableHead>{t('Contractor')}</TableHead>
                    <TableHead className="text-center">{t('Completed')}</TableHead>
                    <TableHead className="text-center">{t('Avg Delay')}</TableHead>
                    <TableHead className="text-right">{t('Penalties')}</TableHead>
                    <TableHead className="w-40">{t('Score')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedContractors.map((contractor, idx) => {
                    const score = getScore(contractor.completed, contractor.avgDelay);
                    return (
                      <TableRow key={contractor.id} className="border-border">
                        <TableCell>
                          <div className="flex items-center justify-center">
                            {rankIcon(idx)}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{contractor.name}</TableCell>
                        <TableCell className="text-center text-muted-foreground">{contractor.completed}</TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {contractor.avgDelay} {contractor.avgDelay === 1 ? t('day') : t('days')}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          ₹{contractor.penalty.toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={score} className="h-1.5 flex-1" />
                            <span className={`text-xs font-semibold w-7 text-right ${scoreColor(score)}`}>
                              {score}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
