import { getMapLayoutRecommendations } from '@/lib/gemini';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await getMapLayoutRecommendations(body);
    return NextResponse.json({ result });
  } catch (error) {
    console.error('Map layouting error:', error);
    return NextResponse.json({ error: 'Failed to generate map layout recommendations' }, { status: 500 });
  }
}
