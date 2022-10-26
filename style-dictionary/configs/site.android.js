module.exports = function (theme) {
  return {
    siteAndroid: {
      transformGroup: 'custom/android',
      buildPath: `dist/${theme}/json/`,
      prefix: 'cdr',
      files: [
        {
          destination: 'android.json',
          format: 'site',
          options: {
            showFileHeader: false,
          },
          filter: 'removeSourceTokens',
        },
      ],
    }
  }
};
