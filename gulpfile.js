const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
var clean = require('gulp-clean');

gulp.task('clean', function () {
  return gulp.src('dist/*')
             .pipe(clean({ force: true }))
});

gulp.task('babel', function () {
  return gulp.src('app/scripts/**/*.js')
             .pipe(sourcemaps.init())
             .pipe(babel({
               presets: ['es2015']
             }))
             .pipe(concat('all.js'))
             .pipe(sourcemaps.write('.'))
             .pipe(gulp.dest('dist'))
});

gulp.task('default', [
  'clean',
  'babel',
]);