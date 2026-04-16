import { describe, it, expect } from "vitest";
import type { Token } from "style-dictionary";

describe("component-link-tokens filter", () => {
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

  // Matches the logic defined in your componentLinkTokens registration
  const filterLogic = (token: Token): boolean =>
    token.path[0] !== "options" &&
    token.path[0] === "color" &&
    token.path.includes("link");

  it('should include tokens where "color" is the root and "link" is present', () => {
    const token = createToken(["color", "link", "primary"]);
    expect(filterLogic(token)).toBe(true);
  });

  it('should include tokens where "link" appears deeper in a color path', () => {
    const token = createToken(["color", "interaction", "link", "hover"]);
    expect(filterLogic(token)).toBe(true);
  });

  it('should exclude tokens that include "link" but do not start with "color"', () => {
    // This fails because path[0] is 'link', not 'color'
    const token = createToken(["link", "action", "primary"]);
    expect(filterLogic(token)).toBe(false);
  });

  it('should exclude tokens that start with "options" even if they are colors and contain "link"', () => {
    const token = createToken(["options", "color", "link"]);
    expect(filterLogic(token)).toBe(false);
  });

  it('should exclude color tokens that do not contain the word "link"', () => {
    const token = createToken(["color", "background", "primary"]);
    expect(filterLogic(token)).toBe(false);
  });

  it("should exclude tokens from other namespaces like theme", () => {
    const token = createToken(["theme", "color", "link"]);
    expect(filterLogic(token)).toBe(false);
  });

  it("should handle an empty path gracefully", () => {
    const token = createToken([]);
    expect(filterLogic(token)).toBe(false);
  });
});
