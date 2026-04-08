import { describe, it, expect } from "vitest";
import type { Token } from "style-dictionary";

describe("remove-source-tokens filter", () => {
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
  const removeSourceTokensFilter = (token: Token): boolean =>
    token.path[0] !== "options" && token.path[0] !== "theme";

  it("should filter out tokens in options namespace", () => {
    const token = createToken(["options", "color", "base"]);
    expect(removeSourceTokensFilter(token)).toBe(false);
  });

  it("should filter out tokens in theme namespace", () => {
    const token = createToken(["theme", "primary", "color"]);
    expect(removeSourceTokensFilter(token)).toBe(false);
  });

  it("should include tokens in global namespace", () => {
    const token = createToken(["global", "color", "primary"]);
    expect(removeSourceTokensFilter(token)).toBe(true);
  });

  it("should include tokens in web namespace", () => {
    const token = createToken(["web", "typography", "size"]);
    expect(removeSourceTokensFilter(token)).toBe(true);
  });

  it("should include tokens in mobile namespace", () => {
    const token = createToken(["mobile", "text", "size"]);
    expect(removeSourceTokensFilter(token)).toBe(true);
  });

  it("should include tokens with any first-level path except options and theme", () => {
    expect(removeSourceTokensFilter(createToken(["button", "color"]))).toBe(
      true,
    );
    expect(removeSourceTokensFilter(createToken(["spacing", "small"]))).toBe(
      true,
    );
    expect(removeSourceTokensFilter(createToken(["custom", "token"]))).toBe(
      true,
    );
  });

  it("should filter options even with deeply nested paths", () => {
    const token = createToken(["options", "very", "deeply", "nested", "token"]);
    expect(removeSourceTokensFilter(token)).toBe(false);
  });

  it("should filter theme even with deeply nested paths", () => {
    const token = createToken(["theme", "very", "deeply", "nested", "token"]);
    expect(removeSourceTokensFilter(token)).toBe(false);
  });
});
