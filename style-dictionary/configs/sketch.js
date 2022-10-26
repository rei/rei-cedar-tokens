module.exports = function (theme) {
  return {
    sketch: {
      transformGroup: 'custom/sketch',
      buildPath: `dist/${theme}/sketch/`,
      prefix: 'cdr',
      files: [
        {
          destination: 'sketch.json',
          format: 'sketch',
          options: {
            showFileHeader: false,
          },
          filter: 'removeOptions',
        },
      ],
    }
  }
};
