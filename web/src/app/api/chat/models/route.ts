import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Missing API Key" }, { status: 500 });

  const endpoints = [
    `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`,
    `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
  ];

  let lastErr: any = null;
  for (const url of endpoints) {
    try {
      const res = await fetch(url);
      const text = await res.text();
      const contentType = res.headers.get("content-type") || "";
      if (!res.ok) {
        lastErr = { status: res.status, body: text, url };
        continue;
      }
      const json = contentType.includes("application/json") ? JSON.parse(text) : { data: text };
      return NextResponse.json({ url, data: json });
    } catch (err: any) {
      lastErr = err;
    }
  }

  return NextResponse.json({ error: lastErr }, { status: 500 });
}
