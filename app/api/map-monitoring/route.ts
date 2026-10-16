import { getMapMonitoringInsights } from '@/lib/gemma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await getMapMonitoringInsights(body);
    return NextResponse.json({ result });
  } catch (error) {
    console.error('Map monitoring error:', error);
    return NextResponse.json({ error: 'Failed to generate map monitoring insights' }, { status: 500 });
  }
}
