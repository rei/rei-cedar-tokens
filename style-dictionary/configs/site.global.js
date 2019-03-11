module.exports = {
  siteWeb: {
    transformGroup: 'custom/js',
    buildPath: 'dist/json/',
    prefix: 'cdr',
    files: [
      {
        destination: 'global.json',
        format: 'site',
      },
    ],
  },
};
