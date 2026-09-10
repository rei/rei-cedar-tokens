import type { CanonicalToken, CanonicalTokenGroup } from '../types/canonical-token.js';

export function recursiveTokensLookUp(
  tokensData: CanonicalTokenGroup,
  aliasTokens?: boolean,
): CanonicalTokenGroup {
  const recursiveObject: CanonicalTokenGroup = {};
  const currentKeys = Object.keys(tokensData);

  for (const key of currentKeys) {
    const currentObject: CanonicalTokenGroup | CanonicalToken = tokensData[key];

    if (currentObject && typeof currentObject === 'object' && '$value' in currentObject) {
      const { $value, $type } = currentObject as CanonicalToken;

      recursiveObject[key] = aliasTokens
        ? {
            $value: String($value).replace(/\{/g, '{color.'),
            $type,
          }
        : {
            $value,
            $type,
          };
    } else {
      recursiveObject[key] = {
        ...recursiveTokensLookUp(currentObject, aliasTokens),
      } as CanonicalTokenGroup;
    }
  }

  return recursiveObject;
}
