module.exports = function (theme) { return {
  less: {
    transformGroup: 'custom/less',
    buildPath: `dist/${theme}/less/`,
    prefix: 'cdr',
    files: [
      {
        destination: 'cdr-variable.less',
        format: 'less/variables',
        options: {
          showFileHeader: false,
        },
      },
      {
        destination: 'cdr-mixins.less',
        format: 'less/mixin',
        options: {
          showFileHeader: false,
        },
      },
    ],
    actions: ['include_media_queries_less', 'include_display_less', 'concat_files'],
  },
}};
