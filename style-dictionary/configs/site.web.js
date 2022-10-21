module.exports = {
  siteWeb: {
    transformGroup: 'custom/scss',
    buildPath: 'dist/json/',
    prefix: 'cdr',
    files: [
      {
        destination: 'web.json',
        format: 'site',
        options: {
          showFileHeader: false,
        },
        filter: 'removeOptions',
      },
    ],
  },
};
