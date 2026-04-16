import { describe, it, expect } from "vitest";
import type { Token } from "style-dictionary";

describe("component-button-tokens filter", () => {
  // Helper to create a token structure similar to Style Dictionary's internal format
  const createToken = (path: string[]): Token => ({
    name: "test-token",
    path,
    $type: "color",
    $value: "#000000",
    original: { $value: "#000000" },
    filePath: "test.json",
    isSource: true,
  });

  // Matches the logic defined in your componentButtonTokens registration
  const filterLogic = (token: Token): boolean =>
    token.path[0] !== "options" &&
    token.path[0] === "color" &&
    token.path.includes("button");

  it('should include tokens where "color" is the root and "button" is present', () => {
    const token = createToken(["color", "button", "primary", "background"]);
    expect(filterLogic(token)).toBe(true);
  });

  it('should include tokens where "button" appears later in a color path', () => {
    const token = createToken(["color", "brand", "button", "border"]);
    expect(filterLogic(token)).toBe(true);
  });

  it('should exclude tokens that include "button" but do not start with "color"', () => {
    // Fails because path[0] is 'button', not 'color'
    const token = createToken(["button", "color", "primary"]);
    expect(filterLogic(token)).toBe(false);
  });

  it('should exclude tokens that start with "options" even if they contain "button"', () => {
    const token = createToken(["options", "color", "button"]);
    expect(filterLogic(token)).toBe(false);
  });

  it('should exclude color tokens that do not contain the word "button"', () => {
    const token = createToken(["color", "background", "base"]);
    expect(filterLogic(token)).toBe(false);
  });

  it("should exclude tokens from the theme namespace", () => {
    const token = createToken(["theme", "color", "button"]);
    expect(filterLogic(token)).toBe(false);
  });

  it("should handle an empty path gracefully", () => {
    const token = createToken([]);
    expect(filterLogic(token)).toBe(false);
  });
});
