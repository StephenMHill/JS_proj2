const { src, dest, watch, parallel, series } = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const del = require('delete');
const terser = require('gulp-terser');
const concat = require('gulp-concat');
const typescript = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const gulp = require('gulp');
const marked = require('gulp-markdown');
const wrap = require('gulp-wrap');
const frontMatter = require('gulp-front-matter');

function css() {
  return src('source/scss/**/*.scss')
    .pipe(sass({ outputStyle: 'compressed' })) // nested, compact, expanded, compressed
    .pipe(dest('prod/ui'));
}

function html() {
  return src('source/**/*.html').pipe(dest('prod/'));
}

function image() {
  return src('source/images/**/*.*').pipe(dest('prod/images/'));
}

function js() {
  return src(['source/js/**/*.js', 'source/js/**/*.ts'])
    .pipe(sourcemaps.init())
    .pipe(typescript({ target: 'ES2015', allowJs: true }))
    .pipe(terser())
    .pipe(concat('script.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('prod/ui'));
}

function clean(cb) {
  del(['prod/**/*'], cb);
}

function watch_task() {
  watch('source/**/*.scss', series(css, reload));
  watch('source/**/*.html', series(html, reload));
  watch('source/**/*.js', series(js, reload));
}

function sync(cb) {
  browserSync.init({
    server: { baseDir: 'prod/' }
  });
  cb();
}

function reload(cb) {
  browserSync.reload();
  cb();
}

exports.css = css;
exports.watch = watch_task;
exports.sync = sync;
exports.clean = clean;
exports.build = series(clean, parallel(css, html, js, image));
exports.default = series(clean, parallel(css, html, js, image), sync, watch_task);
