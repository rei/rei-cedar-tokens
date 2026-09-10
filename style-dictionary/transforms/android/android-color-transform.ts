import type { Transform } from 'style-dictionary/types';
import { converter, parse } from 'culori';

const toRgb = converter('rgb');

export const androidColorTransform: Transform = {
  name: 'value/android-color',
  type: 'value',
  transform: (token) => {
    if (token.$type !== 'color') {
      return token.$value;
    }

    const value = token.$value as string;

    // If already a hex value, just return it
    if (value.startsWith('#')) {
      return value;
    }

    // Otherwise try to parse and convert to hex
    const parsed = parse(value);
    if (!parsed) {
      throw new Error(`[android-color] Could not parse color value "${value}"`);
    }

    // Convert to RGB and format as hex
    const rgb = toRgb(parsed);
    if (!rgb) {
      throw new Error(`[android-color] Could not convert color value "${value}" to RGB`);
    }

    const r = Math.round(((rgb as { r?: number }).r ?? 0) * 255);
    const g = Math.round(((rgb as { g?: number }).g ?? 0) * 255);
    const b = Math.round(((rgb as { b?: number }).b ?? 0) * 255);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  },
};
