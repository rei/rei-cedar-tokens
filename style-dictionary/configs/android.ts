import type { Token } from 'style-dictionary';
import type { PlatformConfig } from 'style-dictionary/types';
import type { Theme } from '../constants';
import { commonConfig, filterSourceTokensAndType } from '../utils';

export const android = (theme: Theme): PlatformConfig => ({
  android: {
    ...commonConfig(theme, 'android'),
    transforms: ['name/snake', 'size/space', 'size/dp-transitive', 'size/sp', 'color/hex8android'],
    files: [
      {
        destination: 'colors.xml',
        filter: (token: Token) => filterSourceTokensAndType(token, 'color'),
        format: 'android/resources'
      },
      {
        destination: 'font_dimens.xml',
        filter: (token: Token) => filterSourceTokensAndType(token, 'fontSize'),
        format: 'android/fontDimens'
      },
      {
        destination: 'dimens.xml',
        filter: (token: Token) => filterSourceTokensAndType(token, 'dimension'),
        format: 'android/dimens'
      }
    ]
  }
});
