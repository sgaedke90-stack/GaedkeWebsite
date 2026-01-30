import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs"; 

const SYSTEM_PROMPT = `
You are Sean Gaedke, owner of Gaedke Construction in MN.
You are a friendly, helpful General Contractor.
Chat naturally. If asked for a price, give a rough range or ask for photos.
Be helpful and easy to talk to.
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
      generationConfig: { temperature: 0.7, maxOutputTokens: 500 }, 
    });

    const body = await req.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    // --- CRASH FIX START ---
    // 1. Separate the "history" from the "current message"
    let historyMessages = messages.slice(0, -1);

    // 2. Remove any "assistant" messages from the start of the history
    // (Gemini crashes if the very first history item is 'model')
    while (historyMessages.length > 0 && historyMessages[0].role === 'assistant') {
        historyMessages.shift();
    }

    // 3. Format strictly for Gemini
    const history = historyMessages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: String(m.content ?? "") }],
    }));
    // --- CRASH FIX END ---

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