const config = require('../config');
const copyUtil = require('../utils/copy');
const gulp = require('./build.js');

function devWatch(done) {
  config.browserSync.init(config.browserSyncInit);

  gulp.watch(config.src + '/game/**/*.js', gulp.series('build'));
  gulp.watch(config.src + '/assets/styling/**/*.scss', gulp.series('build'));
  gulp.watch(config.src + '/**/*.html').on('change', gulp.series(copyUtil.copyHtmlAndReload));
  done();
}

gulp.task('devWatch', devWatch);
