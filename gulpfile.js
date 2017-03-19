const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const runSequence = require('run-sequence');
const clean = require('gulp-clean');
const gulpUseref = require('gulp-useref');
const fs = require('fs');
const useref = require('useref');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

gulp.task('clean:dist', function () {
  return gulp.src('dist/*')
             .pipe(clean({ force: true }))
});

gulp.task('clean:dist-scripts', function () {
  return gulp.src('dist/scripts/*')
             .pipe(clean({ force: true }))
});

gulp.task('htmlreplace', function () {
  return gulp.src('app/*.html')
             .pipe(gulpUseref())
             .pipe(gulp.dest('dist'));
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
    'htmlreplace',
    'clean:dist-scripts',
    'useref',
    callback);
});
