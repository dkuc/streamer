const gulp = require('gulp');
var ts = require('gulp-typescript');


var tsProject = ts.createProject('tsconfig.json', {
    typescript: require('typescript'),
    out: 'output.js',
});

/*gulp.task('scripts', function() {
    var tsResult = tsProject.src() // instead of gulp.src(...)
        .pipe(ts(tsProject));

    return tsResult.js.pipe(gulp.dest('release'));
});*/

gulp.task('default', function () {
    return gulp.src('public/**/*.ts')
        .pipe(ts(tsProject))
        .pipe(gulp.dest('built/local'));
});