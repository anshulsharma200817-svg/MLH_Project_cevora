import { getAiMonitoringInsights } from '@/lib/gemini';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await getAiMonitoringInsights(body);
    return NextResponse.json({ result });
  } catch (error) {
    console.error('AI monitoring error:', error);
    return NextResponse.json({ error: 'Failed to generate monitoring insights' }, { status: 500 });
  }
}
