import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";

const SYSTEM_PROMPT = "You are Sean Gaedke, owner of Gaedke Construction in MN.";

const MODEL_FALLBACKS = [
  "gemini-3-flash-preview",
  "gemini-1.5-flash-latest",
  "gemini-1.5",
  "gemini-1.0",
  "gemini-1.5-pro",
  "chat-bison",
  "text-bison",
] as const;

interface ChatMessage {
  readonly role: "assistant" | "user";
  readonly content: string;
}

interface ChatResponse {
  readonly message?: string;
  readonly model?: string;
  readonly quoteComplete?: boolean;
  readonly leadSent?: boolean;
  readonly leadError?: string;
  readonly error?: string;
}

export async function POST(req: Request): Promise<NextResponse<ChatResponse>> {
  try {
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing API Key" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const body = (await req.json()) as { messages?: unknown };
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    const normalized: ChatMessage[] = (messages as unknown[]).map(
      (m: unknown) => {
        const msg = m as { role?: string; content?: string };
        const role = msg.role === "assistant" ? "assistant" : "user";
        return {
          role,
          content: String(msg.content ?? ""),
        };
      }
    );

    const contents = [
      SYSTEM_PROMPT,
      ...normalized.map((m) => `${m.role.toUpperCase()}: ${m.content}`),
    ].join("\n\n");

    let lastError: unknown = null;
    for (const modelId of MODEL_FALLBACKS) {
      try {
        const result = (await ai.models.generateContent({
          model: modelId,
          contents,
        })) as { text?: string; output?: Array<{ content?: Array<{ text?: string }> }> };

        const text =
          result.text ??
          result.output?.[0]?.content?.[0]?.text ??
          JSON.stringify(result);

        const quoteIndicatorRegex =
          /(\$\s*\d{1,3}[\d,\.]*|\b(total|estimate|quotation|quote|subtotal|grand total|price|estimated)\b)/i;
        const quoteComplete = quoteIndicatorRegex.test(String(text));

        if (quoteComplete) {
          const clientName =
            normalized[1]?.role === "user" ? normalized[1].content : "Unknown Client";
          const phoneMatch = normalized
            .map((m) => m.content)
            .join(" ")
            .match(/(\d{3}[-\.\s]??\d{3}[-\.\s]??\d{4}|\(\d{3}\)\s*\d{3}[-\.\s]??\d{4})/);
          const clientPhone = phoneMatch ? phoneMatch[0] : "Not detected";

          const dateKeywords = [
            "immediately",
            "month",
            "week",
            "year",
            "asap",
            "spring",
            "summer",
            "fall",
            "winter",
          ];
          const timeline =
            normalized.find(
              (m) =>
                m.role === "user" &&
                dateKeywords.some((k) => m.content.toLowerCase().includes(k))
            )?.content || "TBD";

          const summary = `========================================\n🚀 NEW LEAD: PROJECT BRIEF\n========================================\n👤 NAME:       ${clientName}\n📱 PHONE:      ${clientPhone}\n📅 START DATE: ${timeline}\n`;
          const transcript = normalized
            .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
            .join("\n\n");

          try {
            const { sendLead } = await import("../../../lib/sendLead");
            await sendLead({ summary, transcript, model: modelId, source: "chat-api" });
            return NextResponse.json({
              message: text,
              model: modelId,
              quoteComplete: true,
              leadSent: true,
            });
          } catch (err: unknown) {
            const error = err instanceof Error ? err.message : String(err);
            return NextResponse.json({
              message: text,
              model: modelId,
              quoteComplete: true,
              leadSent: false,
              leadError: error,
            });
          }
        }

        return NextResponse.json({
          message: text,
          model: modelId,
          quoteComplete,
        });
      } catch (err: unknown) {
        lastError = err;
        const msg = String((err as Error)?.message ?? "").toLowerCase();
        if (
          msg.includes("not found") ||
          msg.includes("not supported") ||
          msg.includes("generatecontent")
        ) {
          continue;
        }
        throw err;
      }
    }

    return NextResponse.json(
      {
        error:
          (lastError instanceof Error ? lastError.message : String(lastError)) ||
          "No available model",
      },
      { status: 500 }
    );
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error }, { status: 500 });
  }
}