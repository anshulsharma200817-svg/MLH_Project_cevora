interface Project {
  id: number;
  dept: string;
  title: string;
  start: string;
  end: string;
  cost: number;
  risk: string;
  clash_with: string | null;
  description: string;
  geometry: {
    type: string;
    coordinates: number[][];
  };
}

interface Clash {
  id: number;
  dept: string;
  title: string;
  cost: number;
  risk: string;
  overlapScore: number;
}

export function getBBox(coordinates: number[][]): [number, number, number, number] {
  const lngs = coordinates.map(coord => coord[0]);
  const lats = coordinates.map(coord => coord[1]);
  return [Math.min(...lngs), Math.min(...lats), Math.max(...lngs), Math.max(...lats)];
}

export function bboxesOverlap(
  bbox1: [number, number, number, number],
  bbox2: [number, number, number, number]
): boolean {
  const [minLng1, minLat1, maxLng1, maxLat1] = bbox1;
  const [minLng2, minLat2, maxLng2, maxLat2] = bbox2;
  return !(maxLng1 < minLng2 || maxLng2 < minLng1 || maxLat1 < minLat2 || maxLat2 < minLat1);
}

export function dateRangesOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  const s1 = new Date(start1);
  const e1 = new Date(end1);
  const s2 = new Date(start2);
  const e2 = new Date(end2);
  return !(e1 < s2 || e2 < s1);
}

export function detectClashes(newProject: Project, existingProjects: Project[]): Clash[] {
  const clashes: Clash[] = [];
  const newBBox = getBBox(newProject.geometry.coordinates);

  for (const project of existingProjects) {
    if (project.id === newProject.id) continue;

    const projectBBox = getBBox(project.geometry.coordinates);

    // Check both spatial and temporal overlap
    if (bboxesOverlap(newBBox, projectBBox) && 
        dateRangesOverlap(newProject.start, newProject.end, project.start, project.end)) {
      clashes.push({
        id: project.id,
        dept: project.dept,
        title: project.title,
        cost: project.cost,
        risk: project.risk,
        overlapScore: 0.85 // Simplified scoring
      });
    }
  }

  return clashes;
}
