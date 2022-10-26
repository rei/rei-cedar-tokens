module.exports = function (theme) {
  return {
    siteWeb: {
      transformGroup: 'custom/scss',
      buildPath: `dist/${theme}/json/`,
      prefix: 'cdr',
      files: [
        {
          destination: 'web.json',
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
