import { describe, it, expect } from "vitest";
import type { Token } from "style-dictionary";

describe("surface-tokens filter", () => {
  const createToken = (path: string[]): Token => ({
    name: "test-token",
    path,
    $type: "color",
    $value: "#000000",
    original: { $value: "#000000" },
    filePath: "test.json",
    isSource: true,
  });

  const surfaceTokensFilter = (token: Token): boolean =>
    token.path[0] !== "options" &&
    token.path[0] !== "theme" &&
    token.path.includes("surface");

  it('should include tokens where "surface" is an exact element in the path', () => {
    const token = createToken(["surface", "background", "primary"]);
    expect(surfaceTokensFilter(token)).toBe(true);
  });

  it('should include tokens where "surface" is nested exactly in the path', () => {
    const token = createToken(["component", "card", "surface", "color"]);
    expect(surfaceTokensFilter(token)).toBe(true);
  });

  it('should filter out "surface-selection" because it is not an exact match for "surface"', () => {
    // Correcting my previous mistake: Array.includes check is exact!
    const token = createToken(["surface-selection", "background", "active"]);
    expect(surfaceTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens in options or theme even if they contain "surface"', () => {
    const optionsToken = createToken(["options", "surface", "opacity"]);
    const themeToken = createToken(["theme", "surface", "elevation"]);
    expect(surfaceTokensFilter(optionsToken)).toBe(false);
    expect(surfaceTokensFilter(themeToken)).toBe(false);
  });

  it('should filter out tokens that do not have "surface" as an array element', () => {
    const token = createToken(["background", "primary"]);
    expect(surfaceTokensFilter(token)).toBe(false);
  });
});
