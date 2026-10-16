import { generateNIT } from '@/lib/groq';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projects } = body;

    if (!Array.isArray(projects) || projects.length === 0) {
      return NextResponse.json(
        { error: 'Projects array is required' },
        { status: 400 }
      );
    }

    const nitContent = await generateNIT(projects);

    return NextResponse.json({
      nit: nitContent,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('NIT generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate NIT' },
      { status: 500 }
    );
  }
}
