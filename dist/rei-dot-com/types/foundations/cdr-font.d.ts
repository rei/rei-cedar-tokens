export interface CdrFontTokens {
  /**
   * @value Pressura,  "Avenir Next", Roboto, sans-serif
   * @cssvar --cdr-font-family-mono-brand-font
   */
  readonly CdrFontFamilyMonoBrandFont: string;
  /**
   * @value Graphik, "Graphik fallback", "Helvetica Neue", sans-serif
   * @cssvar --cdr-font-family-sans
   */
  readonly CdrFontFamilySans: string;
  /**
   * @value Graphik
   * @cssvar --cdr-font-family-sans-brand-font
   */
  readonly CdrFontFamilySansBrandFont: string;
  /**
   * @value Stuart, "Stuart fallback", Georgia, serif
   * @cssvar --cdr-font-family-serif
   */
  readonly CdrFontFamilySerif: string;
  /**
   * @value Stuart
   * @cssvar --cdr-font-family-serif-brand-font
   */
  readonly CdrFontFamilySerifBrandFont: string;
}

export declare const CdrFont: CdrFontTokens;

export default CdrFont;