import { describe, it, expect } from "vitest";
import type { Token } from "style-dictionary";

describe("table-tokens filter", () => {
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
  const tableTokensFilter = (token: Token): boolean =>
    token.path[0] !== "options" &&
    token.path[0] !== "theme" &&
    token.path.includes("table");

  it('should include tokens where "table" is the root namespace', () => {
    const token = createToken(["table", "background", "header"]);
    expect(tableTokensFilter(token)).toBe(true);
  });

  it('should include tokens where "table" is nested exactly in the path', () => {
    const token = createToken(["component", "data-display", "table", "border"]);
    expect(tableTokensFilter(token)).toBe(true);
  });

  it('should filter out tokens that only partially match "table"', () => {
    // Array.includes('table') is false for 'table-row' or 'tables'
    const tableRowToken = createToken(["table-row", "background"]);
    const tablesToken = createToken(["tables", "margin"]);

    expect(tableTokensFilter(tableRowToken)).toBe(false);
    expect(tableTokensFilter(tablesToken)).toBe(false);
  });

  it('should filter out "table" tokens if they are in the options namespace', () => {
    const token = createToken(["options", "table", "row-limit"]);
    expect(tableTokensFilter(token)).toBe(false);
  });

  it('should filter out "table" tokens if they are in the theme namespace', () => {
    const token = createToken(["theme", "table", "font-family"]);
    expect(tableTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens that do not contain the word "table" at all', () => {
    const token = createToken(["grid", "background", "primary"]);
    expect(tableTokensFilter(token)).toBe(false);
  });
});
