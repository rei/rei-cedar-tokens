module.exports = {
  siteWeb: {
    transformGroup: 'custom/scss',
    buildPath: 'dist/json/',
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
  },
};
