module.exports = function (theme) {
  return {
    siteIos: {
      transformGroup: 'custom/ios',
      buildPath: `dist/${theme}/json/`,
      prefix: 'cdr',
      files: [
        {
          destination: 'ios.json',
          format: 'site',
          filter: 'removeSourceTokens',
          options: {
            showFileHeader: false,
          },
        },
      ],
    }
  }
};
