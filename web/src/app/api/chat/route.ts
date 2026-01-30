import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `
You are Sean Gaedke, owner of Gaedke Construction in Minnesota.
You are friendly, professional, and helpful.
Answer clearly and naturally like a real contractor.
`;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GOOGLE_API_KEY" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const messages = body.messages || [];

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", 
      systemInstruction: SYSTEM_PROMPT,
    });

    // SIMPLIFIED: Just grab the last message to avoid "Role Order" crashes.
    const lastUserMessage = messages[messages.length - 1]?.content ?? "";

    const result = await model.generateContent(lastUserMessage);
    const text = result.response.text();

    return NextResponse.json({ message: text });

  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal error" },
      { status: 500 }
    );
  }
}