
//
// colors.m
//
// Do not edit directly
// Generated on Tue, 08 Jan 2019 23:23:17 GMT
//

#import ".h"


@implementation 

+ (UIColor *)color:()colorEnum{
  return [[self values] objectAtIndex:colorEnum];
}

+ (NSArray *)values {
  static NSArray* colorArray;
  static dispatch_once_t onceToken;

  dispatch_once(&onceToken, ^{
    colorArray = @[
#292929,
#616161,
#fafafa,
#999999
    ];
  });

  return colorArray;
}

@end
