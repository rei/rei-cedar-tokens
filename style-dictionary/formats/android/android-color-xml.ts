import type { TransformedToken } from 'style-dictionary';
import StyleDictionary from 'style-dictionary';

StyleDictionary.registerFormat({
  name: 'android/color-xml',
  format: ({ dictionary }) => {
    const colorTokens = dictionary.allTokens.filter(
      (token: TransformedToken) => token.path[0] === 'color',
    );

    const colorDefinitions = colorTokens
      .map((token: TransformedToken) => {
        return `    <color name="${token.name}">${token.$value as string}</color>`;
      })
      .join('\n');

    return [
      '<?xml version="1.0" encoding="utf-8"?>',
      '<resources>',
      colorDefinitions,
      '</resources>',
    ].join('\n');
  },
});
