const browserify  = require('browserify');
const babelify    = require('babelify');
const source      = require('vinyl-source-stream');
const buffer      = require('vinyl-buffer');
const uglify      = require('gulp-uglify');
const sourcemaps  = require('gulp-sourcemaps');
const sass        = require('gulp-sass');
const gulp        = require('gulp');

const config = require('../config');

/**
 * Task to build javascript files. Outputs source maps and 
 * browser-ready javascript
 */
gulp.task('buildJs', () => {
    // app.js is your main JS file with all your module inclusions
    return browserify(config.browserify)
        .transform("babelify", config.babelify)
        .bundle()
        .pipe(source('index.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./dist/js'))
});

gulp.task('buildSass', () => {
    return gulp.src('src/assets/styling/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./dist/assets/css'));
});

gulp.task('build', ['buildJs', 'buildSass'], (done) => {
    config.browserSync.reload({stream: true});
    done();
});