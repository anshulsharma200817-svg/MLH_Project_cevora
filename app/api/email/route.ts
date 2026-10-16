import { NextRequest, NextResponse } from 'next/server';

type EmailBody = {
  subject?: string;
  html?: string;
  text?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as EmailBody;
    const subject = body?.subject?.trim();
    const html = body?.html?.trim();
    const text = body?.text?.trim();

    if (!subject || (!html && !text)) {
      return NextResponse.json({ error: 'subject and html/text are required' }, { status: 400 });
    }

    const provider = (process.env.EMAIL_PROVIDER || 'resend').toLowerCase();

    if (provider !== 'resend') {
      return NextResponse.json({ status: 'skipped', reason: 'Email provider not configured' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;
    const to = process.env.EMAIL_TO;

    if (!apiKey || !from || !to) {
      return NextResponse.json({ status: 'skipped', reason: 'Email env missing' });
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
        text,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ status: 'failed' }, { status: 502 });
    }

    return NextResponse.json({ status: 'sent' });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ status: 'failed' }, { status: 500 });
  }
}
