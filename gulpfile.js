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
var useref = require('useref');
var gulpUseref = require('gulp-useref');
var fs = require('fs');

gulp.task('clean:dist', function () {
  return gulp.src('dist/*')
             .pipe(clean({ force: true }))
});

gulp.task('clean:dist-scripts', function () {
  return gulp.src('dist/scripts/*')
             .pipe(clean({ force: true }))
});

// gulp.task('assets', function () {
//   return gulp.src('app/index.html').pipe(gulp.dest('dist'));
// });

gulp.task('htmlreplace', function () {
  return gulp.src('app/*.html')
             .pipe(gulpUseref())
             .pipe(gulp.dest('dist'));
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

gulp.task('useref', function () {
  fs.readFile('./app/index.html', function (err, html) {
    if (err) throw err;

    const result = useref(html.toString())[1];
    const { css, js } = result;
    const data = {
      css: [],
      js: [],
    };

    Object.keys(css).forEach(key => {
      if (key && css[key].assets && css[key].assets.length) {
        data.css.push({
          name: key,
          arr: css[key].assets.map((file) => ('app/' + file)),
        })
      }
    });
    Object.keys(js).forEach(key => {
      if (key && js[key].assets && js[key].assets.length) {
        data.js.push({
          name: key,
          arr: js[key].assets.map((file) => ('app/' + file)),
        })
      }
    });

    data.js.forEach(item => {
      gulp.src(item.arr)
          .pipe(sourcemaps.init())
          .pipe(babel({
            presets: ['es2015']
          }))
          .pipe(concat(item.name))
          .pipe(uglify())
          .pipe(sourcemaps.write('.'))
          .pipe(gulp.dest('dist'))
    });
  });
});

gulp.task('default', function (callback) {
  runSequence(
    'clean:dist',
    // 'assets',
    // 'babel',
    'htmlreplace',
    'clean:dist-scripts',
    'useref',
    callback);
});
