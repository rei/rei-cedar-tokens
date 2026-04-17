import type { Token } from 'style-dictionary';
import type { PlatformConfig } from 'style-dictionary/types';
import type { Theme } from '../constants';
import { commonConfig, filterSourceTokensAndType } from '../utils';

export const ios = (theme: Theme): PlatformConfig => ({
  ios: {
    ...commonConfig(theme, 'ios'),
    transforms: [
      'attribute/deprecated',
      'name/pascal',
      'color/UIColor',
      'size/strip-px',
      'size/space',
      'size/float',
    ],
    files: [
      {
        destination: 'CdrSize.h',
        format: 'ios/static.h',
        filter: (token: Token) => filterSourceTokensAndType(token, ['dimension', 'fontSize']),
        options: {
          type: 'float',
          className: 'CdrSize',
        },
      },
      {
        destination: 'CdrSize.m',
        format: 'ios/static.m',
        filter: (token: Token) => filterSourceTokensAndType(token, ['dimension', 'fontSize']),
        options: {
          type: 'float',
          className: 'CdrSize',
        },
      },
      {
        destination: 'CdrColor.h',
        format: 'ios/colors.h',
        filter: (token: Token) => filterSourceTokensAndType(token, 'color'),
        options: {
          type: 'CdrColorName',
          className: 'CdrColor',
        },
      },
      {
        destination: 'CdrColor.m',
        format: 'ios/colors.m',
        filter: (token: Token) => filterSourceTokensAndType(token, 'color'),
        options: {
          type: 'CdrColorName',
          className: 'CdrColor',
        },
      },
    ],
  },
});
