const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const pug = require("gulp-pug");
const imagemin = require("gulp-imagemin");
const postcss = require("gulp-postcss");
var pngquant = require('imagemin-pngquant')
var autoprefixer = require('gulp-autoprefixer')
const browserify = require("browserify");
const babelify = require("babelify");
const source = require("vinyl-source-stream");
const del = require("del");
const cssnano = require('gulp-cssnano');
	
const buffer = require("vinyl-buffer");
const uglify = require("gulp-uglify");

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

function images() {
  return gulp
    .src(`${origin}images/**/*`)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(`${dest}images/`))
}

function copyStatic() {
  gulp.src(origin + 'pdf/**/*')
    .pipe(gulp.dest(dest + 'pdf'))
  gulp.src(origin + 'fonts/**/*')
    .pipe(gulp.dest(dest + 'fonts'))
  gulp.src(origin + 'videos/**/*')
    .pipe(gulp.dest(dest + 'videos'))
  gulp.src(origin + 'txt/**/*')
    .pipe(gulp.dest(dest + 'txt'))
}


	
function javascriptBuild() {
  // Start by calling browserify with our entry pointing to our main javascript file
  return (
      browserify({
          entries: [`${origin}js/main.js`],
          // Pass babelify as a transform and set its preset to @babel/preset-env
          transform: [babelify.configure({ presets: ["@babel/preset-env"] })]
      })
          // Bundle it all up!
          .bundle()
          // Source the bundle
          .pipe(source("bundle.js"))
          // Turn it into a buffer!
          .pipe(buffer())
          // And uglify
          .pipe(uglify())
          // Then write the resulting files to a folder
          .pipe(gulp.dest(`${dest}js`))
  );
}

function watch() {
  browserSync.init({
    server: {
      baseDir: dest
    }
  });
  gulp.watch(`${origin}sass/**/*.scss`, style);
  gulp.watch(`${origin}**/*.pug`, views).on('change', browserSync.reload);
  gulp.watch(`${origin}js/**/*.js`, javascriptBuild).on('change', browserSync.reload);
  gulp.watch(`${origin}images/**/*`, images).on('change', browserSync.reload);
}

	
function cleanup() {
  // Simply execute del with the build folder path
  return del([dest]);
}

exports.default = exports.watch = gulp.series(cleanup, gulp.parallel(javascriptBuild, views, style, images), watch);
exports.style = style;
exports.views = views;
exports.images = images;
exports.copyStatic = copyStatic;
exports.javascriptBuild = javascriptBuild;
