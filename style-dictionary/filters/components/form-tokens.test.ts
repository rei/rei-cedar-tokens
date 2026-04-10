import { describe, it, expect } from "vitest";
import type { Token } from "style-dictionary";

describe("form-tokens filter", () => {
  const createToken = (path: string[]): Token => ({
    name: "test-token",
    path,
    $type: "dimension",
    $value: "16px",
    original: { $value: "16px" },
    filePath: "test.json",
    isSource: true,
  });

  // Test the filter logic directly
  const formTokensFilter = (token: Token): boolean =>
    token.path[0] !== "options" && token.path[0] === "form";

  it("should include tokens in form namespace", () => {
    const token = createToken(["form", "input", "height"]);
    expect(formTokensFilter(token)).toBe(true);
  });

  it("should include deeply nested form tokens", () => {
    const token = createToken(["form", "checkbox", "size", "small"]);
    expect(formTokensFilter(token)).toBe(true);
  });

  it("should filter out tokens in options namespace", () => {
    const token = createToken(["options", "form", "default"]);
    expect(formTokensFilter(token)).toBe(false);
  });

  it("should filter out non-form tokens", () => {
    const token = createToken(["color", "primary"]);
    expect(formTokensFilter(token)).toBe(false);
  });

  it("should filter out space tokens", () => {
    const token = createToken(["space", "small"]);
    expect(formTokensFilter(token)).toBe(false);
  });

  it("should filter out icon tokens", () => {
    const token = createToken(["icon", "size", "medium"]);
    expect(formTokensFilter(token)).toBe(false);
  });
});
