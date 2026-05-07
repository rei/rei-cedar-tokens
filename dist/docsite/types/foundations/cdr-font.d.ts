export interface CdrFontTokens {
  /**
   * Cedar's monospace typeface (Pressura). Use for code, data, and technical content.
   * @value Pressura,  "Avenir Next", Roboto, sans-serif
   * @cssvar --cdr-font-family-mono-brand-font
   */
  readonly CdrFontFamilyMonoBrandFont: string;
  /**
   * Cedar's full sans-serif typeface stack with system fallbacks. Use when the Graphik brand font may not be available.
   * @value Graphik, "Graphik fallback", "Helvetica Neue", sans-serif
   * @cssvar --cdr-font-family-sans
   */
  readonly CdrFontFamilySans: string;
  /**
   * The Cedar brand sans-serif typeface (Graphik). Use for UI text, labels, and body copy.
   * @value Graphik
   * @cssvar --cdr-font-family-sans-brand-font
   */
  readonly CdrFontFamilySansBrandFont: string;
  /**
   * Cedar's full serif typeface stack with system fallbacks. Use when the Stuart brand font may not be available.
   * @value Stuart, "Stuart fallback", Georgia, serif
   * @cssvar --cdr-font-family-serif
   */
  readonly CdrFontFamilySerif: string;
  /**
   * The Cedar brand serif typeface (Stuart). Use for headings and editorial display text.
   * @value Stuart
   * @cssvar --cdr-font-family-serif-brand-font
   */
  readonly CdrFontFamilySerifBrandFont: string;
}

export declare const CdrFont: CdrFontTokens;

export default CdrFont;