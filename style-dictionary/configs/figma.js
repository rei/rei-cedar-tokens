module.exports = function (theme) {
  return {
    figma: {
      transformGroup: 'custom/figma',
      buildPath: `dist/${theme}/figma/`,
      prefix: 'cdr',
      files: [
        {
          destination: 'figma.json',
          format: 'figma',
          options: {
            showFileHeader: false,
          },
          filter: 'removeSourceTokens'
        },
      ],
    }
  }
};
