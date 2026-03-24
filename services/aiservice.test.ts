import { generateCompletion } from "./aiservice";

function withEnv<T>(env: Record<string, string | undefined>, fn: () => T): T {
  const previous: Record<string, string | undefined> = {};
  for (const key of Object.keys(env)) {
    previous[key] = process.env[key];
    const value = env[key];
    if (typeof value === "undefined") delete process.env[key];
    else process.env[key] = value;
  }
  try {
    return fn();
  } finally {
    for (const key of Object.keys(env)) {
      const value = previous[key];
      if (typeof value === "undefined") delete process.env[key];
      else process.env[key] = value;
    }
  }
}

describe("services/aiservice", () => {
  it("throws if OpenAI key is missing", async () => {
    await withEnv(
      { AI_PROVIDER: "openai", OPENAI_API_KEY: undefined },
      async () => {
        await expect(generateCompletion({ prompt: "hi" })).rejects.toThrow(
          /OPENAI_API_KEY/i,
        );
      },
    );
  });

  it("calls OpenAI chat completions and returns text/usage", async () => {
    const fetchMock = jest.fn(async () => {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          model: "gpt-test",
          choices: [{ message: { content: "hello" } }],
          usage: { prompt_tokens: 1, completion_tokens: 2, total_tokens: 3 },
        }),
        text: async () => "",
      } as unknown as Response;
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const result = await withEnv(
      { AI_PROVIDER: "openai", OPENAI_API_KEY: "test-key" },
      async () => generateCompletion({ prompt: "Say hello", temperature: 0.2 }),
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.provider).toBe("openai");
    expect(result.text).toBe("hello");
    expect(result.usage).toEqual({ promptTokens: 1, completionTokens: 2, totalTokens: 3 });
    expect(result.latencyMs).toEqual(expect.any(Number));
  });
});
