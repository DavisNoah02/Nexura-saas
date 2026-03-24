import "server-only";

export type AIModelProvider = "openai" | "anthropic";

export interface AICompletionRequest {
  prompt: string;
  system?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AICompletionUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface AICompletionResponse {
  provider: AIModelProvider;
  model: string;
  text: string;
  usage?: AICompletionUsage;
  latencyMs: number;
}

type ProviderOptions = {
  provider?: AIModelProvider;
  baseUrl?: string;
  apiKey?: string;
};

function nowMs() {
  return Date.now();
}

async function readResponseBody(response: Response) {
  try {
    return await response.text();
  } catch {
    return "";
  }
}

function getProvider(options?: ProviderOptions): AIModelProvider {
  const providerFromEnv = process.env.AI_PROVIDER as AIModelProvider | undefined;
  return options?.provider ?? providerFromEnv ?? "openai";
}

function getModel(provider: AIModelProvider, request: AICompletionRequest) {
  if (request.model) return request.model;
  if (provider === "openai") return process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  return process.env.ANTHROPIC_MODEL ?? "claude-3-5-sonnet-latest";
}

function getApiKey(provider: AIModelProvider, options?: ProviderOptions) {
  if (options?.apiKey) return options.apiKey;
  if (provider === "openai") return process.env.OPENAI_API_KEY;
  return process.env.ANTHROPIC_API_KEY;
}

function getBaseUrl(provider: AIModelProvider, options?: ProviderOptions) {
  if (options?.baseUrl) return options.baseUrl;
  if (provider === "openai") return process.env.OPENAI_BASE_URL ?? "https://api.openai.com";
  return process.env.ANTHROPIC_BASE_URL ?? "https://api.anthropic.com";
}

async function openAIChatCompletion(
  request: AICompletionRequest,
  options?: ProviderOptions,
): Promise<Omit<AICompletionResponse, "provider">> {
  const apiKey = getApiKey("openai", options);
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY (or pass options.apiKey) for OpenAI provider.");
  }

  const model = getModel("openai", request);
  const baseUrl = getBaseUrl("openai", options).replace(/\/$/, "");
  const url = `${baseUrl}/v1/chat/completions`;

  const startedAt = nowMs();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        ...(request.system ? [{ role: "system", content: request.system }] : []),
        { role: "user", content: request.prompt },
      ],
      temperature: request.temperature,
      max_tokens: request.maxTokens,
    }),
  });
  const latencyMs = nowMs() - startedAt;

  if (!response.ok) {
    const body = await readResponseBody(response);
    throw new Error(`OpenAI error (${response.status}): ${body}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
    model?: string;
  };

  const text = data.choices?.[0]?.message?.content ?? "";
  const usage = data.usage
    ? {
        promptTokens: data.usage.prompt_tokens ?? 0,
        completionTokens: data.usage.completion_tokens ?? 0,
        totalTokens: data.usage.total_tokens ?? 0,
      }
    : undefined;

  return {
    model: data.model ?? model,
    text,
    usage,
    latencyMs,
  };
}

async function anthropicMessages(
  request: AICompletionRequest,
  options?: ProviderOptions,
): Promise<Omit<AICompletionResponse, "provider">> {
  const apiKey = getApiKey("anthropic", options);
  if (!apiKey) {
    throw new Error("Missing ANTHROPIC_API_KEY (or pass options.apiKey) for Anthropic provider.");
  }

  const model = getModel("anthropic", request);
  const baseUrl = getBaseUrl("anthropic", options).replace(/\/$/, "");
  const url = `${baseUrl}/v1/messages`;

  const startedAt = nowMs();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": process.env.ANTHROPIC_VERSION ?? "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      system: request.system,
      max_tokens: request.maxTokens ?? 1024,
      temperature: request.temperature,
      messages: [{ role: "user", content: request.prompt }],
    }),
  });
  const latencyMs = nowMs() - startedAt;

  if (!response.ok) {
    const body = await readResponseBody(response);
    throw new Error(`Anthropic error (${response.status}): ${body}`);
  }

  const data = (await response.json()) as {
    model?: string;
    content?: Array<{ type?: string; text?: string }>;
    usage?: { input_tokens?: number; output_tokens?: number };
  };

  const text =
    data.content
      ?.filter((part) => part.type === "text" && typeof part.text === "string")
      .map((part) => part.text)
      .join("") ?? "";

  const usage = data.usage
    ? {
        promptTokens: data.usage.input_tokens ?? 0,
        completionTokens: data.usage.output_tokens ?? 0,
        totalTokens: (data.usage.input_tokens ?? 0) + (data.usage.output_tokens ?? 0),
      }
    : undefined;

  return {
    model: data.model ?? model,
    text,
    usage,
    latencyMs,
  };
}

export async function generateCompletion(
  request: AICompletionRequest,
  options?: ProviderOptions,
): Promise<AICompletionResponse> {
  const provider = getProvider(options);
  if (provider === "openai") {
    return { provider, ...(await openAIChatCompletion(request, options)) };
  }
  if (provider === "anthropic") {
    return { provider, ...(await anthropicMessages(request, options)) };
  }

  const exhaustiveCheck: never = provider;
  throw new Error(`Unsupported provider: ${exhaustiveCheck}`);
}
