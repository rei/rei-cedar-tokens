import type { TransformedToken } from 'style-dictionary';
import StyleDictionary from 'style-dictionary';

// This intercepts the 'spacing.space' tokens and forces Style Dictionary to
// replace the fluid web references with the static ios pointers (e.g., {spacing.static.eighth-x}).
// Because transitive is set to true, Style Dictionary automatically evaluates
// that reference down to the raw numeric point value (e.g., 0.2).
StyleDictionary.registerTransform({
  name: 'value/ios/spacing-static-only',
  type: 'value',
  transitive: true,
  filter: (token: TransformedToken) => {
    return (
      token.path[0] === 'spacing' && (token.path[1] === 'layout' || token.path[1] === 'component')
    );
  },
  transform: (token: TransformedToken) => {
    return token.$extensions.cedar.ios.light;
  },
});
