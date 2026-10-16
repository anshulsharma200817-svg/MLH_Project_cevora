import { getAiCoordinationPlan } from '@/lib/gemini';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await getAiCoordinationPlan(body);
    return NextResponse.json({ result });
  } catch (error) {
    console.error('AI coordination error:', error);
    return NextResponse.json({ error: 'Failed to generate coordination plan' }, { status: 500 });
  }
}
