"use strict";

const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const cleancss = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const stylus = require('gulp-stylus');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');

gulp.task('html', () => {
    return gulp.src('./src/html/renderer.html')
        .pipe(htmlmin({
            removeComments: true,
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('./app/html/'));
});

gulp.task('js', () => {
    return gulp.src('./src/js/**/*.js')
        /*.pipe(uglify())*/
        .pipe(gulp.dest('./app/js/'));
});

gulp.task('css', () => {
    return gulp.src('./stylus/renderer.styl')
        .pipe(stylus())
        .pipe(cleancss())
        .pipe(gulp.dest('./app/css/'));
});

gulp.task('build', ['html', 'css', 'js']);