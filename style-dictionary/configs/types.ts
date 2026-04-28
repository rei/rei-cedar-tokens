import type { PlatformConfig } from 'style-dictionary/types';
import type { Theme } from '../constants';
import { commonConfig } from '../utils';
import { typesFilters } from './filters/typesFilters';

export const types = (theme: Theme): PlatformConfig => ({
  types: {
    ...commonConfig(theme, 'types'),
    transforms: [
      'attribute/deprecated',
      'name/pascal',
      'size/strip-all-px-js',
      'size/space-js',
      'value/clamp',
    ],
    files: [
      // Custom Foundations, Components and palettes filters
      ...typesFilters(),
    ],
  },
});
