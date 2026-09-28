/**
 * token-metadata.ts
 *
 * Governance data structure for semantic tokens. Keyed by canonical token path
 * (e.g., "color.modes.default.surface.base"), this is repo-authored and maintained
 * separately from Figma. Merged into canonical during normalization via
 * $extensions.cedar.
 *
 * Philosophy:
 *   - Figma owns: primitive values, alias references, optional primitive summaries
 *   - Repo owns: status, badges, structured usage, deprecation, migration, consumed-by, authority dates
 *   - Pipeline owns: accessibility data (OKLCH, contrast pairs, intervals), platform resolved values
 *   - Canonical is the merge: docs, governance, usage, accessibility, platform are all attached
 *   - Neither is the "source of truth" — together they are the complete token definition
 *
 * See ADR-0010 and the metadata merge step in src/normalization/normalize.ts.
 */

export interface TokenBadge {
  label: string;
  tone?: 'stable' | 'experimental' | 'deprecated' | 'info' | 'success' | 'warning' | 'error';
}

export interface TokenUsage {
  /**
   * Semantic roles this token fulfills (e.g., ["foreground", "background"]).
   */
  roles: string[];

  /**
   * Usage contexts where this token applies (e.g., ["text", "surfaces"]).
   */
  contexts: string[];

  /**
   * Token tier: "primitive", "semantic", or "component".
   */
  semanticTier: 'primitive' | 'semantic' | 'component';

  /**
   * Common alias names for this token.
   */
  aliases?: string[];

  /**
   * Token pairing rules for color family compatibility.
   */
  pairingRules?: {
    /**
     * Glob patterns for allowed token pairings (e.g., ["color.background.neutral.*"]).
     */
    allowedWith: string[];

    /**
     * Glob patterns for prohibited token pairings (e.g., ["color.background.sale.*"]).
     */
    prohibitedWith: string[];

    /**
     * Rationale for pairing restrictions.
     */
    rationale?: string;
  };
}

export interface ColorAccessibilityMetadata {
  /**
   * OKLCH color space values per appearance.
   */
  oklch: {
    light: { l: number; c: number; h: number };
    dark: { l: number; c: number; h: number };
  };

  /**
   * Pre-computed contrast ratios against common backgrounds.
   */
  contrastPairs?: Array<{
    with: string;
    ratio: number;
    level: 'AA' | 'AAA' | 'FAIL';
    mode: 'light' | 'dark';
  }>;

  /**
   * OKLCH lightness ranges where AA/AAA pass against a background.
   */
  intervals?: Array<{
    against: string;
    mode: 'light' | 'dark';
    AA: { minL: number; maxL: number };
    AAA: { minL: number; maxL: number };
  }>;

  /**
   * Alternative tokens for different use cases.
   */
  alternates?: {
    /**
     * Higher-contrast alternatives.
     */
    contrastAlternates?: Array<{ token: string; ratio: number; level: 'AA' | 'AAA' }>;

    /**
     * Same-role alternatives.
     */
    roleAlternates?: string[];

    /**
     * Platform-specific fallbacks.
     */
    platformAlternates?: {
      ios?: string[];
      web?: string[];
    };
  };

  /**
   * Required replacement tokens for deprecated tokens.
   */
  replacements?: string[];

  /**
   * Minimum WCAG level required for this token's usage.
   */
  minRequired?: 'AA' | 'AAA';
}

export interface LayoutMetadata {
  /**
   * Position within the scale.
   */
  scalePosition: number;

  /**
   * Layout paradigm (e.g., "modular", "ratio", "fixed").
   */
  paradigm: 'modular' | 'ratio' | 'fixed';

  /**
   * Composition patterns (e.g., ["stack", "inline", "grid"]).
   */
  composition: ('stack' | 'inline' | 'grid')[];
}

export interface TypographyMetadata {
  /**
   * Font family stack.
   */
  fontStack?: string[];

  /**
   * Line-height ratio.
   */
  lineHeightRatio?: number;

  /**
   * Modular scale (e.g., "minor-third", "major-third", "perfect-fourth").
   */
  scale?: 'minor-third' | 'major-third' | 'perfect-fourth';
}

export interface ElevationMetadata {
  /**
   * Z-index mapping.
   */
  zIndex?: number;

