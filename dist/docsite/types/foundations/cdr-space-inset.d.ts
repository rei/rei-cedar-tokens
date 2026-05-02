export interface CdrSpaceInsetTokens {
  /**
   * @usage Uniform inset padding at one-eighth of the base unit.
   * @design Use for compact components such as badges or tags.
   * @value 2
   * @cssvar --cdr-space-inset-eighth-x
   */
  readonly CdrSpaceInsetEighthX: string;
  /**
   * @value 0 2
   * @cssvar --cdr-space-inset-eighth-x-squish
   */
  readonly CdrSpaceInsetEighthXSquish: string;
  /**
   * @usage Left and right padding component of a squished eighth-x inset.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.eighth-x}
   * @value 2
   * @cssvar --cdr-space-inset-eighth-x-squish-left-right
   */
  readonly CdrSpaceInsetEighthXSquishLeftRight: string;
  /**
   * @usage Top and bottom padding component of a squished eighth-x inset, compressed to zero.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.eighth-x}
   * @value 0
   * @cssvar --cdr-space-inset-eighth-x-squish-top-bottom
   */
  readonly CdrSpaceInsetEighthXSquishTopBottom: string;
  /**
   * @value 4 2
   * @cssvar --cdr-space-inset-eighth-x-stretch
   */
  readonly CdrSpaceInsetEighthXStretch: string;
  /**
   * @usage Left and right padding component of a stretched eighth-x inset.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.eighth-x}
   * @value 2
   * @cssvar --cdr-space-inset-eighth-x-stretch-left-right
   */
  readonly CdrSpaceInsetEighthXStretchLeftRight: string;
  /**
   * @usage Top and bottom padding component of a stretched eighth-x inset, expanded beyond the base.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.eighth-x}
   * @value 4
   * @cssvar --cdr-space-inset-eighth-x-stretch-top-bottom
   */
  readonly CdrSpaceInsetEighthXStretchTopBottom: string;
  /**
   * @usage Uniform inset padding at four times the base unit.
   * @design Use for the most spacious layouts such as hero sections.
   * @value 64
   * @cssvar --cdr-space-inset-four-x
   */
  readonly CdrSpaceInsetFourX: string;
  /**
   * @value 32 64
   * @cssvar --cdr-space-inset-four-x-squish
   */
  readonly CdrSpaceInsetFourXSquish: string;
  /**
   * @usage Left and right padding component of a squished four-x inset.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.four-x}
   * @value 64
   * @cssvar --cdr-space-inset-four-x-squish-left-right
   */
  readonly CdrSpaceInsetFourXSquishLeftRight: string;
  /**
   * @usage Top and bottom padding component of a squished four-x inset, compressed by the squish modifier.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.four-x}
   * @value 32
   * @cssvar --cdr-space-inset-four-x-squish-top-bottom
   */
  readonly CdrSpaceInsetFourXSquishTopBottom: string;
  /**
   * @value 96 64
   * @cssvar --cdr-space-inset-four-x-stretch
   */
  readonly CdrSpaceInsetFourXStretch: string;
  /**
   * @usage Left and right padding component of a stretched four-x inset.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.four-x}
   * @value 64
   * @cssvar --cdr-space-inset-four-x-stretch-left-right
   */
  readonly CdrSpaceInsetFourXStretchLeftRight: string;
  /**
   * @usage Top and bottom padding component of a stretched four-x inset, expanded by the stretch modifier.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.four-x}
   * @value 96
   * @cssvar --cdr-space-inset-four-x-stretch-top-bottom
   */
  readonly CdrSpaceInsetFourXStretchTopBottom: string;
  /**
   * @usage Uniform inset padding at one-half of the base unit.
   * @design Use for medium-density components such as form inputs or standard buttons.
   * @value 8
   * @cssvar --cdr-space-inset-half-x
   */
  readonly CdrSpaceInsetHalfX: string;
  /**
   * @value 4 8
   * @cssvar --cdr-space-inset-half-x-squish
   */
  readonly CdrSpaceInsetHalfXSquish: string;
  /**
   * @usage Left and right padding component of a squished half-x inset.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.half-x}
   * @value 8
   * @cssvar --cdr-space-inset-half-x-squish-left-right
   */
  readonly CdrSpaceInsetHalfXSquishLeftRight: string;
  /**
   * @usage Top and bottom padding component of a squished half-x inset, compressed by the squish modifier.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.half-x}
   * @value 4
   * @cssvar --cdr-space-inset-half-x-squish-top-bottom
   */
  readonly CdrSpaceInsetHalfXSquishTopBottom: string;
  /**
   * @value 12 8
   * @cssvar --cdr-space-inset-half-x-stretch
   */
  readonly CdrSpaceInsetHalfXStretch: string;
  /**
   * @usage Left and right padding component of a stretched half-x inset.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.half-x}
   * @value 8
   * @cssvar --cdr-space-inset-half-x-stretch-left-right
   */
  readonly CdrSpaceInsetHalfXStretchLeftRight: string;
  /**
   * @usage Top and bottom padding component of a stretched half-x inset, expanded by the stretch modifier.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.half-x}
   * @value 12
   * @cssvar --cdr-space-inset-half-x-stretch-top-bottom
   */
  readonly CdrSpaceInsetHalfXStretchTopBottom: string;
  /**
   * @usage Uniform inset padding at one and a half times the base unit.
   * @design Use for components needing generous padding such as modals or large cards.
   * @value 24
   * @cssvar --cdr-space-inset-one-and-a-half-x
   */
  readonly CdrSpaceInsetOneAndAHalfX: string;
  /**
   * @value 12 24
   * @cssvar --cdr-space-inset-one-and-a-half-x-squish
   */
  readonly CdrSpaceInsetOneAndAHalfXSquish: string;
  /**
   * @usage Left and right padding component of a squished one-and-a-half-x inset.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.one-and-a-half-x}
   * @value 24
   * @cssvar --cdr-space-inset-one-and-a-half-x-squish-left-right
   */
  readonly CdrSpaceInsetOneAndAHalfXSquishLeftRight: string;
  /**
   * @usage Top and bottom padding component of a squished one-and-a-half-x inset, compressed by the squish modifier.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.one-and-a-half-x}
   * @value 12
   * @cssvar --cdr-space-inset-one-and-a-half-x-squish-top-bottom
   */
  readonly CdrSpaceInsetOneAndAHalfXSquishTopBottom: string;
  /**
   * @value 36 24
   * @cssvar --cdr-space-inset-one-and-a-half-x-stretch
   */
  readonly CdrSpaceInsetOneAndAHalfXStretch: string;
  /**
   * @usage Left and right padding component of a stretched one-and-a-half-x inset.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.one-and-a-half-x}
   * @value 24
   * @cssvar --cdr-space-inset-one-and-a-half-x-stretch-left-right
   */
  readonly CdrSpaceInsetOneAndAHalfXStretchLeftRight: string;
  /**
   * @usage Top and bottom padding component of a stretched one-and-a-half-x inset, expanded by the stretch modifier.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.one-and-a-half-x}
   * @value 36
   * @cssvar --cdr-space-inset-one-and-a-half-x-stretch-top-bottom
   */
  readonly CdrSpaceInsetOneAndAHalfXStretchTopBottom: string;
  /**
   * @usage Uniform inset padding at the base unit.
   * @design Use for standard component padding such as cards or panels.
   * @value 16
   * @cssvar --cdr-space-inset-one-x
   */
  readonly CdrSpaceInsetOneX: string;
  /**
   * @value 8 16
   * @cssvar --cdr-space-inset-one-x-squish
   */
  readonly CdrSpaceInsetOneXSquish: string;
  /**
   * @usage Left and right padding component of a squished one-x inset.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.one-x}
   * @value 16
   * @cssvar --cdr-space-inset-one-x-squish-left-right
   */
  readonly CdrSpaceInsetOneXSquishLeftRight: string;
  /**
   * @usage Top and bottom padding component of a squished one-x inset, compressed by the squish modifier.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.one-x}
   * @value 8
   * @cssvar --cdr-space-inset-one-x-squish-top-bottom
   */
  readonly CdrSpaceInsetOneXSquishTopBottom: string;
  /**
   * @value 24 16
   * @cssvar --cdr-space-inset-one-x-stretch
   */
  readonly CdrSpaceInsetOneXStretch: string;
  /**
   * @usage Left and right padding component of a stretched one-x inset.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.one-x}
   * @value 16
   * @cssvar --cdr-space-inset-one-x-stretch-left-right
   */
  readonly CdrSpaceInsetOneXStretchLeftRight: string;
  /**
   * @usage Top and bottom padding component of a stretched one-x inset, expanded by the stretch modifier.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.one-x}
   * @value 24
   * @cssvar --cdr-space-inset-one-x-stretch-top-bottom
   */
  readonly CdrSpaceInsetOneXStretchTopBottom: string;
  /**
   * @usage Uniform inset padding at one-quarter of the base unit.
   * @design Use for small components such as chips or compact buttons.
   * @value 4
   * @cssvar --cdr-space-inset-quarter-x
   */
  readonly CdrSpaceInsetQuarterX: string;
  /**
   * @value 2 4
   * @cssvar --cdr-space-inset-quarter-x-squish
   */
  readonly CdrSpaceInsetQuarterXSquish: string;
  /**
   * @usage Left and right padding component of a squished quarter-x inset.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.quarter-x}
   * @value 4
   * @cssvar --cdr-space-inset-quarter-x-squish-left-right
   */
  readonly CdrSpaceInsetQuarterXSquishLeftRight: string;
  /**
   * @usage Top and bottom padding component of a squished quarter-x inset, compressed by the squish modifier.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.quarter-x}
   * @value 2
   * @cssvar --cdr-space-inset-quarter-x-squish-top-bottom
   */
  readonly CdrSpaceInsetQuarterXSquishTopBottom: string;
  /**
   * @value 6 4
   * @cssvar --cdr-space-inset-quarter-x-stretch
   */
  readonly CdrSpaceInsetQuarterXStretch: string;
  /**
   * @usage Left and right padding component of a stretched quarter-x inset.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.quarter-x}
   * @value 4
   * @cssvar --cdr-space-inset-quarter-x-stretch-left-right
   */
  readonly CdrSpaceInsetQuarterXStretchLeftRight: string;
  /**
   * @usage Top and bottom padding component of a stretched quarter-x inset, expanded by the stretch modifier.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.quarter-x}
   * @value 6
   * @cssvar --cdr-space-inset-quarter-x-stretch-top-bottom
   */
  readonly CdrSpaceInsetQuarterXStretchTopBottom: string;
  /**
   * @usage Uniform inset padding at one-sixteenth of the base unit.
   * @design Use for the tightest padding on very small components such as micro badges.
   * @value 1
   * @cssvar --cdr-space-inset-sixteenth-x
   */
  readonly CdrSpaceInsetSixteenthX: string;
  /**
   * @usage Uniform inset padding at three-eighths of the base unit.
   * @design Use for components needing slightly more padding than quarter-x.
   * @value 6
   * @cssvar --cdr-space-inset-three-eighth-x
   */
  readonly CdrSpaceInsetThreeEighthX: string;
  /**
   * @usage Uniform inset padding at three-quarters of the base unit.
   * @design Use for components needing slightly more padding than half-x.
   * @value 12
   * @cssvar --cdr-space-inset-three-quarter-x
   */
  readonly CdrSpaceInsetThreeQuarterX: string;
  /**
   * @value 6 12
   * @cssvar --cdr-space-inset-three-quarter-x-squish
   */
  readonly CdrSpaceInsetThreeQuarterXSquish: string;
  /**
   * @usage Left and right padding component of a squished three-quarter-x inset.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.three-quarter-x}
   * @value 12
   * @cssvar --cdr-space-inset-three-quarter-x-squish-left-right
   */
  readonly CdrSpaceInsetThreeQuarterXSquishLeftRight: string;
  /**
   * @usage Top and bottom padding component of a squished three-quarter-x inset, compressed by the squish modifier.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.three-quarter-x}
   * @value 6
   * @cssvar --cdr-space-inset-three-quarter-x-squish-top-bottom
   */
  readonly CdrSpaceInsetThreeQuarterXSquishTopBottom: string;
  /**
   * @value 18 12
   * @cssvar --cdr-space-inset-three-quarter-x-stretch
   */
  readonly CdrSpaceInsetThreeQuarterXStretch: string;
  /**
   * @usage Left and right padding component of a stretched three-quarter-x inset.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.three-quarter-x}
   * @value 12
   * @cssvar --cdr-space-inset-three-quarter-x-stretch-left-right
   */
  readonly CdrSpaceInsetThreeQuarterXStretchLeftRight: string;
  /**
   * @usage Top and bottom padding component of a stretched three-quarter-x inset, expanded by the stretch modifier.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.three-quarter-x}
   * @value 18
   * @cssvar --cdr-space-inset-three-quarter-x-stretch-top-bottom
   */
  readonly CdrSpaceInsetThreeQuarterXStretchTopBottom: string;
  /**
   * @usage Uniform inset padding at three-sixteenths of the base unit.
   * @design Use for compact components needing slightly more padding than eighth-x.
   * @value 3
   * @cssvar --cdr-space-inset-three-sixteenth-x
   */
  readonly CdrSpaceInsetThreeSixteenthX: string;
  /**
   * @usage Uniform inset padding at three times the base unit.
   * @design Use for very spacious layouts or full-width content areas.
   * @value 48
   * @cssvar --cdr-space-inset-three-x
   */
  readonly CdrSpaceInsetThreeX: string;
  /**
   * @value 24 48
   * @cssvar --cdr-space-inset-three-x-squish
   */
  readonly CdrSpaceInsetThreeXSquish: string;
  /**
   * @usage Left and right padding component of a squished three-x inset.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.three-x}
   * @value 48
   * @cssvar --cdr-space-inset-three-x-squish-left-right
   */
  readonly CdrSpaceInsetThreeXSquishLeftRight: string;
  /**
   * @usage Top and bottom padding component of a squished three-x inset, compressed by the squish modifier.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.three-x}
   * @value 24
   * @cssvar --cdr-space-inset-three-x-squish-top-bottom
   */
  readonly CdrSpaceInsetThreeXSquishTopBottom: string;
  /**
   * @value 72 48
   * @cssvar --cdr-space-inset-three-x-stretch
   */
  readonly CdrSpaceInsetThreeXStretch: string;
  /**
   * @usage Left and right padding component of a stretched three-x inset.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.three-x}
   * @value 48
   * @cssvar --cdr-space-inset-three-x-stretch-left-right
   */
  readonly CdrSpaceInsetThreeXStretchLeftRight: string;
  /**
   * @usage Top and bottom padding component of a stretched three-x inset, expanded by the stretch modifier.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.three-x}
   * @value 72
   * @cssvar --cdr-space-inset-three-x-stretch-top-bottom
   */
  readonly CdrSpaceInsetThreeXStretchTopBottom: string;
  /**
   * @usage Uniform inset padding at two times the base unit.
   * @design Use for spacious layouts such as page sections or large containers.
   * @value 32
   * @cssvar --cdr-space-inset-two-x
   */
  readonly CdrSpaceInsetTwoX: string;
  /**
   * @value 16 32
   * @cssvar --cdr-space-inset-two-x-squish
   */
  readonly CdrSpaceInsetTwoXSquish: string;
  /**
   * @usage Left and right padding component of a squished two-x inset.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.two-x}
   * @value 32
   * @cssvar --cdr-space-inset-two-x-squish-left-right
   */
  readonly CdrSpaceInsetTwoXSquishLeftRight: string;
  /**
   * @usage Top and bottom padding component of a squished two-x inset, compressed by the squish modifier.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.two-x}
   * @value 16
   * @cssvar --cdr-space-inset-two-x-squish-top-bottom
   */
  readonly CdrSpaceInsetTwoXSquishTopBottom: string;
  /**
   * @value 48 32
   * @cssvar --cdr-space-inset-two-x-stretch
   */
  readonly CdrSpaceInsetTwoXStretch: string;
  /**
   * @usage Left and right padding component of a stretched two-x inset.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.two-x}
   * @value 32
   * @cssvar --cdr-space-inset-two-x-stretch-left-right
   */
  readonly CdrSpaceInsetTwoXStretchLeftRight: string;
  /**
   * @usage Top and bottom padding component of a stretched two-x inset, expanded by the stretch modifier.
   * @design Avoid in new work. Use the base inset token instead.
   * @alternatives {space.inset.two-x}
   * @value 48
   * @cssvar --cdr-space-inset-two-x-stretch-top-bottom
   */
  readonly CdrSpaceInsetTwoXStretchTopBottom: string;
}

export declare const CdrSpaceInset: CdrSpaceInsetTokens;

export default CdrSpaceInset;