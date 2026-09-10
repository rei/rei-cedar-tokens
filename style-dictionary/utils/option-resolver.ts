/**
 * option-resolver.ts
 *
 * Shared utilities for resolving option tokens to hex values in platform actions.
 * Used by both web-css-transform.ts and ios-color-action.ts.
 */

export type CedarOptionNode = {
  value?: unknown;
  $value?: unknown;
  $extensions?: {
    cedar?: {
      appearances?: Record<string, string>;
      platformOverrides?: Record<string, Record<string, string>>;
      colorFamily?: string;
    };
  };
};

/**
 * Navigate dictionary.tokens by a dot-separated path.
 * SD v5 stores tokens as a nested object matching the source JSON structure.
 */
export function getTokenAtPath(tokens: any, dotPath: string): any {
  return dotPath.split('.').reduce<unknown>((node, seg) => {
    if (!node || typeof node !== 'object') return undefined;
    return (node as Record<string, unknown>)[seg];
  }, tokens);
}

/**
 * Resolve an option token node to its final hex for a given platform
 * and appearance, applying platform overrides and appearance values.
 *
 * Resolution order:
 *   1. $extensions.cedar.platformOverrides.<platform>.<appearance>  (most specific)
 *   2. $extensions.cedar.appearances.<appearance>                    (appearance variant)
 *   3. $value, falling back to `value` only when $value is absent    (DTCG canonical)
 *
 * This is the single canonical implementation of option-value resolution.
 * `src/normalization/color-variants.ts` imports this function directly (rather
 * than re-implementing the same precedence rules) so the pre-baked
 * `$extensions.cedar.resolved.*` values written at normalize time always match
 * what platform actions (ios-color-action.ts, web-css-transform.ts) resolve
 * at build time. Do not duplicate this logic elsewhere — import it instead.
 *
 * `platform`/`appearance` are typed as `string` rather than a literal union
 * because callers (including the normalization layer) may iterate over
 * dynamically-derived platform/appearance keys read from the schema.
 */
export function resolveOptionHex(
  optionNode: CedarOptionNode | undefined,
  platform: string,
  appearance: string,
): string | undefined {
  const cedar = optionNode?.$extensions?.cedar;
  const platformOverride = cedar?.platformOverrides?.[platform]?.[appearance];
  if (typeof platformOverride === 'string') return platformOverride;

  if (appearance === 'dark' && typeof cedar?.appearances?.dark === 'string') {
    return cedar.appearances.dark;
  }

  const dtcgValue = optionNode?.$value;
  const legacyValue = optionNode?.value;

  if (typeof dtcgValue === 'string') {
    if (typeof legacyValue === 'string' && legacyValue !== dtcgValue) {
      console.warn(
        `[option-resolver] Option token has mismatched "$value" ("${dtcgValue}") and ` +
          `"value" ("${legacyValue}"). Using "$value" (DTCG canonical field). ` +
          `Investigate why these diverged — this may indicate a Style Dictionary ` +
          `transform mutated "value" without updating "$value".`,
      );
    }
    return dtcgValue;
  }

  return typeof legacyValue === 'string' ? legacyValue : undefined;
}
