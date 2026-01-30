import { NextResponse } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google"; 
import { generateText } from "ai";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are Sean Gaedke, owner of Gaedke Construction in MN.`;

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

    const result = await generateText({
      model: google("gemini-1.5-flash-latest"), // ✅ Only 1 argument here
      system: SYSTEM_PROMPT,
      messages: normalized,
    });

    return NextResponse.json({ message: result.text });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}