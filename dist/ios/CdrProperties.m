
//
// CdrProperties.m
//

//

#import "CdrProperties.h"

@implementation CdrProperties

+ (NSDictionary *)getProperty:(NSString *)keyPath {
  return [[self properties] valueForKeyPath:keyPath];
}

+ (nonnull)getValue:(NSString *)keyPath {
  return [[self properties] valueForKeyPath:[NSString stringWithFormat:@"%@.value", keyPath]];
}

+ (NSDictionary *)properties {
  static NSDictionary * dictionary;
  static dispatch_once_t onceToken;

  dispatch_once(&onceToken, ^{
    dictionary = @{
  @"color": @{
    @"text": @{
      @"primary": @{
        @"lightmode": @{
          @"value": [UIColor colorWithRed:0.16f green:0.16f blue:0.16f alpha:1.00f],
          @"name": @"CdrColorTextPrimaryLightmode",
          @"category": @"color"
          },
        @"darkmode": @{
          @"value": [UIColor colorWithRed:0.98f green:0.98f blue:0.98f alpha:1.00f],
          @"name": @"CdrColorTextPrimaryDarkmode",
          @"category": @"color"
          }
        },
      @"secondary": @{
        @"lightmode": @{
          @"value": [UIColor colorWithRed:0.38f green:0.38f blue:0.38f alpha:1.00f],
          @"name": @"CdrColorTextSecondaryLightmode",
          @"category": @"color"
          },
        @"darkmode": @{
          @"value": [UIColor colorWithRed:0.60f green:0.60f blue:0.60f alpha:1.00f],
          @"name": @"CdrColorTextSecondaryDarkmode",
          @"category": @"color"
          }
        },
      @"disabled": @{
        @"lightmode": @{
          @"value": [UIColor colorWithRed:0.72f green:0.72f blue:0.72f alpha:1.00f],
          @"name": @"CdrColorTextDisabledLightmode",
          @"category": @"color"
          },
        @"darkmode": @{
          @"value": [UIColor colorWithRed:0.38f green:0.38f blue:0.38f alpha:1.00f],
          @"name": @"CdrColorTextDisabledDarkmode",
          @"category": @"color"
          }
        },
      @"link": @{
        @"lightmode": @{
          @"value": [UIColor colorWithRed:0.20f green:0.47f blue:0.68f alpha:1.00f],
          @"name": @"CdrColorTextLinkLightmode",
          @"category": @"color"
          },
        @"darkmode": @{
          @"value": [UIColor colorWithRed:0.32f green:0.59f blue:0.80f alpha:1.00f],
          @"name": @"CdrColorTextLinkDarkmode",
          @"category": @"color"
          }
        },
      @"error": @{
        @"lightmode": @{
          @"value": [UIColor colorWithRed:0.71f green:0.16f blue:0.17f alpha:1.00f],
          @"name": @"CdrColorTextErrorLightmode",
          @"category": @"color"
          },
        @"darkmode": @{
          @"value": [UIColor colorWithRed:0.91f green:0.41f blue:0.41f alpha:1.00f],
          @"name": @"CdrColorTextErrorDarkmode",
          @"category": @"color"
          }
        },
      @"form": @{
        @"label": @{
          @"lightmode": @{
            @"value": [UIColor colorWithRed:0.16f green:0.16f blue:0.16f alpha:1.00f],
            @"name": @"CdrColorTextFormLabelLightmode",
            @"category": @"color"
            },
          @"darkmode": @{
            @"value": [UIColor colorWithRed:0.98f green:0.98f blue:0.98f alpha:1.00f],
            @"name": @"CdrColorTextFormLabelDarkmode",
            @"category": @"color"
            }
          },
        @"placeholder": @{
          @"lightmode": @{
            @"value": [UIColor colorWithRed:0.38f green:0.38f blue:0.38f alpha:1.00f],
            @"name": @"CdrColorTextFormPlaceholderLightmode",
            @"category": @"color"
            },
          @"darkmode": @{
            @"value": [UIColor colorWithRed:0.60f green:0.60f blue:0.60f alpha:1.00f],
            @"name": @"CdrColorTextFormPlaceholderDarkmode",
            @"category": @"color"
            }
          },
        @"disabled": @{
          @"lightmode": @{
            @"value": [UIColor colorWithRed:0.72f green:0.72f blue:0.72f alpha:1.00f],
            @"name": @"CdrColorTextFormDisabledLightmode",
            @"category": @"color"
            },
          @"darkmode": @{
            @"value": [UIColor colorWithRed:0.38f green:0.38f blue:0.38f alpha:1.00f],
            @"name": @"CdrColorTextFormDisabledDarkmode",
            @"category": @"color"
            }
          }
        }
      },
    @"icon": @{
      @"primary": @{
        @"lightmode": @{
          @"value": [UIColor colorWithRed:0.16f green:0.16f blue:0.16f alpha:1.00f],
          @"name": @"CdrColorIconPrimaryLightmode",
          @"category": @"color"
          },
        @"darkmode": @{
          @"value": [UIColor colorWithRed:0.98f green:0.98f blue:0.98f alpha:1.00f],
          @"name": @"CdrColorIconPrimaryDarkmode",
          @"category": @"color"
          }
        }
      },
    @"background": @{
      @"dark": @{
        @"value": [UIColor colorWithRed:0.10f green:0.10f blue:0.10f alpha:1.00f],
        @"name": @"CdrColorBackgroundDark",
        @"category": @"color"
        },
      @"darker": @{
        @"value": [UIColor colorWithRed:0.16f green:0.16f blue:0.16f alpha:1.00f],
        @"name": @"CdrColorBackgroundDarker",
        @"category": @"color"
        },
      @"light": @{
        @"value": [UIColor colorWithRed:0.97f green:0.97f blue:0.97f alpha:1.00f],
        @"name": @"CdrColorBackgroundLight",
        @"category": @"color"
        },
      @"lighter": @{
        @"value": [UIColor colorWithRed:0.98f green:0.98f blue:0.98f alpha:1.00f],
        @"name": @"CdrColorBackgroundLighter",
        @"category": @"color"
        },
      @"lightest": @{
        @"value": [UIColor colorWithRed:1.00f green:1.00f blue:1.00f alpha:1.00f],
        @"name": @"CdrColorBackgroundLightest",
        @"category": @"color"
        },
      @"form": @{
        @"lightmode": @{
          @"value": [UIColor colorWithRed:1.00f green:1.00f blue:1.00f alpha:1.00f],
          @"name": @"CdrColorBackgroundFormLightmode",
          @"category": @"color"
          },
        @"darkmode": @{
          @"value": [UIColor colorWithRed:0.10f green:0.10f blue:0.10f alpha:1.00f],
          @"name": @"CdrColorBackgroundFormDarkmode",
          @"category": @"color"
          },
        @"input": @{
          @"lightmode": @{
            @"value": [UIColor colorWithRed:1.00f green:1.00f blue:1.00f alpha:1.00f],
            @"name": @"CdrColorBackgroundFormInputLightmode",
            @"category": @"color"
            },
          @"darkmode": @{
            @"value": [UIColor colorWithRed:0.10f green:0.10f blue:0.10f alpha:1.00f],
            @"name": @"CdrColorBackgroundFormInputDarkmode",
            @"category": @"color"
            }
          }
        }
      },
    @"border": @{
      @"primary": @{
        @"lightmode": @{
          @"value": [UIColor colorWithRed:0.38f green:0.38f blue:0.38f alpha:1.00f],
          @"name": @"CdrColorBorderPrimaryLightmode",
          @"category": @"color"
          },
        @"darkmode": @{
          @"value": [UIColor colorWithRed:0.98f green:0.98f blue:0.98f alpha:1.00f],
          @"name": @"CdrColorBorderPrimaryDarkmode",
          @"category": @"color"
          }
        },
      @"secondary": @{
        @"lightmode": @{
          @"value": [UIColor colorWithRed:0.72f green:0.72f blue:0.72f alpha:1.00f],
          @"name": @"CdrColorBorderSecondaryLightmode",
          @"category": @"color"
          },
        @"darkmode": @{
          @"value": [UIColor colorWithRed:0.60f green:0.60f blue:0.60f alpha:1.00f],
          @"name": @"CdrColorBorderSecondaryDarkmode",
          @"category": @"color"
          }
        },
      @"disabled": @{
        @"lightmode": @{
          @"value": [UIColor colorWithRed:0.85f green:0.85f blue:0.85f alpha:1.00f],
          @"name": @"CdrColorBorderDisabledLightmode",
          @"category": @"color"
          },
        @"darkmode": @{
          @"value": [UIColor colorWithRed:0.85f green:0.85f blue:0.85f alpha:1.00f],
          @"name": @"CdrColorBorderDisabledDarkmode",
          @"category": @"color"
          }
        },
      @"error": @{
        @"lightmode": @{
          @"value": [UIColor colorWithRed:0.91f green:0.41f blue:0.41f alpha:1.00f],
          @"name": @"CdrColorBorderErrorLightmode",
          @"category": @"color"
          }
        },
      @"selected": @{
        @"lightmode": @{
          @"value": [UIColor colorWithRed:0.17f green:0.40f blue:0.57f alpha:1.00f],
          @"name": @"CdrColorBorderSelectedLightmode",
          @"category": @"color"
          }
        }
      }
    },
  @"icon": @{
    @"size-sm": @{
      @"value": @256.00f,
      @"name": @"CdrIconSizeSm",
      @"category": @"size"
      },
    @"size": @{
      @"value": @384.00f,
      @"name": @"CdrIconSize",
      @"category": @"size"
      },
    @"size-lg": @{
      @"value": @512.00f,
      @"name": @"CdrIconSizeLg",
      @"category": @"size"
      }
    },
  @"duration": @{
    @"1-x": @{
      @"value": @100ms,
      @"name": @"CdrDuration1X",
      @"category": @"time"
      },
    @"2-x": @{
      @"value": @200ms,
      @"name": @"CdrDuration2X",
      @"category": @"time"
      },
    @"3-x": @{
      @"value": @300ms,
      @"name": @"CdrDuration3X",
      @"category": @"time"
      },
    @"4-x": @{
      @"value": @400ms,
      @"name": @"CdrDuration4X",
      @"category": @"time"
      },
    @"5-x": @{
      @"value": @500ms,
      @"name": @"CdrDuration5X",
      @"category": @"time"
      },
    @"6-x": @{
      @"value": @600ms,
      @"name": @"CdrDuration6X",
      @"category": @"time"
      }
    },
  @"timing": @{
    @"function-ease-out": @{
      @"value": cubic-bezier(0.32, 0.94, 0.60, 1),
      @"name": @"CdrTimingFunctionEaseOut"
      },
    @"function-ease": @{
      @"value": cubic-bezier(0.15, 0, 0.15, 0),
      @"name": @"CdrTimingFunctionEase"
      },
    @"function-linear": @{
      @"value": cubic-bezier(0, 0, 1, 1),
      @"name": @"CdrTimingFunctionLinear"
      }
    },
  @"prominence": @{
    @"flat-x": @{
      @"value": @0.00f,
      @"name": @"CdrProminenceFlatX",
      @"category": @"size"
      },
    @"flat-y": @{
      @"value": @0.00f,
      @"name": @"CdrProminenceFlatY",
      @"category": @"size"
      },
    @"flat-blur": @{
      @"value": @0.00f,
      @"name": @"CdrProminenceFlatBlur",
      @"category": @"size"
      },
    @"flat-spread": @{
      @"value": @0.00f,
      @"name": @"CdrProminenceFlatSpread",
      @"category": @"size"
      },
    @"flat-color": @{
      @"value": [UIColor colorWithRed:0.10f green:0.10f blue:0.10f alpha:1.00f],
      @"name": @"CdrProminenceFlatColor",
      @"category": @"color"
      },
    @"raised-x": @{
      @"value": @32.00f,
      @"name": @"CdrProminenceRaisedX",
      @"category": @"size"
      },
    @"raised-y": @{
      @"value": @32.00f,
      @"name": @"CdrProminenceRaisedY",
      @"category": @"size"
      },
    @"raised-blur": @{
      @"value": @32.00f,
      @"name": @"CdrProminenceRaisedBlur",
      @"category": @"size"
      },
    @"raised-spread": @{
      @"value": @0.00f,
      @"name": @"CdrProminenceRaisedSpread",
      @"category": @"size"
      },
    @"raised-color": @{
      @"value": [UIColor colorWithRed:0.10f green:0.10f blue:0.10f alpha:0.20f],
      @"name": @"CdrProminenceRaisedColor",
      @"category": @"color"
      },
    @"elevated-x": @{
      @"value": @64.00f,
      @"name": @"CdrProminenceElevatedX",
      @"category": @"size"
      },
    @"elevated-y": @{
      @"value": @64.00f,
      @"name": @"CdrProminenceElevatedY",
      @"category": @"size"
      },
    @"elevated-blur": @{
      @"value": @64.00f,
      @"name": @"CdrProminenceElevatedBlur",
      @"category": @"size"
      },
    @"elevated-spread": @{
      @"value": @0.00f,
      @"name": @"CdrProminenceElevatedSpread",
      @"category": @"size"
      },
    @"elevated-color": @{
      @"value": [UIColor colorWithRed:0.10f green:0.10f blue:0.10f alpha:0.20f],
      @"name": @"CdrProminenceElevatedColor",
      @"category": @"color"
      },
    @"floating-x": @{
      @"value": @128.00f,
      @"name": @"CdrProminenceFloatingX",
      @"category": @"size"
      },
    @"floating-y": @{
      @"value": @128.00f,
      @"name": @"CdrProminenceFloatingY",
      @"category": @"size"
      },
    @"floating-blur": @{
      @"value": @128.00f,
      @"name": @"CdrProminenceFloatingBlur",
      @"category": @"size"
      },
    @"floating-spread": @{
      @"value": @0.00f,
      @"name": @"CdrProminenceFloatingSpread",
      @"category": @"size"
      },
    @"floating-color": @{
      @"value": [UIColor colorWithRed:0.10f green:0.10f blue:0.10f alpha:0.20f],
      @"name": @"CdrProminenceFloatingColor",
      @"category": @"color"
      },
    @"lifted-x": @{
      @"value": @256.00f,
      @"name": @"CdrProminenceLiftedX",
      @"category": @"size"
      },
    @"lifted-y": @{
      @"value": @256.00f,
      @"name": @"CdrProminenceLiftedY",
      @"category": @"size"
      },
    @"lifted-blur": @{
      @"value": @256.00f,
      @"name": @"CdrProminenceLiftedBlur",
      @"category": @"size"
      },
    @"lifted-spread": @{
      @"value": @0.00f,
      @"name": @"CdrProminenceLiftedSpread",
      @"category": @"size"
      },
    @"lifted-color": @{
      @"value": [UIColor colorWithRed:0.10f green:0.10f blue:0.10f alpha:0.20f],
      @"name": @"CdrProminenceLiftedColor",
      @"category": @"color"
      }
    },
  @"radius": @{
    @"sharp": @{
      @"value": @0.00f,
      @"name": @"CdrRadiusSharp",
      @"category": @"size"
      },
    @"soft": @{
      @"value": @32.00f,
      @"name": @"CdrRadiusSoft",
      @"category": @"size"
      },
    @"softer": @{
      @"value": @64.00f,
      @"name": @"CdrRadiusSofter",
      @"category": @"size"
      },
    @"round": @{
      @"value": 50%,
      @"name": @"CdrRadiusRound"
      }
    },
  @"space": @{
    @"eighth-x": @{
      @"value": @32.00f,
      @"name": @"CdrSpaceEighthX",
      @"category": @"size"
      },
    @"quarter-x": @{
      @"value": @64.00f,
      @"name": @"CdrSpaceQuarterX",
      @"category": @"size"
      },
    @"half-x": @{
      @"value": @128.00f,
      @"name": @"CdrSpaceHalfX",
      @"category": @"size"
      },
    @"three-quarter-x": @{
      @"value": @192.00f,
      @"name": @"CdrSpaceThreeQuarterX",
      @"category": @"size"
      },
    @"one-x": @{
      @"value": @256.00f,
      @"name": @"CdrSpaceOneX",
      @"category": @"size"
      },
    @"one-and-a-half-x": @{
      @"value": @384.00f,
      @"name": @"CdrSpaceOneAndAHalfX",
      @"category": @"size"
      },
    @"two-x": @{
      @"value": @512.00f,
      @"name": @"CdrSpaceTwoX",
      @"category": @"size"
      },
    @"four-x": @{
      @"value": @1024.00f,
      @"name": @"CdrSpaceFourX",
      @"category": @"size"
      },
    @"inset": @{
      @"eighth-x": @{
        @"value": @32.00f,
        @"name": @"CdrSpaceInsetEighthX",
        @"category": @"size"
        },
      @"eighth-x-squish-top-bottom": @{
        @"value": @0.00f,
        @"name": @"CdrSpaceInsetEighthXSquishTopBottom",
        @"category": @"size"
        },
      @"eighth-x-squish-left-right": @{
        @"value": @32.00f,
        @"name": @"CdrSpaceInsetEighthXSquishLeftRight",
        @"category": @"size"
        },
      @"eighth-x-stretch-top-bottom": @{
        @"value": @64.00f,
        @"name": @"CdrSpaceInsetEighthXStretchTopBottom",
        @"category": @"size"
        },
      @"eighth-x-stretch-left-right": @{
        @"value": @32.00f,
        @"name": @"CdrSpaceInsetEighthXStretchLeftRight",
        @"category": @"size"
        },
      @"quarter-x": @{
        @"value": @64.00f,
        @"name": @"CdrSpaceInsetQuarterX",
        @"category": @"size"
        },
      @"quarter-x-squish-top-bottom": @{
        @"value": @32.00f,
        @"name": @"CdrSpaceInsetQuarterXSquishTopBottom",
        @"category": @"size"
        },
      @"quarter-x-squish-left-right": @{
        @"value": @64.00f,
        @"name": @"CdrSpaceInsetQuarterXSquishLeftRight",
        @"category": @"size"
        },
      @"quarter-x-stretch-top-bottom": @{
        @"value": @96.00f,
        @"name": @"CdrSpaceInsetQuarterXStretchTopBottom",
        @"category": @"size"
        },
      @"quarter-x-stretch-left-right": @{
        @"value": @64.00f,
        @"name": @"CdrSpaceInsetQuarterXStretchLeftRight",
        @"category": @"size"
        },
      @"half-x": @{
        @"value": @128.00f,
        @"name": @"CdrSpaceInsetHalfX",
        @"category": @"size"
        },
      @"half-x-squish-top-bottom": @{
        @"value": @64.00f,
        @"name": @"CdrSpaceInsetHalfXSquishTopBottom",
        @"category": @"size"
        },
      @"half-x-squish-left-right": @{
        @"value": @128.00f,
        @"name": @"CdrSpaceInsetHalfXSquishLeftRight",
        @"category": @"size"
        },
      @"half-x-stretch-top-bottom": @{
        @"value": @192.00f,
        @"name": @"CdrSpaceInsetHalfXStretchTopBottom",
        @"category": @"size"
        },
      @"half-x-stretch-left-right": @{
        @"value": @128.00f,
        @"name": @"CdrSpaceInsetHalfXStretchLeftRight",
        @"category": @"size"
        },
      @"three-quarter-x": @{
        @"value": @192.00f,
        @"name": @"CdrSpaceInsetThreeQuarterX",
        @"category": @"size"
        },
      @"three-quarter-x-squish-top-bottom": @{
        @"value": @96.00f,
        @"name": @"CdrSpaceInsetThreeQuarterXSquishTopBottom",
        @"category": @"size"
        },
      @"three-quarter-x-squish-left-right": @{
        @"value": @192.00f,
        @"name": @"CdrSpaceInsetThreeQuarterXSquishLeftRight",
        @"category": @"size"
        },
      @"three-quarter-x-stretch-top-bottom": @{
        @"value": @288.00f,
        @"name": @"CdrSpaceInsetThreeQuarterXStretchTopBottom",
        @"category": @"size"
        },
      @"three-quarter-x-stretch-left-right": @{
        @"value": @192.00f,
        @"name": @"CdrSpaceInsetThreeQuarterXStretchLeftRight",
        @"category": @"size"
        },
      @"one-x": @{
        @"value": @256.00f,
        @"name": @"CdrSpaceInsetOneX",
        @"category": @"size"
        },
      @"one-x-squish-top-bottom": @{
        @"value": @128.00f,
        @"name": @"CdrSpaceInsetOneXSquishTopBottom",
        @"category": @"size"
        },
      @"one-x-squish-left-right": @{
        @"value": @256.00f,
        @"name": @"CdrSpaceInsetOneXSquishLeftRight",
        @"category": @"size"
        },
      @"one-x-stretch-top-bottom": @{
        @"value": @384.00f,
        @"name": @"CdrSpaceInsetOneXStretchTopBottom",
        @"category": @"size"
        },
      @"one-x-stretch-left-right": @{
        @"value": @256.00f,
        @"name": @"CdrSpaceInsetOneXStretchLeftRight",
        @"category": @"size"
        },
      @"one-and-a-half-x": @{
        @"value": @384.00f,
        @"name": @"CdrSpaceInsetOneAndAHalfX",
        @"category": @"size"
        },
      @"one-and-a-half-x-squish-top-bottom": @{
        @"value": @192.00f,
        @"name": @"CdrSpaceInsetOneAndAHalfXSquishTopBottom",
        @"category": @"size"
        },
      @"one-and-a-half-x-squish-left-right": @{
        @"value": @384.00f,
        @"name": @"CdrSpaceInsetOneAndAHalfXSquishLeftRight",
        @"category": @"size"
        },
      @"one-and-a-half-x-stretch-top-bottom": @{
        @"value": @576.00f,
        @"name": @"CdrSpaceInsetOneAndAHalfXStretchTopBottom",
        @"category": @"size"
        },
      @"one-and-a-half-x-stretch-left-right": @{
        @"value": @384.00f,
        @"name": @"CdrSpaceInsetOneAndAHalfXStretchLeftRight",
        @"category": @"size"
        },
      @"two-x": @{
        @"value": @512.00f,
        @"name": @"CdrSpaceInsetTwoX",
        @"category": @"size"
        },
      @"two-x-squish-top-bottom": @{
        @"value": @256.00f,
        @"name": @"CdrSpaceInsetTwoXSquishTopBottom",
        @"category": @"size"
        },
      @"two-x-squish-left-right": @{
        @"value": @512.00f,
        @"name": @"CdrSpaceInsetTwoXSquishLeftRight",
        @"category": @"size"
        },
      @"two-x-stretch-top-bottom": @{
        @"value": @768.00f,
        @"name": @"CdrSpaceInsetTwoXStretchTopBottom",
        @"category": @"size"
        },
      @"two-x-stretch-left-right": @{
        @"value": @512.00f,
        @"name": @"CdrSpaceInsetTwoXStretchLeftRight",
        @"category": @"size"
        },
      @"four-x": @{
        @"value": @1024.00f,
        @"name": @"CdrSpaceInsetFourX",
        @"category": @"size"
        },
      @"four-x-squish-top-bottom": @{
        @"value": @512.00f,
        @"name": @"CdrSpaceInsetFourXSquishTopBottom",
        @"category": @"size"
        },
      @"four-x-squish-left-right": @{
        @"value": @1024.00f,
        @"name": @"CdrSpaceInsetFourXSquishLeftRight",
        @"category": @"size"
        },
      @"four-x-stretch-top-bottom": @{
        @"value": @1536.00f,
        @"name": @"CdrSpaceInsetFourXStretchTopBottom",
        @"category": @"size"
        },
      @"four-x-stretch-left-right": @{
        @"value": @1024.00f,
        @"name": @"CdrSpaceInsetFourXStretchLeftRight",
        @"category": @"size"
        }
      }
    }
  };
  });

  return dictionary;
}

@end


