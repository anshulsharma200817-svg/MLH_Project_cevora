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

/** Fraction (0-1) of the two bounding boxes that overlap. */
export function bboxOverlapRatio(
  bbox1: [number, number, number, number],
  bbox2: [number, number, number, number]
): number {
  const [minLng1, minLat1, maxLng1, maxLat1] = bbox1;
  const [minLng2, minLat2, maxLng2, maxLat2] = bbox2;

  const intersectionWidth = Math.max(
    0,
    Math.min(maxLng1, maxLng2) - Math.max(minLng1, minLng2),
  );
  const intersectionHeight = Math.max(
    0,
    Math.min(maxLat1, maxLat2) - Math.max(minLat1, minLat2),
  );
  if (intersectionWidth <= 0 || intersectionHeight <= 0) {
    return 0;
  }

  const intersection = intersectionWidth * intersectionHeight;
  const area1 = (maxLng1 - minLng1) * (maxLat1 - minLat1);
  const area2 = (maxLng2 - minLng2) * (maxLat2 - minLat2);
  const union = area1 + area2 - intersection;
  return union > 0 ? intersection / union : 0;
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

  // Guard against missing/unparsable dates — they must never look like an overlap.
  if (
    isNaN(s1.getTime()) || isNaN(e1.getTime()) ||
    isNaN(s2.getTime()) || isNaN(e2.getTime())
  ) {
    return false;
  }

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
        overlapScore: bboxOverlapRatio(newBBox, projectBBox),
      });
    }
  }

  return clashes;
}
