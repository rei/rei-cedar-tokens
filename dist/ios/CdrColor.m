
//
// CdrColor.m
//
// Do not edit directly
// Generated on Mon, 11 Feb 2019 22:20:27 GMT
//

#import "CdrColor.h"


@implementation CdrColor

+ (UIColor *)color:(CdrColorName)colorEnum{
  return [[self values] objectAtIndex:colorEnum];
}

+ (NSArray *)values {
  static NSArray* colorArray;
  static dispatch_once_t onceToken;

  dispatch_once(&onceToken, ^{
    colorArray = @[
[UIColor colorWithRed:0.16f green:0.16f blue:0.16f alpha:1.00f],
[UIColor colorWithRed:0.98f green:0.98f blue:0.98f alpha:1.00f],
[UIColor colorWithRed:0.38f green:0.38f blue:0.38f alpha:1.00f],
[UIColor colorWithRed:0.60f green:0.60f blue:0.60f alpha:1.00f],
[UIColor colorWithRed:0.72f green:0.72f blue:0.72f alpha:1.00f],
[UIColor colorWithRed:0.38f green:0.38f blue:0.38f alpha:1.00f],
[UIColor colorWithRed:0.20f green:0.47f blue:0.68f alpha:1.00f],
[UIColor colorWithRed:0.32f green:0.59f blue:0.80f alpha:1.00f],
[UIColor colorWithRed:0.71f green:0.16f blue:0.17f alpha:1.00f],
[UIColor colorWithRed:0.91f green:0.41f blue:0.41f alpha:1.00f],
[UIColor colorWithRed:0.16f green:0.16f blue:0.16f alpha:1.00f],
[UIColor colorWithRed:0.98f green:0.98f blue:0.98f alpha:1.00f],
[UIColor colorWithRed:0.38f green:0.38f blue:0.38f alpha:1.00f],
[UIColor colorWithRed:0.60f green:0.60f blue:0.60f alpha:1.00f],
[UIColor colorWithRed:0.72f green:0.72f blue:0.72f alpha:1.00f],
[UIColor colorWithRed:0.38f green:0.38f blue:0.38f alpha:1.00f],
[UIColor colorWithRed:0.10f green:0.10f blue:0.10f alpha:1.00f],
[UIColor colorWithRed:0.16f green:0.16f blue:0.16f alpha:1.00f],
[UIColor colorWithRed:0.97f green:0.97f blue:0.97f alpha:1.00f],
[UIColor colorWithRed:0.98f green:0.98f blue:0.98f alpha:1.00f],
[UIColor colorWithRed:1.00f green:1.00f blue:1.00f alpha:1.00f],
[UIColor colorWithRed:1.00f green:1.00f blue:1.00f alpha:1.00f],
[UIColor colorWithRed:0.10f green:0.10f blue:0.10f alpha:1.00f],
[UIColor colorWithRed:1.00f green:1.00f blue:1.00f alpha:1.00f],
[UIColor colorWithRed:0.10f green:0.10f blue:0.10f alpha:1.00f],
[UIColor colorWithRed:0.38f green:0.38f blue:0.38f alpha:1.00f],
[UIColor colorWithRed:0.98f green:0.98f blue:0.98f alpha:1.00f],
[UIColor colorWithRed:0.72f green:0.72f blue:0.72f alpha:1.00f],
[UIColor colorWithRed:0.60f green:0.60f blue:0.60f alpha:1.00f],
[UIColor colorWithRed:0.85f green:0.85f blue:0.85f alpha:1.00f],
[UIColor colorWithRed:0.85f green:0.85f blue:0.85f alpha:1.00f],
[UIColor colorWithRed:0.91f green:0.41f blue:0.41f alpha:1.00f],
[UIColor colorWithRed:0.17f green:0.40f blue:0.57f alpha:1.00f],
[UIColor colorWithRed:0.10f green:0.10f blue:0.10f alpha:1.00f],
[UIColor colorWithRed:0.10f green:0.10f blue:0.10f alpha:1.00f],
[UIColor colorWithRed:0.10f green:0.10f blue:0.10f alpha:1.00f],
[UIColor colorWithRed:0.10f green:0.10f blue:0.10f alpha:1.00f],
[UIColor colorWithRed:0.10f green:0.10f blue:0.10f alpha:1.00f]
    ];
  });

  return colorArray;
}

@end
