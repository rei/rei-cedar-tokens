// @deprecated Component tokens are deprecated and will be removed in a future release.
export interface CdrChipTokens {
  /**
   * Background color for active chips
   * @value #edeae3
   * @cssvar --cdr-color-background-chip-default-active
   */
  readonly CdrColorBackgroundChipDefaultActive: string;
  /**
   * Background color for disabled chips
   * @value #ffffff
   * @cssvar --cdr-color-background-chip-default-disabled
   */
  readonly CdrColorBackgroundChipDefaultDisabled: string;
  /**
   * Background color for focused chips
   * @value #ffffff
   * @cssvar --cdr-color-background-chip-default-focus
   */
  readonly CdrColorBackgroundChipDefaultFocus: string;
  /**
   * Background color for hovered chips
   * @value #f7f5f3
   * @cssvar --cdr-color-background-chip-default-hover
   */
  readonly CdrColorBackgroundChipDefaultHover: string;
  /**
   * Background color for chips
   * @value #ffffff
   * @cssvar --cdr-color-background-chip-default-rest
   */
  readonly CdrColorBackgroundChipDefaultRest: string;
  /**
   * Background color for selected chips
   * @value #d5cfc3
   * @cssvar --cdr-color-background-chip-default-selected
   */
  readonly CdrColorBackgroundChipDefaultSelected: string;
  /**
   * @usage Active background for selected chips
   * @design Use when a chip is selected and active
   * @value #edeae3
   * @cssvar --cdr-color-background-chip-default-selected-active
   */
  readonly CdrColorBackgroundChipDefaultSelectedActive: string;
  /**
   * Background color for focused selected chips
   * @value #d5cfc3
   * @cssvar --cdr-color-background-chip-default-selected-focus
   */
  readonly CdrColorBackgroundChipDefaultSelectedFocus: string;
  /**
   * Background color for hovered selected chips
   * @value #edeae3
   * @cssvar --cdr-color-background-chip-default-selected-hover
   */
  readonly CdrColorBackgroundChipDefaultSelectedHover: string;
  /**
   * Border color for active chips
   * @value #4b4a48
   * @cssvar --cdr-color-border-chip-default-active
   */
  readonly CdrColorBorderChipDefaultActive: string;
  /**
   * Border color for disabled chips
   * @value #d5cfc3
   * @cssvar --cdr-color-border-chip-default-disabled
   */
  readonly CdrColorBorderChipDefaultDisabled: string;
  /**
   * Border color for focused chips
   * @value #4b4a48
   * @cssvar --cdr-color-border-chip-default-focus
   */
  readonly CdrColorBorderChipDefaultFocus: string;
  /**
   * Border color for hovered chips
   * @value #958e83
   * @cssvar --cdr-color-border-chip-default-hover
   */
  readonly CdrColorBorderChipDefaultHover: string;
  /**
   * Border color for chips
   * @value #958e83
   * @cssvar --cdr-color-border-chip-default-rest
   */
  readonly CdrColorBorderChipDefaultRest: string;
  /**
   * Border color for focused selected chips
   * @value #4b4a48
   * @cssvar --cdr-color-border-chip-default-selected-focus
   */
  readonly CdrColorBorderChipDefaultSelectedFocus: string;
  /**
   * Border color for hovered selected chips
   * @value #736e65
   * @cssvar --cdr-color-border-chip-default-selected-hover
   */
  readonly CdrColorBorderChipDefaultSelectedHover: string;
  /**
   * Border color for selected chips
   * @value #4b4a48
   * @cssvar --cdr-color-border-chip-default-selected-rest
   */
  readonly CdrColorBorderChipDefaultSelectedRest: string;
  /**
   * Text color for default chips
   * @value #4b4a48
   * @cssvar --cdr-color-text-chip-default
   */
  readonly CdrColorTextChipDefault: string;
  /**
   * Text color for default chips
   * @value #d5cfc3
   * @cssvar --cdr-color-text-chip-disabled
   */
  readonly CdrColorTextChipDisabled: string;
}

export declare const CdrChip: CdrChipTokens;
export default CdrChip;