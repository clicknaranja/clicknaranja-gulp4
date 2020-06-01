const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const pug = require("gulp-pug");

const origin = "./src/";
const dest = "./dist/";

// compila scss a css

function style() {
  return (
    gulp
      .src(`${origin}sass/**/*.scss`)
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest(`${dest}css`))
      // stream cambios
      .pipe(browserSync.stream())
  );
}

function views() {
  return gulp
    .src(`${origin}*.pug`)
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(`${dest}`))
}

function watch() {
  browserSync.init({
    server: {
      baseDir: dest
    }
  });
  gulp.watch(`${origin}sass/**/*.scss`, style);
  gulp.watch(`${origin}**/*.pug`, views).on('change', browserSync.reload);
}

exports.style = style;
exports.watch= watch;
exports.views = views;
