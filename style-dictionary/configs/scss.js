module.exports = {
  scss: {
    transformGroup: 'custom/scss',
    buildPath: 'dist/scss/',
    prefix: 'cdr',
    files: [
      {
        destination: 'cdr-variable.scss',
        format: 'scss/variables',
        filter: 'removeOptions',
        options: {
          showFileHeader: false,
        },
      },
      {
        destination: 'cdr-mixins.scss',
        format: 'scss/mixin',
        options: {
          showFileHeader: false,
        },
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
    actions: ['include_media_queries_scss', 'include_display_scss', 'concat_files', 'include_deprecate_scss'],
  },
};
