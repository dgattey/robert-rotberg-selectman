// Plugins
var gulp        = require('gulp'),
    jshint      = require('gulp-jshint'),
    stylish     = require('jshint-stylish'),
    sass        = require('gulp-sass'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    minifyCSS   = require('gulp-minify-css'),
    rename      = require('gulp-rename'),
    rimraf      = require('rimraf');

// Configuration
var cfg = require( './gulp.config.js' );

// Cleaning Task
gulp.task('clean', function(cb) {
    return rimraf(cfg.dest, cb);
});

// Lint Tasks
var lintFunc = function() {
    return gulp.src(cfg.srcFiles.js)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
};
gulp.task('lint', lintFunc);
gulp.task('lint-clean', ['clean'], lintFunc);

// SASS to CSS and minify
var sassFunc = function() {
    return gulp.src(cfg.srcFiles.sass)
        .pipe(sass())
        .pipe(minifyCSS({processImport:true}))
        .pipe(rename('all.min.css'))
        .pipe(gulp.dest(cfg.dest));
};
gulp.task('sass',  sassFunc);
gulp.task('sass-clean', ['clean'], sassFunc);

// Copy HTML files
var htmlFunc = function(){
    return gulp.src(cfg.srcFiles.html)
        .pipe(gulp.dest(cfg.dest));
};
gulp.task('html', htmlFunc);
gulp.task('html-clean', ['clean'], htmlFunc);

// Copy Assets
var assetsFunc = function(){
    return gulp.src(cfg.srcFiles.assets)
        .pipe(gulp.dest(cfg.dest));
};
gulp.task('assets', assetsFunc);
gulp.task('assets-clean', ['clean'], assetsFunc);

// Concatenate & Minify JS
var jsFunc = function() {
    return gulp.src(cfg.srcFiles.allJS)
        .pipe(concat('all.min.js'))
        .pipe(gulp.dest(cfg.dest))
        .pipe(uglify())
        .pipe(gulp.dest(cfg.dest));
};
gulp.task('js', ['lint'],  jsFunc);
gulp.task('js-clean', ['lint-clean'],  jsFunc);

// Watching all files
gulp.task('watch', ['dist'], function() {
    gulp.watch(cfg.srcFiles.allJS, ['lint', 'js']);
    gulp.watch(cfg.srcFiles.sass, ['sass']);
    gulp.watch(cfg.srcFiles.assets, ['assets']);
    gulp.watch(cfg.srcFiles.html, ['html']);
});

// Default Tasks
gulp.task('dist', ['lint-clean', 'sass-clean', 'assets-clean', 'html-clean', 'js-clean'])
gulp.task('default', ['clean', 'dist', 'watch']);
