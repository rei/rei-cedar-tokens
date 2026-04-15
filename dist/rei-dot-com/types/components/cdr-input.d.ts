export interface CdrInputTokens {
  /**
   * Default background color on form elements
   */
  readonly CdrColorBackgroundInputDefault: string;
  /**
   * Active state of a form element background
   */
  readonly CdrColorBackgroundInputDefaultActive: string;
  /**
   * Disabled form element background
   */
  readonly CdrColorBackgroundInputDefaultDisabled: string;
  /**
   * Focused checkbox or radio form element background
   */
  readonly CdrColorBackgroundInputDefaultFocus: string;
  /**
   * Hover state of a checkbox or radio element background
   */
  readonly CdrColorBackgroundInputDefaultHover: string;
  /**
   * Selected state of a checkbox or radio element background
   */
  readonly CdrColorBackgroundInputDefaultSelected: string;
  /**
   * Selected focus state of checkbox or radio element background
   */
  readonly CdrColorBackgroundInputDefaultSelectedFocus: string;
  /**
   * Hover state of a selected checkbox or radio element background
   */
  readonly CdrColorBackgroundInputDefaultSelectedHover: string;
  /**
   * Error background color on form elements
   */
  readonly CdrColorBackgroundInputError: string;
  /**
   * Default background color on form elements
   */
  readonly CdrColorBackgroundInputSecondary: string;
  /**
   * Active state of an input or select element background on secondary
   */
  readonly CdrColorBackgroundInputSecondaryActive: string;
  /**
   * Active state of a checkbox or radio label background
   */
  readonly CdrColorBackgroundLabelDefaultActive: string;
  /**
   * Focused state of a checkbox or radio label background
   */
  readonly CdrColorBackgroundLabelDefaultFocus: string;
  /**
   * Hover state of a checkbox or radio label background
   */
  readonly CdrColorBackgroundLabelDefaultHover: string;
  /**
   * Active state of a checkbox or radio label background on secondary
   */
  readonly CdrColorBackgroundLabelSecondaryActive: string;
  /**
   * Focused state of a checkbox or radio label background on secondary
   */
  readonly CdrColorBackgroundLabelSecondaryFocus: string;
  /**
   * Hover state of a checkbox or radio label background on secondary
   */
  readonly CdrColorBackgroundLabelSecondaryHover: string;
  /**
   * Default border color on form elements
   */
  readonly CdrColorBorderInputDefault: string;
  /**
   * Hover/active/focus state of a checkbox or radio element border
   */
  readonly CdrColorBorderInputDefaultActive: string;
  /**
   * Disabled form element border
   */
  readonly CdrColorBorderInputDefaultDisabled: string;
  /**
   * Focus state of an input or select element border
   */
  readonly CdrColorBorderInputDefaultFocus: string;
  /**
   * Hover state of a checkbox or radio element border
   */
  readonly CdrColorBorderInputDefaultHover: string;
  /**
   * Selected state of a checkbox or radio element border
   */
  readonly CdrColorBorderInputDefaultSelected: string;
  /**
   * Hover state of a selected checkbox or radio element border
   */
  readonly CdrColorBorderInputDefaultSelectedHover: string;
  /**
   * Error border color on form elements
   */
  readonly CdrColorBorderInputError: string;
  /**
   * Focused border color on checkbox or radio labels
   */
  readonly CdrColorBorderLabelDefaultFocus: string;
  /**
   * Default text color used in form elements
   */
  readonly CdrColorTextInputDefault: string;
  /**
   * Disabled text color used in form elements
   */
  readonly CdrColorTextInputDisabled: string;
  /**
   * Error text color used in forms
   */
  readonly CdrColorTextInputError: string;
  /**
   * Text color used in filled forms
   */
  readonly CdrColorTextInputFilled: string;
  /**
   * Help text color used in forms
   */
  readonly CdrColorTextInputHelp: string;
  /**
   * Color of label text used in form elements
   */
  readonly CdrColorTextInputLabel: string;
  /**
   * Color of label text used in disabled form elements
   */
  readonly CdrColorTextInputLabelDisabled: string;
  /**
   * Text color of optional label within forms
   */
  readonly CdrColorTextInputOptional: string;
  /**
   * Text color of placeholder text within forms
   */
  readonly CdrColorTextInputPlaceholder: string;
  /**
   * Text color of required label within forms
   */
  readonly CdrColorTextInputRequired: string;
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

export declare const CdrInput: CdrInputTokens;

export default CdrInput;
