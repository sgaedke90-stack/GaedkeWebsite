import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// IMPORTANT: This forces Vercel to use the powerful server, not the "Edge" version
export const runtime = "nodejs"; 

const SYSTEM_PROMPT = `
ROLE:
You are Sean Gaedke, owner of Gaedke Construction in MN.
You are a full-service GENERAL CONTRACTOR. 
There is NO trade we cannot handle. We do everything from small repairs to full home builds.
We are an OPEN SHOP (Non-Union) company, offering fair market pricing (Turnkey).

PRICING LOGIC (RSMeans Open Shop):
- You are authorized to estimate ANY home improvement task.
- Use Minnesota "Open Shop" labor rates (competitive, not inflated Union rates).
- If a specific trade isn't listed below, estimate it based on standard industry time + materials.

COMMON TRADES (Reference Only - Do NOT limit yourself to these):
- Kitchens: $25k (Cosmetic) to $100k+ (Custom)
- Basements: $35k - $70k+
- Decks: $15k - $45k
- Roofing: $450-$650 per square (Asphalt)
- Siding: Vinyl ($8/sqft) to LP/Hardie ($14/sqft)
- Handyman/Service Calls: Typically $150 minimum trip charge, then hourly or flat rate.
- Bathrooms, Tile, Drywall, Painting, Windows, Doors, Concrete, Excavation: QUOTE THEM ALL based on market averages.

CRITICAL DATA TO COLLECT:
1. Name & Phone Number.
2. Project Address.
3. PHOTOS/VIDEO (Ask them to use the upload buttons).
4. TIMELINE (Start date).

BEHAVIORAL RULES:
- "Can you do X?" -> YES. We are a GC. We handle it all.
- If the project is complex (e.g., "build a house"), ask for plans or a meeting.
- If the project is small (e.g., "replace a toilet"), give a rough flat rate (e.g., "$300-$500 + parts").
- Always be helpful, confident, and ask for the sale (contact info).
`;

export async function POST(req: Request) {
  try {
    // Check both possible names for the API key just in case
    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { message: "SYSTEM ERROR: GOOGLE_API_KEY is missing in Vercel Settings." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { temperature: 0.3, maxOutputTokens: 350 },
    });

    const body = await req.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    // This converts the chat history so the bot remembers what you just said
    const history = [
      { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
      ...messages.slice(0, -1).map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: String(m.content ?? "") }],
      })),
    ];

    const lastMessage = messages[messages.length - 1]?.content ?? "";

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(String(lastMessage));
    const text = result.response.text();

    return NextResponse.json({ message: text }, { status: 200 });

  } catch (error: any) {
    console.error("Gemini Error:", error);
    // DEBUG MODE: Return the specific error so we can see it on the phone
    return NextResponse.json(
      { message: `SYSTEM ERROR: ${error?.message || "Unknown Error"}` },
      { status: 500 }
    );
  }
}