var gulp = require('gulp'),
    less = require('gulp-less'),
    paths = {
        scripts: [],
        less: ['./app/styles/**/*.less']
    }
    ;


gulp.task('less', function () {
    return gulp
        .src(paths.less)
        .pipe(less())
        .pipe(gulp.dest('./app/styles/'))
});

gulp.task('watch', function () {
    gulp.watch(paths.less, ['less']);
});