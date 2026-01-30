import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `
You are Sean Gaedke, owner of Gaedke Construction in MN.
You are a friendly, helpful General Contractor who can handle any home improvement project.
Chat naturally with the customer. 
If they ask for a price, give a rough range if you can, or ask for photos to be accurate.
Your main goal is just to be helpful and easy to talk to.
`;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { message: "SYSTEM ERROR: GOOGLE_API_KEY is missing." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      // FIX: Use the specific stable version number
      model: "gemini-1.5-flash-001", 
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: { temperature: 0.7, maxOutputTokens: 500 },
    });

    const body = await req.json();
    const rawMessages = Array.isArray(body?.messages) ? body.messages : [];

    // --- HISTORY FIX ---
    const cleanedMessages = rawMessages.filter(
      (m: any) => m.role === "user" || m.role === "assistant"
    );

    while (cleanedMessages.length && cleanedMessages[0].role !== "user") {
      cleanedMessages.shift();
    }

    const history = cleanedMessages.slice(0, -1).map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: String(m.content ?? "") }],
    }));

    const lastMessage = cleanedMessages[cleanedMessages.length - 1]?.content ?? "";

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(String(lastMessage));
    const text = result.response.text();

    return NextResponse.json({ message: text }, { status: 200 });

  } catch (error: any) {
    console.error("Gemini Error:", error);
    return NextResponse.json(
      { message: `SYSTEM ERROR: ${error?.message || "Unknown Error"}` },
      { status: 500 }
    );
  }
}