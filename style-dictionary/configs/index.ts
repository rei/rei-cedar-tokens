// Import platform configs and add them below
import { css as cssConfig } from './css';
import { scss as scssConfig } from './scss';
import { js as jsConfig } from './js';
import { android as androidConfig } from './android';
import { ios as iosConfig } from './ios';
import { siteGlobal as siteGlobalConfig } from './site.global';
import { siteWeb as siteWebConfig } from './site.web';
import { siteAndroid as siteAndroidConfig } from './site.android';
import { siteIos as siteIosConfig } from './site.ios';
import { figma as figmaConfig } from './figma';
import { types as typesConfig } from './types';
import type { Platform, Theme } from '../constants';
import type { Config, PlatformConfig } from 'style-dictionary/types';

const getSources = (platform: Platform) => {
  const sources: Record<Platform, string[]> = {
    'site/global': [],
    'site/web': ['tokens/web/**/*.json'],
    'site/android': ['tokens/mobile/**/*.json'],
    'site/ios': ['tokens/mobile/**/*.json'],
    web: ['tokens/web/**/*.json'],
    android: ['tokens/mobile/**/*.json'],
    ios: ['tokens/mobile/**/*.json'],
    figma: ['tokens/web/**/*.json'],
    types: ['tokens/web/**/*.json']
  };

  return sources[platform];
};

const allPlatforms = (platform: Platform, theme: Theme) => {
  const platforms: Record<Platform, Config> = {
    web: { ...cssConfig(theme), ...scssConfig(theme), ...jsConfig(theme) },
    figma: { ...figmaConfig(theme) },
    android: { ...androidConfig(theme) },
    ios: { ...iosConfig(theme) },
    'site/global': { ...siteGlobalConfig(theme) },
    'site/web': { ...siteWebConfig(theme) },
    'site/android': { ...siteAndroidConfig(theme) },
    'site/ios': { ...siteIosConfig(theme) },
    types: { ...typesConfig(theme) }
  };

  return platforms[platform];
};

export const getConfig = (platform: Platform, theme: Theme): PlatformConfig => {
  const defaultTokens = [
    'tokens/_options/**/*.json',
    'tokens/global/**/*.json',
    ...getSources(platform)
  ];

  const themeOverrides = [`tokens/themes/${theme}/**/*.json`];

  return {
    include: defaultTokens,
    source: themeOverrides,
    expand: {
      include: ['typography']
    },
    preprocessors: ['tokens-studio'],
    platforms: allPlatforms(platform, theme),
    usesDtcg: true,
    log: {
      verbosity: 'verbose'
    }
  };
};
