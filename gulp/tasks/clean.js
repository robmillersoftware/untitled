const del = require('del');
const gulp = require('gulp');

/**
 * Cleans all of the files in the dist directory. This task is synchronous
 * to avoid issues with deleting output files
 */
function clean(done) {
  del.sync(['dist/**/*']);
  done();
}

gulp.task('clean', clean);