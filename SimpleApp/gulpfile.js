'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    sourcemaps = require('gulp-sourcemaps'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    reactify = require('reactify'),
    buffer = require('vinyl-buffer'),
    source = require('vinyl-source-stream'),
    del = require('del'),
    chalk = require('chalk'),

    stylusTask = require('./gulp-tasks/stylus');

// Define tasks
gulp.task('stylus', stylusTask);

var bundleScripts = function (bundler) {
    
    return bundler
        // Create bundle
        .bundle()
        // Error handling
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
        }))
        // Set source
        .pipe(source('app.js'))
        // Convert browserify stream wrapper
        .pipe(buffer())
        // Load sourcemaps
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        // Write souremaps to external sourcemap file
        .pipe(sourcemaps.write('.', {
            sourceRoot: '.'
        }))
        // Write sourcemap and compiled JS
        .pipe(gulp.dest('./assets/js'));
};

gulp.task('watch-scripts', function () {
    var bundler = browserify({
        entries: ['./app/app.jsx'],
        extensions: ['.js', '.jsx'],
        debug: true,
        cache: {},
        packageCache: {},
        fullPaths: true
    }).transform(reactify);

    var watcher = watchify(bundler);

    watcher
        .on('update', function (scripts) {
            scripts = scripts
                .filter(function (id) {
                    return id.substr(0, 2) !== './';
                })
                .map(function (id) {
                    return chalk.blue(id.replace(__dirname, ''));
                });

            if (scripts.length > 1) {
                gutil.log(scripts.length + ' Scripts updated:\n* ' + scripts.join('\n* ') + '\nrebuilding...');
            } else {
                gutil.log(scripts[0] + ' updated, rebuilding...');
            }

            bundleScripts(watcher);
        })
        .on('time', function (time) {
            gutil.log('Finished \'' + chalk.cyan('watch-scripts') + '\' after ' + chalk.magenta((Math.round(time / 10) / 100) + ' s'));
        });

    // Bundle scripts
    return bundleScripts(watcher);
});

gulp.task('build-scripts', function () {

    var bundler = browserify({
        entries: ['./app/app.jsx'],
        extensions: ['.js', '.jsx'],
        debug: true
    }).transform(reactify);

    // Bundle scripts
    return bundleScripts(bundler);
});

// Not all tasks need to use streams
gulp.task('clean', function (callback) {
    var paths = [
        'assets/css/*',
        'assets/js/*',
        'assets/build/*'
    ];

    del(paths, callback);
});

// Default watch task
gulp.task('watch', ['stylus', 'watch-scripts'], function () {
    gulp.watch(['app/**/*.{styl,css}', 'app_nej/stylus/**/*.{styl,css}'], ['stylus']);
});

// Default build task
gulp.task('default', ['stylus', 'build-scripts']);