# GitHub Copilot Instructions — GaedkeWebsite 🔧

Purpose
- Short, focused instructions to help coding agents (Copilot/agents) be productive immediately in this codebase.

Project snapshot
- Next.js (App Router, TypeScript) site in `web/`.
- Uses Tailwind CSS and `next/font` (Geist). No tests present.
- AI integration: server-side API at `src/app/api/chat/route.ts` using `@ai-sdk/google` + `ai.generateText`.

Quick dev commands
- Start dev server: `npm run dev` (from `web/`) ✅
- Build: `npm run build`
- Start production server: `npm run start`
- Lint: `npm run lint`

Critical files & why they matter
- `src/app/api/chat/route.ts` — Server-side chat endpoint. Key points:
  - Reads `process.env.GOOGLE_GENERATIVE_AI_API_KEY` or `process.env.GOOGLE_API_KEY`.
  - Uses factory pattern `createGoogleGenerativeAI({ apiKey })` and `generateText({ model: google("gemini-1.5-flash-latest"), ... })` (keep this pattern to avoid signature/TS issues).
  - `export const runtime = "nodejs"` — this route expects Node runtime (not edge).

- `src/app/quote/page.tsx` — Client chat UI and lead handling:
  - Runs in the browser (`"use client"`). Posts user messages to `/api/chat` as [{ role: 'user'|'assistant', content }].
  - Uses `emailjs` (service/template IDs + public key are embedded client-side) to email lead summaries.
  - `generateLeadSummary()` contains the canonical parsing logic: phone regex, timeline keywords, and file counts — reuse this when extracting lead data.
  - File uploads currently use `URL.createObjectURL()` (not uploaded to server).

- `src/app/page.tsx`, `src/app/layout.tsx` — UI patterns, Tailwind utility variants, and brand color usage.

Integration & environment rules
- Google AI API keys must remain server-side. Set `GOOGLE_GENERATIVE_AI_API_KEY` or `GOOGLE_API_KEY` (e.g., `.env.local`) for local dev.
- Email sending is triggered client-side. Verify `emailjs` service/template IDs and public key for full end-to-end tests.

Patterns & project-specific conventions
- Roles mapping: client uses 'bot'/'user' locally; server normalizes to `assistant`/`user` before calling the model.
- Keep the single-argument call to `google(...)` when passing to `generateText` (see `route.ts` comment).
- UI logic triggers emails when server responses include a `$` (see `quote/page.tsx`): preserve this behavior when changing response content.

Testing / debugging tips
- Manual test flow:
  1. export GOOGLE_GENERATIVE_AI_API_KEY=<key>
  2. cd web && npm run dev
  3. Open `http://localhost:3000/quote` and interact with the chat UI.
  4. Inspect network tab for POST `/api/chat` and server responses.
- Use `curl` to emulate API payloads: POST JSON messages to `http://localhost:3000/api/chat`.
- Check server logs for error messages (route returns { error } on failures).

Security & caution
- Don't move the Google API key into client code. Server route must call the AI provider.
- EmailJS credentials are public-facing by design (client-usable), but review service/template IDs before committing secrets.

Where to implement changes
- New model logic: update `src/app/api/chat/route.ts`.
- UI and lead parsing: update `src/app/quote/page.tsx` (look for `generateLeadSummary` and `sendToOwner`).

If something is unclear or a section is missing, tell me which areas you'd like expanded (build, deploy, AI behavior examples), and I will iterate. 👋