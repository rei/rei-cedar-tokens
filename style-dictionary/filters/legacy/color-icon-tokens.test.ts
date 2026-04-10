import { describe, it, expect } from "vitest";
import type { Token } from "style-dictionary";

describe("color-icon-tokens filter", () => {
  const createToken = (path: string[]): Token => ({
    name: "test-token",
    path,
    $type: "color",
    $value: "#000000",
    original: { $value: "#000000" },
    filePath: "test.json",
    isSource: true,
  });

  // Test the filter logic directly
  const colorIconTokensFilter = (token: Token): boolean =>
    token.path[0] !== "options" &&
    token.path[0] !== "theme" &&
    token.path[0] === "color" &&
    token.path[1] === "icon";

  it("should include tokens in color.icon namespace", () => {
    const token = createToken(["color", "icon", "primary"]);
    expect(colorIconTokensFilter(token)).toBe(true);
  });

  it("should include deeply nested color.icon tokens", () => {
    const token = createToken(["color", "icon", "action", "success"]);
    expect(colorIconTokensFilter(token)).toBe(true);
  });

  it("should filter out tokens in options namespace", () => {
    const token = createToken(["options", "color", "icon"]);
    expect(colorIconTokensFilter(token)).toBe(false);
  });

  it("should filter out tokens in theme namespace", () => {
    const token = createToken(["theme", "color", "icon"]);
    expect(colorIconTokensFilter(token)).toBe(false);
  });

  it("should filter out color.text tokens", () => {
    const token = createToken(["color", "text", "primary"]);
    expect(colorIconTokensFilter(token)).toBe(false);
  });

  it("should filter out color.background tokens", () => {
    const token = createToken(["color", "background", "primary"]);
    expect(colorIconTokensFilter(token)).toBe(false);
  });

  it("should filter out color.border tokens", () => {
    const token = createToken(["color", "border", "primary"]);
    expect(colorIconTokensFilter(token)).toBe(false);
  });

  it("should filter out non-color tokens", () => {
    const token = createToken(["space", "small"]);
    expect(colorIconTokensFilter(token)).toBe(false);
  });
});
