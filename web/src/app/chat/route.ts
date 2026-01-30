import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Brain
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

const SYSTEM_PROMPT = `
ROLE:
You are Sean Gaedke, owner of Gaedke Construction in MN.
We are an OPEN SHOP (Non-Union) General Contractor.
We provide high-quality work at fair market rates, not inflated Union pricing.

CRITICAL DATA TO COLLECT (The "Big 4"):
Before the conversation ends, you MUST try to get:
1. Full Name & Phone Number.
2. Project Address (or at least City).
3. PHOTOS/VIDEO (Ask them to click the Paperclip icon).
4. START DATE (Ask: "Are you looking to start immediately, in a few months, or just planning for next year?").

PRICING DATA SOURCE (SIMULATED):
- Base your logic on "RSMeans Residential" data for Minnesota.
- Use "Open Shop" (Non-Union) labor rates.
- Factor in a standard GC margin implicitly (Turnkey Pricing).

STRICT PRICING GUARDRAILS (MN Open Shop Market):
- Kitchens: Cosmetic $25k+ | Full Custom $60k-$100k+
- Basements: Finish $35k+ | Luxury $70k+
- Decks: Pressure Treated $15k+ | Composite $25k-$45k
- Roofing: Asphalt Shingles range $450 - $650 per square (100 sq ft) installed.
- Siding: Vinyl ~$8/sqft | LP/Hardie ~$14/sqft
- Flooring: Carpet $5-$8/sqft | LVP $10-$16/sqft (Installed)

BEHAVIORAL RULES:
1. PUSH FOR MEDIA: "To give you a tighter number, I really need to see the space. Can you tap the paperclip and send a quick video or photo?"
2. CONTACT INFO: If they ask for a firm price, say: "I can write up a formal quote. What is the best email and phone number to reach you at?"
3. NO "UNION" TALK: If asked, say "We are an Open Shop company, which keeps our pricing competitive."
4. LIABILITY SHIELD: Always end with "This is a rough range based on MN averages. Site conditions determine final bid."

TONE:
Professional, knowledgeable, slightly informal (like a text).
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    // "temperature: 0.25" makes the AI very strict and accurate (not creative)
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
            temperature: 0.25, 
            maxOutputTokens: 250,
        }
    });

    const prompt = `${SYSTEM_PROMPT}\n\nUSER MESSAGE: ${lastMessage}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ message: text });

  } catch (error) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ message: "I'm having trouble connecting right now. Please text Sean at (763) 318-0605." });
  }
}