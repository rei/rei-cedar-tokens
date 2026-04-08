export interface ChipTokens {
  /**
   * Background color for active chips
   */
  readonly CdrColorBackgroundChipDefaultActive: string;
  /**
   * Background color for disabled chips
   */
  readonly CdrColorBackgroundChipDefaultDisabled: string;
  /**
   * Background color for focused chips
   */
  readonly CdrColorBackgroundChipDefaultFocus: string;
  /**
   * Background color for hovered chips
   */
  readonly CdrColorBackgroundChipDefaultHover: string;
  /**
   * Background color for chips
   */
  readonly CdrColorBackgroundChipDefaultRest: string;
  /**
   * Background color for selected chips
   */
  readonly CdrColorBackgroundChipDefaultSelected: string;
  /**
   * @usage Active background for selected chips
   * @design Use when a chip is selected and active
   */
  readonly CdrColorBackgroundChipDefaultSelectedActive: string;
  /**
   * Background color for focused selected chips
   */
  readonly CdrColorBackgroundChipDefaultSelectedFocus: string;
  /**
   * Background color for hovered selected chips
   */
  readonly CdrColorBackgroundChipDefaultSelectedHover: string;
  /**
   * Border color for active chips
   */
  readonly CdrColorBorderChipDefaultActive: string;
  /**
   * Border color for disabled chips
   */
  readonly CdrColorBorderChipDefaultDisabled: string;
  /**
   * Border color for focused chips
   */
  readonly CdrColorBorderChipDefaultFocus: string;
  /**
   * Border color for hovered chips
   */
  readonly CdrColorBorderChipDefaultHover: string;
  /**
   * Border color for chips
   */
  readonly CdrColorBorderChipDefaultRest: string;
  /**
   * Border color for focused selected chips
   */
  readonly CdrColorBorderChipDefaultSelectedFocus: string;
  /**
   * Border color for hovered selected chips
   */
  readonly CdrColorBorderChipDefaultSelectedHover: string;
  /**
   * Border color for selected chips
   */
  readonly CdrColorBorderChipDefaultSelectedRest: string;
  /**
   * Text color for default chips
   */
  readonly CdrColorTextChipDefault: string;
  /**
   * Text color for default chips
   */
  readonly CdrColorTextChipDisabled: string;
}

export declare const Chip: ChipTokens;

export default Chip;
