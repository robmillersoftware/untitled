/**
 * This module provides some utility functions for copying files
 */
const config = require('../config');
const gulp = require('gulp');

const copy = (src, dest) => {
    gulp.src(src).pipe(gulp.dest(dest));
}

/**
 * Helper methods used by tasks for copying files
 */
module.exports.copy = copy;

module.exports.copyHtmlAndReload = () => {
    copy(config.src + '/**/*.html', './dist');
    config.browserSync.reload({stream: true});
}