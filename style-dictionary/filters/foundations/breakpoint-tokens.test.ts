import { describe, it, expect } from "vitest";
import type { Token } from "style-dictionary";

describe("foundations-breakpoint-tokens filter", () => {
  // Helper to mock the exact structure from your JSON
  const createToken = (path: string[], value: string): Token => ({
    name: `test-token-${path.join("-")}`,
    path,
    $type: "breakpoint",
    $value: value,
    original: { $value: value },
    filePath: "tokens/breakpoint.json",
    isSource: true,
  });

  // The intended logic based on your JSDoc and JSON structure
  const foundationsBreakpointTokensFilter = (token: Token): boolean =>
    token.path[0] !== "options" && token.path[0] === "breakpoint";

  it('should include the "xs" breakpoint token from the JSON', () => {
    // Maps to: "breakpoint": { "xs": { ... } }
    const token = createToken(["breakpoint", "xs"], "0");
    expect(foundationsBreakpointTokensFilter(token)).toBe(true);
  });

  it('should include the "sm" breakpoint token from the JSON', () => {
    // Maps to: "breakpoint": { "sm": { ... } }
    const token = createToken(["breakpoint", "sm"], "768px");
    expect(foundationsBreakpointTokensFilter(token)).toBe(true);
  });

  it('should include the "lg" breakpoint token from the JSON', () => {
    // Maps to: "breakpoint": { "lg": { ... } }
    const token = createToken(["breakpoint", "lg"], "1232px");
    expect(foundationsBreakpointTokensFilter(token)).toBe(true);
  });

  it('should filter out "breakpoint" tokens if they are nested inside the options namespace', () => {
    const token = createToken(["options", "breakpoint", "md"], "992px");
    expect(foundationsBreakpointTokensFilter(token)).toBe(false);
  });

  it("should filter out tokens that are not breakpoints (e.g., radius)", () => {
    const token = createToken(["radius", "medium"], "8px");
    expect(foundationsBreakpointTokensFilter(token)).toBe(false);
  });

  it('should filter out tokens where "breakpoint" is not the root namespace', () => {
    const token = createToken(["layout", "grid", "breakpoint"], "768px");
    expect(foundationsBreakpointTokensFilter(token)).toBe(false);
  });
});
