export const scss = (theme) => ({
  scss: {
    prefix: 'cdr',
    transformGroup: 'tokens-studio',
    transforms: [
      'attribute/deprecated',
      'attribute/cdr-cti',
      'name/kebab',
      'size/space',
      'size/px-to-rem',
      'color/alpha',
      'color/css-transitive',
      'time/seconds'
    ],
    buildPath: `dist/${theme}/scss/`,
    files: [
      {
        destination: 'cdr-variable.scss',
        format: 'scss/variables'
      },
      {
        destination: 'cdr-mixins.scss',
        format: 'scss/mixin'
      },
      {
        destination: 'utility-map.no_concat.scss',
        format: 'scss/map'
      }
    ],
    actions: ['include-media-queries-scss', 'include-display-scss', 'concat-files', 'include-deprecate-scss']
  }
})
