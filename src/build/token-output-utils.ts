import type { DesignTokens, Dictionary, TransformedToken } from 'style-dictionary/types';
import { isRecord, isTokenLeaf } from '../utils.js';

export interface ModuleDefinition {
  theme: string;
  responsibility: string;
  moduleFileName: string;
  interfaceName: string;
  unionTypeName: string;
  matchesToken: (token: TransformedToken) => boolean;
  getTokenName: (token: TransformedToken) => string;
}

function toPascalCase(value: string): string {
  const parts = value.match(/[a-zA-Z0-9]+/g) ?? [];

  return parts
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
}

function createModuleDefinition(
  moduleFileName: string,
  getRelativePath: (token: TransformedToken) => string[],
) {
  const typeBaseName = toPascalCase(moduleFileName);
  const tokenNamePrefix = moduleFileName.replace(/^cdr-/, '');

  return {
    theme: 'rei-dot-com',
    responsibility: 'foundations',
    moduleFileName,
    interfaceName: `${typeBaseName}Tokens`,
    unionTypeName: `${typeBaseName}TokenName`,
    matchesToken: (token: TransformedToken) => getRelativePath(token).length > 0,
    getTokenName: (token: TransformedToken) =>
      [tokenNamePrefix, ...getRelativePath(token)].join('-'),
  } satisfies ModuleDefinition;
}

const MODULE_DEFINITIONS: ModuleDefinition[] = [
  // Color semantic categories
  // TBD: Review if these color categories added are correct.
  // Let them there for the moment so StoryBook keeps working
  createModuleDefinition('cdr-color-surface', (token) => {
    if (token.path[0] !== 'color' || token.path[1] !== 'surface') {
      return [];
    }
    // token path: color.surface.base → return ["base"]
    return token.path.slice(2);
  }),
  createModuleDefinition('cdr-color-text', (token) => {
    if (token.path[0] !== 'color' || token.path[1] !== 'text') {
      return [];
    }
    // token path: color.text.base → return ["base"]
    return token.path.slice(2);
  }),
  createModuleDefinition('cdr-color-border', (token) => {
    if (token.path[0] !== 'color' || token.path[1] !== 'border') {
      return [];
    }
    // token path: color.border.base → return ["base"]
    return token.path.slice(2);
  }),
  createModuleDefinition('cdr-color-action', (token) => {
    if (token.path[0] !== 'color' || token.path[1] !== 'action') {
      return [];
    }
    // token path: color.action.edge → return ["edge"]
    return token.path.slice(2);
  }),
  createModuleDefinition('cdr-color-selection', (token) => {
    if (token.path[0] !== 'color' || token.path[1] !== 'selection') {
      return [];
    }
    // token path: color.selection.on → return ["on"]
    return token.path.slice(2);
  }),
  createModuleDefinition('cdr-color-feedback', (token) => {
    if (token.path[0] !== 'color' || token.path[1] !== 'feedback') {
      return [];
    }
    // token path: color.feedback.info → return ["info"]
    return token.path.slice(2);
  }),
  createModuleDefinition('cdr-color-navigation', (token) => {
    if (token.path[0] !== 'color' || token.path[1] !== 'navigation') {
      return [];
    }
    // token path: color.navigation.on → return ["on"]
    return token.path.slice(2);
  }),
  createModuleDefinition('cdr-color-icon', (token) => {
    if (token.path[0] !== 'color' || token.path[1] !== 'icon') {
      return [];
    }
    // token path: color.icon.neutral.bold → return ["neutral"]
    return token.path.slice(2);
  }),
  createModuleDefinition('cdr-color-overlay', (token) => {
    if (token.path[0] !== 'color' || token.path[1] !== 'overlay') {
      return [];
    }
    // token path: color.icon.overlay.bold → return ["neutral"]
    return token.path.slice(2);
  }),

  // Spacing semantic categories
  createModuleDefinition('cdr-spacing-scale', (token) => {
    if (token.path[0] !== 'spacing' || token.path[1] !== 'scale' || token.path.length < 3) {
      return [];
    }
    // token path: spacing.scale.-50 → return ["-50"]
    return token.path.slice(2);
  }),
  createModuleDefinition('cdr-spacing-component', (token) => {
    if (token.path[0] !== 'spacing' || token.path[1] !== 'component' || token.path.length < 3) {
      return [];
    }
    // token path: spacing.component.sm → return ["sm"]
    return token.path.slice(2);
  }),
  createModuleDefinition('cdr-spacing-layout', (token) => {
    if (token.path[0] !== 'spacing' || token.path[1] !== 'layout' || token.path.length < 3) {
      return [];
    }
    // token path: spacing.layout.sm → return ["sm"]
    return token.path.slice(2);
  }),

  createModuleDefinition('cdr-spacing-static', (token) => {
    if (token.path[0] !== 'spacing' || token.path[1] !== 'static' || token.path.length < 3) {
      return [];
    }
    // token path: spacing.static.sm → return ["sm"]
    return token.path.slice(2);
  }),

  // Typography categories
  createModuleDefinition('cdr-text-family', (token) => {
    if (token.path[0] !== 'text' || token.path[1] !== 'family' || token.path.length < 3) {
      return [];
    }
    // token path: text.family.graphik → return ["graphik"]
    return token.path.slice(2);
  }),

  createModuleDefinition('cdr-text-letter-spacing', (token) => {
    if (
      token.path[0] !== 'text' ||
      token.path[1] !== 'letter' ||
      token.path[2] !== 'spacing' ||
      token.path.length < 4
    ) {
      return [];
    }
    // token path: text.letter.spacing.tightest → return ["tightest"]
    return token.path.slice(2);
  }),

  createModuleDefinition('cdr-text-line-height', (token) => {
    if (
      token.path[0] !== 'text' ||
      token.path[1] !== 'line' ||
      token.path[2] !== 'height' ||
      token.path.length < 4
    ) {
      return [];
    }
    // token path: text.line.height.0 → return ["0"]
    return token.path.slice(2);
  }),

  createModuleDefinition('cdr-text-size-static', (token) => {
    if (
      token.path[0] !== 'text' ||
      token.path[1] !== 'size' ||
      token.path[2] !== 'static' ||
      token.path.length < 4
    ) {
      return [];
    }
    // token path: text.size.static.100 → return ["100"]
    return token.path.slice(2);
  }),

  createModuleDefinition('cdr-text-size-fluid', (token) => {
    if (
      token.path[0] !== 'text' ||
      token.path[1] !== 'size' ||
      token.path[2] !== 'fluid' ||
      token.path.length < 4
    ) {
      return [];
    }
    // token path: text.size.fluid.100 → return ["100"]
    return token.path.slice(2);
  }),

  createModuleDefinition('cdr-text-style', (token) => {
    if (token.path[0] !== 'text' || token.path[1] !== 'style' || token.path.length < 3) {
      return [];
    }
    // token path: text.style.normal → return ["normal"]
    return token.path.slice(2);
  }),

  createModuleDefinition('cdr-text-weight', (token) => {
    if (token.path[0] !== 'text' || token.path[1] !== 'weight' || token.path.length < 3) {
      return [];
    }
    // token path: text.weight.normal → return ["normal"]
    return token.path.slice(2);
  }),
];

