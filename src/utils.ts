import { RGB, RGBA } from '@figma/rest-api-spec';
import type { TokenLeaf } from './types/types.js';

/**
 * Formats a message with green ANSI color codes for terminal output.
 *
 * @param msg - The message to format
 * @returns The message wrapped in ANSI green color codes
 */
export function green(msg: string) {
  return `\x1b[32m${msg}\x1b[0m`;
}

/**
 * Converts RGB or RGBA color values to hexadecimal color string.
 *
 * @param color - RGB or RGBA color object with values between 0 and 1
 * @returns Hexadecimal color string (e.g., '#ff5500' or '#ff5500aa' with alpha)
 */
export function rgbToHex({ r, g, b, ...rest }: RGB | RGBA) {
  const a = 'a' in rest ? rest.a : 1;

  const toHex = (value: number) => {
    const hex = Math.round(value * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  const hex = [toHex(r), toHex(g), toHex(b)].join('');
  return `#${hex}` + (a !== 1 ? toHex(a) : '');
}

/**
 * Type guard that checks if an unknown value is a non-null object record.
 *
 * Excludes JavaScript `null` and `Array` instances, ensuring the value can
 * safely be treated as a key-value object (`Record<string, unknown>`).
 *
 * @param value - The unknown value to inspect.
 * @returns `true` if the value is a valid non-array object record, narrowing its type; otherwise `false`.
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Type guard that checks if an unknown value is a valid `TokenLeaf`.
 *
 * A value is considered a `TokenLeaf` if it satisfies all of the following:
 * - Is a non-null object record.
 * - Has a defined `$value` property.
 * - Has a `$type` property with a type of `string`.
 * - Does **not** contain a `$meta` property.
 * - Does **not** contain a `$extensions.skip` flag.
 *
 * @param value - The unknown value to inspect.
 * @returns `true` if the value matches the `TokenLeaf` structure, narrowing its type; otherwise `false`.
 */
export function isTokenLeaf(value: unknown): value is TokenLeaf {
  // 1. Must be a valid object/record
  if (!isRecord(value)) {
    return false;
  }

  // 2. Must have "$value" (defined) and "$type" (string)
  const hasValidValue = '$value' in value && value.$value !== undefined;
  const hasValidType = '$type' in value && typeof value.$type === 'string';

  if (!hasValidValue || !hasValidType) {
    return false;
  }

  // 3. Must NOT contain $meta
  if ('$meta' in value) {
    return false;
  }

  // 4. Must NOT have $extensions.skip
  if ('$extensions' in value && isRecord(value.$extensions) && 'skip' in value.$extensions) {
    return false;
  }

  return true;
}
