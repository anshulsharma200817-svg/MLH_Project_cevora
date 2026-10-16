'use client';

import { WORK_TYPE_IDS, getWorkType } from '@/lib/workTypes';
import {
    AlertTriangle,
    CalendarDays,
    ChevronDown,
    FileUp,
    FolderOpen,
    GripVertical,
    IndianRupee,
    MapPin,
    Sparkles,
    X,
} from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

const DEPARTMENTS = ['PWD', 'WATER', 'BESCOM', 'MUNICIPAL', 'TELECOM'] as const;
type Dept = (typeof DEPARTMENTS)[number];

export interface ProjectForm {
  dept: Dept;
  title: string;
  startDate: string;
  endDate: string;
  cost: number;
  description: string;
  work_type: string;
  /** null = auto (engine-calculated), 1-10 = manual override */
  manualPriority: number | null;
  /** Geometry from an imported KML file (GeoJSON format) */
  kmlGeometry?: GeoJSON.Geometry | null;
}

interface SaveProjectModalProps {
  isOpen: boolean;
  geometryType: string;
  onSave: (data: ProjectForm) => void;
  onClose: () => void;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const deptMeta: Record<Dept, { color: string; label: string }> = {
  PWD:       { color: '#EF4444', label: 'Public Works' },
  WATER:     { color: '#3B82F6', label: 'Water Dept' },
  BESCOM:    { color: '#F59E0B', label: 'Electrical' },
  MUNICIPAL: { color: '#8B5CF6', label: 'Municipal' },
  TELECOM:   { color: '#10B981', label: 'Telecom' },
};

const PRIORITY_OPTIONS = [
  { value: null as number | null, label: 'Auto (engine)',  desc: 'Calculated by priority algorithm' },
  { value: 1,                     label: '1 — Critical',   desc: 'Must execute immediately' },
  { value: 2,                     label: '2 — Urgent',     desc: 'Very high urgency' },
  { value: 3,                     label: '3 — High',       desc: 'High importance' },
  { value: 5,                     label: '5 — Medium',     desc: 'Standard priority' },
  { value: 7,                     label: '7 — Low',        desc: 'Can wait' },
  { value: 10,                    label: '10 — Deferred',  desc: 'Schedule when convenient' },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function SaveProjectModal({
  isOpen,
  geometryType,
  onSave,
  onClose,
}: SaveProjectModalProps) {
  const today = new Date().toISOString().split('T')[0];
  const kmlInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ProjectForm>({
    dept: 'PWD',
    title: '',
    startDate: today,
    endDate: '',
    cost: 0,
    description: '',
    work_type: 'ROAD_PAVING',
    manualPriority: null,
    kmlGeometry: null,
  });

  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [kmlFileName, setKmlFileName] = useState<string | null>(null);
  const [kmlError, setKmlError] = useState<string | null>(null);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

  /* ---------- KML import ---------- */
  const handleKmlImport = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setKmlError(null);

    try {
      const text = await file.text();

      // Parse KML using DOMParser to extract coordinates
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/xml');

      // Check for parse errors
      const parseError = doc.querySelector('parsererror');
      if (parseError) {
        setKmlError('Invalid KML file — could not parse XML');
        return;
      }

      // Try to extract geometry from KML
      const geometry = extractKmlGeometry(doc);
      if (!geometry) {
        setKmlError('No valid geometry found in KML file');
        return;
      }

      setForm((f) => ({ ...f, kmlGeometry: geometry }));
      setKmlFileName(file.name);
    } catch {
      setKmlError('Failed to read KML file');
    }

    // Reset input so same file can be re-selected
    if (kmlInputRef.current) kmlInputRef.current.value = '';
  }, []);

  const clearKml = useCallback(() => {
    setForm((f) => ({ ...f, kmlGeometry: null }));
    setKmlFileName(null);
    setKmlError(null);
  }, []);

