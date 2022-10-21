module.exports = {
    figma: {
      transformGroup: 'custom/figma',
      buildPath: 'dist/figma/',
      prefix: 'cdr',
      files: [
        {
          destination: 'figma.json',
          format: 'json',
          showFileHeader: false,
        },
      ],
    },
  };
  