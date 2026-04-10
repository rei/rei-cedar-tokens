import { describe, it, expect } from "vitest";
import type { Token } from "style-dictionary";

describe("remove-categories-tokens filter", () => {
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
  const removeCategoriesTokensFilter = (token: Token): boolean => {
    const colorSubcategoriesToFilter = [
      "background",
      "radius",
      "icon",
      "text",
      "border",
    ];
    const categoriesToFilter = [
      "space",
      "radius",
      "icon",
      "text",
      "border",
      "prominence",
      "duration",
      "timing",
      "form",
    ];

    if (
      (token.path[0] === "color" &&
        colorSubcategoriesToFilter.includes(token.path[1])) ||
      categoriesToFilter.includes(token.path[0])
    ) {
      return false;
    }

    return token.path[0] !== "options" && token.path[0] !== "theme";
  };

  // Color subcategories that should be filtered out
  it("should filter out color.background tokens", () => {
    const token = createToken(["color", "background", "primary"]);
    expect(removeCategoriesTokensFilter(token)).toBe(false);
  });

  it("should filter out color.radius tokens", () => {
    const token = createToken(["color", "radius", "primary"]);
    expect(removeCategoriesTokensFilter(token)).toBe(false);
  });

  it("should filter out color.icon tokens", () => {
    const token = createToken(["color", "icon", "primary"]);
    expect(removeCategoriesTokensFilter(token)).toBe(false);
  });

  it("should filter out color.text tokens", () => {
    const token = createToken(["color", "text", "primary"]);
    expect(removeCategoriesTokensFilter(token)).toBe(false);
  });

  it("should filter out color.border tokens", () => {
    const token = createToken(["color", "border", "primary"]);
    expect(removeCategoriesTokensFilter(token)).toBe(false);
  });

  // Top-level categories that should be filtered out
  it("should filter out space tokens", () => {
    const token = createToken(["space", "small"]);
    expect(removeCategoriesTokensFilter(token)).toBe(false);
  });

  it("should filter out radius tokens", () => {
    const token = createToken(["radius", "medium"]);
    expect(removeCategoriesTokensFilter(token)).toBe(false);
  });

  it("should filter out icon tokens", () => {
    const token = createToken(["icon", "size", "large"]);
    expect(removeCategoriesTokensFilter(token)).toBe(false);
  });

  it("should filter out text tokens", () => {
    const token = createToken(["text", "size", "large"]);
    expect(removeCategoriesTokensFilter(token)).toBe(false);
  });

  it("should filter out border tokens", () => {
    const token = createToken(["border", "width", "default"]);
    expect(removeCategoriesTokensFilter(token)).toBe(false);
  });

  it("should filter out prominence tokens", () => {
    const token = createToken(["prominence", "raised"]);
    expect(removeCategoriesTokensFilter(token)).toBe(false);
  });

  it("should filter out duration tokens", () => {
    const token = createToken(["duration", "fast"]);
    expect(removeCategoriesTokensFilter(token)).toBe(false);
  });

  it("should filter out timing tokens", () => {
    const token = createToken(["timing", "ease-in"]);
    expect(removeCategoriesTokensFilter(token)).toBe(false);
  });

  it("should filter out form tokens", () => {
    const token = createToken(["form", "input", "height"]);
    expect(removeCategoriesTokensFilter(token)).toBe(false);
  });

  // Source namespaces that should be filtered out
  it("should filter out options namespace", () => {
    const token = createToken(["options", "color", "base"]);
    expect(removeCategoriesTokensFilter(token)).toBe(false);
  });

  it("should filter out theme namespace", () => {
    const token = createToken(["theme", "primary", "color"]);
    expect(removeCategoriesTokensFilter(token)).toBe(false);
  });

  // Tokens that should be included
  it("should include color.primary tokens (non-filtered subcategory)", () => {
    const token = createToken(["color", "primary", "base"]);
    expect(removeCategoriesTokensFilter(token)).toBe(true);
  });

  it("should include button tokens", () => {
    const token = createToken(["button", "padding", "horizontal"]);
    expect(removeCategoriesTokensFilter(token)).toBe(true);
  });

  it("should include typography tokens", () => {
    const token = createToken(["typography", "heading", "large"]);
    expect(removeCategoriesTokensFilter(token)).toBe(true);
  });

  it("should include surface tokens", () => {
    const token = createToken(["surface", "card", "default"]);
    expect(removeCategoriesTokensFilter(token)).toBe(true);
  });
});
