import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

interface AnalyticsEvent {
  readonly timestamp: string;
  readonly event: string;
  readonly data: Record<string, unknown>;
  readonly session?: string;
}

interface AnalyticsRequest {
  readonly event: string;
  readonly data?: Record<string, unknown>;
  readonly session?: string;
}

const ANALYTICS_DIR = path.resolve(process.cwd(), 'web', 'data');
const ANALYTICS_FILE = path.join(ANALYTICS_DIR, 'analytics.jsonl');

const ensureDir = (): void => {
  try {
    fs.mkdirSync(ANALYTICS_DIR, { recursive: true });
  } catch {
    // Ignore
  }
};

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = (await req.json()) as AnalyticsRequest;
    const { event, data = {}, session } = body;

    if (!event) {
      return NextResponse.json(
        { error: 'Missing event name' },
        { status: 400 }
      );
    }

    const analyticsEvent: AnalyticsEvent = {
      timestamp: new Date().toISOString(),
      event,
      data,
      session,
    };

    ensureDir();

    // Append to JSONL file (non-blocking)
    fs.appendFileSync(ANALYTICS_FILE, JSON.stringify(analyticsEvent) + '\n');

    return NextResponse.json({ ok: true, logged: true });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : String(err);
    console.error('Analytics logging error:', error);
    // Don't fail the request - just log the error
    return NextResponse.json({ ok: true, logged: false, note: 'Logging failed silently' });
  }
}

/**
 * GET endpoint to retrieve analytics (optional admin view)
 * Can be extended to require authentication
 */
export async function GET(): Promise<NextResponse> {
  try {
    if (!fs.existsSync(ANALYTICS_FILE)) {
      return NextResponse.json({ events: [], count: 0 });
    }

    const fileContent = fs.readFileSync(ANALYTICS_FILE, 'utf-8');
    const events = fileContent
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      })
      .filter((event): event is AnalyticsEvent => event !== null);

    return NextResponse.json({ events, count: events.length });
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error },
      { status: 500 }
    );
  }
}
