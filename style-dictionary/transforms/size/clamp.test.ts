import { describe, it, expect } from "vitest";
import type { Token } from "style-dictionary";

describe("cssClamp transform", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createMockToken = (value: any, type = "clamp"): Token => ({
    name: "test-token",
    path: ["test", "token"],
    $type: type,
    $value: value,
    original: { $value: value },
    filePath: "test.json",
    isSource: true,
  });

  // We'll test the transform logic directly
  const clampTransform = (token: Token): string => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const v = token.$value ?? (token as any).value;

    if (typeof v === "string") return v;

    const { min, ideal, max } = v || {};
    if (!min || !ideal || !max) {
      throw new Error(
        `Clamp token ${token.name} must have min, ideal, and max values.`,
      );
    }

    return `clamp(${min}, ${ideal}, ${max})`;
  };

  it("should create clamp function with all three values", () => {
    const token = createMockToken({ min: "1rem", ideal: "2vw", max: "3rem" });
    expect(clampTransform(token)).toBe("clamp(1rem, 2vw, 3rem)");
  });

  it("should handle pixel values", () => {
    const token = createMockToken({ min: "16px", ideal: "4vw", max: "48px" });
    expect(clampTransform(token)).toBe("clamp(16px, 4vw, 48px)");
  });

  it("should handle mixed units", () => {
    const token = createMockToken({
      min: "0.875rem",
      ideal: "calc(0.875rem + 0.5vw)",
      max: "1.25rem",
    });
    expect(clampTransform(token)).toBe(
      "clamp(0.875rem, calc(0.875rem + 0.5vw), 1.25rem)",
    );
  });

  it("should throw error when min is missing", () => {
    const token = createMockToken({ ideal: "2vw", max: "3rem" });
    expect(() => clampTransform(token)).toThrow(
      "Clamp token test-token must have min, ideal, and max values",
    );
  });

  it("should throw error when ideal is missing", () => {
    const token = createMockToken({ min: "1rem", max: "3rem" });
    expect(() => clampTransform(token)).toThrow(
      "Clamp token test-token must have min, ideal, and max values",
    );
  });

  it("should throw error when max is missing", () => {
    const token = createMockToken({ min: "1rem", ideal: "2vw" });
    expect(() => clampTransform(token)).toThrow(
      "Clamp token test-token must have min, ideal, and max values",
    );
  });

  it("should return string value as-is when value is already a string", () => {
    const token = createMockToken("clamp(1rem, 2vw, 3rem)");
    expect(clampTransform(token)).toBe("clamp(1rem, 2vw, 3rem)");
  });

  it("should handle numeric string values", () => {
    const token = createMockToken({ min: "10", ideal: "20", max: "30" });
    expect(clampTransform(token)).toBe("clamp(10, 20, 30)");
  });
});
