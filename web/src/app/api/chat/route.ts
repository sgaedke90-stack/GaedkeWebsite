import { NextResponse } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google"; // Updated import
import { generateText } from "ai";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `
You are Sean Gaedke, owner of Gaedke Construction in MN.
You are a friendly, helpful General Contractor.
If they ask for pricing, give a rough range or ask for photos.
`;

export async function POST(req: Request) {
  try {
    const apiKey =
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GOOGLE_GENERATIVE_AI_API_KEY" },
        { status: 500 }
      );
    }

    // ✅ FIX: Create the provider factory first
  const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

    const body = await req.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    const normalized = messages
      .filter((m: any) => m?.role && m?.content)
      .map((m: any) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content),
      }));

    while (normalized.length && normalized[0].role !== "user") {
      normalized.shift();
    }

    if (!normalized.length) {
      normalized.push({ role: "user", content: "Hello" });
    }

    // ✅ FIX: model now only takes the string name
    const result = await generateText({
      model: google("gemini-1.5-flash-latest"),
      system: SYSTEM_PROMPT,
      messages: normalized,
    });

    return NextResponse.json({ message: result.text });
  } catch (err: any) {
    console.error("Chat API Error:", err);
    return NextResponse.json(
      { error: err.message || "Internal error" },
      { status: 500 }
    );
  }
}