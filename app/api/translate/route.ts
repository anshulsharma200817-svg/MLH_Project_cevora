import { translateText } from '@/lib/translation';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { q, source, target } = body || {};

    if (!q || !source || !target) {
      return NextResponse.json({ error: 'q, source, and target are required' }, { status: 400 });
    }

    const result = await translateText({ text: q, source, target });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: 'Failed to translate text' }, { status: 500 });
  }
}
