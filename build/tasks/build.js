let gulp = require('gulp');
let runSequence = require('run-sequence');
let to5 = require('gulp-babel');
let paths = require('../paths');
let compilerOptions = require('../babel-options');
let assign = Object.assign || require('object.assign');

gulp.task('build-html', function() {
    return gulp.src(paths.html)
        .pipe(gulp.dest(paths.output));
});

gulp.task('build-css', function() {
    return gulp.src(paths.css)
        .pipe(gulp.dest(paths.output));
});

gulp.task('build-js', function() {
    return gulp.src(paths.source)
        .pipe(to5(assign({}, compilerOptions.commonjs())))
        .pipe(gulp.dest(paths.output));
});

gulp.task('build', function(callback) {
    return runSequence(
        'clean', 'copy-medium-files', [
            'build-html',
            'build-css',
            'build-js'
        ],
        callback
    );
});
