const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
var clean = require('gulp-clean');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var cleanCss = require('gulp-clean-css');
var rev = require('gulp-rev');
var gulpCopy = require('gulp-copy');
var rename = require("gulp-rename");
var runSequence = require('run-sequence');
var htmlreplace = require('gulp-html-replace');

gulp.task('clean', function () {
  return gulp.src('dist/*')
             .pipe(clean({ force: true }))
});

gulp.task('assets', function () {
  return gulp.src('app/index.html').pipe(gulp.dest('dist'));
});

gulp.task('babel', function () {
  return gulp.src('app/scripts/*.js')
             .pipe(sourcemaps.init())
             .pipe(babel({
               presets: ['es2015']
             }))
             .pipe(concat('main.js'))
             .pipe(uglify())
             .pipe(sourcemaps.write('.'))
             .pipe(gulp.dest('dist'))
});

gulp.task('htmlreplace', function () {
  gulp.src('index.html')
      .pipe(htmlreplace({
        'css': 'styles.min.css',
        'js': 'js/bundle.min.js'
      }))
      .pipe(gulp.dest('build/'));
});

gulp.task('default', function (callback) {
  runSequence('clean',
    'assets',
    'babel',
    // 'htmlreplace',
    callback);
});
