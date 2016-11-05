const gulp = require('gulp');
const paths = require('../paths');
const eslint = require('gulp-eslint');

// runs eslint on all .js files
gulp.task('lint', () => {
    return gulp.src([paths.source, `!${paths.root}/medium-editor.js`])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});
