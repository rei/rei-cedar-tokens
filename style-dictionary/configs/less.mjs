export const less = (theme) => ({
  less: {
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
    buildPath: `dist/${theme}/less/`,
    files: [
      {
        destination: 'cdr-variable.less',
        format: 'less/variables',
        options: {
          showFileHeader: false
        }
      },
      {
        destination: 'cdr-mixins.less',
        format: 'less/mixin',
        options: {
          showFileHeader: false
        }
      }
    ],
    actions: ['include-media-queries-less', 'include-display-less', 'concat-files']
  }
})
