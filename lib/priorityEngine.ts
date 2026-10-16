/**
 * KARANA PRIORITY ENGINE
 *
 * Core principle: Underground work MUST precede surface work.
 * Surface work MUST precede road paving.
 * Emergency repairs (POTHOLE_REPAIR) bypass the normal queue.
 *
 * Score = 0-10, higher = do THIS FIRST.
 */

// Work type dependency ordering is defined inline below

// ── Public types ──────────────────────────────────────────────────────────────

export interface PriorityProject {
  id: number;
  dept: string;
  work_type: string;
  title: string;
  start: string;
  end: string;
  cost: number;
  risk: string;
  clash_with: string | null;
  description?: string;
  geometry: { type: string; coordinates: number[][] | number[] };
}

export interface RankedProject extends PriorityProject {
  priorityScore: number;
  rank: number;
}

export interface Phase {
  phase: string;
  label: string;
  projects: RankedProject[];
}

// ── Dependency chain ──────────────────────────────────────────────────────────

const DEPENDENCY_ORDER: Record<string, number> = {
  SEWER: 1,
  WATER_SUPPLY: 2,
  ELECTRICAL: 3,
  TELECOM: 4,
  STREET_LIGHT: 5,
  FOOTPATH: 6,
  ROAD_PAVING: 7,
  POTHOLE_REPAIR: 0, // emergency — immediate
};

// ── Weight factors ────────────────────────────────────────────────────────────

const WEIGHTS = {
  dependency: 0.4,
  clashRisk: 0.25,
  costImpact: 0.15,
  timeline: 0.1,
  deptWait: 0.1,
} as const;

// ── Scoring ───────────────────────────────────────────────────────────────────

export function calculatePriorityScore(
  project: PriorityProject,
  allProjects: PriorityProject[],
): number {
  // Emergency override
  if (project.work_type === 'POTHOLE_REPAIR') return 10;

  // 1. Dependency-based score (lower dep order = more urgent → higher score)
  const depOrder = DEPENDENCY_ORDER[project.work_type] ?? 5;
  const depScore = depOrder / 8; // normalised 0–1

  // 2. Clash-risk score
  const riskScore =
    project.risk === 'HIGH' ? 1.0 : project.risk === 'MEDIUM' ? 0.5 : 0.1;

  // 3. Cost impact (normalised against dataset max)
  const maxCost = Math.max(...allProjects.map((p) => p.cost), 1);
  const costScore = project.cost / maxCost;

  // 4. Timeline urgency — closer start date = more urgent
  const daysUntilStart = Math.max(
    0,
    (new Date(project.start).getTime() - Date.now()) / 86_400_000,
  );
  const timelineScore = 1 / (1 + daysUntilStart / 30);

  // 5. Clash penalty — if this project's dep order is *after* the clashing one,
  //    it needs to be bumped (it may be blocking the other)
  let clashPenalty = 0;
  if (project.clash_with) {
    // Find clashing project's work_type dep order
    const clashingProject = allProjects.find(
      (p) => p.dept === project.clash_with || p.title === project.clash_with,
    );
    if (clashingProject) {
      const clashOrder = DEPENDENCY_ORDER[clashingProject.work_type] ?? 5;
      clashPenalty = depOrder > clashOrder ? 0.8 : 0.2;
    }
  }

  const rawScore =
    ((1 - depScore) * WEIGHTS.dependency +
      riskScore * WEIGHTS.clashRisk +
      costScore * WEIGHTS.costImpact +
      timelineScore * WEIGHTS.timeline +
      clashPenalty * WEIGHTS.deptWait) *
    10;

  return parseFloat(rawScore.toFixed(2));
}

// ── Ranking ───────────────────────────────────────────────────────────────────

export function rankProjects(projects: PriorityProject[]): RankedProject[] {
  const scored = projects.map((p) => ({
    ...p,
    priorityScore: calculatePriorityScore(p, projects),
    rank: 0,
  }));

  scored.sort((a, b) => b.priorityScore - a.priorityScore);
  scored.forEach((p, i) => {
    p.rank = i + 1;
  });

  return scored;
}

// ── Phased execution order ────────────────────────────────────────────────────

export function getSequenceOrder(projects: PriorityProject[]): Phase[] {
  const ranked = rankProjects(projects);

  return [
    {
      phase: 'PHASE 1',
      label: 'Do First — Underground Work',
      projects: ranked.filter((p) =>
        ['SEWER', 'WATER_SUPPLY', 'ELECTRICAL', 'TELECOM'].includes(p.work_type),
      ),
    },
    {
      phase: 'PHASE 2',
      label: 'Do Second — Surface Work',
      projects: ranked.filter((p) =>
        ['STREET_LIGHT', 'FOOTPATH'].includes(p.work_type),
      ),
    },
    {
      phase: 'PHASE 3',
      label: 'Do Last — Road Sealing',
      projects: ranked.filter((p) => p.work_type === 'ROAD_PAVING'),
    },
    {
      phase: 'EMERGENCY',
      label: 'Emergency — Immediate',
      projects: ranked.filter((p) => p.work_type === 'POTHOLE_REPAIR'),
    },
  ];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Get the midpoint of a LineString or return the Point itself.
 * Returns [lat, lng] for Leaflet consumption.
 */
export function getGeometryCenter(
  geometry: { type: string; coordinates: number[][] | number[] },
): [number, number] {
  if (geometry.type === 'Point') {
    const c = geometry.coordinates as number[];
    return [c[1], c[0]]; // [lat, lng]
  }
  // LineString or Polygon exterior ring
  const coords = geometry.coordinates as number[][];
  if (coords.length === 0) return [0, 0];
  const mid = Math.floor(coords.length / 2);
  return [coords[mid][1], coords[mid][0]]; // [lat, lng]
}

/** Phase colour for badges */
export function phaseColor(phase: string): string {
  switch (phase) {
    case 'PHASE 1':
      return '#DC2626';
    case 'PHASE 2':
      return '#D97706';
    case 'PHASE 3':
      return '#16A34A';
    case 'EMERGENCY':
      return '#7C3AED';
    default:
      return '#6B7280';
  }
}
