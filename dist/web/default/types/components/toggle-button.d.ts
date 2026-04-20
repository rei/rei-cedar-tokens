export interface ToggleButtonTokens {
  /**
   * The background color of a toggle button on focus
   */
  readonly CdrColorBackgroundToggleButtonDefaultFocus: string;
  /**
   * The background color of a toggle button on hover
   */
  readonly CdrColorBackgroundToggleButtonDefaultHover: string;
  /**
   * The background color of a toggle button on rest
   */
  readonly CdrColorBackgroundToggleButtonDefaultRest: string;
  /**
   * The background color of a selected toggle button on hover
   */
  readonly CdrColorBackgroundToggleButtonDefaultSelectedHover: string;
  /**
   * The background color of a selected toggle button on rest
   */
  readonly CdrColorBackgroundToggleButtonDefaultSelectedRest: string;
  /**
   * The background color of a toggle group on rest
   */
  readonly CdrColorBackgroundToggleGroupDefaultRest: string;
  /**
   * Border color for a toggle button that is not selected on focus
   */
  readonly CdrColorBorderToggleButtonDefaultFocus: string;
  /**
   * Border color for a selected toggle on focus
   */
  readonly CdrColorBorderToggleButtonDefaultSelectedFocus: string;
  /**
   * Border color for a selected toggle button on rest
   */
  readonly CdrColorBorderToggleButtonDefaultSelectedRest: string;
  /**
   * The text color of a toggle button on rest
   */
  readonly CdrColorTextToggleButtonDefaultRest: string;
}

export declare const ToggleButton: ToggleButtonTokens;

export default ToggleButton;