import type { TransformedToken } from 'style-dictionary/types';
import type { PlatformConfig } from 'style-dictionary/types';
import type { Theme } from '../constants';
import { commonConfig } from '../utils';

export const ios = (theme: Theme): PlatformConfig => ({
  ios: {
    ...commonConfig(theme, 'ios'),
    transforms: ['name/ios-camel', 'value/ios/text'],
    files: [
      {
        destination: 'CedarText.swift',
        format: 'ios/swift-text',
        filter: (token: TransformedToken) => token.path[0] === 'text',
      },
    ],
  },
});
