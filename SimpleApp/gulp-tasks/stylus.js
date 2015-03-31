'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    stylus = require('gulp-stylus'),
    notify = require('gulp-notify'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps');

module.exports = function () {

    var src = 'app/app.styl',
        dest = 'assets/css',

        settings = {
            paths: ['bower_components'],
            'include css': true
        },

        onError = function(error) {
            notify.onError({
                title: 'Cancerfonden Build',
                subtitle: 'Stylus Compilation Failed!',
                message: 'Error: <%= error.message %>'
            })(error);

            this.emit('end');
        };

    return gulp
        .src(src)
        .pipe(sourcemaps.init())
        .pipe(stylus(settings)).on('error', onError)
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dest));
};
