import { describe, expect, it } from 'vitest';
import {
  buildIntentsBundle,
  collectUiTokens,
  renderBundleDts,
  renderBundleMjs,
} from './intents-output';

const fixture = {
  UI: {
    Primary: {
      surface: { $value: '#ffffff', $type: 'color' },
      text: { $value: '#4c473e', $type: 'color' },
      icon: { $value: '#4c473e', $type: 'color' },
      border: { $value: '#cecac3', $type: 'color' },
      'text-emphasis': { $value: '#312d27', $type: 'color' },
    },
    Brand: {
      surface: { $value: '#143528', $type: 'color' },
      text: { $value: '#ffffff', $type: 'color' },
      icon: { $value: '#ffffff', $type: 'color' },
      border: { $value: '#e5fd9c', $type: 'color' },
    },
    link: {
      rest: { $value: '#3d6db9', $type: 'color' },
      active: { $value: '#5889d6', $type: 'color' },
      visited: { $value: '#1e4683', $type: 'color' },
      'border hover': { $value: '#3d6db9', $type: 'color' },
      'border active': { $value: '#5889d6', $type: 'color' },
    },
  },
};

describe('collectUiTokens', () => {
  it('collects all UI leaf tokens', () => {
    const tokens = collectUiTokens(fixture);
    expect(tokens).toHaveLength(14);
  });
});

describe('buildIntentsBundle', () => {
  it('bundles each intent with its coordinated category values', () => {
    const bundle = buildIntentsBundle(collectUiTokens(fixture));

    expect(bundle['Primary']).toEqual({
      surface: '#ffffff',
      text: '#4c473e',
      icon: '#4c473e',
      border: '#cecac3',
      textEmphasis: '#312d27',
    });

    expect(bundle['Brand']).toEqual({
      surface: '#143528',
      text: '#ffffff',
      icon: '#ffffff',
      border: '#e5fd9c',
    });
  });

  it('nests link states under text and border', () => {
    const bundle = buildIntentsBundle(collectUiTokens(fixture));

    expect(bundle['Link']).toEqual({
      text: { rest: '#3d6db9', active: '#5889d6', visited: '#1e4683' },
      border: { hover: '#3d6db9', active: '#5889d6' },
    });
  });
});

describe('renderBundleMjs', () => {
  it('emits CdrIntents and a CdrIntentOrder array of intent names', () => {
    const bundle = buildIntentsBundle(collectUiTokens(fixture));
    const output = renderBundleMjs(bundle);
    expect(output).toContain('export const CdrIntents');
    expect(output).toContain('Primary: {');
    expect(output).toContain('export const CdrIntentOrder');
    expect(output).toMatch(/CdrIntentOrder = \[\s*"Primary",\s*"Brand",\s*"Link",?\s*\]/s);
  });
});

describe('renderBundleDts', () => {
  it('emits CdrIntentsType and a CdrIntentKey union', () => {
    const bundle = buildIntentsBundle(collectUiTokens(fixture));
    const output = renderBundleDts(bundle);
    expect(output).toContain('export type CdrIntentsType');
    expect(output).toContain('export type CdrIntentKey = keyof CdrIntentsType');
    expect(output).toContain('export declare const CdrIntentOrder');
  });
});
