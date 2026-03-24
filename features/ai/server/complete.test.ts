import { parseCompletePromptBody } from "./complete";

describe("parseCompletePromptBody", () => {
  it("rejects non-object bodies", () => {
    expect(() => parseCompletePromptBody("x")).toThrow(/json object/i);
  });

  it("requires prompt", () => {
    expect(() => parseCompletePromptBody({})).toThrow(/prompt is required/i);
    expect(() => parseCompletePromptBody({ prompt: "   " })).toThrow(/prompt is required/i);
  });

  it("normalizes and clamps values", () => {
    const parsed = parseCompletePromptBody({
      prompt: "  hello  ",
      temperature: 999,
      maxTokens: 999999,
      provider: "openai",
    });
    expect(parsed.prompt).toBe("hello");
    expect(parsed.temperature).toBe(2);
    expect(parsed.maxTokens).toBe(8192);
    expect(parsed.provider).toBe("openai");
  });
});

