import mockProjects from '@/data/mockProjects.json';
import { detectClashes } from '@/lib/clashEngine';
import { NextRequest, NextResponse } from 'next/server';

interface Project {
  id?: number;
  type: string;
  properties: {
    id: number;
    dept: string;
    title: string;
    start: string;
    end: string;
    cost: number;
    risk: string;
    clash_with: string | null;
    description: string;
  };
  geometry: {
    type: string;
    coordinates: number[][];
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newProject = body as Project;

    // Convert GeoJSON features to project format
    const projects = (mockProjects as any).features.map((feature: any) => ({
      ...feature.properties,
      geometry: feature.geometry,
    }));

    // Detect clashes
    const projectWithClashes = {
      ...newProject.properties,
      geometry: newProject.geometry,
    };

    const clashes = detectClashes(projectWithClashes, projects);

    return NextResponse.json({
      projectId: newProject.properties.id,
      clashes,
      clashCount: clashes.length,
      totalWasteRisk: clashes.reduce((sum, c) => sum + (c.cost * 0.2), 0),
    });
  } catch (error) {
    console.error('Clash detection error:', error);
    return NextResponse.json({ error: 'Failed to detect clashes' }, { status: 500 });
  }
}
