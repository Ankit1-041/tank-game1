module.exports = function (gulp, config, plugins) {
    if(config.devMode) {
      plugins.util.log(plugins.util.colors.yellow("tanks.test disabled in dev mode"));
      return function () {
        return gulp.src('.').pipe(plugins.util.noop());
      }
    }
    return function () {
      return gulp.src(config.tanks.test, { read: false })
        .pipe(plugins.mocha({
          reporter: 'spec',
          globals: {
            should: require('should')
          }
        }));
    };
};
