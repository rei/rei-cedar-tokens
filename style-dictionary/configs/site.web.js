module.exports = {
  siteWeb: {
    transformGroup: 'custom/js',
    buildPath: 'dist/json/',
    prefix: 'cdr',
    files: [
      {
        destination: 'web.json',
        format: 'site',
      },
    ],
  },
};
