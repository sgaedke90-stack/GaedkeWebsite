import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Force Node.js runtime
export const runtime = "nodejs"; 

// --- MINIMAL BRAIN (No Rules) ---
const SYSTEM_PROMPT = `
You are Sean Gaedke, owner of Gaedke Construction in MN.
You are a general contractor who can handle any home improvement project.
Be friendly, helpful, and answer the customer's questions naturally.
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
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT, 
      generationConfig: { temperature: 0.7, maxOutputTokens: 500 }, // Raised temp for more creativity
    });

    const body = await req.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    // Clean history handling
    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: String(m.content ?? "") }],
    }));

    const lastMessage = messages[messages.length - 1]?.content ?? "";

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