const config = require('../config');
const gulp = require('gulp');

/**
 * Helper methods used by tasks
 */
module.exports.copy = (src, dest) => {
    gulp.src(src).pipe(gulp.dest(dest));
}

module.exports.copyHtmlAndReload = () => {
    copy(config.src + '/**/*.html', './dist');
    config.browserSync.reload({stream: true});
}

/**
 * Copies over files needed by the page
 */
gulp.task('copy', ['copyHtml', 'copyAssets', 'copyLib'], () => {
    config.browserSync.reload();
});