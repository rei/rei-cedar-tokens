import { describe, it, expect } from "vitest";
import type { Token } from "style-dictionary";

describe("color-border-tokens filter", () => {
  const createToken = (path: string[]): Token => ({
    name: "test-token",
    path,
    $type: "color",
    $value: "#000000",
    original: { $value: "#000000" },
    filePath: "test.json",
    isSource: true,
  });

  // Updated to match the Definition File logic
  const colorBorderTokensFilter = (token: Token): boolean => {
    const borderTokens = [
      "transparent",
      "primary",
      "secondary",
      "success",
      "warning",
      "error",
      "info",
    ];

    return (
      token.path[0] !== "options" &&
      token.path[0] !== "theme" &&
      token.path[0] === "color" &&
      token.path[1] === "border" &&
      borderTokens.includes(token.path[2])
    );
  };

  it("should include allowed tokens in color.border namespace", () => {
    const token = createToken(["color", "border", "primary"]);
    expect(colorBorderTokensFilter(token)).toBe(true);
  });

  it('should include "success" as a valid border token', () => {
    const token = createToken(["color", "border", "success"]);
    expect(colorBorderTokensFilter(token)).toBe(true);
  });

  it("should include deeply nested allowed color.border tokens", () => {
    // Passes because path[2] is 'error'
    const token = createToken(["color", "border", "error", "subtle"]);
    expect(colorBorderTokensFilter(token)).toBe(true);
  });

  it("should filter out color.border tokens NOT in the allowed list", () => {
    const token = createToken(["color", "border", "custom-unrecognized-color"]);
    expect(colorBorderTokensFilter(token)).toBe(false);
  });

  it("should filter out tokens in options namespace", () => {
    const token = createToken(["options", "color", "border", "primary"]);
    expect(colorBorderTokensFilter(token)).toBe(false);
  });

  it("should filter out tokens in theme namespace", () => {
    const token = createToken(["theme", "color", "border", "primary"]);
    expect(colorBorderTokensFilter(token)).toBe(false);
  });

  it("should filter out color.text tokens", () => {
    const token = createToken(["color", "text", "primary"]);
    expect(colorBorderTokensFilter(token)).toBe(false);
  });

  it("should filter out color.background tokens", () => {
    const token = createToken(["color", "background", "primary"]);
    expect(colorBorderTokensFilter(token)).toBe(false);
  });

  it("should filter out non-color tokens", () => {
    const token = createToken(["space", "small"]);
    expect(colorBorderTokensFilter(token)).toBe(false);
  });
});
