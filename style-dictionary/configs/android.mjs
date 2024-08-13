export const android = (theme) => ({
  android: {
    prefix: 'cdr',
    buildPath: `dist/${theme}/android/`,
    log: {
      verbosity: 'verbose'
    },
    transforms: [
      'attribute/cdr-cti',
      'name/snake',
      'size/space',
      'size/dp-transitive',
      'size/sp',
      'color/alpha',
      'color/hex8android-transitive'
    ],
    files: [
      {
        destination: 'colors.xml',
        format: 'android/colors'
      },
      {
        destination: 'font_dimens.xml',
        format: 'android/fontDimens'
      },
      {
        destination: 'dimens.xml',
        format: 'android/dimens'
      }
    ]
  }
})
