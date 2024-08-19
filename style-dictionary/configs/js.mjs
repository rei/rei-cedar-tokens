import { commonConfig } from '../utils.mjs'

export const js = (theme) => ({
  js: {
    ...commonConfig(theme, 'js'),
    transforms: [
      'attribute/deprecated',
      'name/pascal',
      'size/strip-all-px-js',
      'size/space-js',
      'color/alpha',
      'color/css-transitive'
    ],
    files: [
      {
        destination: 'cdr-tokens.cjs',
        format: 'javascript/module-flat',
        options: {
          showFileHeader: false
        }
      },
      {
        destination: 'cdr-tokens.mjs',
        format: 'javascript/es6',
        filter: 'remove-source-tokens',
        options: {
          showFileHeader: false
        }
      },
      {
        format: 'typescript/es6-declarations',
        destination: 'cdr-tokens.d.mts'
      }
    ]
  }
})
