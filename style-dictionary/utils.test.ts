import { describe, it, expect } from 'vitest';
import {
  getDirname,
  BASE_FONT_SIZE,
  commonConfig,
  filterSourceTokensAndType,
  pxToRem
} from './utils';
import type { Token } from 'style-dictionary';

describe('utils', () => {
  describe('BASE_FONT_SIZE', () => {
    it('should be 10', () => {
      expect(BASE_FONT_SIZE).toBe(10);
    });
  });

  describe('getDirname', () => {
    it('should convert file URL to dirname', () => {
      const result = getDirname('file:///Users/test/project/file.ts');
      expect(result).toBe('/Users/test/project');
    });
  });

  describe('commonConfig', () => {
    it('should generate config with correct prefix and buildPath', () => {
      const config = commonConfig('rei-dot-com', 'web');

      expect(config.prefix).toBe('cdr');
      expect(config.buildPath).toBe('dist/rei-dot-com/web/');
      expect(config.options.showFileHeader).toBe(false);
    });

    it('should handle different themes and platforms', () => {
      const config = commonConfig('docsite', 'android');

      expect(config.buildPath).toBe('dist/docsite/android/');
      expect(config.prefix).toBe('cdr');
    });
  });

  describe('filterSourceTokensAndType', () => {
    const createToken = (path: string[], type?: string): Token => ({
      name: 'test',
      path,
      $type: type,
      $value: 'test-value',
      original: { $value: 'test-value' },
      filePath: 'test.json',
      isSource: true
    });

    it('should filter out options tokens', () => {
      const token = createToken(['options', 'color', 'primary'], 'color');
      expect(filterSourceTokensAndType(token, 'color')).toBe(false);
    });

    it('should filter out theme tokens', () => {
      const token = createToken(['theme', 'color', 'primary'], 'color');
      expect(filterSourceTokensAndType(token, 'color')).toBe(false);
    });

    it('should filter out tokens without $type', () => {
      const token = createToken(['global', 'color', 'primary'], undefined);
      expect(filterSourceTokensAndType(token, 'color')).toBe(false);
    });

    it('should include tokens with matching type', () => {
      const token = createToken(['global', 'color', 'primary'], 'color');
      expect(filterSourceTokensAndType(token, 'color')).toBe(true);
    });

    it('should filter out tokens with non-matching type', () => {
      const token = createToken(['global', 'spacing', 'small'], 'dimension');
      expect(filterSourceTokensAndType(token, 'color')).toBe(false);
    });

    it('should handle array of types', () => {
      const colorToken = createToken(['global', 'color', 'primary'], 'color');
      const dimensionToken = createToken(['global', 'spacing', 'small'], 'dimension');
      const fontToken = createToken(['global', 'font', 'size'], 'fontSize');

      expect(filterSourceTokensAndType(colorToken, ['color', 'dimension'])).toBe(true);
      expect(filterSourceTokensAndType(dimensionToken, ['color', 'dimension'])).toBe(true);
      expect(filterSourceTokensAndType(fontToken, ['color', 'dimension'])).toBe(false);
    });

    it('should include valid tokens from global', () => {
      const token = createToken(['global', 'button', 'bg'], 'color');
      expect(filterSourceTokensAndType(token, 'color')).toBe(true);
    });
  });

  describe('pxToRem (from utils)', () => {
    it('should convert px to rem', () => {
      expect(pxToRem('16px', 10)).toBe('1.6rem');
    });

    it('should handle multiple values', () => {
      expect(pxToRem('16px 32px', 10)).toBe('1.6rem 3.2rem');
    });

    it('should handle zero', () => {
      expect(pxToRem('0', 10)).toBe('0');
    });
  });
});
