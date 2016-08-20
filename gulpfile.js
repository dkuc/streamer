const gulp = require('gulp');
var ts = require('gulp-typescript');


var tsProject = ts.createProject('tsconfig.json', {
    typescript: require('typescript')
});

gulp.task('scripts', function() {
    var tsResult = tsProject.src() // instead of gulp.src(...)
        .pipe(ts(tsProject));

    return tsResult.js.pipe(gulp.dest('release'));
});

gulp.task('default', function () {
    return gulp.src('src/**/*.ts')
        .pipe(ts({
            noImplicitAny: true,
            out: 'output.js',
            typescript: require('typescript')
        }))
        .pipe(gulp.dest('built/local'));
});