function collectLeafPaths(tokens: DesignTokens): string[][] {
  const leafPaths: string[][] = [];

  const visit = (node: unknown, currentPath: string[]) => {
    if (isTokenLeaf(node)) {
      leafPaths.push(currentPath);
      return;
    }

    if (!isRecord(node)) {
      return;
    }

    for (const [key, child] of Object.entries(node)) {
      visit(child, [...currentPath, key]);
    }
  };

  visit(tokens, []);

  return leafPaths;
}

export function collectModuleDefinitions(tokens: DesignTokens): ModuleDefinition[] {
  const leafPaths = collectLeafPaths(tokens);

  return MODULE_DEFINITIONS.filter((moduleDefinition) =>
    leafPaths.some((path) => moduleDefinition.matchesToken({ path } as TransformedToken)),
  );
}

export function getModuleTokenNames(
  dictionary: Dictionary,
  moduleDefinition: ModuleDefinition,
): string[] {
  return Array.from(
    new Set(
      dictionary.allTokens
        .filter((token) => moduleDefinition.matchesToken(token))
        .map((token) => moduleDefinition.getTokenName(token)),
    ),
  ).sort((left, right) => left.localeCompare(right));
}

export function getModuleTokensByName(
  dictionary: Dictionary,
  moduleDefinition: ModuleDefinition,
): Map<string, TransformedToken> {
  const byName = new Map<string, TransformedToken>();

  dictionary.allTokens
    .filter((token) => moduleDefinition.matchesToken(token))
    .forEach((token) => {
      const tokenName = moduleDefinition.getTokenName(token);
      if (!byName.has(tokenName)) {
        byName.set(tokenName, token);
      }
    });

  return byName;
}
