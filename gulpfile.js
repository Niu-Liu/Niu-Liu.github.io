var gulp = require('gulp');
var csso = require('gulp-csso');
var minifycss = require("gulp-minify-css");
var uglify = require('gulp-uglify');
var concat = require('gulp-concat'); 
var sass = require('gulp-sass')(require('sass'));
var plumber = require('gulp-plumber');
var cp = require('child_process'); 
const imagemin = import("gulp-imagemin"); 
var htmlmin = require("gulp-htmlmin");
var htmlclean = require("gulp-htmlclean");

/*
* Compile and minify sass
*/
 gulp.task('sass', function() {
  return gulp.src('src/styles/**//*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(csso())
		.pipe(gulp.dest('assets/css/'))
});


/*
* Compile fonts
*/
gulp.task('fonts', function() {
	return gulp.src('src/fonts/**/*.{ttf,woff,woff2,eot,svg}')
		.pipe(plumber())
		.pipe(gulp.dest('assets/fonts/'))
});

/*
 * Minify images
 */
gulp.task('imagemin', function() {
	return gulp.src('src/img/**/*.{jpg,png,gif}')
		.pipe(plumber())
		.pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
		.pipe(gulp.dest('assets/img/'))
});

/**
 * Compile and minify js
 */
gulp.task('js', function() {
	return gulp.src('src/js/**/*.js')
		.pipe(plumber())
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(gulp.dest('assets/js/'))
});


gulp.task('default', gulp.series(['js', 'sass', 'fonts']));
