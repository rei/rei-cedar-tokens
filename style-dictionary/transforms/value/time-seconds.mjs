export const timeSeconds = (StyleDictionary) => {
  StyleDictionary.registerTransform({
    name: 'time-seconds',
    type: 'value',
    filter: (token) => token.attributes.category === 'time',
    transform: (token, _, options) =>
      (parseFloat(options.usesDtcg ? token.$value : token.value) / 1000).toFixed(2) + 's'
  })
}
