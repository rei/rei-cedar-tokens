module.exports = {
  siteIos: {
    transformGroup: 'custom/ios',
    buildPath: 'dist/json/',
    prefix: 'cdr',
    files: [
      {
        destination: 'ios.json',
        format: 'site',
        filter: 'removeOptions',
        options: {
          showFileHeader: false,
        },
      },
    ],
  },
};
