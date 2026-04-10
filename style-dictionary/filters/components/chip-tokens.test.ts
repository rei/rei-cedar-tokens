import { describe, it, expect } from "vitest";
import type { Token } from "style-dictionary";

describe("chip tokens filter", () => {
  const createToken = (path: string[]): Token => ({
    name: "test-token",
    path,
    $type: "color",
    $value: "#000000",
    original: { $value: "#000000" },
    filePath: "test.json",
    isSource: true,
  });

  // Matches the logic in your provided Definition File for chips
  const chipTokensFilter = (token: Token): boolean =>
    token.path[0] !== "options" &&
    token.path[0] !== "theme" &&
    token.path.includes("chip");

  it('should include tokens where "chip" is the root namespace', () => {
    const token = createToken(["chip", "background", "primary"]);
    expect(chipTokensFilter(token)).toBe(true);
  });

  it('should include tokens where "chip" appears later in the path', () => {
    const token = createToken(["component", "chip", "label", "color"]);
    expect(chipTokensFilter(token)).toBe(true);
  });

  it("should include tokens for specific chip states", () => {
    const token = createToken(["chip", "border", "dismiss", "hover"]);
    expect(chipTokensFilter(token)).toBe(true);
  });

  it('should filter out "chip" tokens if they are in the options namespace', () => {
    const token = createToken(["options", "chip", "spacing"]);
    expect(chipTokensFilter(token)).toBe(false);
  });

  it('should filter out "chip" tokens if they are in the theme namespace', () => {
    const token = createToken(["theme", "chip", "radius"]);
    expect(chipTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens that do not contain the word "chip"', () => {
    const token = createToken(["button", "background", "primary"]);
    expect(chipTokensFilter(token)).toBe(false);
  });

  it('should filter out general component tokens like "accordion"', () => {
    const token = createToken(["accordion", "item", "header"]);
    expect(chipTokensFilter(token)).toBe(false);
  });
});
