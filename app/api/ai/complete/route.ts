import { NextResponse, type NextRequest } from "next/server";

import {
  completePrompt,
  CompletePromptValidationError,
  parseCompletePromptBody,
} from "@/features/ai/server/complete";

export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(request: NextRequest) {
  const expectedToken = process.env.AI_API_TOKEN;
  if (expectedToken) {
    const authorization = request.headers.get("authorization") ?? "";
    const match = authorization.match(/^Bearer\s+(.+)$/i);
    if (!match || match[1] !== expectedToken) return unauthorized();
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  try {
    const input = parseCompletePromptBody(body);
    const result = await completePrompt(input);
    return NextResponse.json({ result });
  } catch (error) {
    if (error instanceof CompletePromptValidationError) {
      return badRequest(error.message);
    }
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}

