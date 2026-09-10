// @deprecated Component tokens are deprecated and will be removed in a future release.
export interface CdrInputTokens {
  /**
   * Default background color on form elements
   * @value rgba(247, 245, 243, 0.15)
   * @cssvar --cdr-color-background-input-default
   */
  readonly CdrColorBackgroundInputDefault: string;
  /**
   * Active state of a form element background
   * @value #fafbf9
   * @cssvar --cdr-color-background-input-default-active
   */
  readonly CdrColorBackgroundInputDefaultActive: string;
  /**
   * Disabled form element background
   * @value #fafbf9
   * @cssvar --cdr-color-background-input-default-disabled
   */
  readonly CdrColorBackgroundInputDefaultDisabled: string;
  /**
   * Focused checkbox or radio form element background
   * @value #fafbf9
   * @cssvar --cdr-color-background-input-default-focus
   */
  readonly CdrColorBackgroundInputDefaultFocus: string;
  /**
   * Hover state of a checkbox or radio element background
   * @value #fafbf9
   * @cssvar --cdr-color-background-input-default-hover
   */
  readonly CdrColorBackgroundInputDefaultHover: string;
  /**
   * Selected state of a checkbox or radio element background
   * @value #4b4a48
   * @cssvar --cdr-color-background-input-default-selected
   */
  readonly CdrColorBackgroundInputDefaultSelected: string;
  /**
   * Selected focus state of checkbox or radio element background
   * @value #958e83
   * @cssvar --cdr-color-background-input-default-selected-focus
   */
  readonly CdrColorBackgroundInputDefaultSelectedFocus: string;
  /**
   * Hover state of a selected checkbox or radio element background
   * @value #958e83
   * @cssvar --cdr-color-background-input-default-selected-hover
   */
  readonly CdrColorBackgroundInputDefaultSelectedHover: string;
  /**
   * Error background color on form elements
   * @value rgba(255, 242, 242, 0.75)
   * @cssvar --cdr-color-background-input-error
   */
  readonly CdrColorBackgroundInputError: string;
  /**
   * Default background color on form elements
   * @value rgba(255, 255, 255, 0.85)
   * @cssvar --cdr-color-background-input-secondary
   */
  readonly CdrColorBackgroundInputSecondary: string;
  /**
   * Active state of an input or select element background on secondary
   * @value #ffffff
   * @cssvar --cdr-color-background-input-secondary-active
   */
  readonly CdrColorBackgroundInputSecondaryActive: string;
  /**
   * Active state of a checkbox or radio label background
   * @value #edeae3
   * @cssvar --cdr-color-background-label-default-active
   */
  readonly CdrColorBackgroundLabelDefaultActive: string;
  /**
   * Focused state of a checkbox or radio label background
   * @value #fafbf9
   * @cssvar --cdr-color-background-label-default-focus
   */
  readonly CdrColorBackgroundLabelDefaultFocus: string;
  /**
   * Hover state of a checkbox or radio label background
   * @value #fafbf9
   * @cssvar --cdr-color-background-label-default-hover
   */
  readonly CdrColorBackgroundLabelDefaultHover: string;
  /**
   * Active state of a checkbox or radio label background on secondary
   * @value #ffffff
   * @cssvar --cdr-color-background-label-secondary-active
   */
  readonly CdrColorBackgroundLabelSecondaryActive: string;
  /**
   * Focused state of a checkbox or radio label background on secondary
   * @value rgba(255, 255, 255, 0.75)
   * @cssvar --cdr-color-background-label-secondary-focus
   */
  readonly CdrColorBackgroundLabelSecondaryFocus: string;
  /**
   * Hover state of a checkbox or radio label background on secondary
   * @value rgba(255, 255, 255, 0.75)
   * @cssvar --cdr-color-background-label-secondary-hover
   */
  readonly CdrColorBackgroundLabelSecondaryHover: string;
  /**
   * Default border color on form elements
   * @value #958e83
   * @cssvar --cdr-color-border-input-default
   */
  readonly CdrColorBorderInputDefault: string;
  /**
   * Hover/active/focus state of a checkbox or radio element border
   * @value #4b4a48
   * @cssvar --cdr-color-border-input-default-active
   */
  readonly CdrColorBorderInputDefaultActive: string;
  /**
   * Disabled form element border
   * @value #d5cfc3
   * @cssvar --cdr-color-border-input-default-disabled
   */
  readonly CdrColorBorderInputDefaultDisabled: string;
  /**
   * Focus state of an input or select element border
   * @value #2e2e2b
   * @cssvar --cdr-color-border-input-default-focus
   */
  readonly CdrColorBorderInputDefaultFocus: string;
  /**
   * Hover state of a checkbox or radio element border
   * @value #2e2e2b
   * @cssvar --cdr-color-border-input-default-hover
   */
  readonly CdrColorBorderInputDefaultHover: string;
  /**
   * Selected state of a checkbox or radio element border
   * @value #4b4a48
   * @cssvar --cdr-color-border-input-default-selected
   */
  readonly CdrColorBorderInputDefaultSelected: string;
  /**
   * Hover state of a selected checkbox or radio element border
   * @value #4b4a48
   * @cssvar --cdr-color-border-input-default-selected-hover
   */
  readonly CdrColorBorderInputDefaultSelectedHover: string;
  /**
   * Error border color on form elements
   * @value #b33322
   * @cssvar --cdr-color-border-input-error
   */
  readonly CdrColorBorderInputError: string;
  /**
   * Focused border color on checkbox or radio labels
   * @value #2e2e2b
   * @cssvar --cdr-color-border-label-default-focus
   */
  readonly CdrColorBorderLabelDefaultFocus: string;
  /**
   * Rest state of a selected form icon
   * @value #ffffff
   * @cssvar --cdr-color-icon-checkbox-default-selected
   */
  readonly CdrColorIconCheckboxDefaultSelected: string;
  /**
   * Hover state of a selected form icon
   * @value #4b4a48
   * @cssvar --cdr-color-icon-checkbox-default-selected-active
   */
  readonly CdrColorIconCheckboxDefaultSelectedActive: string;
  /**
   * Hover state of a selected form icon
   * @value #ffffff
   * @cssvar --cdr-color-icon-checkbox-default-selected-hover
   */
  readonly CdrColorIconCheckboxDefaultSelectedHover: string;
  /**
   * Default text color used in form elements
   * @value #2e2e2b
   * @cssvar --cdr-color-text-input-default
   */
  readonly CdrColorTextInputDefault: string;
  /**
   * Disabled text color used in form elements
   * @value #d5cfc3
   * @cssvar --cdr-color-text-input-disabled
   */
  readonly CdrColorTextInputDisabled: string;
  /**
   * Error text color used in forms
   * @value #b33322
   * @cssvar --cdr-color-text-input-error
   */
  readonly CdrColorTextInputError: string;
  /**
   * Text color used in filled forms
   * @value #2e2e2b
   * @cssvar --cdr-color-text-input-filled
   */
  readonly CdrColorTextInputFilled: string;
  /**
   * Help text color used in forms
   * @value #736e65
   * @cssvar --cdr-color-text-input-help
   */
  readonly CdrColorTextInputHelp: string;
  /**
   * Color of label text used in form elements
   * @value #4b4a48
   * @cssvar --cdr-color-text-input-label
   */
  readonly CdrColorTextInputLabel: string;
  /**
   * Color of label text used in disabled form elements
   * @value #b2ab9f
   * @cssvar --cdr-color-text-input-label-disabled
   */
  readonly CdrColorTextInputLabelDisabled: string;
  /**
   * Text color of optional label within forms
   * @value #736e65
   * @cssvar --cdr-color-text-input-optional
   */
  readonly CdrColorTextInputOptional: string;
  /**
   * Text color of placeholder text within forms
   * @value #736e65
   * @cssvar --cdr-color-text-input-placeholder
   */
  readonly CdrColorTextInputPlaceholder: string;
  /**
   * Text color of required label within forms
   * @value #4b4a48
   * @cssvar --cdr-color-text-input-required
   */
  readonly CdrColorTextInputRequired: string;
}

export declare const CdrInput: CdrInputTokens;
export default CdrInput;