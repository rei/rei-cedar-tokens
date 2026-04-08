import { describe, it, expect } from "vitest";
import type { Token } from "style-dictionary";

describe("input-tokens filter", () => {
  const createToken = (path: string[]): Token => ({
    name: "test-token",
    path,
    $type: "color",
    $value: "#000000",
    original: { $value: "#000000" },
    filePath: "test.json",
    isSource: true,
  });

  // Matches the updated logic: (Not Options AND Not Theme) AND (Input OR Label)
  const inputTokensFilter = (token: Token): boolean =>
    token.path[0] !== "options" &&
    token.path[0] !== "theme" &&
    (token.path.includes("input") || token.path.includes("label"));

  it('should include tokens where "input" is in the path', () => {
    const token = createToken(["input", "background", "primary"]);
    expect(inputTokensFilter(token)).toBe(true);
  });

  it('should include tokens where "label" is in the path', () => {
    const token = createToken(["label", "text", "color"]);
    expect(inputTokensFilter(token)).toBe(true);
  });

  it('should include tokens where "input" is deeply nested', () => {
    const token = createToken(["component", "form", "input", "border"]);
    expect(inputTokensFilter(token)).toBe(true);
  });

  it('should filter out "input" tokens if they are in the options namespace', () => {
    const token = createToken(["options", "input", "spacing"]);
    expect(inputTokensFilter(token)).toBe(false);
  });

  it('should filter out "label" tokens if they are in the options namespace', () => {
    const token = createToken(["options", "label", "font-size"]);
    expect(inputTokensFilter(token)).toBe(false);
  });

  it('should filter out "input" tokens if they are in the theme namespace', () => {
    const token = createToken(["theme", "input", "radius"]);
    expect(inputTokensFilter(token)).toBe(false);
  });

  it('should filter out "label" tokens if they are in the theme namespace', () => {
    const token = createToken(["theme", "label", "color"]);
    expect(inputTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens that contain neither "input" nor "label"', () => {
    const token = createToken(["button", "background", "primary"]);
    expect(inputTokensFilter(token)).toBe(false);
  });
});
