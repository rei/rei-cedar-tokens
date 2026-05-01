export interface CdrSpaceTokens {
  /**
   * @usage Static spacing at one-eighth of the base unit.
   * @design Use for legacy components only. No direct scale equivalent — scale.0 is the closest but produces slightly larger spacing.
   * @alternatives {space.scale.0}
   */
  readonly CdrSpaceEighthX: string;
  /**
   * @usage Static spacing at four times the base unit.
   * @design Use for legacy components only. Prefer fluid scale tokens for new work.
   * @alternatives {space.scale.7}
   */
  readonly CdrSpaceFourX: string;
  /**
   * @usage Static spacing at one-half of the base unit.
   * @design Use for legacy components only. Prefer fluid scale tokens for new work.
   * @alternatives {space.scale.2}
   */
  readonly CdrSpaceHalfX: string;
  /**
   * @usage Static spacing at one and a half times the base unit.
   * @design Use for legacy components only. Prefer fluid scale tokens for new work.
   * @alternatives {space.scale.4}
   */
  readonly CdrSpaceOneAndAHalfX: string;
  /**
   * @usage The base static spacing unit.
   * @design Use for legacy components only. Prefer fluid scale tokens for new work.
   * @alternatives {space.scale.3}
   */
  readonly CdrSpaceOneX: string;
  /**
   * @usage Static spacing at one-quarter of the base unit.
   * @design Use for legacy components only. Prefer fluid scale tokens for new work.
   * @alternatives {space.scale.0}, {space.scale.1}
   */
  readonly CdrSpaceQuarterX: string;
  /**
   * @usage The smallest static spacing unit, one-sixteenth of the base.
   * @design Use for legacy components only. No direct scale equivalent — scale.0 is the closest but produces slightly larger spacing.
   * @alternatives {space.scale.0}
   */
  readonly CdrSpaceSixteenthX: string;
  /**
   * @usage Static spacing at three-eighths of the base unit.
   * @design Use for legacy components only. Prefer fluid scale tokens for new work.
   * @alternatives {space.scale.1}
   */
  readonly CdrSpaceThreeEighthX: string;
  /**
   * @usage Static spacing at three-quarters of the base unit.
   * @design Use for legacy components only. Prefer fluid scale tokens for new work.
   * @alternatives {space.scale.3}
   */
  readonly CdrSpaceThreeQuarterX: string;
  /**
   * @usage Static spacing at three-sixteenths of the base unit.
   * @design Use for legacy components only. Prefer fluid scale tokens for new work.
   * @alternatives {space.scale.0}
   */
  readonly CdrSpaceThreeSixteenthX: string;
  /**
   * @usage Static spacing at three times the base unit.
   * @design Use for legacy components only. Prefer fluid scale tokens for new work.
   * @alternatives {space.scale.6}
   */
  readonly CdrSpaceThreeX: string;
  /**
   * @usage Static spacing at two times the base unit.
   * @design Use for legacy components only. Prefer fluid scale tokens for new work.
   * @alternatives {space.scale.5}
   */
  readonly CdrSpaceTwoX: string;
  /**
   * @usage Zero spacing, removes all space between elements.
   * @design Use when elements must be flush against each other with no gap.
   */
  readonly CdrSpaceZero: string;
}

export declare const CdrSpace: CdrSpaceTokens;

export default CdrSpace;