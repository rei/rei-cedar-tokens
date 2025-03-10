
//
// CdrColor.h
//

#import <UIKit/UIKit.h>

typedef NS_ENUM(NSInteger, CdrColorName) {
CdrColorBackgroundAccordionHover,
CdrColorBackgroundButtonPrimaryRest,
CdrColorBackgroundButtonPrimaryActive,
CdrColorBackgroundButtonPrimaryHover,
CdrColorBackgroundButtonPrimaryIconAltHover,
CdrColorBackgroundButtonSecondaryRest,
CdrColorBackgroundButtonSecondaryActive,
CdrColorBackgroundButtonSecondaryHover,
CdrColorBackgroundButtonSecondaryDisabled,
CdrColorBackgroundButtonDarkRest,
CdrColorBackgroundButtonDarkActive,
CdrColorBackgroundButtonDarkHover,
CdrColorBackgroundButtonSaleRest,
CdrColorBackgroundButtonSaleActive,
CdrColorBackgroundButtonSaleHover,
CdrColorBackgroundButtonDefaultDisabled,
CdrColorBackgroundButtonIconOnlyActive,
CdrColorBackgroundChipDefaultRest,
CdrColorBackgroundChipDefaultDisabled,
CdrColorBackgroundChipDefaultHover,
CdrColorBackgroundChipDefaultFocus,
CdrColorBackgroundChipDefaultActive,
CdrColorBackgroundChipDefaultSelected,
CdrColorBackgroundChipDefaultSelectedHover,
CdrColorBackgroundChipDefaultSelectedFocus,
CdrColorBackgroundChipDefaultSelectedActive,
CdrColorBackgroundTransparent,
CdrColorBackgroundPrimary,
CdrColorBackgroundSecondary,
CdrColorBackgroundSale,
CdrColorBackgroundBrandSpruce,
CdrColorBackgroundSuccess,
CdrColorBackgroundInfo,
CdrColorBackgroundWarning,
CdrColorBackgroundError,
CdrColorBackgroundLabelDefaultHover,
CdrColorBackgroundLabelDefaultActive,
CdrColorBackgroundLabelDefaultFocus,
CdrColorBackgroundLabelSecondaryHover,
CdrColorBackgroundLabelSecondaryActive,
CdrColorBackgroundLabelSecondaryFocus,
CdrColorBackgroundInputDefault,
CdrColorBackgroundInputSecondary,
CdrColorBackgroundInputError,
CdrColorBackgroundInputDefaultHover,
CdrColorBackgroundInputDefaultActive,
CdrColorBackgroundInputDefaultSelected,
CdrColorBackgroundInputSecondaryActive,
CdrColorBackgroundInputDefaultSelectedHover,
CdrColorBackgroundInputDefaultDisabled,
CdrColorBackgroundInputDefaultSelectedFocus,
CdrColorBackgroundInputDefaultFocus,
CdrColorBackgroundMessageDefault01,
CdrColorBackgroundMessageDefault02,
CdrColorBackgroundMessageSuccess,
CdrColorBackgroundMessageSuccess01,
CdrColorBackgroundMessageSuccess02,
CdrColorBackgroundMessageWarning,
CdrColorBackgroundMessageWarning01,
CdrColorBackgroundMessageWarning02,
CdrColorBackgroundMessageError,
CdrColorBackgroundMessageError01,
CdrColorBackgroundMessageError02,
CdrColorBackgroundMessageInfo,
CdrColorBackgroundMessageInfo01,
CdrColorBackgroundMessageInfo02,
CdrColorBackgroundMessageSale,
CdrColorBackgroundModalOverlay,
CdrColorBackgroundPaginationHover,
CdrColorBackgroundPaginationKeyline,
CdrColorBackgroundRatingStarDefault,
CdrColorBackgroundRatingStarHighlighted,
CdrColorBackgroundSlideHover,
CdrColorBackgroundSlideDefault,
CdrColorBackgroundSurfaceSelectionDefaultRest,
CdrColorBackgroundSurfaceSelectionDefaultActive,
CdrColorBackgroundSurfaceSelectionDefaultHover,
CdrColorBackgroundSurfaceSelectionDefaultChecked,
CdrColorBackgroundSurfaceSelectionDefaultDisabled,
CdrColorBackgroundSurfaceSelectionDefaultLoading,
CdrColorBackgroundSurfacePrimary,
CdrColorBackgroundSurfaceSecondary,
CdrColorBackgroundSurfaceBrandSpruce,
CdrColorBackgroundSurfaceSale,
CdrColorBackgroundSwitchDefaultRest,
CdrColorBackgroundSwitchDefaultHover,
CdrColorBackgroundSwitchDefaultFocus,
CdrColorBackgroundSwitchSelectedDefaultRest,
CdrColorBackgroundSwitchSelectedDefaultHover,
CdrColorBackgroundSwitchSelectedDefaultFocus,
CdrColorBackgroundSwitchHandleDefaultRest,
CdrColorBackgroundSwitchHandleDefaultHover,
CdrColorBackgroundSwitchHandleDefaultFocus,
CdrColorBackgroundSwitchHandleSelectedDefaultRest,
CdrColorBackgroundSwitchHandleSelectedDefaultHover,
CdrColorBackgroundSwitchHandleSelectedDefaultFocus,
CdrColorBackgroundTableHeader,
CdrColorBackgroundTableRow,
CdrColorBackgroundTableRowAlt,
CdrColorBackgroundToggleGroupDefaultRest,
CdrColorBackgroundToggleButtonDefaultRest,
CdrColorBackgroundToggleButtonDefaultHover,
CdrColorBackgroundToggleButtonDefaultFocus,
CdrColorBackgroundToggleButtonDefaultSelectedRest,
CdrColorBackgroundToggleButtonDefaultSelectedHover,
CdrColorBackgroundTooltipDefault,
CdrColorTextButtonPrimary,
CdrColorTextButtonPrimaryHover,
CdrColorTextButtonPrimaryActive,
CdrColorTextButtonPrimaryDisabled,
CdrColorTextButtonSecondary,
CdrColorTextButtonSecondaryHover,
CdrColorTextButtonSecondaryActive,
CdrColorTextButtonSecondaryDisabled,
CdrColorTextButtonDark,
CdrColorTextButtonDarkHover,
CdrColorTextButtonDarkActive,
CdrColorTextButtonDarkDisabled,
CdrColorTextButtonSale,
CdrColorTextButtonSaleHover,
CdrColorTextButtonSaleActive,
CdrColorTextButtonSaleDisabled,
CdrColorTextChipDefault,
CdrColorTextChipDisabled,
CdrColorTextPrimary,
CdrColorTextSecondary,
CdrColorTextEmphasis,
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
CdrColorTextInputLabelDisabled,
CdrColorTextInputPlaceholder,
CdrColorTextInputRequired,
CdrColorTextInputOptional,
CdrColorTextInputDisabled,
CdrColorTextInputFilled,
CdrColorTextInputHelp,
CdrColorTextInputError,
CdrColorTextLinkRest,
CdrColorTextLinkHover,
CdrColorTextLinkActive,
CdrColorTextLinkDisabled,
CdrColorTextLinkVisited,
CdrColorTextMessageError,
CdrColorTextRatingDefault,
CdrColorTextRatingHover,
CdrColorTextRatingSeparator,
CdrColorTextTabRest,
CdrColorTextTabActive,
CdrColorTextTabHover,
CdrColorTextTabDisabled,
CdrColorTextToggleButtonDefaultRest,
CdrColorTextTooltipDefault,
CdrColorBorderButtonPrimaryRest,
CdrColorBorderButtonPrimaryActive,
CdrColorBorderButtonPrimaryActiveInset,
CdrColorBorderButtonPrimaryHover,
CdrColorBorderButtonSecondaryRest,
CdrColorBorderButtonSecondaryActive,
CdrColorBorderButtonSecondaryActiveInset,
CdrColorBorderButtonSecondaryHover,
CdrColorBorderButtonDarkRest,
CdrColorBorderButtonDarkActive,
CdrColorBorderButtonDarkActiveInset,
CdrColorBorderButtonDarkHover,
CdrColorBorderButtonSaleRest,
CdrColorBorderButtonSaleActive,
CdrColorBorderButtonSaleActiveInset,
CdrColorBorderButtonSaleHover,
CdrColorBorderButtonDefaultDisabled,
CdrColorBorderButtonIconOnlyActive,
CdrColorBorderChipDefaultRest,
CdrColorBorderChipDefaultDisabled,
CdrColorBorderChipDefaultHover,
CdrColorBorderChipDefaultFocus,
CdrColorBorderChipDefaultActive,
CdrColorBorderChipDefaultSelectedRest,
CdrColorBorderChipDefaultSelectedHover,
CdrColorBorderChipDefaultSelectedFocus,
CdrColorBorderTransparent,
CdrColorBorderPrimary,
CdrColorBorderSecondary,
CdrColorBorderSuccess,
CdrColorBorderWarning,
CdrColorBorderError,
CdrColorBorderInfo,
CdrColorBorderLabelDefaultFocus,
CdrColorBorderInputDefault,
CdrColorBorderInputError,
CdrColorBorderInputDefaultActive,
CdrColorBorderInputDefaultSelected,
CdrColorBorderInputDefaultFocus,
CdrColorBorderInputDefaultSelectedHover,
CdrColorBorderInputDefaultHover,
CdrColorBorderInputDefaultDisabled,
CdrColorBorderLinkRest,
CdrColorBorderLinkHover,
CdrColorBorderLinkActive,
CdrColorBorderLinkDisabled,
CdrColorBorderLinkVisited,
CdrColorBorderMessageDefault01,
CdrColorBorderMessageDefault02,
CdrColorBorderMessageSuccess01,
CdrColorBorderMessageSuccess02,
CdrColorBorderMessageWarning01,
CdrColorBorderMessageWarning02,
CdrColorBorderMessageError01,
CdrColorBorderMessageError02,
CdrColorBorderMessageInfo01,
CdrColorBorderMessageInfo02,
CdrColorBorderRatingStarDefault,
CdrColorBorderRatingStarHighlighted,
CdrColorBorderSurfaceSelectionDefaultRest,
CdrColorBorderSurfaceSelectionDefaultActive,
CdrColorBorderSurfaceSelectionDefaultHover,
CdrColorBorderSurfaceSelectionDefaultChecked,
CdrColorBorderSurfaceSelectionDefaultDisabled,
CdrColorBorderSurfaceSelectionDefaultLoading,
CdrColorBorderSurfacePrimary,
CdrColorBorderSurfaceSecondary,
CdrColorBorderSurfaceSuccess,
CdrColorBorderSurfaceWarning,
CdrColorBorderSurfaceError,
CdrColorBorderSurfaceInfo,
CdrColorBorderSwitchDefaultHover,
CdrColorBorderSwitchHandleDefaultRest,
CdrColorBorderSwitchHandleDefaultHover,
CdrColorBorderSwitchHandleDefaultFocus,
CdrColorBorderTabKeylineRest,
CdrColorBorderTabKeylineActive,
CdrColorBorderTabKeylineActiveAlt,
CdrColorBorderTabKeylineHover,
CdrColorBorderTabKeylineHoverAlt,
CdrColorBorderTabKeylineDisabled,
CdrColorBorderTableDefault,
CdrColorBorderTableHead,
CdrColorBorderToggleButtonDefaultFocus,
CdrColorBorderToggleButtonDefaultSelectedRest,
CdrColorBorderToggleButtonDefaultSelectedFocus,
CdrColorBorderTooltipDefault,
CdrColorIconDefault,
CdrColorIconEmphasis,
CdrColorIconLink,
CdrColorIconDisabled,
CdrColorIconCheckboxDefaultSelected,
CdrColorIconCheckboxDefaultSelectedHover,
CdrColorIconCheckboxDefaultSelectedActive,
CdrColorIconMessageDefault,
CdrColorIconMessageSuccess,
CdrColorIconMessageWarning,
CdrColorIconMessageError,
CdrColorIconMessageInfo,
CdrColorIconSwitchSelectedDefaultRest,
CdrColorIconSwitchSelectedDefaultHover,
CdrColorIconSwitchSelectedDefaultFocus,
CdrProminenceFlatColor,
CdrProminenceRaisedColor,
CdrProminenceElevatedColor,
CdrProminenceFloatingColor,
CdrProminenceLiftedColor,
CdrMembershipVibrantColorTextButtonPrimaryHover,
CdrMembershipVibrantColorTextPrimary,
CdrMembershipVibrantColorTextLinkRest,
CdrMembershipVibrantColorTextLinkHover,
CdrMembershipVibrantColorTextLinkVisited,
CdrMembershipVibrantColorBackgroundButtonPrimaryRest,
CdrMembershipVibrantColorBackgroundButtonPrimaryActive,
CdrMembershipVibrantColorBackgroundPrimary,
CdrMembershipVibrantColorBorderButtonPrimaryRest,
CdrMembershipVibrantColorBorderButtonPrimaryActive,
CdrMembershipVibrantColorBorderButtonPrimaryHover,
CdrMembershipVibrantColorBorderLinkRest,
CdrMembershipVibrantColorBorderLinkHover,
CdrMembershipVibrantColorBorderLinkVisited,
CdrMembershipSubtleColorTextButtonPrimaryHover,
CdrMembershipSubtleColorTextPrimary,
CdrMembershipSubtleColorTextLinkRest,
CdrMembershipSubtleColorTextLinkHover,
CdrMembershipSubtleColorTextLinkVisited,
CdrMembershipSubtleColorBackgroundButtonPrimaryRest,
CdrMembershipSubtleColorBackgroundButtonPrimaryActive,
CdrMembershipSubtleColorBackgroundPrimary,
CdrMembershipSubtleColorBorderButtonPrimaryRest,
CdrMembershipSubtleColorBorderButtonPrimaryActive,
CdrMembershipSubtleColorBorderButtonPrimaryHover,
CdrMembershipSubtleColorBorderLinkRest,
CdrMembershipSubtleColorBorderLinkHover,
CdrMembershipSubtleColorBorderLinkVisited
};

@interface CdrColor : NSObject
+ (NSArray *)values;
+ (UIColor *)color:(CdrColorName)color;
@end