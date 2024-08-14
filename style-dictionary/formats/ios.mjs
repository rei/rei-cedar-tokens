export const iosColorsH = (StyleDictionary) => {
  StyleDictionary.registerFormat({
    name: 'ios-colors-h',
    format: ({ dictionary, options, file, header }) => `
//
// ${file.destination ?? ''}
//
${header ?? ''}
#import <UIKit/UIKit.h>

typedef NS_ENUM(NSInteger, ${file.type ?? ''}) {
${dictionary.allTokens.map((token) => `${token.name}`).join(',\n')}
};

@interface ${file.className ? `${file.className} ` : ''}: NSObject
+ (NSArray *)values;
+ (UIColor *)color:(${file.type ?? ''})color;
@end`
  })
}

export const iosColorsM = (StyleDictionary) => {
  StyleDictionary.registerFormat({
    name: 'ios-colors-m',
    format: ({ dictionary, options, file, header }) => `
//
// ${file.destination ?? ''}
//
${header ?? ''}
#import "${file.className ?? ''}.h"

@implementation ${file.className ?? ''}

+ (UIColor *)color:(${file.type ?? ''})colorEnum{
  return [[self values] objectAtIndex:colorEnum];
}

+ (NSArray *)values {
  static NSArray* colorArray;
  static dispatch_once_t onceToken;

  dispatch_once(&onceToken, ^{
    colorArray = @[
${dictionary.allTokens.map((token) => token.value).join(',\n')}
    ];
  });

  return colorArray;
}

@end`
  })
}

export const iosStaticH = (StyleDictionary) => {
  StyleDictionary.registerFormat({
    name: 'ios-static-h',
    format: ({ dictionary, options, file, header }) => `
// ${file.destination ?? ''}
//
${header ?? ''}
#import <Foundation/Foundation.h>


${dictionary.allTokens
  .map((token) => `extern ${file.type ? `${file.type} ` : ''}const ${token.name};`)
  .join('\n')}`
  })
}

export const iosStaticM = (StyleDictionary) => {
  StyleDictionary.registerFormat({
    name: 'ios-static-m',
    format: ({ dictionary, options, file, header }) => `
//
// ${file.destination ?? ''}
//
${header ?? ''}
#import "${file.className ?? ''}.h"


${dictionary.allTokens
  .map(
    (token) =>
      `${file.type ? `${file.type} ` : ''}const ${token.name} = ${token.value};`
  )
  .join('\n')}`
  })
}