  /**
   * Depth level within the elevation system (e.g., "low", "medium", "high").
   */
  depth?: 'low' | 'medium' | 'high';
}

export interface MotionMetadata {
  /**
   * Duration in milliseconds.
   */
  duration?: number;

  /**
   * Easing curve (e.g., "ease-in", "ease-out", "ease-in-out", "custom").
   */
  curve?: 'ease-in' | 'ease-out' | 'ease-in-out' | 'custom';

  /**
   * Animation pattern (e.g., "entrance", "exit", "emphasis").
   */
  pattern?: 'entrance' | 'exit' | 'emphasis';
}

/**
 * Repo-authored governance metadata (lifecycle, authority, usage).
 * Stored under $extensions.cedar.governance in canonical.
 */
export interface TokenGovernance {
  /**
   * "stable", "experimental", "deprecated", "unreviewed" (default if no entry).
   * Controls visibility, styling, and release readiness.
   */
  status?: 'stable' | 'experimental' | 'deprecated' | 'unreviewed';

  /**
   * Visual badges to render alongside token name (e.g., [stable], [semantic], [alpha]).
   * Falls back to status if absent.
   */
  badges?: TokenBadge[];

  /**
   * Internal migration notes for deprecated tokens. When to remove, what to use instead.
   * Only populated for deprecated status.
   */
  deprecation?: {
    removedIn: string; // e.g. "v2.0.0" or "Q4 2026"
    migrateToToken: string; // e.g. "color.modes.default.surface.raised"
    reason: string;
  };

  /**
   * Cedar components and product features that depend on this token.
   * Used for impact analysis and deprecation safety.
   */
  usedBy?: string[];

  /**
   * Figma collection and variable names for this token (informational).
   * Hydrated from normalization for easy reference in Storybook.
   */
  figma?: {
    collection?: string; // e.g., "Color / Semantic / Surface"
    variable?: string; // e.g., "surface.base"
  };

  /**
   * Notes for consumers (DSE + design team). e.g., design rationale,
   * production timing, known limitations, design-system-wide impact.
   */
  consumerNotes?: string;

  /**
   * ISO 8601 timestamp when this metadata was last reviewed or updated.
   * Used to surface stale governance entries.
   */
  lastChanged?: string;

  /**
   * Authority: who reviewed and approved this token governance.
   * e.g., "DSE Team", "Sarah (@design-systems)", "Cedar Core".
   */
  authority?: string;
}

/**
 * Complete token metadata structure including all sections.
 * This represents the union of repo-authored and pipeline-computed data.
 */
export interface TokenMetadata {
  /**
   * Repo-authored governance metadata (lifecycle, authority, usedBy).
   */
  governance?: TokenGovernance;

  /**
   * Structured usage guidance with roles, contexts, and pairing rules.
   * Machine-readable for automated validation and tooling.
   */
  usage?: TokenUsage;

  /**
   * Type-specific metadata for color tokens (OKLCH, contrast, accessibility).
   * Pipeline-computed.
   */
  accessibility?: ColorAccessibilityMetadata;

  /**
   * Type-specific metadata for dimension/spacing tokens (layout paradigm, scale).
   */
  layout?: LayoutMetadata;

  /**
   * Type-specific metadata for typography tokens (font stack, modular scale).
   */
  typography?: TypographyMetadata;

  /**
   * Type-specific metadata for shadow tokens (elevation, z-index).
   */
  elevation?: ElevationMetadata;

  /**
   * Type-specific metadata for motion tokens (duration, curve, pattern).
   */
  motion?: MotionMetadata;

  /**
   * Platform references and resolved values.
   * Pipeline-computed.
   */
  platform?: {
    ios?: {
      light?: string;
      dark?: string;
    };
    web?: {
      light?: string;
      dark?: string;
    };
    resolved?: {
      ios?: {
        light?: string;
        dark?: string;
      };
      web?: {
        light?: string;
        dark?: string;
      };
    };
  };
}

/**
 * Keyed collection of token metadata, indexed by canonical token path.
 * Example keys:
 *   "color.modes.default.surface.base"
 *   "color.modes.default.surface.raised"
 *   "color.modes.sale.background"
 *   "spacing.layout.md"
 */
export type TokenMetadataManifest = Record<string, TokenMetadata>;
