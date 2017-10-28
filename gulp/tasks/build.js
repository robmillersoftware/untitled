const browserify  = require('browserify');
const babelify    = require('babelify');
const source      = require('vinyl-source-stream');
const buffer      = require('vinyl-buffer');
const uglify      = require('gulp-uglify');
const sourcemaps  = require('gulp-sourcemaps');
const gulp        = require('gulp');
const gulpUtil    = require('gulp-util');
const config      = require('../config');

/**
 * Task to build javascript files. Outputs source maps and 
 * browser-ready javascript
 */
gulp.task('buildApp', () => {
    return browserify(config.browserifyApp)
        .require('delaunator')
        .require('node-object-hash')
        .transform('babelify', config.babelify)
        .bundle()
        .pipe(source('index.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./dist/js'))
});

/**
 * Runs both the JS build and the Sass build
 */
gulp.task('build', ['buildApp'], (done) => {
    config.browserSync.reload({stream: true});
    done();
});