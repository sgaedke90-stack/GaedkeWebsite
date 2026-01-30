import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are Sean Gaedke, owner of Gaedke Construction in MN.`;

const MODEL_FALLBACKS = [
  "gemini-3-flash-preview",
  "gemini-1.5-flash-latest",
  "gemini-1.5",
  "gemini-1.0",
  "gemini-1.5-pro",
  "chat-bison",
  "text-bison",
];

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Missing API Key" }, { status: 500 });

    const ai = new GoogleGenAI({ apiKey });

    const body = await req.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    type ChatMessage = { role: string; content: string };
    const normalized: ChatMessage[] = messages.map((m: any) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content),
    }));

    // Compose a single content string for generateContent
    const contents = [SYSTEM_PROMPT, ...normalized.map((m: ChatMessage) => `${m.role.toUpperCase()}: ${m.content}`)].join("\n\n");

    let lastError: any = null;
    for (const modelId of MODEL_FALLBACKS) {
      try {
        const result = await ai.models.generateContent({
          model: modelId,
          contents,
        });

        // Robust extraction of returned text (handle different response shapes)
        const text = (result as any).text ?? (result as any).output?.[0]?.content?.[0]?.text ?? JSON.stringify(result);

        // Detect whether this response looks like a finished quote so clients can trigger email sends
        const quoteIndicatorRegex = /(\$\s*\d{1,3}[\d,\.]*|\b(total|estimate|quotation|quote|subtotal|grand total|price|estimated)\b)/i;
        const quoteComplete = quoteIndicatorRegex.test(String(text));

        return NextResponse.json({ message: text, model: modelId, quoteComplete });
      } catch (err: any) {
        lastError = err;
        const msg = String(err?.message || "").toLowerCase();
        if (msg.includes("not found") || msg.includes("not supported") || msg.includes("generatecontent")) {
          continue;
        }
        throw err;
      }
    }

    return NextResponse.json({ error: lastError?.message || "No available model" }, { status: 500 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}