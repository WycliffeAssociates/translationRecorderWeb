var fs = require('fs'),
	path = require('path'),
	merge = require('merge-stream'),
	gulp = require('gulp'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	cleanCSS = require('gulp-clean-css'),
	autoprefixer = require('gulp-autoprefixer');

var scriptsPath = 'src/scripts',
	buildPath = 'build/scripts';

function getFolders(dir) {
    return fs.readdirSync(dir)
      .filter(function(file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
      });
}



gulp.task('default', ['watch']);

gulp.task('build', ['scripts', 'styles', 'img']);

gulp.task('watch', [], function() {
	gulp.watch(['src/scripts/*.js'], ['scripts']);
	gulp.watch(['src/styles/*.css'], ['styles']);
	gulp.watch(['src/img/*'], ['img']);
});

gulp.task('scripts', function() {
   var folders = getFolders(scriptsPath);

   var tasks = folders.map(function(folder) {
      return gulp.src(path.join(scriptsPath, folder, '/**/*.js'))
        // concat into foldername.js
        .pipe(concat(folder + '.js'))
        // write to output
        .pipe(gulp.dest(scriptsPath)) 
        // minify
        .pipe(uglify())    
        // rename to folder.min.js
        .pipe(rename(folder + '.min.js')) 
        // write to output again
        .pipe(gulp.dest(scriptsPath));    
   });

   // process all remaining files in scriptsPath root into main.js and main.min.js files
   var root = gulp.src(path.join(scriptsPath, '/*.js'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest(buildPath))
        .pipe(uglify())
        .pipe(rename('main.min.js'))
        .pipe(gulp.dest(buildPath));

   return merge(tasks, root);
});

gulp.task('styles', function() {
	gulp.src('src/styles/*.css')
		.pipe(autoprefixer({browsers: '> 1%'}))
		.pipe(concat('main.css'))
		.pipe(gulp.dest('build/styles'))
		.pipe(cleanCSS({
			'compatibility': 'ie8',
			'debug': true
		}, function(details) {
			console.log(details.name + ': ' + details.stats.originalSize + ' to ' + details.stats.minifiedSize);
		}))
		.pipe(rename('main.min.css'))
		.pipe(gulp.dest('build/styles'));
});

gulp.task('img', function() {
	gulp.src('src/img/*')
		.pipe(imagemin())
		.pipe(gulp.dest('build/img'));
});
