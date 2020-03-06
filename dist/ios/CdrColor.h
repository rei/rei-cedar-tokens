
//
// CdrColor.h
//

//

#import <UIKit/UIKit.h>


typedef NS_ENUM(NSInteger, CdrColorName) {
CdrColorTextPrimary,
CdrColorTextSecondary,
CdrColorTextBrand,
CdrColorTextSale,
CdrColorTextInverse,
CdrColorTextDisabled,
CdrColorTextSuccess,
CdrColorTextWarning,
CdrColorTextError,
CdrColorTextInfo,
CdrColorTextInputDefault,
CdrColorTextInputLabel,
CdrColorTextInputPlaceholder,
CdrColorTextInputRequired,
CdrColorTextInputDisabled,
CdrColorTextInputFilled,
CdrColorTextInputHelp,
CdrColorTextLinkRest,
CdrColorTextLinkHover,
CdrColorTextLinkActive,
CdrColorTextLinkDisabled,
CdrColorTextLinkVisited,
CdrColorTextButtonPrimary,
CdrColorTextButtonPrimaryDisabled,
CdrColorTextButtonSecondary,
CdrColorTextButtonSecondaryDisabled,
CdrColorTextCtaDark,
CdrColorTextCtaDarkDisabled,
CdrColorTextCtaLight,
CdrColorTextCtaLightDisabled,
CdrColorTextCtaBrand,
CdrColorTextCtaBrandDisabled,
CdrColorTextCtaSale,
CdrColorTextCtaSaleDisabled,
CdrColorTextTabRest,
CdrColorTextTabActive,
CdrColorTextTabHover,
CdrColorTextTabDisabled,
CdrColorTextRatingDefault,
CdrColorTextRatingHover,
CdrColorTextRatingSeparator,
CdrColorIconDefault,
CdrColorIconEmphasis,
CdrColorIconDisabled,
CdrColorBackgroundPrimary,
CdrColorBackgroundSecondary,
CdrColorBackgroundSuccess,
CdrColorBackgroundWarning,
CdrColorBackgroundError,
CdrColorBackgroundInfo,
CdrColorBackgroundTableRow,
CdrColorBackgroundTableRowAlt,
CdrColorBackgroundInputDefault,
CdrColorBackgroundInputDefaultHover,
CdrColorBackgroundInputDefaultSelected,
CdrColorBackgroundInputDefaultSelectedHover,
CdrColorBackgroundInputDefaultDisabled,
CdrColorBackgroundButtonPrimaryRest,
CdrColorBackgroundButtonPrimaryActive,
CdrColorBackgroundButtonPrimaryHover,
CdrColorBackgroundButtonSecondaryRest,
CdrColorBackgroundButtonSecondaryActive,
CdrColorBackgroundButtonSecondaryHover,
CdrColorBackgroundButtonSecondaryDisabled,
CdrColorBackgroundButtonDefaultDisabled,
CdrColorBackgroundCtaDarkRest,
CdrColorBackgroundCtaDarkActive,
CdrColorBackgroundCtaDarkHover,
CdrColorBackgroundCtaLightRest,
CdrColorBackgroundCtaLightActive,
CdrColorBackgroundCtaLightHover,
CdrColorBackgroundCtaLightDisabled,
CdrColorBackgroundCtaSaleRest,
CdrColorBackgroundCtaSaleActive,
CdrColorBackgroundCtaSaleHover,
CdrColorBackgroundCtaBrandActive,
CdrColorBackgroundCtaBrandHover,
CdrColorBackgroundCtaDefaultDisabled,
CdrColorBackgroundAccordionHover,
CdrColorBackgroundPaginationHover,
CdrColorBackgroundPaginationKeyline,
CdrColorBackgroundButtonIconAltHover,
CdrColorBackgroundRatingStarDefault,
CdrColorBackgroundRatingStarHighlighted,
CdrColorBackgroundModalOverlay,
CdrColorBorderPrimary,
CdrColorBorderSecondary,
CdrColorBorderSuccess,
CdrColorBorderWarning,
CdrColorBorderError,
CdrColorBorderInfo,
CdrColorBorderInputDefault,
CdrColorBorderInputDefaultActive,
CdrColorBorderInputDefaultSelected,
CdrColorBorderInputDefaultSelectedHover,
CdrColorBorderInputDefaultHover,
CdrColorBorderInputDefaultDisabled,
CdrColorBorderButtonPrimaryRest,
CdrColorBorderButtonPrimaryActive,
CdrColorBorderButtonPrimaryHover,
CdrColorBorderButtonSecondaryRest,
CdrColorBorderButtonSecondaryActive,
CdrColorBorderButtonSecondaryHover,
CdrColorBorderButtonDefaultDisabled,
CdrColorBorderCtaDarkRest,
CdrColorBorderCtaDarkActive,
CdrColorBorderCtaDarkHover,
CdrColorBorderCtaLightRest,
CdrColorBorderCtaLightActive,
CdrColorBorderCtaLightHover,
CdrColorBorderCtaSaleRest,
CdrColorBorderCtaSaleActive,
CdrColorBorderCtaSaleHover,
CdrColorBorderCtaBrandRest,
CdrColorBorderCtaBrandActive,
CdrColorBorderCtaBrandHover,
CdrColorBorderCtaDefaultDisabled,
CdrColorBorderRatingStarDefault,
CdrColorBorderRatingStarHighlighted,
CdrColorBorderLinkRest,
CdrColorBorderLinkHover,
CdrColorBorderLinkActive,
CdrColorBorderLinkDisabled,
CdrColorBorderLinkVisited,
CdrColorBorderTableDefault,
CdrColorBorderTabKeylineRest,
CdrColorBorderTabKeylineActive,
CdrColorBorderTabKeylineActiveAlt,
CdrColorBorderTabKeylineHover,
CdrColorBorderTabKeylineHoverAlt,
CdrColorBorderTabKeylineDisabled,
CdrColorTextPrimaryLightmode,
CdrColorTextPrimaryDarkmode,
CdrColorTextSecondaryLightmode,
CdrColorTextSecondaryDarkmode,
CdrColorTextDisabledLightmode,
CdrColorTextDisabledDarkmode,
CdrColorTextLinkLightmode,
CdrColorTextLinkDarkmode,
CdrColorTextErrorLightmode,
CdrColorTextErrorDarkmode,
CdrColorTextFormLabelLightmode,
CdrColorTextFormLabelDarkmode,
CdrColorTextFormPlaceholderLightmode,
CdrColorTextFormPlaceholderDarkmode,
CdrColorTextFormDisabledLightmode,
CdrColorTextFormDisabledDarkmode,
CdrColorIconPrimaryLightmode,
CdrColorIconPrimaryDarkmode,
CdrColorIconEmphasisLightmode,
CdrColorIconEmphasisDarkmode,
CdrColorBackgroundDark,
CdrColorBackgroundDarker,
CdrColorBackgroundLight,
CdrColorBackgroundLighter,
CdrColorBackgroundLightest,
CdrColorBackgroundFormLightmode,
CdrColorBackgroundFormDarkmode,
CdrColorBackgroundFormInputLightmode,
CdrColorBackgroundFormInputDarkmode,
CdrColorBorderPrimaryLightmode,
CdrColorBorderPrimaryDarkmode,
CdrColorBorderSecondaryLightmode,
CdrColorBorderSecondaryDarkmode,
CdrColorBorderDisabledLightmode,
CdrColorBorderDisabledDarkmode,
CdrColorBorderErrorLightmode,
CdrColorBorderSelectedLightmode,
CdrProminenceFlatColor,
CdrProminenceRaisedColor,
CdrProminenceElevatedColor,
CdrProminenceFloatingColor,
CdrProminenceLiftedColor
};

@interface CdrColor : NSObject
+ (NSArray *)values;
+ (UIColor *)color:(CdrColorName)color;
@end
