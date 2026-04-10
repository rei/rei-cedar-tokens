import { describe, it, expect } from "vitest";
import type { Token } from "style-dictionary";

describe("link-tokens filter", () => {
  const createToken = (path: string[]): Token => ({
    name: "test-token",
    path,
    $type: "color",
    $value: "#000000",
    original: { $value: "#000000" },
    filePath: "test.json",
    isSource: true,
  });

  // Matches the logic in your provided Definition File
  const linkTokensFilter = (token: Token): boolean =>
    token.path[0] !== "options" &&
    token.path[0] !== "theme" &&
    token.path.includes("link");

  it('should include tokens where "link" is the root namespace', () => {
    const token = createToken(["link", "color", "primary"]);
    expect(linkTokensFilter(token)).toBe(true);
  });

  it('should include tokens where "link" appears later in the path', () => {
    const token = createToken([
      "component",
      "typography",
      "link",
      "decoration",
    ]);
    expect(linkTokensFilter(token)).toBe(true);
  });

  it("should include specific link state tokens", () => {
    const token = createToken(["link", "hover", "color"]);
    expect(linkTokensFilter(token)).toBe(true);
  });

  it('should filter out "link" tokens if they are in the options namespace', () => {
    const token = createToken(["options", "link", "transition-speed"]);
    expect(linkTokensFilter(token)).toBe(false);
  });

  it('should filter out "link" tokens if they are in the theme namespace', () => {
    const token = createToken(["theme", "link", "font-weight"]);
    expect(linkTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens that do not contain the word "link"', () => {
    const token = createToken(["button", "text", "color"]);
    expect(linkTokensFilter(token)).toBe(false);
  });

  it('should filter out general navigation tokens without the "link" keyword', () => {
    const token = createToken(["navigation", "item", "background"]);
    expect(linkTokensFilter(token)).toBe(false);
  });
});
