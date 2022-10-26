module.exports = function (theme) {
  return {
    siteWeb: {
      transformGroup: 'custom/scss',
      buildPath: `dist/${theme}/json/`,
      prefix: 'cdr',
      files: [
        {
          destination: 'global.json',
          format: 'site',
          options: {
            showFileHeader: false,
          },
          filter: 'removeOptions',
        },
      ],
    }
  }
};
