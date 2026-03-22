import { cn } from "./utils";

describe("cn", () => {
  it("joins class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("resolves Tailwind conflicts via tailwind-merge", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});

