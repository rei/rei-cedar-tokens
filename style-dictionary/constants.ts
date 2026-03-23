/**
 * REI Cedar Tokens - Constants
 *
 * Defines themes, platforms, and token types used throughout the build system.
 */

/**
 * Available themes
 *
 * Themes provide overrides for base tokens and are located in tokens/themes/[theme-name]/
 * Each theme is built for all platforms.
 */
export const THEMES = ["rei-dot-com", "docsite"];

/**
 * Available platforms
 *
 * Each platform generates specific output formats:
 * - web: CSS, SCSS, JavaScript
 * - android: XML (colors, dimensions)
 * - ios: Swift (colors, sizes)
 * - figma: JSON for Figma integration
 * - site/*: JSON for documentation site
 */
export const PLATFORMS = [
  "site/global", // Documentation - all platforms
  "site/web", // Documentation - web tokens
  "site/android", // Documentation - Android tokens
  "site/ios", // Documentation - iOS tokens
  "web", // Web applications
  "android", // Android native
  "ios", // iOS native
  "figma", // Figma design tool
];

export type Platform = (typeof PLATFORMS)[number];
export type Theme = (typeof THEMES)[number];

/**
 * DTCG Token Types
 *
 * Supported token types from the Design Tokens Community Group specification.
 * These types determine how tokens are transformed for different platforms.
 *
 * @see https://tr.designtokens.org/format/#types
 */
export const TOKEN_TYPES = [
  "color", // Color values (#hex, rgb, etc.)
  "dimension", // Size values with units (px, rem, etc.)
  "fontFamily", // Font family names
  "fontSize", // Font size values
  "fontWeight", // Font weight values
  "duration", // Time duration (for animations)
  "cubicBezier", // Easing functions
  "number", // Unitless numbers
];

export type TokenTypes = (typeof TOKEN_TYPES)[number];
