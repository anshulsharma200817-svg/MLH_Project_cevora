import { NextRequest, NextResponse } from 'next/server';

type NotifyBody = {
  message?: string;
  topic?: string;
};

const isValidTopic = (value: string) => /^[a-zA-Z0-9_-]{3,64}$/.test(value);

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as NotifyBody;
    const message = body?.message?.trim();
    if (!message) {
      return NextResponse.json({ error: 'message is required' }, { status: 400 });
    }

    const server = (process.env.NTFY_SERVER || 'https://ntfy.sh').replace(/\/$/, '');
    const envTopic = process.env.NTFY_TOPIC || '';
    const topic = envTopic || body.topic || '';

    if (!topic || !isValidTopic(topic)) {
      return NextResponse.json({
        status: 'skipped',
        reason: 'Notification topic not configured',
      });
    }

    const response = await fetch(`${server}/${topic}`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: message,
    });

    if (!response.ok) {
      return NextResponse.json({ status: 'failed' }, { status: 502 });
    }

    return NextResponse.json({ status: 'sent' });
  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json({ status: 'failed' }, { status: 500 });
  }
}
