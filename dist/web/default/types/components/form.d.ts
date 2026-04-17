export interface FormTokens {
  /**
   * @usage Large figure size
   * @design Use for large or expressive forms
   */
  readonly CdrFormFigureSizeLarge: string;
  /**
   * @usage Medium figure size
   * @design Use for standard forms
   * @alternatives {form.figure.size-large}
   */
  readonly CdrFormFigureSizeMedium: string;
  /**
   * @usage Small figure size
   * @design Use for compact forms
   * @alternatives {form.figure.size-medium}
   */
  readonly CdrFormFigureSizeSmall: string;
  /**
   * @usage Default input height
   * @design Use for standard form fields
   * @alternatives {form.input.height-large}
   */
  readonly CdrFormInputHeightDefault: string;
  /**
   * @usage Large input height
   * @design Use for spacious layouts
   */
  readonly CdrFormInputHeightLarge: string;
}

export declare const Form: FormTokens;

export default Form;
