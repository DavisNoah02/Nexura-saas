export type AIModelProvider = "openai" | "anthropic" | "local";

export interface AICompletionRequest {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AICompletionUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface AICompletionResponse {
  text: string;
  usage?: AICompletionUsage;
}

/**
 * Generate a text completion for the given prompt.
 * Wire this up to your actual AI provider (OpenAI, Anthropic, etc.)
 * in one place so the rest of the app stays provider-agnostic.
 */
export async function generateCompletion(
  _request: AICompletionRequest,
  _options?: { provider?: AIModelProvider },
): Promise<AICompletionResponse> {
  throw new Error(
    "AI service not implemented. Implement generateCompletion in services/aiservice.tsx to call your provider.",
  );
}

