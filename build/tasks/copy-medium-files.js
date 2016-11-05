let gulp = require('gulp');
let paths = require('../paths');

let meditorJs = './node_modules/medium-editor/dist/js/medium-editor.js';
let meditorCss = './node_modules/medium-editor/dist/css/**/!(*.min).css';

gulp.task('copy-medium-files', function() {
    return gulp.src([meditorJs, meditorCss])
        .pipe(gulp.dest(paths.root));
});