  /* ---------- Validation ---------- */
  const validate = useCallback((): boolean => {
    const newErrors: Partial<Record<string, string>> = {};
    if (!form.title.trim()) newErrors.title = 'Project title is required';
    if (!form.startDate) newErrors.startDate = 'Start date is required';
    if (!form.endDate) newErrors.endDate = 'End date is required';
    if (form.endDate && form.startDate && form.endDate < form.startDate)
      newErrors.endDate = 'End date must be after start date';
    if (!form.cost || form.cost <= 0) newErrors.cost = 'Enter a valid cost';
    // Geometry required — either drawn on map or KML imported
    if (!geometryType && !form.kmlGeometry) {
      newErrors.geometry = 'Draw on map or import a KML file';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form, geometryType]);

  /* ---------- Submit ---------- */
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (validate()) {
        onSave(form);
        // Reset
        setForm({
          dept: 'PWD',
          title: '',
          startDate: today,
          endDate: '',
          cost: 0,
          description: '',
          work_type: 'ROAD_PAVING',
          manualPriority: null,
          kmlGeometry: null,
        });
        setErrors({});
        setKmlFileName(null);
        setKmlError(null);
      }
    },
    [form, onSave, validate, today],
  );

  const handleClose = useCallback(() => {
    setErrors({});
    setKmlError(null);
    onClose();
  }, [onClose]);

  /* ---------- Priority label ---------- */
  const priorityLabel = form.manualPriority === null
    ? 'Auto (engine)'
    : PRIORITY_OPTIONS.find((o) => o.value === form.manualPriority)?.label ?? `Priority ${form.manualPriority}`;

  if (!isOpen) return null;

  const hasGeometry = !!geometryType || !!form.kmlGeometry;
  const selectedWt = getWorkType(form.work_type);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="save-project-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-lg mx-4 bg-background border border-border rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <FolderOpen className="h-4 w-4 text-primary" aria-hidden="true" />
            </div>
            <div>
              <h2 id="save-project-title" className="text-base font-semibold text-foreground">
                New Project
              </h2>
              <p className="text-xs text-muted-foreground">
                {hasGeometry
                  ? form.kmlGeometry
                    ? `KML imported: ${kmlFileName}`
                    : geometryType === 'LineString'
                      ? 'Route drawn on map'
                      : 'Point marked on map'
                  : 'Define project details'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <form onSubmit={handleSubmit} noValidate className="overflow-y-auto flex-1">
          <div className="px-6 py-5 space-y-5">

            {/* ═══ Section 1: Geometry Source ═══ */}
            <fieldset className="space-y-3">
              <legend className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Project Geometry
              </legend>

              {/* Drawn geometry indicator */}
              {geometryType && (
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border bg-accent/30">
                  <MapPin className="h-4 w-4 text-primary flex-shrink-0" aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">
                      {geometryType === 'LineString' ? 'Route' : 'Point'} drawn on map
                    </p>
                    <p className="text-xs text-muted-foreground">Geometry captured from drawing tool</p>
                  </div>
                </div>
              )}

              {/* KML import */}
              <div className="space-y-2">
                {kmlFileName ? (
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-primary/30 bg-primary/5">
                    <FileUp className="h-4 w-4 text-primary flex-shrink-0" aria-hidden="true" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{kmlFileName}</p>
                      <p className="text-xs text-muted-foreground">KML geometry imported</p>
                    </div>
                    <button
                      type="button"
                      onClick={clearKml}
                      className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground"
                      aria-label="Remove imported KML"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => kmlInputRef.current?.click()}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-lg border border-dashed border-border hover:border-primary/50 hover:bg-accent/30 transition text-left group"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted group-hover:bg-primary/10 transition">
                      <FileUp className="h-4 w-4 text-muted-foreground group-hover:text-primary transition" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Import Project KML</p>
                      <p className="text-xs text-muted-foreground">Upload .kml file to define project area</p>
                    </div>
                  </button>
                )}
                <input
                  ref={kmlInputRef}
                  type="file"
                  accept=".kml"
                  onChange={handleKmlImport}
                  className="hidden"
                  aria-label="Upload KML file"
                />
                {kmlError && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200">
                    <AlertTriangle className="h-3.5 w-3.5 text-red-500 flex-shrink-0" aria-hidden="true" />
                    <p className="text-xs text-red-600">{kmlError}</p>
                  </div>
                )}
              </div>

              {errors.geometry && (
                <p role="alert" className="text-xs text-red-500 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                  {errors.geometry}
                </p>
              )}
            </fieldset>

            <hr className="border-border" />

            {/* ═══ Section 2: Department & Work Type ═══ */}
            <div className="grid grid-cols-1 gap-4">
              {/* Department */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Department <span aria-hidden="true" className="text-red-400">*</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {DEPARTMENTS.map((d) => {
                    const meta = deptMeta[d];
                    const selected = form.dept === d;
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, dept: d }))}
                        aria-pressed={selected}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary ${
                          selected
                            ? 'text-white border-transparent shadow-sm'
                            : 'bg-background text-foreground border-border hover:bg-accent'
                        }`}
                        style={selected ? { backgroundColor: meta.color } : undefined}
                        title={meta.label}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Work Type */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Work Type <span aria-hidden="true" className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {WORK_TYPE_IDS.map((wtId) => {
                    const wt = getWorkType(wtId);
                    const selected = form.work_type === wtId;
                    return (
                      <button
                        key={wtId}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, work_type: wtId }))}
                        aria-pressed={selected}
                        className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-center transition border focus:outline-none focus:ring-2 focus:ring-primary ${
                          selected
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-border hover:bg-accent/50'
                        }`}
                      >
                        <span
                          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: selected ? wt.color : `${wt.color}30` }}
                          aria-hidden="true"
                          dangerouslySetInnerHTML={{
                            __html: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none">${
                              selected
                                ? wt.iconSvg
                                : wt.iconSvg.replace(/stroke="white"/g, `stroke="${wt.color}"`)
                            }</svg>`,
                          }}
                        />
                        <span className={`text-[10px] leading-tight font-medium ${selected ? 'text-primary' : 'text-muted-foreground'}`}>
                          {wt.label.split('/')[0].split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Selected: <span className="font-medium text-foreground">{selectedWt.label}</span>
                  <span className="ml-1 text-muted-foreground">({selectedWt.layer})</span>
                </p>
              </div>
            </div>

            <hr className="border-border" />

            {/* ═══ Section 3: Project Details ═══ */}
            <div className="space-y-3">
              {/* Title */}
              <div>
                <label htmlFor="project-title" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Project Title <span aria-hidden="true" className="text-red-400">*</span>
                </label>
                <input
                  id="project-title"
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. NH-46 Road Widening"
                  aria-required="true"
                  aria-invalid={!!errors.title}
                  aria-describedby={errors.title ? 'title-error' : undefined}
                  className={`w-full bg-muted/50 border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background transition ${
                    errors.title ? 'border-red-500' : 'border-border'
                  }`}
                />
                {errors.title && (
                  <p id="title-error" role="alert" className="mt-1 text-xs text-red-500">{errors.title}</p>
                )}
              </div>

              {/* Date row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="start-date" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Start <span aria-hidden="true" className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" aria-hidden="true" />
                    <input
                      id="start-date"
                      type="date"
                      value={form.startDate}
                      onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                      aria-required="true"
                      aria-invalid={!!errors.startDate}
                      aria-describedby={errors.startDate ? 'start-error' : undefined}
                      className={`w-full bg-muted/50 border rounded-lg pl-9 pr-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background transition ${
                        errors.startDate ? 'border-red-500' : 'border-border'
                      }`}
                    />
                  </div>
                  {errors.startDate && (
                    <p id="start-error" role="alert" className="mt-1 text-xs text-red-500">{errors.startDate}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="end-date" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    End <span aria-hidden="true" className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" aria-hidden="true" />
                    <input
                      id="end-date"
                      type="date"
                      value={form.endDate}
                      onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                      aria-required="true"
                      aria-invalid={!!errors.endDate}
                      aria-describedby={errors.endDate ? 'end-error' : undefined}
                      className={`w-full bg-muted/50 border rounded-lg pl-9 pr-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background transition ${
                        errors.endDate ? 'border-red-500' : 'border-border'
                      }`}
                    />
                  </div>
                  {errors.endDate && (
                    <p id="end-error" role="alert" className="mt-1 text-xs text-red-500">{errors.endDate}</p>
                  )}
                </div>
              </div>

              {/* Cost */}
              <div>
                <label htmlFor="project-cost" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Estimated Cost <span aria-hidden="true" className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" aria-hidden="true" />
                  <input
                    id="project-cost"
                    type="number"
                    min={1}
                    value={form.cost || ''}
                    onChange={(e) => setForm((f) => ({ ...f, cost: Number(e.target.value) }))}
                    placeholder="e.g. 5000000"
                    aria-required="true"
                    aria-invalid={!!errors.cost}
                    aria-describedby={errors.cost ? 'cost-error' : 'cost-hint'}
                    className={`w-full bg-muted/50 border rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background transition ${
                      errors.cost ? 'border-red-500' : 'border-border'
                    }`}
                  />
                </div>
                <p id="cost-hint" className="mt-1 text-xs text-muted-foreground">
                  {form.cost > 0 ? `${(form.cost / 100000).toFixed(2)} Lakhs` : 'Enter amount in Rupees'}
                </p>
                {errors.cost && (
                  <p id="cost-error" role="alert" className="mt-1 text-xs text-red-500">{errors.cost}</p>
                )}
              </div>
            </div>

            <hr className="border-border" />

            {/* ═══ Section 4: Priority ═══ */}
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Execution Priority
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPriorityDropdown((v) => !v)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-border bg-muted/50 hover:bg-accent/30 transition text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-expanded={showPriorityDropdown}
                  aria-haspopup="listbox"
                >
                  <div className="flex items-center gap-2">
                    {form.manualPriority === null ? (
                      <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    ) : (
                      <GripVertical className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                    )}
                    <span>{priorityLabel}</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition ${showPriorityDropdown ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>

                {showPriorityDropdown && (
                  <div
                    className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-10 py-1 max-h-52 overflow-y-auto"
                    role="listbox"
                    aria-label="Priority options"
                  >
                    {PRIORITY_OPTIONS.map((opt) => {
                      const isSelected = form.manualPriority === opt.value;
                      return (
                        <button
                          key={String(opt.value)}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            setForm((f) => ({ ...f, manualPriority: opt.value }));
                            setShowPriorityDropdown(false);
                          }}
                          className={`w-full px-3 py-2 text-left hover:bg-accent transition flex items-center justify-between ${
                            isSelected ? 'bg-accent/50' : ''
                          }`}
                        >
                          <div>
                            <p className="text-sm font-medium text-foreground">{opt.label}</p>
                            <p className="text-xs text-muted-foreground">{opt.desc}</p>
                          </div>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" aria-hidden="true" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {form.manualPriority === null
                  ? 'Priority will be calculated automatically based on work type, clashes, and cost.'
                  : `Manual override: priority score fixed at ${form.manualPriority}/10.`}
              </p>
            </div>

            {/* ═══ Section 5: Description ═══ */}
            <div>
              <label htmlFor="project-desc" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                id="project-desc"
                rows={2}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Brief description of the project scope..."
                className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background resize-none transition"
              />
            </div>
          </div>

          {/* ── Footer actions ── */}
          <div className="flex gap-3 px-6 py-4 border-t border-border bg-muted/30 rounded-b-2xl">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-background hover:bg-accent text-foreground font-medium py-2.5 rounded-lg border border-border transition text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 rounded-lg transition text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Save &amp; Check Clashes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  KML geometry extraction helper                                     */
/* ------------------------------------------------------------------ */

function extractKmlGeometry(doc: Document): GeoJSON.Geometry | null {
  // Try LineString coordinates
  const lineStringEl = doc.querySelector('LineString coordinates');
  if (lineStringEl?.textContent) {
    const coords = parseKmlCoordinates(lineStringEl.textContent);
    if (coords.length >= 2) {
      return { type: 'LineString', coordinates: coords };
    }
  }

  // Try Polygon
  const polygonEl = doc.querySelector('Polygon outerBoundaryIs LinearRing coordinates');
  if (polygonEl?.textContent) {
    const coords = parseKmlCoordinates(polygonEl.textContent);
    if (coords.length >= 4) {
      return { type: 'Polygon', coordinates: [coords] };
    }
  }

  // Try Point
  const pointEl = doc.querySelector('Point coordinates');
  if (pointEl?.textContent) {
    const coords = parseKmlCoordinates(pointEl.textContent);
    if (coords.length === 1) {
      return { type: 'Point', coordinates: coords[0] };
    }
  }

  // Try MultiGeometry — take the first valid child
  const multiEl = doc.querySelector('MultiGeometry');
  if (multiEl) {
    const innerCoords = multiEl.querySelector('coordinates');
    if (innerCoords?.textContent) {
      const coords = parseKmlCoordinates(innerCoords.textContent);
      if (coords.length >= 2) {
        return { type: 'LineString', coordinates: coords };
      }
      if (coords.length === 1) {
        return { type: 'Point', coordinates: coords[0] };
      }
    }
  }

  return null;
}

function parseKmlCoordinates(text: string): number[][] {
  return text
    .trim()
    .split(/\s+/)
    .map((tuple) => {
      const parts = tuple.split(',').map(Number);
      // KML is lng,lat,alt — we use lng,lat (GeoJSON order)
      if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return [parts[0], parts[1]];
      }
      return null;
    })
    .filter((c): c is number[] => c !== null);
}
