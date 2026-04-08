import { describe, it, expect } from "vitest";
import type { Token } from "style-dictionary";

describe("tab-tokens filter", () => {
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
  const tabTokensFilter = (token: Token): boolean =>
    token.path[0] !== "options" &&
    token.path[0] !== "theme" &&
    token.path.includes("tab");

  it('should include tokens where "tab" is the root namespace', () => {
    const token = createToken(["tab", "background", "active"]);
    expect(tabTokensFilter(token)).toBe(true);
  });

  it('should include tokens where "tab" is nested exactly in the path', () => {
    const token = createToken(["component", "navigation", "tab", "label"]);
    expect(tabTokensFilter(token)).toBe(true);
  });

  it('should filter out tokens that only partially match "tab"', () => {
    // Array.includes('tab') is false for 'table' or 'tab-bar'
    const tableToken = createToken(["table", "cell", "padding"]);
    const tabBarToken = createToken(["tab-bar", "background"]);

    expect(tabTokensFilter(tableToken)).toBe(false);
    expect(tabTokensFilter(tabBarToken)).toBe(false);
  });

  it('should filter out "tab" tokens if they are in the options namespace', () => {
    const token = createToken(["options", "tab", "height"]);
    expect(tabTokensFilter(token)).toBe(false);
  });

  it('should filter out "tab" tokens if they are in the theme namespace', () => {
    const token = createToken(["theme", "tab", "font-size"]);
    expect(tabTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens that do not contain the word "tab" at all', () => {
    const token = createToken(["button", "background", "primary"]);
    expect(tabTokensFilter(token)).toBe(false);
  });
});
