import { describe, it, expect } from "vitest";
import type { Token } from "style-dictionary";

describe("foundations-type-tokens filter", () => {
  const createToken = (path: string[]): Token => ({
    name: "test-token",
    path,
    $type: "typography",
    $value: "sans-serif",
    original: { $value: "sans-serif" },
    filePath: "test.json",
    isSource: true,
  });

  // Matches your exact logic: strictly root level, exact string match
  const foundationsTypeTokensFilter = (token: Token): boolean =>
    token.path[0] !== "options" && token.path[0] === "type";

  it('should include tokens where the root namespace is exactly "type"', () => {
    const token = createToken(["type", "font-family", "primary"]);
    expect(foundationsTypeTokensFilter(token)).toBe(true);
  });

  it('should filter out tokens where "type" is NOT at the root (path[0])', () => {
    const token = createToken(["typography", "type", "scale"]);
    expect(foundationsTypeTokensFilter(token)).toBe(false);
  });

  it("should filter out tokens in the options namespace", () => {
    const token = createToken(["options", "type", "base"]);
    expect(foundationsTypeTokensFilter(token)).toBe(false);
  });

  it("should filter out tokens that only partially match the string", () => {
    // === requires an exact match, so "type-scale" will fail
    const token = createToken(["type-scale", "large"]);
    expect(foundationsTypeTokensFilter(token)).toBe(false);
  });

  it("should filter out completely unrelated tokens", () => {
    const token = createToken(["color", "background", "primary"]);
    expect(foundationsTypeTokensFilter(token)).toBe(false);
  });
});
