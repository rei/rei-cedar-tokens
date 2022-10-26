module.exports = function (theme) {
  return {
    figma: {
      transformGroup: 'custom/figma',
      buildPath: `dist/${theme}/figma/`,
      prefix: 'cdr',
      files: [
        {
          destination: 'figma.json',
          format: 'json',
          options: {
            showFileHeader: false,
          },
          filter: 'removeSourceTokens'
        },
      ],
    }
  }
};
