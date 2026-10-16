import { getAiDecision } from '@/lib/gemini';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await getAiDecision(body);
    return NextResponse.json({ result });
  } catch (error) {
    console.error('AI decision error:', error);
    return NextResponse.json({ error: 'Failed to generate AI decision' }, { status: 500 });
  }
}
