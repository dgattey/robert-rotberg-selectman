var gulp        = require('gulp'),
    jshint      = require('gulp-jshint'),
    sass        = require('gulp-sass'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    minifyCSS   = require('gulp-minify-css'),
    rename      = require('gulp-rename'),
    webserver   = require('gulp-webserver'),
    stylish     = require('jshint-stylish'),
    rimraf      = require('rimraf'),
    cfg         = require('./gulp.config.js');

/**
 * SASS
 * Combines and minifies all SASS files
 */
var sassFuncFat = function() {
    return gulp.src(cfg.srcFiles.sass)
        .pipe(sass())
        .pipe(rename('all.min.css'))
        .pipe(gulp.dest(cfg.dest));
};
var sassFunc = function() {
    return sassFuncFat()
        .pipe(minifyCSS({processImport:true}))
        .pipe(gulp.dest(cfg.dest));
};
gulp.task('sass',  sassFunc);
gulp.task('sass-fat',  sassFuncFat);
gulp.task('sass-clean', ['clean'], sassFunc);
gulp.task('sass-clean-fat', ['clean'], sassFuncFat);

/**
 * STATIC FILES
 * Copies static files to the build directory
 */
var htmlFunc = function(){
    return gulp.src(cfg.srcFiles.html)
        .pipe(gulp.dest(cfg.dest));
};
var assetsFunc = function(){
    return gulp.src(cfg.srcFiles.assets)
        .pipe(gulp.dest(cfg.dest+'/assets/'));
};
gulp.task('html', htmlFunc);
gulp.task('html-clean', ['clean'], htmlFunc);
gulp.task('assets', assetsFunc);
gulp.task('assets-clean', ['clean'], assetsFunc);

/**
 * JAVASCRIPT
 * Concatenate and minify JS files after linting
 */
var lintFunc = function() {
    return gulp.src(cfg.srcFiles.js)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
};
var jsFuncFat = function() {
    return gulp.src(cfg.srcFiles.allJS)
        .pipe(concat('all.min.js'))
        .pipe(gulp.dest(cfg.dest));
};
var jsFunc = function() {
    return jsFuncFat()
        .pipe(uglify())
        .pipe(gulp.dest(cfg.dest));
}

gulp.task('lint', lintFunc);
gulp.task('lint-clean', ['clean'], lintFunc);
gulp.task('js', ['lint'],  jsFunc);
gulp.task('js-fat', jsFuncFat);
gulp.task('js-clean', ['lint-clean'],  jsFunc);
gulp.task('js-clean-fat', ['lint-clean'],  jsFuncFat);

/**
 * ONGOING
 * Tasks that are ongoing, like serving files and
 * watching for changes
 */
gulp.task('watch', ['dist'], function() {
    gulp.watch(cfg.srcFiles.allJS, ['lint', 'js']);
    gulp.watch(cfg.srcFiles.sass, ['sass']);
    gulp.watch(cfg.srcFiles.assets, ['assets']);
    gulp.watch(cfg.srcFiles.html, ['html']);
});
gulp.task('watch-fat', ['dev'], function() {
    gulp.watch(cfg.srcFiles.allJS, ['lint', 'js-fat']);
    gulp.watch(cfg.srcFiles.sass, ['sass-fat']);
    gulp.watch(cfg.srcFiles.assets, ['assets']);
    gulp.watch(cfg.srcFiles.html, ['html']);
});
gulp.task('server', function() {
    gulp.src(cfg.dest)
        .pipe(webserver({
            livereload: true
        }));
});

/**
 * MAIN
 * Overarching tasks for full build
 */
gulp.task('clean', function(cb) {
    return rimraf(cfg.dest, cb);
});
gulp.task('dev', ['lint-clean', 'sass-clean-fat', 'assets-clean', 'html-clean', 'js-clean-fat']);
gulp.task('dist', ['lint-clean', 'sass-clean', 'assets-clean', 'html-clean', 'js-clean']);
gulp.task('fat', ['clean', 'dev', 'watch-fat', 'server']);
gulp.task('default', ['clean', 'dist', 'watch', 'server']);
