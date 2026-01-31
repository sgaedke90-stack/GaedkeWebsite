import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

export interface LeadPayload {
  readonly summary: string;
  readonly transcript: string;
  readonly model?: string;
  readonly source?: string;
}

const LOG_DIR = path.resolve(process.cwd(), 'web', 'data');
const LOG_FILE = path.join(LOG_DIR, 'quote-log.jsonl');

const ensureLogDir = (): void => {
  try {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  } catch {
    // Ignore directory creation errors
  }
};

interface SendMailResult {
  readonly messageId?: string;
}

interface LogEntry {
  readonly timestamp: string;
  readonly to: string;
  readonly subject: string;
  readonly model: string | null;
  readonly source: string | null;
  readonly summary: string;
  readonly transcript: string;
  readonly ok: boolean;
  readonly error?: string;
  readonly info?: SendMailResult;
}

const sendEmailSMTP = async (to: string, subject: string, body: string): Promise<SendMailResult> => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error('SMTP credentials missing (SMTP_HOST, SMTP_USER, SMTP_PASS)');
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const info = await transporter.sendMail({
    from: `${process.env.EMAIL_FROM_NAME || 'Gaedke Construction'} <${user}>`,
    to,
    subject,
    text: body,
  });

  return { messageId: (info as SendMailResult).messageId };
};

export const sendLead = async (payload: LeadPayload): Promise<{ readonly ok: true }> => {
  const to = process.env.LEAD_EMAIL_TO || 'Sgaedke90@gmail.com';
  const subject = `New Smart Quote from Website (${new Date().toISOString()})`;
  const body = `${payload.summary}\n\n${payload.transcript}\n\nModel: ${payload.model || 'unknown'}\nSource: ${payload.source || 'web'}`;

  const timestamp = new Date().toISOString();
  ensureLogDir();

  const logEntry: LogEntry = {
    timestamp,
    to,
    subject,
    model: payload.model || null,
    source: payload.source || null,
    summary: payload.summary,
    transcript: payload.transcript,
    ok: false,
  };

  try {
    const info = await sendEmailSMTP(to, subject, body);
    const successEntry: LogEntry = { ...logEntry, ok: true, info };
    fs.appendFileSync(LOG_FILE, JSON.stringify(successEntry) + '\n');
    return { ok: true };
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : String(err);
    const failureEntry: LogEntry = { ...logEntry, ok: false, error };

    try {
      fs.appendFileSync(LOG_FILE, JSON.stringify(failureEntry) + '\n');
    } catch (logErr) {
      console.error('Failed to write lead log:', logErr);
    }

    throw new Error(error || 'Failed to send lead email');
  }
};
