
//
// CdrColor.m
//

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
[UIColor colorWithRed:0.161f green:0.161f blue:0.161f alpha:1.000f],
[UIColor colorWithRed:0.980f green:0.980f blue:0.980f alpha:1.000f],
[UIColor colorWithRed:0.380f green:0.380f blue:0.380f alpha:1.000f],
[UIColor colorWithRed:0.600f green:0.600f blue:0.600f alpha:1.000f],
[UIColor colorWithRed:0.722f green:0.722f blue:0.722f alpha:1.000f],
[UIColor colorWithRed:0.380f green:0.380f blue:0.380f alpha:1.000f],
[UIColor colorWithRed:0.196f green:0.471f blue:0.682f alpha:1.000f],
[UIColor colorWithRed:0.318f green:0.592f blue:0.804f alpha:1.000f],
[UIColor colorWithRed:0.710f green:0.161f blue:0.169f alpha:1.000f],
[UIColor colorWithRed:0.910f green:0.408f blue:0.408f alpha:1.000f],
[UIColor colorWithRed:0.161f green:0.161f blue:0.161f alpha:1.000f],
[UIColor colorWithRed:0.980f green:0.980f blue:0.980f alpha:1.000f],
[UIColor colorWithRed:0.380f green:0.380f blue:0.380f alpha:1.000f],
[UIColor colorWithRed:0.600f green:0.600f blue:0.600f alpha:1.000f],
[UIColor colorWithRed:0.722f green:0.722f blue:0.722f alpha:1.000f],
[UIColor colorWithRed:0.380f green:0.380f blue:0.380f alpha:1.000f],
[UIColor colorWithRed:0.380f green:0.380f blue:0.380f alpha:1.000f],
[UIColor colorWithRed:0.600f green:0.600f blue:0.600f alpha:1.000f],
[UIColor colorWithRed:0.161f green:0.161f blue:0.161f alpha:1.000f],
[UIColor colorWithRed:0.980f green:0.980f blue:0.980f alpha:1.000f],
[UIColor colorWithRed:0.161f green:0.161f blue:0.161f alpha:1.000f],
[UIColor colorWithRed:0.102f green:0.102f blue:0.102f alpha:1.000f],
[UIColor colorWithRed:0.969f green:0.969f blue:0.969f alpha:1.000f],
[UIColor colorWithRed:0.980f green:0.980f blue:0.980f alpha:1.000f],
[UIColor colorWithRed:1.000f green:1.000f blue:1.000f alpha:1.000f],
[UIColor colorWithRed:1.000f green:1.000f blue:1.000f alpha:1.000f],
[UIColor colorWithRed:0.161f green:0.161f blue:0.161f alpha:1.000f],
[UIColor colorWithRed:1.000f green:1.000f blue:1.000f alpha:1.000f],
[UIColor colorWithRed:0.161f green:0.161f blue:0.161f alpha:1.000f],
[UIColor colorWithRed:0.380f green:0.380f blue:0.380f alpha:1.000f],
[UIColor colorWithRed:0.980f green:0.980f blue:0.980f alpha:1.000f],
[UIColor colorWithRed:0.722f green:0.722f blue:0.722f alpha:1.000f],
[UIColor colorWithRed:0.600f green:0.600f blue:0.600f alpha:1.000f],
[UIColor colorWithRed:0.855f green:0.855f blue:0.855f alpha:1.000f],
[UIColor colorWithRed:0.855f green:0.855f blue:0.855f alpha:1.000f],
[UIColor colorWithRed:0.910f green:0.408f blue:0.408f alpha:1.000f],
[UIColor colorWithRed:0.169f green:0.400f blue:0.573f alpha:1.000f],
[UIColor colorWithRed:0.102f green:0.102f blue:0.102f alpha:0.200f],
[UIColor colorWithRed:0.102f green:0.102f blue:0.102f alpha:0.200f],
[UIColor colorWithRed:0.102f green:0.102f blue:0.102f alpha:0.200f],
[UIColor colorWithRed:0.102f green:0.102f blue:0.102f alpha:0.200f],
[UIColor colorWithRed:0.102f green:0.102f blue:0.102f alpha:0.200f]
    ];
  });

  return colorArray;
}

@end
