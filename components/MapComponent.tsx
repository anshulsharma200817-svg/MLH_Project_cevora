'use client';

/**
 * KARANA PLATFORM — Live Map Component
 *
 * Light-theme map page matching the app's professional UI.
 * - White/light backgrounds, shadcn-style borders
 * - Lucide icons (no emojis)
 * - Hamburger toggle to show/hide side panels
 * - No mock data loaded on start — map starts clean
 */

import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet/dist/leaflet.css';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FeatureGroup,
  MapContainer,
  TileLayer,
  useMap
} from 'react-leaflet';

import FolderTree, {
  type ProjectFolder,
  createFolderId,
} from './FolderTree';
import SaveProjectModal, { type ProjectForm } from './SaveProjectModal';

import {
  buildPopupHtml,
  createClusterIcon,
  createWorkIcon,
} from '@/lib/mapIcons';
import {
  MOCK_FOLDERS,
  MOCK_KML_FILES,
  extractKmlGeometry,
} from '@/lib/mockKmlData';
import {
  type PriorityProject,
  type RankedProject,
  getGeometryCenter,
  getSequenceOrder,
  rankProjects,
} from '@/lib/priorityEngine';
import {
  WORK_TYPE_IDS,
  getWorkType,
} from '@/lib/workTypes';

import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Database,
  FolderTree as FolderTreeIcon,
  Layers,
  MapPin,
  Menu,
  Minus,
  MousePointer,
  Plus,
  Route,
  Satellite,
  Trash2,
  Upload,
  X,
} from 'lucide-react';

/* ================================================================== */
/*  Constants                                                          */
/* ================================================================== */

const GWALIOR: [number, number] = [26.2298, 78.1734];

/**
 * Haversine distance (meters) between two [lat, lng] points.
 */
function haversineMeters(
  a: [number, number],
  b: [number, number],
): number {
  const R = 6_371_000;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLon = ((b[1] - a[1]) * Math.PI) / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const h =
    sinLat * sinLat +
    Math.cos((a[0] * Math.PI) / 180) *
      Math.cos((b[0] * Math.PI) / 180) *
      sinLon * sinLon;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

/**
 * Spatial proximity clash check.
 * Returns true only if two geometries are within CLASH_RADIUS_METERS of each
 * other — measured as closest-point distance between their coordinate arrays.
 */
const CLASH_RADIUS_METERS = 100;

function geometriesClash(
  gA: { type: string; coordinates: number[][] | number[] },
  gB: { type: string; coordinates: number[][] | number[] },
): boolean {
  const toLatLngPairs = (
    g: { type: string; coordinates: number[][] | number[] },
  ): [number, number][] => {
    if (g.type === 'Point') {
      const c = g.coordinates as number[];
      return [[c[1], c[0]]];
    }
    if (g.type === 'Polygon') {
      const rings = g.coordinates as unknown as number[][][];
      return (rings[0] ?? []).map((c) => [c[1], c[0]] as [number, number]);
    }
    // LineString or fallback
    return (g.coordinates as number[][]).map(
      (c) => [c[1], c[0]] as [number, number],
    );
  };

  const ptsA = toLatLngPairs(gA);
  const ptsB = toLatLngPairs(gB);
  if (ptsA.length === 0 || ptsB.length === 0) return false;

  for (const a of ptsA) {
    for (const b of ptsB) {
      if (haversineMeters(a, b) <= CLASH_RADIUS_METERS) return true;
    }
  }
  return false;
}

/** Dash pattern per layer depth */
const LAYER_DASH: Record<string, string | undefined> = {
  underground: '8 4',
  surface: '4 2',
  road: undefined,
};

const TILE_LAYERS = {
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attr: '&copy; OpenStreetMap contributors',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attr: '&copy; Esri',
  },
};

