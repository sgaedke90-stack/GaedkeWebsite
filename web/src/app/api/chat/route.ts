import { NextResponse } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google"; 
import { generateText } from "ai";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are Sean Gaedke, owner of Gaedke Construction in MN.`;

const GOOGLE_MODEL_FALLBACKS = [
  "gemini-1.5-flash-latest",
  "gemini-1.5",
  "gemini-1.0",
];

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Missing API Key" }, { status: 500 });

    // ✅ This factory pattern fixes the "Expected 1 arguments" error
    const google = createGoogleGenerativeAI({ apiKey });

    const body = await req.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const normalized = messages.map((m: any) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content),
    }));

    // Try a few model ids in order until one works in the current environment
    let lastError: any = null;
    for (const modelId of GOOGLE_MODEL_FALLBACKS) {
      try {
        const result = await generateText({
          model: google(modelId),
          system: SYSTEM_PROMPT,
          messages: normalized,
        });
        return NextResponse.json({ message: result.text, model: modelId });
      } catch (err: any) {
        lastError = err;
        // If it looks like the model isn't available, try the next one
        const msg = String(err?.message || "").toLowerCase();
        if (msg.includes("not found") || msg.includes("not supported") || msg.includes("generatecontent")) {
          continue;
        }
        // Unknown error — rethrow
        throw err;
      }
    }

    return NextResponse.json({ error: lastError?.message || "No available model" }, { status: 500 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}