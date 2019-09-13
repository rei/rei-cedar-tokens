module.exports = {
  scss: {
    transformGroup: 'custom/scss',
    buildPath: 'dist/scss/',
    prefix: 'cdr',
    files: [
      {
        destination: 'cdr-variable.scss',
        format: 'scss/variables',
      },
      {
        destination: 'cdr-mixins.scss',
        format: 'scss/mixin',
      },
      // {
      //   destination: 'cdr-deprecated.scss',
      //   format: 'scss/deprecated',
      // },
      {
        destination: 'utility-map.no_concat.scss',
        format: 'scss/map',
      },
    ],
    actions: ['concat_files', 'include_deprecate_scss'],
  },
};
