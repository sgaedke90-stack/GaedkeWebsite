import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- SYSTEM CONFIGURATION ---
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
    // 1. SECURITY CHECK: Ensure API Key exists
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ message: "SYSTEM ERROR: GOOGLE_API_KEY is missing in Vercel Settings." });
    }

    // 2. CONNECT TO GOOGLE
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
            temperature: 0.3, // Low creativity = High accuracy for pricing
            maxOutputTokens: 300,
        }
    });

    // 3. PROCESS CONVERSATION
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    // 4. GENERATE ANSWER
    const prompt = `${SYSTEM_PROMPT}\n\nUSER MESSAGE: ${lastMessage}`;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ message: text });

  } catch (error: any) {
    console.error("Gemini Error:", error);
    // DEBUG MESSAGE: This will tell us exactly what is wrong on your phone screen
    return NextResponse.json({ message: `SYSTEM ERROR: ${error.message || "Unknown Error"}` });
  }
}