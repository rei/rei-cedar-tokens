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
   * @usage Uniform inset padding at one-eighth of the base unit.
   * @design Use for compact components such as badges or tags.
   */
  readonly CdrSpaceInsetEighthX: string;
  readonly CdrSpaceInsetEighthXSquish: string;
  /**
   * @usage Left and right padding component of a squished eighth-x inset.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.eighth-x}
   */
  readonly CdrSpaceInsetEighthXSquishLeftRight: string;
  /**
   * @usage Top and bottom padding component of a squished eighth-x inset, compressed to zero.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.eighth-x}
   */
  readonly CdrSpaceInsetEighthXSquishTopBottom: string;
  readonly CdrSpaceInsetEighthXStretch: string;
  /**
   * @usage Left and right padding component of a stretched eighth-x inset.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.eighth-x}
   */
  readonly CdrSpaceInsetEighthXStretchLeftRight: string;
  /**
   * @usage Top and bottom padding component of a stretched eighth-x inset, expanded beyond the base.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.eighth-x}
   */
  readonly CdrSpaceInsetEighthXStretchTopBottom: string;
  /**
   * @usage Uniform inset padding at four times the base unit.
   * @design Use for the most spacious layouts such as hero sections.
   */
  readonly CdrSpaceInsetFourX: string;
  readonly CdrSpaceInsetFourXSquish: string;
  /**
   * @usage Left and right padding component of a squished four-x inset.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.four-x}
   */
  readonly CdrSpaceInsetFourXSquishLeftRight: string;
  /**
   * @usage Top and bottom padding component of a squished four-x inset, compressed by the squish modifier.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.four-x}
   */
  readonly CdrSpaceInsetFourXSquishTopBottom: string;
  readonly CdrSpaceInsetFourXStretch: string;
  /**
   * @usage Left and right padding component of a stretched four-x inset.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.four-x}
   */
  readonly CdrSpaceInsetFourXStretchLeftRight: string;
  /**
   * @usage Top and bottom padding component of a stretched four-x inset, expanded by the stretch modifier.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.four-x}
   */
  readonly CdrSpaceInsetFourXStretchTopBottom: string;
  /**
   * @usage Uniform inset padding at one-half of the base unit.
   * @design Use for medium-density components such as form inputs or standard buttons.
   */
  readonly CdrSpaceInsetHalfX: string;
  readonly CdrSpaceInsetHalfXSquish: string;
  /**
   * @usage Left and right padding component of a squished half-x inset.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.half-x}
   */
  readonly CdrSpaceInsetHalfXSquishLeftRight: string;
  /**
   * @usage Top and bottom padding component of a squished half-x inset, compressed by the squish modifier.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.half-x}
   */
  readonly CdrSpaceInsetHalfXSquishTopBottom: string;
  readonly CdrSpaceInsetHalfXStretch: string;
  /**
   * @usage Left and right padding component of a stretched half-x inset.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.half-x}
   */
  readonly CdrSpaceInsetHalfXStretchLeftRight: string;
  /**
   * @usage Top and bottom padding component of a stretched half-x inset, expanded by the stretch modifier.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.half-x}
   */
  readonly CdrSpaceInsetHalfXStretchTopBottom: string;
  /**
   * @usage Uniform inset padding at one and a half times the base unit.
   * @design Use for components needing generous padding such as modals or large cards.
   */
  readonly CdrSpaceInsetOneAndAHalfX: string;
  readonly CdrSpaceInsetOneAndAHalfXSquish: string;
  /**
   * @usage Left and right padding component of a squished one-and-a-half-x inset.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.one-and-a-half-x}
   */
  readonly CdrSpaceInsetOneAndAHalfXSquishLeftRight: string;
  /**
   * @usage Top and bottom padding component of a squished one-and-a-half-x inset, compressed by the squish modifier.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.one-and-a-half-x}
   */
  readonly CdrSpaceInsetOneAndAHalfXSquishTopBottom: string;
  readonly CdrSpaceInsetOneAndAHalfXStretch: string;
  /**
   * @usage Left and right padding component of a stretched one-and-a-half-x inset.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.one-and-a-half-x}
   */
  readonly CdrSpaceInsetOneAndAHalfXStretchLeftRight: string;
  /**
   * @usage Top and bottom padding component of a stretched one-and-a-half-x inset, expanded by the stretch modifier.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.one-and-a-half-x}
   */
  readonly CdrSpaceInsetOneAndAHalfXStretchTopBottom: string;
  /**
   * @usage Uniform inset padding at the base unit.
   * @design Use for standard component padding such as cards or panels.
   */
  readonly CdrSpaceInsetOneX: string;
  readonly CdrSpaceInsetOneXSquish: string;
  /**
   * @usage Left and right padding component of a squished one-x inset.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.one-x}
   */
  readonly CdrSpaceInsetOneXSquishLeftRight: string;
  /**
   * @usage Top and bottom padding component of a squished one-x inset, compressed by the squish modifier.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.one-x}
   */
  readonly CdrSpaceInsetOneXSquishTopBottom: string;
  readonly CdrSpaceInsetOneXStretch: string;
  /**
   * @usage Left and right padding component of a stretched one-x inset.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.one-x}
   */
  readonly CdrSpaceInsetOneXStretchLeftRight: string;
  /**
   * @usage Top and bottom padding component of a stretched one-x inset, expanded by the stretch modifier.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.one-x}
   */
  readonly CdrSpaceInsetOneXStretchTopBottom: string;
  /**
   * @usage Uniform inset padding at one-quarter of the base unit.
   * @design Use for small components such as chips or compact buttons.
   */
  readonly CdrSpaceInsetQuarterX: string;
  readonly CdrSpaceInsetQuarterXSquish: string;
  /**
   * @usage Left and right padding component of a squished quarter-x inset.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.quarter-x}
   */
  readonly CdrSpaceInsetQuarterXSquishLeftRight: string;
  /**
   * @usage Top and bottom padding component of a squished quarter-x inset, compressed by the squish modifier.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.quarter-x}
   */
  readonly CdrSpaceInsetQuarterXSquishTopBottom: string;
  readonly CdrSpaceInsetQuarterXStretch: string;
  /**
   * @usage Left and right padding component of a stretched quarter-x inset.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.quarter-x}
   */
  readonly CdrSpaceInsetQuarterXStretchLeftRight: string;
  /**
   * @usage Top and bottom padding component of a stretched quarter-x inset, expanded by the stretch modifier.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.quarter-x}
   */
  readonly CdrSpaceInsetQuarterXStretchTopBottom: string;
  /**
   * @usage Uniform inset padding at one-sixteenth of the base unit.
   * @design Use for the tightest padding on very small components such as micro badges.
   */
  readonly CdrSpaceInsetSixteenthX: string;
  /**
   * @usage Uniform inset padding at three-eighths of the base unit.
   * @design Use for components needing slightly more padding than quarter-x.
   */
  readonly CdrSpaceInsetThreeEighthX: string;
  /**
   * @usage Uniform inset padding at three-quarters of the base unit.
   * @design Use for components needing slightly more padding than half-x.
   */
  readonly CdrSpaceInsetThreeQuarterX: string;
  readonly CdrSpaceInsetThreeQuarterXSquish: string;
  /**
   * @usage Left and right padding component of a squished three-quarter-x inset.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.three-quarter-x}
   */
  readonly CdrSpaceInsetThreeQuarterXSquishLeftRight: string;
  /**
   * @usage Top and bottom padding component of a squished three-quarter-x inset, compressed by the squish modifier.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.three-quarter-x}
   */
  readonly CdrSpaceInsetThreeQuarterXSquishTopBottom: string;
  readonly CdrSpaceInsetThreeQuarterXStretch: string;
  /**
   * @usage Left and right padding component of a stretched three-quarter-x inset.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.three-quarter-x}
   */
  readonly CdrSpaceInsetThreeQuarterXStretchLeftRight: string;
  /**
   * @usage Top and bottom padding component of a stretched three-quarter-x inset, expanded by the stretch modifier.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.three-quarter-x}
   */
  readonly CdrSpaceInsetThreeQuarterXStretchTopBottom: string;
  /**
   * @usage Uniform inset padding at three-sixteenths of the base unit.
   * @design Use for compact components needing slightly more padding than eighth-x.
   */
  readonly CdrSpaceInsetThreeSixteenthX: string;
  /**
   * @usage Uniform inset padding at three times the base unit.
   * @design Use for very spacious layouts or full-width content areas.
   */
  readonly CdrSpaceInsetThreeX: string;
  readonly CdrSpaceInsetThreeXSquish: string;
  /**
   * @usage Left and right padding component of a squished three-x inset.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.three-x}
   */
  readonly CdrSpaceInsetThreeXSquishLeftRight: string;
  /**
   * @usage Top and bottom padding component of a squished three-x inset, compressed by the squish modifier.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.three-x}
   */
  readonly CdrSpaceInsetThreeXSquishTopBottom: string;
  readonly CdrSpaceInsetThreeXStretch: string;
  /**
   * @usage Left and right padding component of a stretched three-x inset.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.three-x}
   */
  readonly CdrSpaceInsetThreeXStretchLeftRight: string;
  /**
   * @usage Top and bottom padding component of a stretched three-x inset, expanded by the stretch modifier.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.three-x}
   */
  readonly CdrSpaceInsetThreeXStretchTopBottom: string;
  /**
   * @usage Uniform inset padding at two times the base unit.
   * @design Use for spacious layouts such as page sections or large containers.
   */
  readonly CdrSpaceInsetTwoX: string;
  readonly CdrSpaceInsetTwoXSquish: string;
  /**
   * @usage Left and right padding component of a squished two-x inset.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.two-x}
   */
  readonly CdrSpaceInsetTwoXSquishLeftRight: string;
  /**
   * @usage Top and bottom padding component of a squished two-x inset, compressed by the squish modifier.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.two-x}
   */
  readonly CdrSpaceInsetTwoXSquishTopBottom: string;
  readonly CdrSpaceInsetTwoXStretch: string;
  /**
   * @usage Left and right padding component of a stretched two-x inset.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.two-x}
   */
  readonly CdrSpaceInsetTwoXStretchLeftRight: string;
  /**
   * @usage Top and bottom padding component of a stretched two-x inset, expanded by the stretch modifier.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.two-x}
   */
  readonly CdrSpaceInsetTwoXStretchTopBottom: string;
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
   * @usage The smallest fluid spacing step, scaling from 3.2px to 4.8px.
   * @design Use for the tightest gaps between inline elements such as an icon and a label.
   */
  readonly CdrSpaceScale0: string;
  /**
   * @usage Fluid spacing spanning steps 0 to 1, scaling from 3.2px to 6.4px.
   * @design Use when spacing needs to adapt across the range of the two smallest steps.
   * @alternatives {space.scale.0}, {space.scale.1}
   */
  readonly CdrSpaceScale01: string;
  /**
   * @usage Fluid spacing step 1, scaling from 4.8px to 6.4px.
   * @design Use for minimal separation between closely related elements.
   */
  readonly CdrSpaceScale1: string;
  /**
   * @usage Fluid spacing step 2, scaling from 6.4px to 8px.
   * @design Use for small gaps such as between stacked text elements or tight component internals.
   */
  readonly CdrSpaceScale2: string;
  /**
   * @usage Fluid spacing step 3, scaling from 12.8px to 16px. Equivalent to the static base unit.
   * @design Use for spacing between related components such as form fields or list items.
   */
  readonly CdrSpaceScale3: string;
  /**
   * @usage Fluid spacing spanning steps 3 to 4, scaling from 6.4px to 16px.
   * @design Use when spacing needs to adapt broadly between component and section spacing.
   * @alternatives {space.scale.3}, {space.scale.4}
   */
  readonly CdrSpaceScale34: string;
  /**
   * @usage Fluid spacing spanning steps 3 to 5, scaling from 12.8px to 25.6px.
   * @design Use when spacing needs to adapt across a wide range of container sizes.
   * @alternatives {space.scale.3}, {space.scale.4}, {space.scale.5}
   */
  readonly CdrSpaceScale35: string;
  /**
   * @usage Fluid spacing step 4, scaling from 19.2px to 24px.
   * @design Use for spacing between distinct components or content groups.
   */
  readonly CdrSpaceScale4: string;
  /**
   * @usage Fluid spacing step 5, scaling from 25.6px to 32px.
   * @design Use for separation between major content sections.
   */
  readonly CdrSpaceScale5: string;
  /**
   * @usage Fluid spacing step 6, scaling from 38.4px to 48px.
   * @design Use for generous separation between page-level sections.
   */
  readonly CdrSpaceScale6: string;
  /**
   * @usage Fluid spacing step 7, scaling from 51.2px to 64px.
   * @design Use for large layout gaps such as between hero sections and page content.
   */
  readonly CdrSpaceScale7: string;
  /**
   * @usage The largest fluid spacing step, scaling from 76.8px to 96px.
   * @design Use for major page-level separation such as between full-width content blocks.
   */
  readonly CdrSpaceScale8: string;
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
