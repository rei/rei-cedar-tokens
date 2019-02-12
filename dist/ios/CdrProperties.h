
//
// CdrProperties.h
//
// Do not edit directly
// Generated on Tue, 12 Feb 2019 22:33:48 GMT
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface CdrProperties : NSObject

+ (NSDictionary *)properties;
+ (NSDictionary *)getProperty:(NSString *)keyPath;
+ (nonnull)getValue:(NSString *)keyPath;

@end
