import { describe, it, expect } from "vitest";
import type { Token } from "style-dictionary";

describe("pagination-tokens filter", () => {
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
  const paginationTokensFilter = (token: Token): boolean =>
    token.path[0] !== "options" &&
    token.path[0] !== "theme" &&
    token.path.includes("pagination");

  it('should include tokens where "pagination" is the root namespace', () => {
    const token = createToken(["pagination", "spacing", "item"]);
    expect(paginationTokensFilter(token)).toBe(true);
  });

  it('should include tokens where "pagination" appears later in the path', () => {
    const token = createToken([
      "component",
      "navigation",
      "pagination",
      "border",
    ]);
    expect(paginationTokensFilter(token)).toBe(true);
  });

  it("should include specific pagination state tokens (e.g., active, disabled)", () => {
    const token = createToken(["pagination", "item", "active", "background"]);
    expect(paginationTokensFilter(token)).toBe(true);
  });

  it('should filter out "pagination" tokens if they are in the options namespace', () => {
    const token = createToken(["options", "pagination", "items-per-page"]);
    expect(paginationTokensFilter(token)).toBe(false);
  });

  it('should filter out "pagination" tokens if they are in the theme namespace', () => {
    const token = createToken(["theme", "pagination", "font-family"]);
    expect(paginationTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens that do not contain the word "pagination"', () => {
    const token = createToken(["stepper", "background", "color"]);
    expect(paginationTokensFilter(token)).toBe(false);
  });

  it('should filter out general navigation tokens without the "pagination" keyword', () => {
    const token = createToken(["navigation", "bar", "height"]);
    expect(paginationTokensFilter(token)).toBe(false);
  });
});