/* ================================================================== */
/*  Toast System                                                       */
/* ================================================================== */

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  const borderColor = (t: Toast['type']) => {
    switch (t) {
      case 'success': return 'border-green-500';
      case 'info':    return 'border-blue-500';
      case 'warning': return 'border-amber-500';
      case 'error':   return 'border-red-500';
    }
  };
  const iconColor = (t: Toast['type']) => {
    switch (t) {
      case 'success': return 'text-green-600';
      case 'info':    return 'text-blue-600';
      case 'warning': return 'text-amber-600';
      case 'error':   return 'text-red-600';
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[10000] flex flex-col gap-2 max-w-sm" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`bg-background border ${borderColor(t.type)} border-l-4 rounded-lg shadow-lg px-4 py-3 flex items-start gap-3`}
        >
          <AlertTriangle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${iconColor(t.type)}`} aria-hidden="true" />
          <p className="text-sm text-foreground flex-1">{t.message}</p>
          <button
            onClick={() => onDismiss(t.id)}
            className="text-muted-foreground hover:text-foreground p-0.5"
            aria-label="Dismiss notification"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ================================================================== */
/*  MapToolbar (draw controls, layer switch, KML import)               */
/* ================================================================== */

interface MapToolbarProps {
  featureGroupRef: React.RefObject<L.FeatureGroup | null>;
  tileLayer: 'street' | 'satellite';
  setTileLayer: (l: 'street' | 'satellite') => void;
  onFeatureCreated: (layer: L.Layer, geoType: string) => void;
  addToast: (msg: string, type?: Toast['type']) => void;
  leftPanelOpen: boolean;
}

function MapToolbar({
  featureGroupRef,
  tileLayer,
  setTileLayer,
  onFeatureCreated,
  addToast,
  leftPanelOpen,
}: MapToolbarProps) {
  const map = useMap();
  const drawRef = useRef<L.Draw.Polyline | L.Draw.Marker | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);

  /* ---------- draw handlers ---------- */
  useEffect(() => {
    const onCreated = (e: L.LeafletEvent) => {
      const evt = e as L.DrawEvents.Created;
      featureGroupRef.current?.addLayer(evt.layer);
      const geo = (evt.layer as L.Layer & { toGeoJSON(): GeoJSON.Feature }).toGeoJSON();
      onFeatureCreated(evt.layer, geo.geometry.type);
      setActiveTool(null);
    };
    map.on(L.Draw.Event.CREATED, onCreated);
    return () => { map.off(L.Draw.Event.CREATED, onCreated); };
  }, [map, featureGroupRef, onFeatureCreated]);

  const startDraw = useCallback(
    (type: 'marker' | 'polyline') => {
      drawRef.current?.disable();
      if (activeTool === type) {
        setActiveTool(null);
        return;
      }
      const fg = featureGroupRef.current;
      if (!fg) return;
      // Cast to DrawMap to satisfy leaflet-draw typings
      const drawMap = map as unknown as L.DrawMap;
      if (type === 'marker') {
        drawRef.current = new L.Draw.Marker(drawMap, { icon: new L.Icon.Default() });
        addToast('Click on the map to place a marker', 'info');
      } else {
        drawRef.current = new L.Draw.Polyline(drawMap, {
          shapeOptions: { color: '#3B82F6', weight: 4, opacity: 0.85 },
        });
        addToast('Click to add points. Double-click to finish the route.', 'info');
      }
      drawRef.current.enable();
      setActiveTool(type);
    },
    [map, featureGroupRef, activeTool, addToast],
  );

  /* ---------- clear ---------- */
  const clearAll = useCallback(() => {
    featureGroupRef.current?.clearLayers();
    addToast('All drawn features cleared', 'info');
  }, [featureGroupRef, addToast]);

  /* ---------- KML import ---------- */
  const handleKml = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.kml,.kmz';
    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const omnivore = require('leaflet-omnivore');
        const kmlLayer = omnivore.kml.parse(text);
        kmlLayer.addTo(map);
        map.fitBounds(kmlLayer.getBounds(), { padding: [40, 40] });
        addToast(`KML file "${file.name}" imported`, 'success');
      } catch {
        addToast('Failed to parse KML file', 'error');
      }
    };
    input.click();
  }, [map, addToast]);

  const btnClass = (active?: boolean) =>
    `p-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-primary
     ${active
       ? 'bg-primary text-primary-foreground shadow-sm'
       : 'bg-background text-foreground hover:bg-accent border border-border'}`;

  return (
    <div
      className={`absolute top-3 z-[1000] flex flex-col gap-1.5 transition-[left] duration-200 ${leftPanelOpen ? 'left-[296px]' : 'left-3'}`}
      role="toolbar"
      aria-label="Map drawing tools"
    >
      {/* Navigation / Pan */}
      <button
        onClick={() => { drawRef.current?.disable(); setActiveTool(null); }}
        className={btnClass(activeTool === null)}
        aria-label="Pan mode"
        aria-pressed={activeTool === null}
        title="Pan"
      >
        <MousePointer className="h-4 w-4" />
      </button>

      {/* Draw marker */}
      <button
        onClick={() => startDraw('marker')}
        className={btnClass(activeTool === 'marker')}
        aria-label="Draw marker"
        aria-pressed={activeTool === 'marker'}
        title="Place marker"
      >
        <MapPin className="h-4 w-4" />
      </button>

      {/* Draw polyline */}
      <button
        onClick={() => startDraw('polyline')}
        className={btnClass(activeTool === 'polyline')}
        aria-label="Draw route"
        aria-pressed={activeTool === 'polyline'}
        title="Draw route"
      >
        <Route className="h-4 w-4" />
      </button>

      {/* Clear */}
      <button onClick={clearAll} className={btnClass()} aria-label="Clear drawn features" title="Clear all">
        <Trash2 className="h-4 w-4" />
      </button>

      <div className="my-1 border-t border-border" aria-hidden="true" />

      {/* Tile layer toggle */}
      <button
        onClick={() => setTileLayer(tileLayer === 'street' ? 'satellite' : 'street')}
        className={btnClass()}
        aria-label={`Switch to ${tileLayer === 'street' ? 'satellite' : 'street'} view`}
        title="Toggle tile layer"
      >
        <Satellite className="h-4 w-4" />
      </button>

      {/* KML Import */}
      <button onClick={handleKml} className={btnClass()} aria-label="Import KML file" title="Import KML">
        <Upload className="h-4 w-4" />
      </button>

      {/* Zoom in / out */}
      <div className="my-1 border-t border-border" aria-hidden="true" />
      <button onClick={() => map.zoomIn()} className={btnClass()} aria-label="Zoom in" title="Zoom in">
        <Plus className="h-4 w-4" />
      </button>
      <button onClick={() => map.zoomOut()} className={btnClass()} aria-label="Zoom out" title="Zoom out">
        <Minus className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ================================================================== */
/*  ProjectGeometryLayer — render saved project geometries with        */
/*  work-type-specific color coding                                    */
/* ================================================================== */

interface ProjectGeometryLayerProps {
  projects: PriorityProject[];
  enabledLayers: Set<string>;
}

function ProjectGeometryLayer({ projects, enabledLayers }: ProjectGeometryLayerProps) {
  const map = useMap();

  useEffect(() => {
    const layers: L.Layer[] = [];

    for (const proj of projects) {
      if (!enabledLayers.has(proj.work_type)) continue;
      const wt = getWorkType(proj.work_type);

      try {
        const geoLayer = L.geoJSON(
          {
            type: 'Feature',
            properties: { title: proj.title, dept: proj.dept },
            geometry: proj.geometry,
          } as GeoJSON.Feature,
          {
            style: () => ({
              color: wt.color,
              weight: proj.geometry.type === 'Point' ? 0 : 4,
              opacity: 0.85,
              dashArray: LAYER_DASH[wt.layer],
              fillColor: wt.color,
              fillOpacity: 0.18,
            }),
            pointToLayer: (_feat, latlng) =>
              L.circleMarker(latlng, {
                radius: 8,
                color: wt.color,
                fillColor: wt.color,
                fillOpacity: 0.6,
                weight: 2,
              }),
            onEachFeature: (_feat, layer) => {
              layer.bindTooltip(
                `<strong>${proj.title}</strong><br/>${wt.label} — ${proj.dept}`,
                { sticky: true, className: 'karana-tooltip' },
              );
            },
          },
        );
        geoLayer.addTo(map);
        layers.push(geoLayer);
      } catch {
        // skip invalid geometry
      }
    }

    return () => {
      layers.forEach((l) => map.removeLayer(l));
    };
  }, [map, projects, enabledLayers]);

  return null;
}

/* ================================================================== */
/*  WorkTypeMarkers — cluster-enabled markers grouped by work type     */
/* ================================================================== */

interface WorkTypeMarkersProps {
  projects: PriorityProject[];
  ranked: RankedProject[];
  enabledLayers: Set<string>;
}

function WorkTypeMarkers({ projects, ranked, enabledLayers }: WorkTypeMarkersProps) {
  const map = useMap();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const MC = require('leaflet.markercluster');
    void MC; // ensure side-effects

    const groups: L.MarkerClusterGroup[] = [];

    for (const wtId of WORK_TYPE_IDS) {
      if (!enabledLayers.has(wtId)) continue;

      const cluster = L.markerClusterGroup({
        iconCreateFunction: (c) => createClusterIcon(wtId, c.getChildCount()),
        maxClusterRadius: 50,
        showCoverageOnHover: false,
      });

      const typeProjects = projects.filter(
        (p) => p.work_type === wtId,
      );

      for (const proj of typeProjects) {
        const rankedEntry = ranked.find((r) => r.id === proj.id);
        const center = getGeometryCenter(proj.geometry);
        const icon = createWorkIcon(
          wtId,
          rankedEntry?.rank,
          undefined,
        );
        const marker = L.marker(center, { icon });
        marker.bindPopup(
          buildPopupHtml(
            { properties: proj as unknown as Record<string, unknown>, work_type: wtId },
            rankedEntry?.priorityScore,
            rankedEntry?.rank,
            ranked.length,
          ),
        );
        cluster.addLayer(marker);
      }

      cluster.addTo(map);
      groups.push(cluster);
    }

    return () => {
      groups.forEach((g) => map.removeLayer(g));
    };
  }, [map, projects, ranked, enabledLayers]);

  return null;
}

/* ================================================================== */
/*  MapRefTracker — captures map instance ref for external use         */
/* ================================================================== */

function MapRefTracker({ mapRef }: { mapRef: React.MutableRefObject<L.Map | null> }) {
  const map = useMap();
  useEffect(() => {
    mapRef.current = map;
    return () => { mapRef.current = null; };
  }, [map, mapRef]);
  return null;
}

/* ================================================================== */
/*  Main MapComponent                                                  */
/* ================================================================== */

export default function MapComponent() {
  /* ---- State ---- */
  const featureGroupRef = useRef<L.FeatureGroup | null>(null);
  const [tileLayer, setTileLayer] = useState<'street' | 'satellite'>('street');

  // Panels
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);

  // Project data (starts empty — no mock data)
  const [projects, setProjects] = useState<PriorityProject[]>([]);
  const [enabledLayers, setEnabledLayers] = useState<Set<string>>(
    () => new Set(WORK_TYPE_IDS),
  );

  // Folder tree state
  const [folders, setFolders] = useState<ProjectFolder[]>([]);
  const [hiddenProjectIds, setHiddenProjectIds] = useState<Set<number>>(
    () => new Set(),
  );
  const [mockLoaded, setMockLoaded] = useState(false);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Draw / save
  const [saveModal, setSaveModal] = useState<{
    open: boolean;
    layer: L.Layer | null;
    geoType: string;
  }>({ open: false, layer: null, geoType: '' });

  // Toast
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

  /* ---- Derived ---- */
  const ranked = useMemo(() => rankProjects(projects), [projects]);
  const phases = useMemo(() => getSequenceOrder(projects), [projects]);
  const clashCount = useMemo(
    () => projects.filter((p) => p.clash_with).length,
    [projects],
  );

  /* ---- Toast helpers ---- */
  const addToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4500);
  }, []);
  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /* ---- Visible projects (hidden filter) ---- */
  const visibleProjects = useMemo(
    () => projects.filter((p) => !hiddenProjectIds.has(p.id)),
    [projects, hiddenProjectIds],
  );

  /* ---- Toggle project visibility ---- */
  const toggleProjectVisibility = useCallback((projectId: number) => {
    setHiddenProjectIds((prev) => {
      const next = new Set(prev);
      if (next.has(projectId)) next.delete(projectId);
      else next.add(projectId);
      return next;
    });
  }, []);

  /* ---- Zoom to project ---- */
  const zoomToProject = useCallback(
    (projectId: number) => {
      const proj = projects.find((p) => p.id === projectId);
      if (!proj || !mapInstanceRef.current) return;
      const center = getGeometryCenter(proj.geometry);
      mapInstanceRef.current.flyTo(center, 15, { duration: 0.8 });
    },
    [projects],
  );

  /* ---- Load mock KML data ---- */
  const loadMockData = useCallback(async () => {
    if (mockLoaded) {
      addToast('Mock data already loaded', 'info');
      return;
    }

    addToast('Loading 22 mock KML projects...', 'info');

    const newProjects: PriorityProject[] = [];
    const folderMap = new Map<string, number[]>();

    for (const entry of MOCK_KML_FILES) {
      try {
        const resp = await fetch(`/mock-kml/${entry.file}`);
        if (!resp.ok) continue;
        const kmlText = await resp.text();
        const geometry = extractKmlGeometry(kmlText);
        if (!geometry) continue;

        const proj: PriorityProject = {
          id: Date.now() + Math.random() * 10000,
          dept: entry.dept,
          work_type: entry.type,
          title: entry.title,
          start: entry.start,
          end: entry.end,
          cost: entry.cost,
          risk: entry.risk,
          clash_with: entry.clashWith,
          geometry: geometry as PriorityProject['geometry'],
        };
        newProjects.push(proj);

        // Track folder assignments
        if (!folderMap.has(entry.folder)) {
          folderMap.set(entry.folder, []);
        }
        folderMap.get(entry.folder)!.push(proj.id);
      } catch {
        // skip failed fetches
      }
    }

    if (newProjects.length === 0) {
      addToast('No KML files could be loaded', 'error');
      return;
    }

    // Run clash detection between new projects
    for (let i = 0; i < newProjects.length; i++) {
      for (let j = i + 1; j < newProjects.length; j++) {
        const a = newProjects[i];
        const b = newProjects[j];
        if (geometriesClash(a.geometry, b.geometry)) {
          if (!a.clash_with) {
            a.clash_with = b.dept;
            a.risk = 'HIGH';
          }
          if (!b.clash_with) {
            b.clash_with = a.dept;
            b.risk = 'HIGH';
          }
        }
      }
    }

    // Create folders from mock data categories
    const newFolders: ProjectFolder[] = MOCK_FOLDERS.map((name) => ({
      id: createFolderId(),
      name,
      expanded: true,
      projectIds: folderMap.get(name) ?? [],
    }));

    setProjects((prev) => [...prev, ...newProjects]);
    setFolders((prev) => [...prev, ...newFolders]);
    setMockLoaded(true);
    addToast(`Loaded ${newProjects.length} mock projects into ${newFolders.length} folders`, 'success');
  }, [mockLoaded, addToast]);

  /* ---- Feature created ---- */
  const onFeatureCreated = useCallback(
    (_layer: L.Layer, geoType: string) => {
      setSaveModal({ open: true, layer: _layer, geoType });
    },
    [],
  );

  /* ---- Save project from modal ---- */
  const handleSaveProject = useCallback(
    (form: ProjectForm) => {
      // Determine geometry: prefer KML, fallback to drawn layer
      let geometry: PriorityProject['geometry'] | null = null;

      if (form.kmlGeometry) {
        geometry = form.kmlGeometry as PriorityProject['geometry'];
      } else if (saveModal.layer) {
        const geo = (
          saveModal.layer as L.Layer & { toGeoJSON(): GeoJSON.Feature }
        ).toGeoJSON();
        geometry = geo.geometry as PriorityProject['geometry'];
      }

      if (!geometry) {
        addToast('No geometry defined — draw on map or import KML', 'error');
        return;
      }

      const newProject: PriorityProject = {
        id: Date.now(),
        dept: form.dept,
        work_type: form.work_type || 'ROAD_PAVING',
        title: form.title,
        start: form.startDate,
        end: form.endDate,
        cost: form.cost,
        risk: 'LOW',
        clash_with: null,
        description: form.description,
        geometry,
        ...(form.manualPriority != null ? { manualPriority: form.manualPriority } : {}),
      };

      // Check for clashes — true spatial proximity check (within 100m)
      const existingClash = projects.find((p) =>
        geometriesClash(p.geometry, newProject.geometry),
      );

      if (existingClash) {
        newProject.clash_with = existingClash.dept;
        newProject.risk = 'HIGH';
        addToast(
          `Clash detected with ${existingClash.dept} project "${existingClash.title}"`,
          'warning',
        );
      }

      setProjects((prev) => [...prev, newProject]);
      // Clear the raw drawn layer — it will be re-rendered with work-type colors
      // by ProjectGeometryLayer
      if (saveModal.layer && featureGroupRef.current) {
        featureGroupRef.current.removeLayer(saveModal.layer);
      }
      setSaveModal({ open: false, layer: null, geoType: '' });
      addToast(`Project "${form.title}" saved`, 'success');
    },
    [saveModal.layer, projects, addToast],
  );

  /* ---- Remove project ---- */
  const removeProject = useCallback(
    (projectId: number) => {
      setProjects((prev) => {
        const target = prev.find((p) => p.id === projectId);
        if (target) {
          addToast(`Removed "${target.title}"`, 'info');
        }
        return prev.filter((p) => p.id !== projectId);
      });
      // Also remove from folders and hidden set
      setFolders((prev) =>
        prev.map((f) => ({
          ...f,
          projectIds: f.projectIds.filter((id) => id !== projectId),
        })),
      );
      setHiddenProjectIds((prev) => {
        const next = new Set(prev);
        next.delete(projectId);
        return next;
      });
    },
    [addToast],
  );

  /* ---- Layer toggle ---- */
  const toggleLayer = useCallback((wtId: string) => {
    setEnabledLayers((prev) => {
      const next = new Set(prev);
      if (next.has(wtId)) next.delete(wtId);
      else next.add(wtId);
      return next;
    });
  }, []);

  /* ---- Export report ---- */
  const exportReport = useCallback(() => {
    if (phases.every((p) => p.projects.length === 0)) {
      addToast('No projects to export', 'info');
      return;
    }
    const lines: string[] = [
      'KARANA PRIORITY EXECUTION REPORT',
      `Generated: ${new Date().toLocaleString()}`,
      `Total Projects: ${projects.length}`,
      `Conflicts: ${clashCount}`,
      '',
    ];
    for (const phase of phases) {
      if (phase.projects.length === 0) continue;
      lines.push(`--- ${phase.phase}: ${phase.label} ---`);
      for (const p of phase.projects) {
        lines.push(
          `  #${p.rank} | ${p.title} (${p.dept}) | Score: ${p.priorityScore} | ${p.work_type}`,
        );
      }
      lines.push('');
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `karana-priority-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Report exported', 'success');
  }, [phases, projects.length, clashCount, addToast]);

  /* ---- Tile config ---- */
  const tile = TILE_LAYERS[tileLayer];

  return (
    <div className="relative h-screen w-full bg-background">
      {/* ======================== TOP BAR ======================== */}
      <div className="absolute top-0 left-0 right-0 z-[1001] h-12 flex items-center gap-2 px-3 bg-background/90 backdrop-blur-sm border-b border-border">
        {/* Left panel hamburger */}
        <button
          onClick={() => setShowLeftPanel((v) => !v)}
          className="p-2 rounded-lg hover:bg-accent transition focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label={showLeftPanel ? 'Hide work layers panel' : 'Show work layers panel'}
          aria-expanded={showLeftPanel}
          title="Work layers"
        >
          {showLeftPanel ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="flex items-center gap-1.5">
          <Layers className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span className="text-sm font-medium text-foreground">Live Map</span>
        </div>

        <div className="flex-1" />

        {/* Stats */}
        {projects.length > 0 && (
          <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
            <span>{projects.length} project{projects.length !== 1 ? 's' : ''}</span>
            {clashCount > 0 && (
              <span className="flex items-center gap-1 text-amber-600">
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                {clashCount} clash{clashCount !== 1 ? 'es' : ''}
              </span>
            )}
          </div>
        )}

        {/* New project button */}
        <button
          onClick={() => setSaveModal({ open: true, layer: null, geoType: '' })}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          title="Create new project"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">New Project</span>
        </button>

        {/* Load mock data */}
        {!mockLoaded && (
          <button
            onClick={loadMockData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-accent transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            title="Load 22 demo Gwalior infrastructure projects"
          >
            <Database className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Mock Data</span>
          </button>
        )}

        {/* Right panel hamburger */}
        <button
          onClick={() => setShowRightPanel((v) => !v)}
          className="p-2 rounded-lg hover:bg-accent transition focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label={showRightPanel ? 'Hide project panel' : 'Show project panel'}
          aria-expanded={showRightPanel}
          title="Project manager"
        >
          {showRightPanel ? <X className="h-5 w-5" /> : <FolderTreeIcon className="h-5 w-5" />}
        </button>
      </div>

      {/* ======================== LEFT PANEL — Work Layers ======================== */}
      {showLeftPanel && (
        <div
          className="absolute top-12 left-0 z-[1000] w-72 bottom-0 bg-background border-r border-border overflow-y-auto"
          role="region"
          aria-label="Work layers panel"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">Work Layers</h2>
              <button
                onClick={() => setShowLeftPanel(false)}
                className="p-1 rounded hover:bg-accent text-muted-foreground"
                aria-label="Close work layers panel"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1">
              {WORK_TYPE_IDS.map((wtId) => {
                const wt = getWorkType(wtId);
                const enabled = enabledLayers.has(wtId);
                const count = projects.filter((p) => p.work_type === wtId).length;

                return (
                  <button
                    key={wtId}
                    onClick={() => toggleLayer(wtId)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition focus:outline-none focus:ring-2 focus:ring-primary ${
                      enabled
                        ? 'bg-accent/50'
                        : 'opacity-50 hover:opacity-75'
                    }`}
                    aria-pressed={enabled}
                    aria-label={`${enabled ? 'Hide' : 'Show'} ${wt.label} layer`}
                  >
                    <span
                      className="flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0"
                      style={{ backgroundColor: wt.color }}
                      aria-hidden="true"
                      dangerouslySetInnerHTML={{
                        __html: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none">${wt.iconSvg}</svg>`,
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {wt.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {wt.layer} &middot; {wt.depts.join(', ')}
                      </p>
                    </div>
                    {count > 0 && (
                      <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend separator */}
            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Layer Classification
              </p>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" aria-hidden="true" />
                  Underground (do first)
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" aria-hidden="true" />
                  Surface (do second)
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" aria-hidden="true" />
                  Road (do last)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================== RIGHT PANEL — Project Manager ======================== */}
      {showRightPanel && (
        <div
          className="absolute top-12 right-0 z-[1000] w-80 bottom-0 bg-background border-l border-border overflow-y-auto"
          role="region"
          aria-label="Project manager panel"
        >
          <div className="p-4 flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">
                Project Manager
              </h2>
              <button
                onClick={() => setShowRightPanel(false)}
                className="p-1 rounded hover:bg-accent text-muted-foreground"
                aria-label="Close project panel"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <FolderTree
              folders={folders}
              ranked={ranked}
              hiddenProjectIds={hiddenProjectIds}
              clashCount={clashCount}
              onFoldersChange={setFolders}
              onToggleProjectVisibility={toggleProjectVisibility}
              onRemoveProject={removeProject}
              onZoomToProject={zoomToProject}
              onAddProject={() =>
                setSaveModal({ open: true, layer: null, geoType: '' })
              }
              onExportReport={exportReport}
            />
          </div>
        </div>
      )}

      {/* ======================== MAP ======================== */}
      <MapContainer
        center={GWALIOR}
        zoom={13}
        zoomControl={false}
        className="h-full w-full"
        style={{ paddingTop: '48px' }}
      >
        <TileLayer url={tile.url} attribution={tile.attr} />

        <MapRefTracker mapRef={mapInstanceRef} />

        <FeatureGroup ref={featureGroupRef}>
          {/* User-drawn GeoJSON features rendered automatically by FeatureGroup */}
        </FeatureGroup>

        <MapToolbar
          featureGroupRef={featureGroupRef}
          tileLayer={tileLayer}
          setTileLayer={setTileLayer}
          onFeatureCreated={onFeatureCreated}
          addToast={addToast}
          leftPanelOpen={showLeftPanel}
        />

        {/* Color-coded project geometry lines/polygons */}
        {visibleProjects.length > 0 && (
          <ProjectGeometryLayer
            projects={visibleProjects}
            enabledLayers={enabledLayers}
          />
        )}

        {/* Clustered work type markers for user-created projects */}
        {visibleProjects.length > 0 && (
          <WorkTypeMarkers
            projects={visibleProjects}
            ranked={ranked}
            enabledLayers={enabledLayers}
          />
        )}
      </MapContainer>

      {/* ======================== MODALS & OVERLAYS ======================== */}
      <SaveProjectModal
        isOpen={saveModal.open}
        geometryType={saveModal.geoType}
        onSave={handleSaveProject}
        onClose={() => setSaveModal({ open: false, layer: null, geoType: '' })}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
