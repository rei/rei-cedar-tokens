module.exports = function(theme) {
    return {
      css: {
        transformGroup: 'custom/css',
        buildPath: `dist/${theme}/css/`,
        prefix: 'cdr',
        files: [
          {
            destination: 'cdr-tokens.css',
            format: 'css/variables',
            options: {
              showFileHeader: false,
              outputVariables: false,
            },
          },
          // {
          //   destination: 'cdr-deprecated.scss',
          //   format: 'scss/deprecated',
          // },
        ],
      }
    }
  };
  