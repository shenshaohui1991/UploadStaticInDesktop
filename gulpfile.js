"use strict";

const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const cleancss = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const stylus = require('gulp-stylus');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const electronInstaller = require('electron-winstaller');

gulp.task('win', () => {
    electronInstaller
        .createWindowsInstaller({
            appDirectory: './app/',
            outputDirectory: './build/installers/',
            authors: 'ssh',
            exe: 'whale.exe'
        })
        .then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));
});

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

gulp.task('js_main', () => {
    return gulp.src('./src/app.js')
        .pipe(gulp.dest('./app/'));
});

gulp.task('css', () => {
    return gulp.src('./src/stylus/*.styl')
        .pipe(stylus())
        .pipe(cleancss())
        .pipe(gulp.dest('./app/css/'));
});

gulp.task('img', function () {
    return gulp.src('./src/img/*.png')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('./app/img/'));
});

gulp.task('build', ['html', 'css', 'js', 'js_main'/*, 'img'*/]);