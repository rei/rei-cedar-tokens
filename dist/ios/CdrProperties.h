
//
// CdrProperties.h
//
// Do not edit directly
// Generated on Tue, 19 Mar 2019 20:41:42 GMT
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface CdrProperties : NSObject

+ (NSDictionary *)properties;
+ (NSDictionary *)getProperty:(NSString *)keyPath;
+ (nonnull)getValue:(NSString *)keyPath;

@end
