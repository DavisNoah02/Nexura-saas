import type { AICompletionRequest, AICompletionResponse, AIModelProvider } from "@/services/aiservice";
import { generateCompletion } from "@/services/aiservice";

export type CompletePromptInput = AICompletionRequest & {
  provider?: AIModelProvider;
};

export class CompletePromptValidationError extends Error {
  readonly statusCode = 400 as const;
}

function clampNumber(value: number, { min, max }: { min: number; max: number }) {
  return Math.min(max, Math.max(min, value));
}

function ensureString(value: unknown, field: string) {
  if (typeof value !== "string") {
    throw new CompletePromptValidationError(`${field} must be a string`);
  }
  return value;
}

function ensureOptionalString(value: unknown, field: string) {
  if (typeof value === "undefined") return undefined;
  return ensureString(value, field);
}

function ensureOptionalNumber(value: unknown, field: string) {
  if (typeof value === "undefined") return undefined;
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new CompletePromptValidationError(`${field} must be a number`);
  }
  return value;
}

function ensureOptionalProvider(value: unknown) {
  if (typeof value === "undefined") return undefined;
  if (value !== "openai" && value !== "anthropic") {
    throw new CompletePromptValidationError(`provider must be "openai" or "anthropic"`);
  }
  return value as AIModelProvider;
}

export function parseCompletePromptBody(body: unknown): CompletePromptInput {
  if (!body || typeof body !== "object") {
    throw new CompletePromptValidationError("body must be a JSON object");
  }

  const record = body as Record<string, unknown>;
  if (typeof record.prompt === "undefined") {
    throw new CompletePromptValidationError("prompt is required");
  }
  const prompt = ensureString(record.prompt, "prompt").trim();
  if (!prompt) {
    throw new CompletePromptValidationError("prompt is required");
  }
  if (prompt.length > 40_000) {
    throw new CompletePromptValidationError("prompt is too long");
  }

  const system = ensureOptionalString(record.system, "system")?.trim();
  const model = ensureOptionalString(record.model, "model")?.trim();
  const temperature = ensureOptionalNumber(record.temperature, "temperature");
  const maxTokens = ensureOptionalNumber(record.maxTokens, "maxTokens");
  const provider = ensureOptionalProvider(record.provider);

  return {
    prompt,
    system,
    model,
    temperature: typeof temperature === "number" ? clampNumber(temperature, { min: 0, max: 2 }) : undefined,
    maxTokens: typeof maxTokens === "number" ? Math.trunc(clampNumber(maxTokens, { min: 1, max: 8192 })) : undefined,
    provider,
  };
}

export async function completePrompt(input: CompletePromptInput): Promise<AICompletionResponse> {
  return generateCompletion(
    {
      prompt: input.prompt,
      system: input.system,
      model: input.model,
      temperature: input.temperature,
      maxTokens: input.maxTokens,
    },
    { provider: input.provider },
  );
}
