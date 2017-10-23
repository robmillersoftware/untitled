const config = require('../config');
const copyUtil = require('../utils/copy');
const gulp = require('gulp');

/**
 * Dev build. Builds all files and copies everything to dist 
 * folder then sets watches
 */
gulp.task('dev', ['clean', 'build', 'copy'], () => {
    config.browserSync.init(config.browserSyncInit);

    gulp.watch(config.src + '/js/**/*.js', ['build']);
    gulp.watch(config.src + '/lib/**/*.js', ['build']);
    gulp.watch(config.src + '/assets/styling/**/*.scss', ['build']);
    gulp.watch(config.src + '/**/*.html').on('change', copyUtil.copyHtmlAndReload);
});