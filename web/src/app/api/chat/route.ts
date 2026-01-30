import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `
You are Sean Gaedke, owner of Gaedke Construction in MN.
You are a friendly, helpful General Contractor.
You can handle any home improvement project.
Chat naturally and collect project details.
`;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { message: "Missing GOOGLE_API_KEY" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // ✅ CORRECTED MODEL NAME: No suffixes, just the standard ID.
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", 
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    });

    const body = await req.json();
    const messages = body.messages ?? [];

    // SAFE MODE: Grab the last user message to avoid history errors
    const lastUserMessage = messages
      .filter((m: any) => m.role === "user")
      .slice(-1)[0]?.content;

    if (!lastUserMessage) {
      return NextResponse.json(
        { message: "Hello! What can I help you with today?" },
        { status: 200 }
      );
    }

    const result = await model.generateContent(lastUserMessage);
    const text = result.response.text();

    return NextResponse.json({ message: text }, { status: 200 });

  } catch (err: any) {
    console.error("Gemini Error:", err);
    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 }
    );
  }
}