import { describe, it, expect } from "vitest";
import { pxToRem } from "../../utils";

describe("pxToRem utility", () => {
  it("should convert single px value to rem", () => {
    expect(pxToRem("16px", 10)).toBe("1.6rem");
    expect(pxToRem("10px", 10)).toBe("1rem");
    expect(pxToRem("5px", 10)).toBe("0.5rem");
  });

  it("should convert multiple space-separated px values to rem", () => {
    expect(pxToRem("16px 32px", 10)).toBe("1.6rem 3.2rem");
    expect(pxToRem("10px 20px 30px 40px", 10)).toBe("1rem 2rem 3rem 4rem");
  });

  it("should handle zero values without units", () => {
    expect(pxToRem("0", 10)).toBe("0");
    expect(pxToRem("0px", 10)).toBe("0");
    expect(pxToRem("16px 0 8px", 10)).toBe("1.6rem 0 0.8rem");
  });

  it("should preserve values already in rem", () => {
    expect(pxToRem("1.6rem", 10)).toBe("1.6rem");
    expect(pxToRem("2rem 3rem", 10)).toBe("2rem 3rem");
  });

  it("should use default base font size when not provided", () => {
    expect(pxToRem("10px")).toBe("1rem"); // BASE_FONT_SIZE = 10
  });

  it("should handle different base font sizes", () => {
    expect(pxToRem("16px", 16)).toBe("1rem");
    expect(pxToRem("32px", 16)).toBe("2rem");
  });

  it("should return string representation for number inputs", () => {
    expect(pxToRem(16, 10)).toBe("16");
  });

  it("should handle empty strings", () => {
    expect(pxToRem("", 10)).toBe("0");
  });

  it("should handle mixed units", () => {
    expect(pxToRem("16px 2rem 8px", 10)).toBe("1.6rem 2rem 0.8rem");
  });

  it("should handle decimal values", () => {
    expect(pxToRem("15.5px", 10)).toBe("1.55rem");
  });
});
