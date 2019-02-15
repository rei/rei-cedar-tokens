
//
// CdrProperties.h
//
// Do not edit directly
// Generated on Fri, 15 Feb 2019 21:54:07 GMT
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface CdrProperties : NSObject

+ (NSDictionary *)properties;
+ (NSDictionary *)getProperty:(NSString *)keyPath;
+ (nonnull)getValue:(NSString *)keyPath;

@end
