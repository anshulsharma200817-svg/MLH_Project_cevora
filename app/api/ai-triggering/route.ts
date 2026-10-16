import { getAiTriggeringResponse } from '@/lib/gemini';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await getAiTriggeringResponse(body);
    return NextResponse.json({ result });
  } catch (error) {
    console.error('AI triggering error:', error);
    return NextResponse.json({ error: 'Failed to generate triggering response' }, { status: 500 });
  }
}
