export const androidColors = (StyleDictionary) => {
  StyleDictionary.registerFormat({
    name: 'android-colors',
    format: ({ dictionary, options, header }) => `<?xml version="1.0" encoding="UTF-8"?>
${header || ''}
<resources>
${dictionary.allTokens
  .filter((token) => token.attributes.category === 'color')
  .map(
    (token) =>
      `  <color name="${token.name}">${token.value}</color>${
        token.comment ? `<!-- ${token.comment} -->` : ''
      }`
  )
  .join('\n')}
</resources>`
  })
}

export const androidDimens = (StyleDictionary) => {
  StyleDictionary.registerFormat({
    name: 'android-dimens',
    format: ({ dictionary, options, header }) => `<?xml version="1.0" encoding="UTF-8"?>
${header || ''}
<resources>
${dictionary.allTokens
  .filter((token) => token.attributes.category === 'size')
  .map(
    (token) =>
      `  <dimen name="${token.name}">${token.value}</dimen>${
        token.comment ? `<!-- ${token.comment} -->` : ''
      }`
  )
  .join('\n')}
</resources>`
  })
}

export const androidFontDimens = (StyleDictionary) => {
  StyleDictionary.registerFormat({
    name: 'android-font-dimens',
    format: ({ dictionary, options, header }) => `<?xml version="1.0" encoding="UTF-8"?>
${header || ''}
<resources>
${dictionary.allTokens
  .filter((token) => token.attributes.category === 'size' && token.attributes.type === 'font')
  .map(
    (token) =>
      `  <dimen name="${token.name}">${token.value}</dimen>${
        token.comment ? `<!-- ${token.comment} -->` : ''
      }`
  )
  .join('\n')}
</resources>`
  })
}
