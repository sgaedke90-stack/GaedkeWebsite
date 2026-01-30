import { NextResponse } from 'next/server';
import { sendLead } from '../../../../src/lib/sendLead';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const summary = String(body?.summary || '');
    const transcript = String(body?.transcript || '');
    const model = body?.model;
    const source = body?.source || 'manual-test';

    if (!summary && !transcript) {
      return NextResponse.json({ error: 'Missing summary or transcript' }, { status: 400 });
    }

    try {
      await sendLead({ summary, transcript, model, source });
      return NextResponse.json({ ok: true });
    } catch (err: any) {
      return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
