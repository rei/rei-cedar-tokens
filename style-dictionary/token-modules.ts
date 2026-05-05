import type { Theme } from './constants';
import { foundationsModulesName } from './configs/filters/modules';

export type ModuleTarget = 'js' | 'scss' | 'types';

export interface TokenModuleDefinition {
  responsibility: 'foundations' | 'palettes';
  name: string;
  filter: string;
  targets: ModuleTarget[];
  themes?: Theme[];
}

const foundationsModules: TokenModuleDefinition[] = foundationsModulesName.map((moduleName) => ({
  responsibility: 'foundations',
  name: `cdr-${moduleName}`,
  filter: `foundations-${moduleName}-tokens`,
  targets: ['js', 'scss', 'types'],
}));

const TOKEN_MODULES: TokenModuleDefinition[] = [
  ...foundationsModules,
  {
    responsibility: 'palettes',
    name: 'cdr-palette-membership-subtle',
    filter: 'membership-subtle-tokens',
    targets: ['scss'],
    themes: ['rei-dot-com'],
  },
  {
    responsibility: 'palettes',
    name: 'cdr-palette-membership-vibrant',
    filter: 'membership-vibrant-tokens',
    targets: ['scss'],
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
