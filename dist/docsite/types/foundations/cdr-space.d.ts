export interface CdrSpaceTokens {
  /**
   * @usage Static spacing at one-eighth of the base unit.
   * @design Use for legacy components only. No direct scale equivalent — scale.0 is the closest but produces slightly larger spacing.
   * @alternatives {space.scale.0}
   * @value 2
   * @cssvar --cdr-space-eighth-x
   */
  readonly CdrSpaceEighthX: string;
  /**
   * @usage Static spacing at four times the base unit.
   * @design Use for legacy components only. Prefer fluid scale tokens for new work.
   * @alternatives {space.scale.7}
   * @value 64
   * @cssvar --cdr-space-four-x
   */
  readonly CdrSpaceFourX: string;
  /**
   * @usage Static spacing at one-half of the base unit.
   * @design Use for legacy components only. Prefer fluid scale tokens for new work.
   * @alternatives {space.scale.2}
   * @value 8
   * @cssvar --cdr-space-half-x
   */
  readonly CdrSpaceHalfX: string;
  /**
   * @usage Static spacing at one and a half times the base unit.
   * @design Use for legacy components only. Prefer fluid scale tokens for new work.
   * @alternatives {space.scale.4}
   * @value 24
   * @cssvar --cdr-space-one-and-ahalf-x
   */
  readonly CdrSpaceOneAndAHalfX: string;
  /**
   * @usage The base static spacing unit.
   * @design Use for legacy components only. Prefer fluid scale tokens for new work.
   * @alternatives {space.scale.3}
   * @value 16
   * @cssvar --cdr-space-one-x
   */
  readonly CdrSpaceOneX: string;
  /**
   * @usage Static spacing at one-quarter of the base unit.
   * @design Use for legacy components only. Prefer fluid scale tokens for new work.
   * @alternatives {space.scale.0}, {space.scale.1}
   * @value 4
   * @cssvar --cdr-space-quarter-x
   */
  readonly CdrSpaceQuarterX: string;
  /**
   * @usage The smallest static spacing unit, one-sixteenth of the base.
   * @design Use for legacy components only. No direct scale equivalent — scale.0 is the closest but produces slightly larger spacing.
   * @alternatives {space.scale.0}
   * @value 1
   * @cssvar --cdr-space-sixteenth-x
   */
  readonly CdrSpaceSixteenthX: string;
  /**
   * @usage Static spacing at three-eighths of the base unit.
   * @design Use for legacy components only. Prefer fluid scale tokens for new work.
   * @alternatives {space.scale.1}
   * @value 6
   * @cssvar --cdr-space-three-eighth-x
   */
  readonly CdrSpaceThreeEighthX: string;
  /**
   * @usage Static spacing at three-quarters of the base unit.
   * @design Use for legacy components only. Prefer fluid scale tokens for new work.
   * @alternatives {space.scale.3}
   * @value 12
   * @cssvar --cdr-space-three-quarter-x
   */
  readonly CdrSpaceThreeQuarterX: string;
  /**
   * @usage Static spacing at three-sixteenths of the base unit.
   * @design Use for legacy components only. Prefer fluid scale tokens for new work.
   * @alternatives {space.scale.0}
   * @value 3
   * @cssvar --cdr-space-three-sixteenth-x
   */
  readonly CdrSpaceThreeSixteenthX: string;
  /**
   * @usage Static spacing at three times the base unit.
   * @design Use for legacy components only. Prefer fluid scale tokens for new work.
   * @alternatives {space.scale.6}
   * @value 48
   * @cssvar --cdr-space-three-x
   */
  readonly CdrSpaceThreeX: string;
  /**
   * @usage Static spacing at two times the base unit.
   * @design Use for legacy components only. Prefer fluid scale tokens for new work.
   * @alternatives {space.scale.5}
   * @value 32
   * @cssvar --cdr-space-two-x
   */
  readonly CdrSpaceTwoX: string;
  /**
   * @usage Zero spacing, removes all space between elements.
   * @design Use when elements must be flush against each other with no gap.
   * @value 0
   * @cssvar --cdr-space-zero
   */
  readonly CdrSpaceZero: string;
}

export declare const CdrSpace: CdrSpaceTokens;

export default CdrSpace;