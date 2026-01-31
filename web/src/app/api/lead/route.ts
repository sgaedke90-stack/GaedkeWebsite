import { NextResponse } from "next/server";
import { sendLead } from "../../../../src/lib/sendLead";

export const runtime = "nodejs";

interface LeadRequest {
  readonly summary?: string;
  readonly transcript?: string;
  readonly model?: string;
  readonly source?: string;
}

interface LeadResponse {
  readonly ok?: boolean;
  readonly error?: string;
}

export async function POST(req: Request): Promise<NextResponse<LeadResponse>> {
  try {
    const body = (await req.json()) as LeadRequest;
    const summary = String(body?.summary ?? "");
    const transcript = String(body?.transcript ?? "");
    const model = body?.model;
    const source = body?.source ?? "manual-test";

    if (!summary && !transcript) {
      return NextResponse.json(
        { error: "Missing summary or transcript" },
        { status: 400 }
      );
    }

    try {
      await sendLead({ summary, transcript, model, source });
      return NextResponse.json({ ok: true });
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : String(err);
      return NextResponse.json({ ok: false, error }, { status: 500 });
    }
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error }, { status: 500 });
  }
}
