const config = require('../config');
const copyUtil = require('../utils/copy');
const favicons = require('gulp-favicons');
const gulp = require('gulp');

gulp.task('favicon', () => {
    return gulp.src('assets/images/phaser.png').pipe(favicons({
        appName: 'Crosstown',
        appDescription: 'A game by Rob Miller',
        developerName: 'Rob Miller',
        developerURL: '',
        background: '#000000',
        display: 'standalone',
        orientation: 'portrait'
    }))
    .pipe(gulp.dest('./dist/'));
})
/**
 * Dev build. Builds all files and copies everything to dist 
 * folder then sets watches
 */
gulp.task('dev', ['favicon', 'build', 'copy'], () => {
    config.browserSync.init(config.browserSyncInit);

    gulp.watch(config.src + '/js/**/*.js', ['build']);
    gulp.watch(config.src + '/assets/styling/**/*.scss', ['build']);
    gulp.watch(config.src + '/**/*.html').on('change', copyUtil.copyHtmlAndReload);
});