const gulp = require('gulp');
const clean = require('gulp-clean');
 
gulp.task('clean', function () {
    return gulp.src('bbbetterLog', {read: false})
        .pipe(clean());
});

gulp.task('copy', () => {
    return gulp.src(['electron/**/*']).pipe(gulp.dest('bbbetterLog'))
});

gulp.task('build', function() {
    return gulp.src(['*app/**/*','*bower_components/**/*','*node_modules/**/*','package.json'])
    .pipe(gulp.dest('bbbetterLog/resources/app'));
});