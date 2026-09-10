// @deprecated Component tokens are deprecated and will be removed in a future release.
export interface CdrFormTokens {
  /**
   * @usage Large figure size
   * @design Use for large or expressive forms
   * @value 20
   * @cssvar --cdr-form-figure-size-large
   */
  readonly CdrFormFigureSizeLarge: string;
  /**
   * @usage Medium figure size
   * @design Use for standard forms
   * @alternatives {form.figure.size-large}
   * @value 16
   * @cssvar --cdr-form-figure-size-medium
   */
  readonly CdrFormFigureSizeMedium: string;
  /**
   * @usage Small figure size
   * @design Use for compact forms
   * @alternatives {form.figure.size-medium}
   * @value 16
   * @cssvar --cdr-form-figure-size-small
   */
  readonly CdrFormFigureSizeSmall: string;
  /**
   * @usage Default input height
   * @design Use for standard form fields
   * @alternatives {form.input.height-large}
   * @value 40
   * @cssvar --cdr-form-input-height-default
   */
  readonly CdrFormInputHeightDefault: string;
  /**
   * @usage Large input height
   * @design Use for spacious layouts
   * @value 48
   * @cssvar --cdr-form-input-height-large
   */
  readonly CdrFormInputHeightLarge: string;
}

export declare const CdrForm: CdrFormTokens;
export default CdrForm;