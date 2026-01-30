import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

export type LeadPayload = {
  summary: string;
  transcript: string;
  model?: string;
  source?: string;
};

const LOG_DIR = path.resolve(process.cwd(), 'web', 'data');
const LOG_FILE = path.join(LOG_DIR, 'quote-log.jsonl');

function ensureLogDir() {
  try {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  } catch (err) {
    // ignore
  }
}

async function sendEmailSMTP(to: string, subject: string, body: string) {
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

  return info;
}

export async function sendLead(payload: LeadPayload) {
  const to = process.env.LEAD_EMAIL_TO || 'Sgaedke90@gmail.com';
  const subject = `New Smart Quote from Website (${new Date().toISOString()})`;
  const body = `${payload.summary}\n\n${payload.transcript}\n\nModel: ${payload.model || 'unknown'}\nSource: ${payload.source || 'web'}`;

  const timestamp = new Date().toISOString();
  ensureLogDir();

  const logEntry: any = {
    timestamp,
    to,
    subject,
    model: payload.model || null,
    source: payload.source || null,
    summary: payload.summary,
    transcript: payload.transcript,
    ok: false,
    error: null,
  };

  try {
    const info = await sendEmailSMTP(to, subject, body);
    logEntry.ok = true;
    logEntry.info = { messageId: (info as any).messageId };
  } catch (err: any) {
    logEntry.ok = false;
    logEntry.error = String(err?.message ?? err);
  }

  // Append to log file as JSONL
  try {
    fs.appendFileSync(LOG_FILE, JSON.stringify(logEntry) + '\n');
  } catch (err) {
    // If file write fails, preserve in-memory (but do not throw)
    console.error('Failed to write lead log:', err);
  }

  if (!logEntry.ok) throw new Error(logEntry.error || 'Failed to send lead email');

  return { ok: true };
}
