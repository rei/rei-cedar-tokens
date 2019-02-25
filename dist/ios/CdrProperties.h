
//
// CdrProperties.h
//
// Do not edit directly
// Generated on Sat, 23 Feb 2019 15:59:44 GMT
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface CdrProperties : NSObject

+ (NSDictionary *)properties;
+ (NSDictionary *)getProperty:(NSString *)keyPath;
+ (nonnull)getValue:(NSString *)keyPath;

@end
