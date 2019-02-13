
//
// CdrProperties.h
//
// Do not edit directly
// Generated on Mon, 11 Feb 2019 22:20:27 GMT
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface CdrProperties : NSObject

+ (NSDictionary *)properties;
+ (NSDictionary *)getProperty:(NSString *)keyPath;
+ (nonnull)getValue:(NSString *)keyPath;

@end
