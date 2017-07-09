const gulp = require("gulp");
const clean = require('gulp-clean');
 
gulp.task('clean', function () {
    return gulp.src('resources', {read: false})
        .pipe(clean());
});

gulp.task("default", () => {
    return gulp.src(['*app/**/*','*bower_components/**/*','*node_modules/**/*','package.json']).pipe(gulp.dest('resources/app'));
});