// Import platform configs and add them below
import { css as cssConfig } from './css';
import { scss as scssConfig } from './scss';
import { js as jsConfig } from './js';
import { ios as iosConfig } from './ios';
import { canonical as canonicalConfig } from './canonical';
import { siteGlobal as siteGlobalConfig } from './site.global';
import { siteWeb as siteWebConfig } from './site.web';
import { siteIos as siteIosConfig } from './site.ios';
import { figma as figmaConfig } from './figma';
import { types as typesConfig } from './types';
import { expandTypesMap } from '@tokens-studio/sd-transforms';
import type { Platform, Theme } from '../constants';
import type { Config, PlatformConfig } from 'style-dictionary/types';

const getSources = (platform: Platform) => {
  const sources: Record<Platform, string[]> = {
    'site/global': [],
    'site/web': ['tokens/legacy/web/**/*.json'],
    'site/ios': ['tokens/legacy/mobile/**/*.json'],
    canonical: ['tokens/legacy/web/**/*.json', 'tokens/legacy/mobile/**/*.json'],
    web: ['tokens/legacy/web/**/*.json'],
    ios: ['tokens/legacy/mobile/**/*.json'],
    figma: ['tokens/legacy/web/**/*.json'],
    types: ['canonical/tokens.json', 'tokens/legacy/web/**/*.json'],
  };

  return sources[platform];
};

const allPlatforms = (platform: Platform, theme: Theme) => {
  const platforms: Record<Platform, Config> = {
    web: { ...cssConfig(theme), ...scssConfig(theme), ...jsConfig(theme) },
    canonical: { ...canonicalConfig(theme) },
    figma: { ...figmaConfig(theme) },
    ios: { ...iosConfig(theme) },
    'site/global': { ...siteGlobalConfig(theme) },
    'site/web': { ...siteWebConfig(theme) },
    'site/ios': { ...siteIosConfig(theme) },
    types: { ...typesConfig(theme) },
  };

  return platforms[platform];
};

export const getConfig = (platform: Platform, theme: Theme): PlatformConfig => {
  const defaultTokens = [
    'tokens/legacy/_options/**/*.json',
    'tokens/legacy/global/**/*.json',
    ...getSources(platform),
  ];

  const themeOverrides = [`tokens/legacy/themes/${theme}/**/*.json`];

  return {
    include: defaultTokens,
    source: themeOverrides,
    expand: {
      typesMap: {
        ...expandTypesMap,
        typography: {
          ...expandTypesMap.typography,
          lineHeight: 'number',
          letterSpacing: 'dimension',
        },
      },
      exclude: (token) => token.$type === 'clamp',
    },
    preprocessors: ['tokens-studio'],
    platforms: allPlatforms(platform, theme),
    usesDtcg: true,
    log: {
      verbosity: 'verbose',
    },
  };
};
