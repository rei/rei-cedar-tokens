/**
 * Specifies the visual brand identity or color mode context for the tokens.
 * @example "rei-dot-com" | "docsite"
 */
export type TTheme = "rei-dot-com" | "docsite";

/**
 * Defines the technical output target or file format for token delivery.
 * Each platform may have specific naming conventions (e.g., camelCase for JS, kebab-case for CSS).
 */
export type TPlatform =
  | "android"
  | "css"
  | "figma"
  | "ios"
  | "js"
  | "json"
  | "scss";

/**
 * Categorizes the specific design intent or "domain" of the tokens.
 * This helps organize tokens into manageable logical chunks.
 */
export type TResponsibility =
  | "color"
  | "typography"
  | "prominence"
  | "radius"
  | "space";

/**
 * The raw data structure of the tokens.
 * Must be a flat object of key-value pairs where all values are strings.
 */
export type TModule = Record<string, string>;

/**
 * A generic, immutable container for design tokens.
 * It links metadata (Theme, Platform, Responsibility) to a specific set of token values.
 * * @template Theme - Must be a valid TTheme. Defaults to the full TTheme union.
 * @template Platform - Must be a valid TPlatform. Defaults to the full TPlatform union.
 * @template Responsibility - Must be a valid TResponsibility. Defaults to the full TResponsibility union.
 * @template Module - The typed interface of the tokens. Must extend Record<string, string>.
 */
export interface TokenDictionary<
  Theme extends TTheme = TTheme,
  Platform extends TPlatform = TPlatform,
  Responsibility extends TResponsibility = TResponsibility,
  Module extends TModule = TModule,
> {
  /** The specific brand or visual mode used to generate these tokens. */
  readonly theme: Theme;

  /** The target technology or format these tokens are optimized for. */
  readonly platform: Platform;

  /** The design category (e.g., 'color') this dictionary represents. */
  readonly responsibility: Responsibility;

  /** * The immutable collection of token key-value pairs.
   * Provides autocomplete for specific token names when a Module type is provided.
   */
  readonly tokens: Readonly<Module>;
}
