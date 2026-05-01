import type { Theme } from './constants';

export type ModuleTarget = 'js' | 'scss' | 'types';

export interface TokenModuleDefinition {
  responsibility: 'foundations' | 'components' | 'palettes';
  name: string;
  filter: string;
  targets: ModuleTarget[];
  themes?: Theme[];
}

const TOKEN_MODULES: TokenModuleDefinition[] = [
  {
    responsibility: 'foundations',
    name: 'cdr-color-background',
    filter: 'color-background-tokens',
    targets: ['js', 'scss', 'types'],
  },
  {
    responsibility: 'foundations',
    name: 'cdr-color-text',
    filter: 'color-text-tokens',
    targets: ['js', 'scss', 'types'],
  },
  {
    responsibility: 'foundations',
    name: 'cdr-color-border',
    filter: 'color-border-tokens',
    targets: ['js', 'scss', 'types'],
  },
  {
    responsibility: 'foundations',
    name: 'cdr-color-icon',
    filter: 'color-icon-tokens',
    targets: ['js', 'scss', 'types'],
  },
  {
    responsibility: 'foundations',
    name: 'cdr-motion',
    filter: 'motion-tokens',
    targets: ['js', 'scss', 'types'],
  },
  {
    responsibility: 'foundations',
    name: 'cdr-prominence',
    filter: 'prominence-tokens',
    targets: ['js', 'scss', 'types'],
  },
  {
    responsibility: 'components',
    name: 'cdr-form',
    filter: 'component-form-tokens',
    targets: ['js', 'scss', 'types'],
  },
  {
    responsibility: 'components',
    name: 'cdr-icon',
    filter: 'component-icon-tokens',
    targets: ['js', 'scss', 'types'],
  },
  {
    responsibility: 'foundations',
    name: 'cdr-radius',
    filter: 'radius-tokens',
    targets: ['js', 'scss', 'types'],
  },
  {
    responsibility: 'foundations',
    name: 'cdr-space',
    filter: 'space-tokens',
    targets: ['js', 'scss', 'types'],
  },
  {
    responsibility: 'palettes',
    name: 'cdr-palette-membership-subtle',
    filter: 'membership-subtle-tokens',
    targets: ['scss', 'types'],
    themes: ['rei-dot-com'],
  },
  {
    responsibility: 'palettes',
    name: 'cdr-palette-membership-vibrant',
    filter: 'membership-vibrant-tokens',
    targets: ['scss', 'types'],
    themes: ['rei-dot-com'],
  },
];

export const getTokenModules = (theme: Theme, target: ModuleTarget): TokenModuleDefinition[] => {
  return TOKEN_MODULES.filter(
    (tokenModule) =>
      tokenModule.targets.includes(target) &&
      (tokenModule.themes === undefined || tokenModule.themes.includes(theme)),
  );
};
