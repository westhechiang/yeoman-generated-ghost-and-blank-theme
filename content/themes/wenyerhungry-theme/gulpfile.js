var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    exec = require('gulp-exec'),
    watch = require('gulp-watch'),
    livereload = require('gulp-livereload'),
    lr = require('tiny-lr'),
    plumber = require('gulp-plumber'),
    server = lr();
    // del = require('del');

gulp.task('styles', function() {
	return gulp.src('dev/styles/sass/main.scss')
		.pipe(plumber())
		.pipe(sass({ style: 'expanded'}))
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest('assets/css'))
		// .pipe(notify({ message: 'Styles task complete'}))
		.pipe( livereload( server ));
});

gulp.task('scripts', function() {
	return gulp.src('dev/scripts/main.js')
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('default'))
		.pipe(concat('main.js'))
		.pipe(notify({ message: 'Scripts task complete'}))
		.pipe( gulp.dest( 'assets/js' ))
    .pipe( livereload( server ));
});

gulp.task('images', function() {
  return gulp.src('dev/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('assets/img'))
    .pipe(notify({ message: 'Images task complete' }));
});


gulp.task( 'template', function () {
  return gulp.src([
  		'*.hbs',
  		'partials/*.hbs'])
    .pipe( livereload( server ));
});


// gulp.task( 'scripts', function () {
//   return gulp.src( [
//       'dev/scripts/main.js'
//     ])
//     .pipe( concat( 'main.js' ))
//     .pipe( gulp.dest( 'assets/js' ))
//     .pipe( livereload( server ));
// });

gulp.task( 'lib', function () {
  return gulp.src( [
      'bower_components/modernizr/modernizr.js',
      'dev/scripts/livereload.js'
    ])
    .pipe( concat( 'lib.js' ))
    .pipe( gulp.dest( 'assets/js' ))
    .pipe( livereload( server ));
});

gulp.task('ghost', function() {
  gulp.src('')
    .pipe(exec( 'cd ../../../; npm start' ));
});

gulp.task('watch', function() {
  // Listen on port 35729
  server.listen( 35729, function ( err ) {
    if ( err ) {
     return console.log( err );
    };

    gulp.watch( 'dev/styles/sass/*.scss', ['styles'] );
    gulp.watch( 'dev/scripts/*.js', ['scripts'] );
    gulp.watch( '*.hbs', ['template'] );
    gulp.watch( 'partials/*.hbs', ['template'] );
    gulp.watch( 'dev/scripts/*.js', ['images'] );
  });
});

// gulp.task('clean', function(cb) {
//     del(['dev/styles', 'dev/scripts', 'dist/assets/img'], cb)
// });


gulp.task( 'default', ['styles', 'lib', 'scripts'], function() {
    gulp.start( 'ghost', 'watch' );
});