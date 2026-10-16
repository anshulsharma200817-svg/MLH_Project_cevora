'use client';

import { useI18n } from '@/components/LanguageProvider';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import jsPDF from 'jspdf';
import {
    AlertTriangle,
    CheckCircle2,
    FileDown,
    Loader2,
    Search,

    Sparkles,
} from 'lucide-react';
import { useState } from 'react';

export default function TenderPage() {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    dept: 'PWD',
    title: '',
    location: '',
    startDate: '',
    endDate: '',
    cost: '',
  });

  const [clashes, setClashes] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [riskScore, setRiskScore] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newProject = {
        type: 'Feature',
        properties: {
          id: 999,
          dept: formData.dept,
          title: formData.title,
          start: formData.startDate,
          end: formData.endDate,
          cost: parseInt(formData.cost),
          risk: 'MEDIUM',
          clash_with: null,
          description: formData.location,
        },
        geometry: {
          type: 'LineString',
          coordinates: [[78.17, 26.22], [78.18, 26.23]],
        },
      };

      const clashRes = await fetch('/api/clashes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      });

      const clashData = await clashRes.json();
      setClashes(clashData);

      if (clashData.clashes.length > 0) {
        const riskRes = await fetch('/api/score-risk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            project_title: formData.title,
            dept: formData.dept,
            clashing_dept: clashData.clashes[0].dept,
            overlap_meters: 500,
            combined_cost: formData.cost + clashData.clashes[0].cost,
          }),
        });

        const riskData = await riskRes.json();
        setRiskScore(riskData);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateNIT = async () => {
    if (!clashes || clashes.clashes.length === 0) return;

    try {
      const projectsList = [
        { dept: formData.dept, title: formData.title, cost: parseInt(formData.cost) },
        ...clashes.clashes,
      ];

      const nitRes = await fetch('/api/generate-nit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects: projectsList }),
      });

      const { nit } = await nitRes.json();

      const doc = new jsPDF();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text(t('Notice Inviting Tender (NIT)'), 20, 20);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      const splitText = doc.splitTextToSize(nit, 170);
      doc.text(splitText, 20, 35);

      doc.save('karana-nit.pdf');
    } catch (error) {
      console.error('Error generating NIT:', error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-auto">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{t('New Tender Submission')}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t('Submit a project tender and check for infrastructure clashes')}</p>
          </div>

          <div className="max-w-2xl space-y-6">
            {/* Form */}
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dept">{t('Department')}</Label>
                      <Select value={formData.dept} onValueChange={(val) => setFormData({ ...formData, dept: val })}>
                        <SelectTrigger id="dept">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PWD">PWD</SelectItem>
                          <SelectItem value="WATER">WATER</SelectItem>
                          <SelectItem value="BESCOM">BESCOM</SelectItem>
                          <SelectItem value="MUNICIPAL">MUNICIPAL</SelectItem>
                          <SelectItem value="TELECOM">TELECOM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title">{t('Project Title')}</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder={t('e.g. Road Resurfacing')}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">{t('Location')}</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder={t('e.g. MLN Road, Gwalior')}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">{t('Start Date')}</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">{t('End Date')}</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cost">{t('Estimated Cost (₹)')}</Label>
                      <Input
                        id="cost"
                        type="number"
                        value={formData.cost}
                        onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                        placeholder={t('0')}
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                        {t('Checking for Clashes...')}
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" aria-hidden="true" />
                        {t('Submit & Check Clashes')}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Results */}
            {clashes && (
              <Card className={clashes.clashes.length > 0 ? 'border-destructive/40' : 'border-emerald-500/40'}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    {clashes.clashes.length > 0 ? (
                      <AlertTriangle className="h-4 w-4 text-destructive" aria-hidden="true" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                    )}
                    {t('Clash Analysis Result')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {clashes.clashes.length > 0 ? (
                    <>
                      <p className="text-sm text-destructive font-medium">
                        {t('{count} clash(es) detected', { count: clashes.clashes.length })}
                      </p>

                      <div className="space-y-2">
                        {clashes.clashes.map((clash: any) => (
                          <div key={clash.id} className="rounded-md border border-border bg-secondary/50 p-3">
                            <p className="text-sm font-medium">{clash.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {t(clash.dept)} &middot; ₹{(clash.cost / 1000000).toFixed(1)}L
                            </p>
                          </div>
                        ))}
                      </div>

                      {riskScore && (
                        <div className="rounded-md border border-border bg-secondary/50 p-4 space-y-2">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
                            <p className="text-sm font-medium">{t('AI Risk Assessment')}</p>
                          </div>
                          <div className="grid grid-cols-3 gap-3 text-xs">
                            <div>
                              <p className="text-muted-foreground">{t('Risk Score')}</p>
                              <p className="text-base font-semibold text-destructive mt-0.5">{riskScore.risk_score}/10</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">{t('Potential Waste')}</p>
                              <p className="text-base font-semibold text-orange-600 mt-0.5">₹{(riskScore.waste_inr / 1000000).toFixed(1)}L</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">{t('Recommendation')}</p>
                              <Badge variant="secondary" className="mt-1 capitalize">{riskScore.recommendation}</Badge>
                            </div>
                          </div>
                        </div>
                      )}

                      <Button onClick={generateNIT} variant="destructive" className="w-full">
                        <FileDown className="mr-2 h-4 w-4" aria-hidden="true" />
                        {t('Generate Combined NIT & Download PDF')}
                      </Button>
                    </>
                  ) : (
                    <p className="text-sm text-emerald-600 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      {t('No conflicts detected — safe to proceed')}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
