import type { CedarToken } from '../../token.types';

export const surfaceTokens: CedarToken[] = [
  {
    name: 'cdr-color-surface-base',
    value: '#ffffff',
    alias: 'cdr-color-neutral-000',
    description: 'Primary surface background',
    tier: 'semantic',
    status: 'stable',
    platforms: {
      web: 'var(--cdr-color-surface-base)',
      ios: 'Color(.cdrColorSurfaceBase)',
      android: 'CdrTheme.colors.surfaceBase',
    },
    usedBy: ['cdr-button-surface', 'cdr-card-surface'],
    meta: {
      source: 'figma-variables',
      lastChanged: '2026-04-16',
      badges: [
        { label: 'stable', tone: 'stable' },
        { label: 'semantic', tone: 'info' },
      ],
      figmaCollection: 'Color / Semantic / Surface',
      figmaVariable: 'surface.base',
      usageSummary:
        'Use for default page and container backgrounds where content density is highest.',
      consumerNotes:
        'Prefer this token over neutral primitives in product code so theming stays centralized.',
    },
  },
  {
    name: 'cdr-color-surface-raised',
    value: '#edeae3',
    alias: 'cdr-color-neutral-100',
    description: 'Raised surface for cards and sheets',
    tier: 'semantic',
    status: 'experimental',
    platforms: {
      web: 'var(--cdr-color-surface-raised)',
      ios: 'Color(.cdrColorSurfaceRaised)',
      android: 'CdrTheme.colors.surfaceRaised',
    },
    usedBy: ['cdr-card-background'],
    meta: {
      source: 'figma-variables',
      lastChanged: '2026-04-16',
      badges: [
        { label: 'experimental', tone: 'experimental' },
        { label: 'semantic', tone: 'info' },
      ],
      figmaCollection: 'Color / Semantic / Surface',
      figmaVariable: 'surface.raised',
      usageSummary:
        'Use for raised containers, sheets, and panels that need separation from base surfaces.',
      consumerNotes: 'Validate contrast against text tokens before broad rollout.',
    },
  },
  {
    name: 'cdr-color-surface-legacy',
    value: '#f2f2f2',
    alias: 'cdr-color-neutral-050',
    description: 'Legacy token retained for backwards compatibility',
    tier: 'semantic',
    status: 'deprecated',
    platforms: {
      web: 'var(--cdr-color-surface-legacy)',
      ios: 'Color(.cdrColorSurfaceLegacy)',
      android: 'CdrTheme.colors.surfaceLegacy',
    },
    usedBy: ['cdr-legacy-card-surface'],
    meta: {
      source: 'figma-variables',
      lastChanged: '2026-03-20',
      badges: [
        { label: 'deprecated', tone: 'deprecated' },
        { label: 'semantic', tone: 'info' },
      ],
      figmaCollection: 'Color / Semantic / Surface',
      figmaVariable: 'surface.legacy',
      usageSummary: 'Legacy surface retained temporarily for migration support only.',
      consumerNotes: 'Migrate to cdr-color-surface-base or cdr-color-surface-raised.',
    },
  },
];
