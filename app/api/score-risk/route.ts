import { scoreRisk } from '@/lib/groq';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await scoreRisk(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Risk scoring error:', error);
    return NextResponse.json({ 
      error: 'Failed to score risk',
      waste_inr: 1500000,
      risk_score: 8,
      recommendation: 'merge'
    }, { status: 500 });
  }
}
