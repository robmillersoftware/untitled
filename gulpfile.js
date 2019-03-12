'use strict';

var gulp = require('gulp');
var HubRegistry = require('gulp-hub');

var hub = new HubRegistry(['gulp/tasks/*.js']);

gulp.registry(hub);

gulp.task('dev', gulp.series('clean', 'build', 'copy', 'devWatch'));
gulp.task('default', gulp.series('dev'));