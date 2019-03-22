const config   = require('../config');
const copyUtil = require('../utils/copy');
const gulp     = require('gulp');

/**
 * Copy tasks for various file types. These are separated in case further
 * logic needs to be performed on a file type
 */
function copyHtml(done) {
  copyUtil.copy('./src/**/*.html', './dist');
  done();
}

function copyAssets(done) {
  copyUtil.copy('./src/assets/**/*', './dist/assets');
  done();
}

function copyLib(done) {
  copyUtil.copy('./src/lib/*', './dist/lib');
  done();
}

function copy(done) {
  config.browserSync.reload();
  done();
}

gulp.task('copy', gulp.series(copyHtml, copyAssets, copyLib, copy));
module.exports = gulp;