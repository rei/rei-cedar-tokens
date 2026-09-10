/**
 * format-number.ts
 *
 * Shared numeric formatting used across the color pipeline
 * (oklch-formulas.ts, ios-color-action.ts) to keep CSS/JSON numeric output
 * consistent. Was previously duplicated in both files.
 */

/**
 * Format a number to a fixed precision, trimming trailing zeros via
 * Number() round-tripping and normalizing -0 to 0.
 */
export function formatNumber(value: number, precision: number): string {
  const rounded = Number(value.toFixed(precision));
  return String(Object.is(rounded, -0) ? 0 : rounded);
}
