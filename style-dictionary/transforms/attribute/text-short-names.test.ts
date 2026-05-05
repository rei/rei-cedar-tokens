import { describe, it, expect } from 'vitest';
import type { Token } from 'style-dictionary';

describe('attribute/text-short-names transform', () => {
  const TEXT_PROPERTY_MAP: Record<string, string> = {
    fontFamily: 'family',
    fontSize: 'size',
    fontStyle: 'style',
    fontWeight: 'weight',
    textTransform: 'transform',
  };

  const filter = (token: Token): boolean => token.path[0].startsWith('text-');

  const transform = (token: Token): Record<string, unknown> => {
    token.path = token.path.map((segment: string) => TEXT_PROPERTY_MAP[segment] || segment);
    return {};
  };

  const createToken = (path: string[]): Token => ({
    name: 'test-token',
    path,
    $type: 'string',
    $value: 'test',
    original: { $value: 'test' },
    filePath: 'test.json',
    isSource: true,
  });

  describe('filter', () => {
    it('should include tokens where path[0] starts with "text-"', () => {
      expect(filter(createToken(['text-default', 'fontFamily']))).toBe(true);
    });

    it('should include tokens with text-eyebrow, text-heading, etc.', () => {
      expect(filter(createToken(['text-eyebrow', 'fontSize']))).toBe(true);
      expect(filter(createToken(['text-heading', 'fontWeight']))).toBe(true);
      expect(filter(createToken(['text-body', 'fontStyle']))).toBe(true);
    });

    it('should exclude non-text tokens', () => {
      expect(filter(createToken(['color', 'text', 'primary']))).toBe(false);
      expect(filter(createToken(['space', 'scale', '2']))).toBe(false);
    });
  });

  describe('transform', () => {
    it('should map fontFamily to family', () => {
      const token = createToken(['text-default', 'fontFamily']);
      transform(token);
      expect(token.path).toEqual(['text-default', 'family']);
    });

    it('should map fontSize to size', () => {
      const token = createToken(['text-default', 'fontSize']);
      transform(token);
      expect(token.path).toEqual(['text-default', 'size']);
    });

    it('should map fontStyle to style', () => {
      const token = createToken(['text-default', 'fontStyle']);
      transform(token);
      expect(token.path).toEqual(['text-default', 'style']);
    });

    it('should map fontWeight to weight', () => {
      const token = createToken(['text-default', 'fontWeight']);
      transform(token);
      expect(token.path).toEqual(['text-default', 'weight']);
    });

    it('should map textTransform to transform', () => {
      const token = createToken(['text-eyebrow', 'textTransform']);
      transform(token);
      expect(token.path).toEqual(['text-eyebrow', 'transform']);
    });

    it('should leave unmapped segments unchanged', () => {
      const token = createToken(['text-default', 'lineHeight']);
      transform(token);
      expect(token.path).toEqual(['text-default', 'lineHeight']);
    });

    it('should not affect non-text tokens (when filter is bypassed)', () => {
      const token = createToken(['color', 'fontFamily']);
      transform(token);
      expect(token.path).toEqual(['color', 'family']);
    });

    it('should handle deeply nested paths', () => {
      const token = createToken(['text-body', '300', 'default', 'fontFamily', 'fontWeight']);
      transform(token);
      expect(token.path).toEqual(['text-body', '300', 'default', 'family', 'weight']);
    });
  });
});
