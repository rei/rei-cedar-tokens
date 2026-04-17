import type { PlatformConfig } from 'style-dictionary/types';
import type { Theme } from '../constants';
import { commonConfig } from '../utils';

export const css = (theme: Theme): PlatformConfig => ({
  css: {
    ...commonConfig(theme, 'css'),
    transformGroup: 'tokens-studio',
    transforms: [
      'attribute/deprecated',
      'name/kebab',
      'size/space',
      'size/px-to-rem-transitive',
      'value/clamp',
    ],
    files: [
      {
        destination: 'cdr-variables.css',
        format: 'css/variables',
        filter: 'remove-categories-tokens',
      },
      {
        destination: 'foundations/cdr-color-background.css',
        format: 'css/variables',
        filter: 'color-background-tokens',
      },
      {
        destination: 'foundations/cdr-color-text.css',
        format: 'css/variables',
        filter: 'color-text-tokens',
      },
      {
        destination: 'foundations/cdr-color-border.css',
        format: 'css/variables',
        filter: 'color-border-tokens',
      },
      {
        destination: 'foundations/cdr-color-icon.css',
        format: 'css/variables',
        filter: 'color-icon-tokens',
      },
      {
        destination: 'foundations/cdr-motion.css',
        format: 'css/variables',
        filter: 'motion-tokens',
      },
      {
        destination: 'foundations/cdr-prominence.css',
        format: 'css/variables',
        filter: 'prominence-tokens',
      },
      {
        destination: 'foundations/cdr-form.css',
        format: 'css/variables',
        filter: 'form-tokens',
      },
      {
        destination: 'foundations/cdr-icon.css',
        format: 'css/variables',
        filter: 'icon-tokens',
      },
      {
        destination: 'foundations/cdr-radius.css',
        format: 'css/variables',
        filter: 'radius-tokens',
      },
      {
        destination: 'foundations/cdr-space.css',
        format: 'css/variables',
        filter: 'space-tokens',
      },
      // REI Dot Com Specific Palettes
      ...(theme == 'rei-dot-com'
        ? [
            {
              destination: 'palettes/cdr-palette-membership-subtle.css',
              format: 'css/variables',
              filter: 'membership-subtle-tokens',
            },
            {
              destination: 'palettes/cdr-palette-membership-vibrant.css',
              format: 'css/variables',
              filter: 'membership-vibrant-tokens',
            },
          ]
        : []),
    ],
    actions: ['concat-files'],
  },
});
